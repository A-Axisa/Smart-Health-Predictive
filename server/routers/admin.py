from datetime import datetime, date, timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi_camelcase import CamelModel
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List
from pydantic import BaseModel

from sqlalchemy import func, extract, desc

from ..utils.database import get_db
from ..utils.audit_log import write_audit_log
from ..models.dbmodels import (
    UserAccount,
    UserAccountRole,
    AccountRole,
    UserAccountValidationToken,
    HealthData,
    Prediction,
    Recommendation,
    AuditLog,
    LogEventType,
    Patient,
    Clinic,
    UserPatientAccess
)
from ..routers.authentication import get_current_user, get_patient_by_email

router = APIRouter()


class AdminDashboard(BaseModel):
    # User data
    totalUsers: int
    totalPatients: int
    totalMerchants: int
    newUsersLast30days: int
    validatedUsers: int
    invalidatedUsers: int
    activePatients: int
    inactivePatients: int

    # Prediction data
    totalReports: int
    reportsLastDay: int
    reportsLast7Days: int
    reportsLast30Days: int
    reportActivity: List[dict]
    averageRiskCVD: float
    averageRiskDiabetes: float
    averageRiskStroke: float

    # Log data
    failedLoginAttemptsLastDay: int
    loginActivity: List[dict]


class AdminReportAnalytics(CamelModel):
    total_reports: int


class ActiveAccountAnalytics(CamelModel):
    past_month: int
    past_week: int


class ActiveMerchantAnalytics(CamelModel):
    past_month: int
    past_week: int


class RecentReportsGeneratedAnalytics(CamelModel):
    past_month: int
    past_week: int


class PendingMerchantAnalytics(CamelModel):
    amount: int


class UnvalidatedAccountsAnalytic(CamelModel):
    amount: int


@router.get("/roles")
async def get_roles(db_conn: Session = Depends(get_db)):
    """Return all roles"""

    roles = db_conn.query(AccountRole).all()

    result = []
    for role in roles:
        result.append({
            "id": role.RoleID if role else None,
            "name": role.RoleName if role else None,
        })

    return result


@router.get("/users")
async def get_users(skip: int = 0, limit: int = 100, search: str = None, db_conn: Session = Depends(get_db)):
    """Return all user accounts"""

    if skip < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="skip must be greater than or equal to 0")
    if limit <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="limit must be greater than 0")

    # Query users and roles, then apply pagination.
    query = db_conn.query(UserAccount, AccountRole, Patient, Clinic) \
        .filter(UserAccount.IsValidated == 1) \
        .outerjoin(UserAccountRole, UserAccount.UserID == UserAccountRole.UserID) \
        .outerjoin(AccountRole, UserAccountRole.RoleID == AccountRole.RoleID) \
        .outerjoin(Patient, Patient.UserID == UserAccount.UserID) \
        .outerjoin(Clinic, Clinic.ClinicID == UserAccount.ClinicID)

    if search:
        keyword = f"%{search.strip()}%"
        if keyword != "%%":
            query = query.filter(
                or_(
                    UserAccount.Email.ilike(keyword),
                    Patient.GivenNames.ilike(keyword),
                    Patient.FamilyName.ilike(keyword),
                    Clinic.ClinicName.ilike(keyword),
                )
            )

    total_count = query.count()
    users = query.order_by(UserAccount.CreatedAt.desc()
                           ).offset(skip).limit(limit).all()

    result = []
    for user, role, patient, clinic in users:
        full_name = ""

        # Retrieve the patients full name for a standard  user
        if role and role.RoleName == "standard_user":
            if patient:
                full_name = f'{patient.GivenNames} {patient.FamilyName}'

        # Retrieve Clinic name for a merchant user
        if role and role.RoleName == "merchant":
            if clinic:
                full_name = clinic.ClinicName

        result.append({
            "fullName": full_name,
            "email": user.Email,
            "phoneNumber": user.PhoneNumber,
            "createdAt": user.CreatedAt,
            "validated": user.IsValidated,
            "role": {
                "id": role.RoleID if role else None,
                "name": role.RoleName if role else None
            }
        })

    return {
        "users": result,
        "total": total_count
    }


@router.patch("/users/{user_email}/roles/{role_id}")
async def update_user_role(user_email: str, role_id: int, request: Request,
                           db_conn: Session = Depends(get_db)):
    """Update a user's role"""
    # Check if both the user and role exist.
    user = db_conn.query(UserAccount).filter(
        UserAccount.Email == user_email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    role = db_conn.query(AccountRole).filter(
        AccountRole.RoleID == role_id).first()
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Role not found.")

    # Check if role mapping exists for the user.
    current_user_role = db_conn.query(UserAccountRole).filter(
        UserAccountRole.UserID == user.UserID).first()

    # Update the user's role otherwise make new mapping.
    if current_user_role:
        current_user_role.RoleID = role_id
    else:
        db_conn.add(UserAccountRole(UserID=user.UserID, RoleID=role_id))

    db_conn.commit()

    actor_email = None
    try:  # After resolving the authentication issue for this endpoint, this exception handling should be removed
        actor_email = get_current_user(request, db_conn).get('email')
    except Exception:
        pass

    write_audit_log(db_conn,
                    eventType=LogEventType.ROLE_CHANGED,
                    success=True,
                    userEmail=actor_email,
                    device=request.headers.get("user-agent"),
                    ipAddress=request.client.host,
                    description=f"Role changed for {user_email} to {role.RoleName}.")

    return {"message": f"Update successful.",
            "role": {
                "id": role.RoleID,
                "name": role.RoleName,
            }}


def _delete_user_data(user_email: str, db_conn: Session):
    """
    Deletes a user and all their associated data, returning a report of the deletion.
    """
    deletion_report = {}

    try:
        # Find the user to ensure they exist before proceeding
        user_to_delete = db_conn.query(UserAccount).filter(
            UserAccount.Email == user_email).first()
        if not user_to_delete:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

        # Collect all HealthDataIDs for this user
        patient_record = get_patient_by_email(user_email, db_conn)

        # Delete Merchant access to patient record
        if patient_record:
            db_conn.query(UserPatientAccess).filter(UserPatientAccess.PatientID ==
                                                    patient_record.PatientID).delete(synchronize_session=False)
        else:
            db_conn.query(UserPatientAccess).filter(
                UserPatientAccess.UserID == user_to_delete.UserID).delete(synchronize_session=False)

        if patient_record:
            health_ids: List[int] = [
                hid for (hid,) in db_conn.query(HealthData.HealthDataID).filter(HealthData.PatientID == patient_record.PatientID).all()
            ]

        if health_ids:
            # Delete tables that depend on HealthData first
            recs_deleted = db_conn.query(Recommendation).filter(
                Recommendation.HealthDataID.in_(health_ids)).delete(synchronize_session=False)
            deletion_report['recommendations_deleted'] = recs_deleted

            preds_deleted = db_conn.query(Prediction).filter(
                Prediction.HealthDataID.in_(health_ids)).delete(synchronize_session=False)
            deletion_report['predictions_deleted'] = preds_deleted

            # Then delete HealthData records
            health_data_deleted = db_conn.query(HealthData).filter(
                HealthData.PatientID == patient_record.PatientID).delete(synchronize_session=False)
            deletion_report['health_data_deleted'] = health_data_deleted

        # Delete tables directly associated with the user
        tokens_deleted = db_conn.query(UserAccountValidationToken).filter(
            UserAccountValidationToken.UserID == user_to_delete.UserID).delete(synchronize_session=False)
        deletion_report['validation_tokens_deleted'] = tokens_deleted

        roles_deleted = db_conn.query(UserAccountRole).filter(
            UserAccountRole.UserID == user_to_delete.UserID).delete(synchronize_session=False)
        deletion_report['user_roles_deleted'] = roles_deleted

        # Delete the user record itself
        db_conn.delete(user_to_delete)
        deletion_report['users_deleted'] = 1  # Since we are deleting one user

        db_conn.commit()

        return deletion_report
    except Exception as e:
        db_conn.rollback()
        # Log the exception e for debugging if needed
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=f"Failed to delete user data: {str(e)}")


@router.delete("/users/{user_email}")
async def delete_user_by_admin(user_email: str, request: Request, db_conn: Session = Depends(get_db)):
    """Delete a user account """
    # Get the current user making the request
    current_user_data = get_current_user(request, db_conn)
    requesting_user_email = current_user_data.get('email')

    # Verify the requesting user is an administrator
    admin_user = db_conn.query(UserAccount).filter(
        UserAccount.Email == requesting_user_email).first()
    if not admin_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Could not identify the requesting user.")

    user_role = db_conn.query(AccountRole).join(UserAccountRole, AccountRole.RoleID ==
                                                UserAccountRole.RoleID).filter(UserAccountRole.UserID == admin_user.UserID).first()

    if not user_role or user_role.RoleName.lower() != 'admin':
        write_audit_log(db_conn,
                        eventType=LogEventType.ACCOUNT_DELETED,
                        success=False,
                        userEmail=requesting_user_email,
                        device=request.headers.get("user-agent"),
                        ipAddress=request.client.host,
                        description=f"Unauthorized delete attempt for account: {user_email}.")
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="You do not have permission to delete users.")

    # Find the user to delete to get their details before deletion
    user_to_delete = db_conn.query(UserAccount).filter(
        UserAccount.Email == user_email).first()
    if not user_to_delete:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="User to delete not found.")

    # Prevent admin from deleting themselves
    if admin_user.UserID == user_to_delete.UserID:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Administrators cannot delete their own accounts.")

    # Perform the deletion and get the report
    deletion_report = _delete_user_data(user_email, db_conn)

    write_audit_log(db_conn,
                    eventType=LogEventType.ACCOUNT_DELETED,
                    success=True,
                    userEmail=requesting_user_email,
                    device=request.headers.get("user-agent"),
                    ipAddress=request.client.host,
                    description=f"Admin deleted account: {user_email}.")

    return {
        "message": f"User with Email {user_email} and all related data deleted successfully",
        "deletion_report": deletion_report
    }


@router.get("/users/merchants/")
async def get_invalid_merchant_accounts(db_conn: Session = Depends(get_db)):
    """Return all merchant accounts that are not validated"""
    # Query all invalid merchant accounts.
    invalid_merchant_accounts = db_conn.query(UserAccount) \
        .outerjoin(UserAccountRole, UserAccount.UserID == UserAccountRole.UserID) \
        .outerjoin(AccountRole, UserAccountRole.RoleID == AccountRole.RoleID) \
        .filter(AccountRole.RoleName == "merchant") \
        .filter(UserAccount.IsValidated == 0) \
        .all()

    result = []
    for merchant in invalid_merchant_accounts:

        full_name = (db_conn.query(Clinic).filter(
            Clinic.ClinicID == merchant.ClinicID).first()).ClinicName

        result.append({
            "fullName": full_name,
            "email": merchant.Email,
            "phoneNumber": merchant.PhoneNumber,
            "createdAt": merchant.CreatedAt,
        })

    return result


@router.patch("/users/merchants/{merchant_email}")
async def validate_merchant(merchant_email: str, request: Request, db_conn: Session = Depends(get_db)):
    """Validate a merchant user account"""
    # Check if requesting user is Admin.
    current_user = get_current_user(request, db_conn)
    current_user_email = current_user.get('email')
    admin = db_conn.query(UserAccount).filter(
        UserAccount.Email == current_user_email).first()
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    current_user_role = current_user.get('role')
    if not current_user_role or current_user_role.lower() != 'admin':
        write_audit_log(db_conn,
                        eventType=LogEventType.MERCHANT_VALIDATED,
                        success=False,
                        userEmail=current_user_email,
                        device=request.headers.get("user-agent"),
                        ipAddress=request.client.host,
                        description=f"Unauthorized merchant validation attempt for {merchant_email}.")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Impermissible action.")

    # Validate the merchant account.
    merchant = db_conn.query(UserAccount).filter(
        UserAccount.Email == merchant_email).first()
    if not merchant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    merchant.IsValidated = 1
    db_conn.commit()
    write_audit_log(db_conn,
                    eventType=LogEventType.MERCHANT_VALIDATED,
                    success=True,
                    userEmail=current_user_email,
                    device=request.headers.get("user-agent"),
                    ipAddress=request.client.host,
                    description=f"Merchant account validated.")

    return {"message": f"Merchant has been successfully validated."}


@router.get("/logs")
async def get_logs(request: Request, user_email: str = None, event_type: str = None, skip: int = 0, limit: int = 100, db_conn: Session = Depends(get_db)):
    """Return logs to an admin user"""
    # Authenticate and authorize admin
    current_user_data = get_current_user(request, db_conn)
    requesting_user_email = current_user_data.get('email')

    admin_user = db_conn.query(UserAccount).filter(
        UserAccount.Email == requesting_user_email).first()
    if not admin_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Could not identify the requesting user.")

    user_role = db_conn.query(AccountRole).join(UserAccountRole, AccountRole.RoleID ==
                                                UserAccountRole.RoleID).filter(UserAccountRole.UserID == admin_user.UserID).first()

    if not user_role or user_role.RoleName.lower() != 'admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="You do not have permission to view logs.")

    # Build query
    query = db_conn.query(AuditLog)

    if user_email:
        query = query.filter(AuditLog.UserEmail.ilike(f"%{user_email}%"))
    if event_type:
        query = query.filter(AuditLog.EventType == event_type)

    total_count = query.count()
    logs = query.order_by(AuditLog.CreatedAt.desc()
                          ).offset(skip).limit(limit).all()

    result = []

    for log in logs:
        result.append({
            "logID": log.LogID,
            "eventType": log.EventType,
            "success": log.Success,
            "userEmail": log.UserEmail,
            "ipAddress": log.IPAddress,
            "device": log.Device,
            "description": log.Description,
            "createdAt": log.CreatedAt,
        })

    return {
        "logs": result,
        "total": total_count
    }


@router.get("/admin-dashboard")
async def get_admin_dashboard(request: Request, db_conn: Session = Depends(get_db)):

    # Check if requesting user is Admin.
    current_user = get_current_user(request, db_conn)
    current_user_email = current_user.get('email')
    admin = db_conn.query(UserAccount).filter(UserAccount.Email == current_user_email).first()
    if not admin:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    current_user_role = current_user.get('role')
    if not current_user_role or current_user_role.lower() != 'admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Impermissible action.")

    last_30_days = datetime.now() - timedelta(days=30)
    last_7_days = datetime.now() - timedelta(days=7)
    last_day = datetime.now() - timedelta(days=1)

    # User data
    all_users = db_conn.query(UserAccount).filter(UserAccount.IsValidated == 1).all()
    total_users = len(all_users)

    total_patients = (db_conn.query(UserAccount).join(UserAccountRole, UserAccount.UserID == UserAccountRole.UserID)
                    .join(AccountRole, UserAccountRole.RoleID == AccountRole.RoleID)
                    .filter(AccountRole.RoleName == "standard_user", UserAccount.IsValidated == 1)
                    .count())

    total_merchants = (db_conn.query(UserAccount).join(UserAccountRole, UserAccount.UserID == UserAccountRole.UserID)
                    .join(AccountRole, UserAccountRole.RoleID == AccountRole.RoleID)
                    .filter(AccountRole.RoleName == "merchant", UserAccount.IsValidated == 1)
                    .count())

    new_users_last_30 = (db_conn.query(UserAccount)
                    .filter(UserAccount.IsValidated == 1, UserAccount.CreatedAt >= last_30_days)
                    .count())

    validated_users = (db_conn.query(UserAccount).filter(UserAccount.IsValidated == 1).count())
    invalidated_users = (db_conn.query(UserAccount).filter(UserAccount.IsValidated == 0).count())

    active_patients = (db_conn.query(Patient).join(HealthData, HealthData.PatientID == Patient.PatientID)
                    .filter(HealthData.CreatedAt >= last_30_days)
                    .distinct().count())

    total_patient_count = db_conn.query(Patient).count()
    inactive_patients = total_patient_count - active_patients

    # Report data
    total_reports = db_conn.query(HealthData).count()

    reports_last_day = (db_conn.query(HealthData).filter(HealthData.CreatedAt >= last_day).count())

    reports_last_7 = (db_conn.query(HealthData).filter(HealthData.CreatedAt >= last_7_days).count())

    reports_last_30 = (db_conn.query(HealthData).filter(HealthData.CreatedAt >= last_30_days).count())

    all_recent_reports = (db_conn.query(HealthData).filter(HealthData.CreatedAt >= last_30_days)
                        .order_by(HealthData.CreatedAt.asc())
                        .all())

    report_dates = {}

    for row in all_recent_reports:
        date = row.CreatedAt.strftime("%Y-%m-%d")
        report_dates[date] = report_dates.get(date, 0) + 1

    report_activity = [{"date": k, "count": v} for k, v in report_dates.items()]

    all_predictions = db_conn.query(Prediction).all()

    if all_predictions:
        avg_cvd = int(sum(float(p.CVDChance or 0) for p in all_predictions) / len(all_predictions))
        avg_diabetes = int(sum(float(p.DiabetesChance or 0) for p in all_predictions) / len(all_predictions))
        avg_stroke = int(sum(float(p.StrokeChance or 0) for p in all_predictions) / len(all_predictions))
    else:
        avg_cvd = avg_diabetes = avg_stroke = 0

    # Log data
    failed_logins_last_day = (db_conn.query(AuditLog)
                            .filter(AuditLog.EventType == LogEventType.FAILED_LOGIN_ATTEMPT,
                            AuditLog.CreatedAt >= last_day)
                            .count())

    login_logs = (db_conn.query(AuditLog).filter(AuditLog.EventType == LogEventType.LOGIN,
                AuditLog.CreatedAt >= last_30_days).order_by(AuditLog.CreatedAt.asc())
                .all())

    login_dates = {}

    for log in login_logs:
        date = log.CreatedAt.strftime("%Y-%m-%d")
        login_dates[date] = login_dates.get(date, 0) + 1

    login_activity = [{"date": k, "count": v} for k, v in login_dates.items()]

    return AdminDashboard(
        totalUsers=total_users,
        totalPatients=total_patients,
        totalMerchants=total_merchants,
        newUsersLast30days=new_users_last_30,
        validatedUsers=validated_users,
        invalidatedUsers=invalidated_users,
        activePatients=active_patients,
        inactivePatients=inactive_patients,
        totalReports=total_reports,
        reportsLastDay=reports_last_day,
        reportsLast7Days=reports_last_7,
        reportsLast30Days=reports_last_30,
        reportActivity=report_activity,
        averageRiskCVD=avg_cvd,
        averageRiskDiabetes=avg_diabetes,
        averageRiskStroke=avg_stroke,
        failedLoginAttemptsLastDay=failed_logins_last_day,
        loginActivity=login_activity,
    )


@router.get("/admin-dashboard/active-account-analytics")
async def get_active_account_analytics(request: Request, db_conn: Session = Depends(get_db)):
    _confirm_admin(request, db_conn)
    prev_month = datetime.now() - timedelta(days=30)
    prev_week = datetime.now() - timedelta(days=7)

    accounts_past_month = (
        db_conn.query(UserAccount)
        .join(UserAccountRole, UserAccountRole.UserID == UserAccount.UserID)
        .join(AccountRole, AccountRole.RoleID == UserAccountRole.RoleID)
        .filter(AccountRole.RoleName == "standard_user")
        .join(AuditLog, AuditLog.UserEmail == UserAccount.Email)
        .filter(AuditLog.CreatedAt >= prev_month)
        .distinct()
        .count()
    )

    accounts_past_week = (
        db_conn.query(UserAccount)
        .join(UserAccountRole, UserAccountRole.UserID == UserAccount.UserID)
        .join(AccountRole, AccountRole.RoleID == UserAccountRole.RoleID)
        .filter(AccountRole.RoleName == "standard_user")
        .join(AuditLog, AuditLog.UserEmail == UserAccount.Email)
        .filter(AuditLog.CreatedAt >= prev_week)
        .distinct()
        .count()
    )

    return ActiveAccountAnalytics(
        past_month=accounts_past_month,
        past_week=accounts_past_week,
    )


@router.get("/admin-dashboard/active-merchant-analytics")
async def get_active_merchant_analytics(request: Request, db_conn: Session = Depends(get_db)):
    _confirm_admin(request, db_conn)
    prev_month = datetime.now() - timedelta(days=30)
    prev_week = datetime.now() - timedelta(days=7)

    merchants_past_month = (
        db_conn.query(UserAccount)
        .join(UserAccountRole, UserAccountRole.UserID == UserAccount.UserID)
        .join(AccountRole, AccountRole.RoleID == UserAccountRole.RoleID)
        .filter(AccountRole.RoleName == "merchant")
        .join(AuditLog, AuditLog.UserEmail == UserAccount.Email)
        .filter(AuditLog.CreatedAt >= prev_month)
        .distinct()
        .count()
    )

    merchants_past_week = (
        db_conn.query(UserAccount)
        .join(UserAccountRole, UserAccountRole.UserID == UserAccount.UserID)
        .join(AccountRole, AccountRole.RoleID == UserAccountRole.RoleID)
        .filter(AccountRole.RoleName == "standard_user")
        .join(AuditLog, AuditLog.UserEmail == UserAccount.Email)
        .filter(AuditLog.CreatedAt >= prev_month)
        .distinct()
        .count()
    )

    return ActiveMerchantAnalytics(
        past_month=merchants_past_month,
        past_week=merchants_past_week,
    )


@router.get("/admin-dashboard/recent-reports-generated-analytics")
async def get_reports_generated_analytics(request: Request, db_conn: Session = Depends(get_db)):
    _confirm_admin(request, db_conn)
    prev_month = datetime.now() - timedelta(days=30)
    prev_week = datetime.now() - timedelta(days=7)

    reports_past_month = (
        db_conn.query(HealthData)
        .filter(HealthData.CreatedAt >= prev_month)
        .count()
    )

    reports_past_week = (
        db_conn.query(HealthData)
        .filter(HealthData.CreatedAt >= prev_week)
        .count()
    )

    return RecentReportsGeneratedAnalytics(
        past_month=reports_past_month,
        past_week=reports_past_week,
    )


@router.get("/admin-dashboard/pending-merchants-analytics")
async def get_pending_merchant_analytics(request: Request, db_conn: Session = Depends(get_db)):
    _confirm_admin(request, db_conn)

    pending_merchants = (
        db_conn.query(UserAccount)
        .join(UserAccountRole, UserAccountRole.UserID == UserAccount.UserID)
        .join(AccountRole, AccountRole.RoleID == UserAccountRole.RoleID)
        .filter(
            AccountRole.RoleName == "merchant",
            UserAccount.IsValidated is False,
        )
        .distinct()
        .count()
    )

    return PendingMerchantAnalytics(
        amount=pending_merchants,
    )


@router.get("/admin-dashboard/predictions-distinct-years")
async def get_predictions_distinct_years(request: Request, db_conn: Session = Depends(get_db)):
    _confirm_admin(request, db_conn)
    query = db_conn.query(
        extract("year", Prediction.CreatedAt).label("year")
    ).distinct().order_by(desc("year")).all()
    return [row._asdict() for row in query]


@router.get("/admin-dashboard/ave-risk-series/{year}")
async def get_average_risk_series(year: int, request: Request, db_conn: Session = Depends(get_db)):
    _confirm_admin(request, db_conn)

    year_start = datetime(year, 1, 1)
    year_end = datetime(year+1, 1, 1)

    query = db_conn.query(
        func.date_format(Prediction.CreatedAt, "%Y-%m").label('date'),
        func.avg(Prediction.StrokeChance).label('stroke'),
        func.avg(Prediction.DiabetesChance).label('diabetes'),
        func.avg(Prediction.CVDChance).label('cvd'),
    ).filter(
        Prediction.CreatedAt > year_start,
        Prediction.CreatedAt < year_end
    ).group_by("date").order_by("date").all()

    return [row._asdict() for row in query]


@router.get("/admin-dashboard/login-activity/{timespanInDays}")
async def get_login_activity(timespanInDays: int, request: Request, db_conn: Session = Depends(get_db)):
    _confirm_admin(request, db_conn)

    start_date = datetime.now() - timedelta(days=timespanInDays)

    query = db_conn.query(
        func.count(AuditLog.EventType).label("total"),
        func.date_format(AuditLog.CreatedAt, "%Y-%m-%d").label('date'),
    ).filter(
        AuditLog.EventType == LogEventType.LOGIN,
        AuditLog.CreatedAt > start_date,
    ).group_by("date").order_by("date").all()

    return [row._asdict() for row in query]


@router.get("/admin-dashboard/unvalidated-account-analytics")
async def get_unvalidated_account_analytics(request: Request, db_conn: Session = Depends(get_db)):
    _confirm_admin(request, db_conn)

    unvalidated_accounts = (
        db_conn.query(UserAccount)
        .join(UserAccountRole, UserAccountRole.UserID == UserAccount.UserID)
        .join(AccountRole, AccountRole.RoleID == UserAccountRole.RoleID)
        .filter(
            AccountRole.RoleName == "standard_user",
            UserAccount.IsValidated is False,
        )
        .count()
    )

    return UnvalidatedAccountsAnalytic(
        amount=unvalidated_accounts,
    )


def _confirm_admin(request: Request, db_conn: Session):
    user = get_current_user(request, db_conn)
    admin = db_conn.query(UserAccount).filter(
        UserAccount.Email == user["email"]).first()

    if not admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Impermissible action.")

    if not user["role"] or user["role"].lower() != 'admin':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Impermissible action.")
