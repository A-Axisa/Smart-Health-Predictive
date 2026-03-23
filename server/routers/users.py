from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session

from ..utils.database import get_db
from ..utils.audit_log import write_audit_log
from ..models.dbmodels import (
    UserAccount,
    UserAccountRole,
    UserAccountValidationToken,
    HealthData,
    Prediction,
    Recommendation,
    LogEventType,
    Patient,
    UserPatientAccess,
    Clinic
)
from ..routers.authentication import get_current_user, get_user, get_patient_by_email

# Health Analysis


class HealthMetric(BaseModel):
    # ISO datetime string of the prediction creation time
    date: str
    month: str
    strokeProbability: float
    cardioProbability: float
    diabetesProbability: float


class Report(BaseModel):
    age: int
    weight: float
    height: float
    gender: int
    bloodGlucose: float
    ap_hi: float
    ap_lo: float
    highCholesterol: int
    hyperTension: int
    heartDisease: int
    diabetes: int
    alcohol: int
    smoker: int
    maritalStatus: int
    workingStatus: int
    strokeChance: float
    CVDChance: float
    diabetesChance: float
    # Optional recommendations
    exerciseRecommendation: Optional[str] = None
    dietRecommendation: Optional[str] = None
    lifestyleRecommendation: Optional[str] = None
    dietToAvoidRecommendation: Optional[str] = None


class HealthDataDates(BaseModel):
    healthDataID: int
    date: datetime


class ClinicDetails(BaseModel):
    clinic_id: int
    clinic_name: str


def _to_float(val) -> float:
    if isinstance(val, Decimal):
        return float(val)
    try:
        return float(val)
    except Exception:
        return 0.0


router = APIRouter()


def _delete_user_data(user_id: int, db_conn: Session):
    """
    Deletes a user and all their associated data, returning a report of the deletion.
    """
    deletion_report = {}

    try:
        # Find the user to ensure they exist before proceeding
        user_to_delete = db_conn.query(UserAccount).filter(
            UserAccount.UserID == user_id).first()
        if not user_to_delete:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

        # Get patient record if it exists
        patient_record = get_patient_by_email(user_to_delete.Email, db_conn)

        # Delete Merchant Patient access
        if patient_record:
            db_conn.query(UserPatientAccess).filter(UserPatientAccess.PatientID ==
                                                    patient_record.PatientID).delete(synchronize_session=False)
        else:
            db_conn.query(UserPatientAccess).filter(
                UserPatientAccess.UserID == user_to_delete.UserID).delete(synchronize_session=False)

        # Collect all HealthDataIDs for this user
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
            UserAccountValidationToken.UserID == user_id).delete(synchronize_session=False)
        deletion_report['validation_tokens_deleted'] = tokens_deleted

        roles_deleted = db_conn.query(UserAccountRole).filter(
            UserAccountRole.UserID == user_id).delete(synchronize_session=False)
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


@router.delete("/users/")
async def delete_user(request: Request, db_conn: Session = Depends(get_db)):
    # Current request user
    current = get_current_user(request, db_conn)
    request_user_email = current.get(
        'email') if isinstance(current, dict) else None
    if not isinstance(request_user_email, str) or request_user_email.strip() == "":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    user_to_delete = get_user(request_user_email, db_conn)
    if user_to_delete is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user_id = user_to_delete.UserID

    # Perform the deletion
    _delete_user_data(user_id, db_conn)
    write_audit_log(db_conn,
                    eventType=LogEventType.ACCOUNT_DELETED,
                    success=True,
                    userEmail=user_to_delete.Email,
                    device=request.headers.get("user-agent"),
                    ipAddress=request.client.host,
                    description=f"Account deleted from database.")

    return {"message": "User and all related data deleted successfully"}

# Health analytics


@router.get("/api/health-analytics", response_model=List[HealthMetric])
async def get_health_analytics(
    request: Request,
    db_conn: Session = Depends(get_db),
):
    """
    Returns time-series health risk probabilities for the current user
    using historical predictions stored in the database.
    """
    user_email = get_current_user(request, db_conn)
    patient = get_patient_by_email(user_email["email"], db_conn)
    if not patient:
        return []
    patient_id = patient.PatientID

    # Join predictions with health data to scope by user, order by prediction time
    rows = (
        db_conn.query(
            getattr(Prediction, 'CreatedAt'),
            getattr(Prediction, 'StrokeChance'),
            getattr(Prediction, 'CVDChance'),
            getattr(Prediction, 'DiabetesChance'),
        )
        .join(
            HealthData,
            getattr(Prediction, 'HealthDataID') == getattr(
                HealthData, 'HealthDataID'),
        )
        .filter(getattr(HealthData, 'PatientID') == patient_id)
        .order_by(getattr(Prediction, 'CreatedAt').asc())
        .all()
    )

    def month_label(dt: datetime) -> str:
        # e.g., 'Jan 2025' to help distinguish years if data spans multiple years
        try:
            return dt.strftime("%b %Y")
        except Exception:
            return str(dt)

    data: List[HealthMetric] = []
    for created_at, stroke, cvd, diab in rows:
        data.append(
            HealthMetric(
                date=(created_at.isoformat() if isinstance(
                    created_at, datetime) else str(created_at)),
                month=month_label(created_at),
                strokeProbability=_to_float(stroke),
                cardioProbability=_to_float(cvd),
                diabetesProbability=_to_float(diab),
            )
        )

    return data

# Report Data


@router.get("/reportData/{healthDataId}")
async def get_report_data(healthDataId: int, db_conn: Session = Depends(get_db)):

    validID = db_conn.query(HealthData).filter_by(
        HealthDataID=healthDataId).first()
    if not validID:
        raise HTTPException(status_code=404, detail="Report data not found")

    # Retrieve user health data
    healthData = db_conn.query(HealthData).filter(
        getattr(HealthData, 'HealthDataID') == healthDataId).first()
    predictionData = db_conn.query(Prediction).filter(
        getattr(Prediction, 'HealthDataID') == healthDataId).first()
    recommendationData = db_conn.query(Recommendation).filter(getattr(
        Recommendation, 'HealthDataID') == healthDataId).order_by(getattr(Recommendation, 'CreatedAt').desc()).first()

    # Create health report data to return
    reportData = Report(
        age=int(getattr(healthData, 'Age', 0) or 0),
        weight=float(getattr(healthData, 'WeightKilograms', 0) or 0),
        height=float(getattr(healthData, 'HeightCentimetres', 0) or 0),
        gender=int(
            1 if bool(getattr(healthData, 'Gender', False) or False) else 0),
        bloodGlucose=float(getattr(healthData, 'BloodGlucose', 0) or 0),
        ap_hi=float(getattr(healthData, 'APHigh', 0) or 0),
        ap_lo=float(getattr(healthData, 'APLow', 0) or 0),
        highCholesterol=int(
            1 if bool(getattr(healthData, 'HighCholesterol', False) or False) else 0),
        hyperTension=int(
            1 if bool(getattr(healthData, 'HyperTension', False) or False) else 0),
        heartDisease=int(
            1 if bool(getattr(healthData, 'HeartDisease', False) or False) else 0),
        diabetes=int(
            1 if bool(getattr(healthData, 'Diabetes', False) or False) else 0),
        alcohol=int(
            1 if bool(getattr(healthData, 'Alcohol', False) or False) else 0),
        smoker=int(getattr(healthData, 'SmokingStatus', 0) or 0),
        maritalStatus=int(getattr(healthData, 'MaritalStatus', 0) or 0),
        workingStatus=int(getattr(healthData, 'WorkingStatus', 0) or 0),
        strokeChance=float(getattr(predictionData, 'StrokeChance', 0) or 0),
        CVDChance=float(getattr(predictionData, 'CVDChance', 0) or 0),
        diabetesChance=float(
            getattr(predictionData, 'DiabetesChance', 0) or 0),
        exerciseRecommendation=getattr(
            recommendationData, 'ExerciseRecommendation', None) if recommendationData else None,
        dietRecommendation=getattr(
            recommendationData, 'DietRecommendation', None) if recommendationData else None,
        lifestyleRecommendation=getattr(
            recommendationData, 'LifestyleRecommendation', None) if recommendationData else None,
        dietToAvoidRecommendation=getattr(
            recommendationData, 'DietToAvoidRecommendation', None) if recommendationData else None,
    )

    # Return reportData object
    return reportData


@router.delete("/reportData/{healthDataId}")
async def delete_report_data(healthDataId: int, db_conn: Session = Depends(get_db)):

   # Raise exception if health data is not in the DB
    health_data = db_conn.query(HealthData).filter_by(
        HealthDataID=healthDataId).first()
    if not health_data:
        raise HTTPException(status_code=404, detail="Health report not found")

    try:
        # Delete recommendation and prediction data first to avoid a foreign key error
        db_conn.query(Recommendation).filter(getattr(
            Recommendation, 'HealthDataID') == healthDataId).delete(synchronize_session=False)
        db_conn.query(Prediction).filter(getattr(
            Prediction, 'HealthDataID') == healthDataId).delete(synchronize_session=False)
        # Delete health data
        db_conn.query(HealthData).filter(getattr(
            HealthData, 'HealthDataID') == healthDataId).delete(synchronize_session=False)

        db_conn.commit()
    except Exception:
        db_conn.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Failed to delete health data.")

    return {"message": "Health report data successfully deleted"}


@router.get("/merchants/reports")
async def get_merchant_reports(request: Request, db_conn: Session = Depends(get_db)):

    # Check if the requesting user is a merchant.
    current_user = get_current_user(request, db_conn)
    current_user_email = current_user.get('email')
    merchant = db_conn.query(UserAccount).filter_by(
        Email=current_user_email).first()
    if not merchant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    current_user_role = current_user.get('role')
    if not current_user_role or current_user_role.lower() != 'merchant':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Impermissible action.")

    # Get patients associated with the merchant.
    patients = get_merchant_patients(merchant.UserID, db_conn)
    patient_ids = [p.PatientID for p in patients]
    # Get patient health data.
    patient_health_data = (db_conn.query(HealthData).filter(HealthData.PatientID.in_(patient_ids))
                           .order_by(HealthData.CreatedAt.desc()).all())
    result = []
    for row in patient_health_data:

        # Get the patient's name.
        patient = db_conn.query(Patient).filter_by(
            PatientID=row.PatientID).first()

        result.append({
            "name": f'{patient.GivenNames} {patient.LastName}',
            "healthDataID": row.HealthDataID,
            "date": row.CreatedAt
        })

    return result


@router.get("/merchants/patient_names")
async def get_patient_names(request: Request, db_conn: Session = Depends(get_db)):

    # Check if the requesting user is a merchant.
    current_user = get_current_user(request, db_conn)
    current_user_email = current_user.get('email')
    merchant = db_conn.query(UserAccount).filter_by(
        Email=current_user_email).first()
    if not merchant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    current_user_role = current_user.get('role')
    if not current_user_role or current_user_role.lower() != 'merchant':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Impermissible action.")

    # Get patient data associated with the merchant.
    patients = get_merchant_patients(merchant.UserID, db_conn)

    result = []
    existing_patient = set()
    for patient in patients:

        # Get the patient's name.
        if patient.PatientID not in existing_patient:
            result.append({
                "name": f'{patient.GivenNames} {patient.LastName}',
                "patient_id": patient.PatientID
            })
            existing_patient.add(patient.PatientID)

    return result


@router.get("/getHealthDataDates/")
async def getHealthData(request: Request, db_conn: Session = Depends(get_db)):
    # Retrieve user current user information
    user_email = get_current_user(request, db_conn)
    patient = get_patient_by_email(user_email["email"], db_conn)

    # Retrieve user health data
    healthData = db_conn.query(HealthData).filter(
        HealthData.PatientID == patient.PatientID).order_by(HealthData.CreatedAt.desc()).all()

    # Filter by ID and date create to return
    healthDataDates = [HealthDataDates(
        healthDataID=data.HealthDataID, date=data.CreatedAt) for data in healthData]

    return healthDataDates


@router.get("/getClinicNames/")
async def getClinicNames(request: Request, db_conn: Session = Depends(get_db)):

    # Retrieve the all clinics
    clinics = (
        db_conn.query(Clinic)
        .order_by(Clinic.ClinicID.asc())
        .all()
    )
    # Filter clinic by name and id
    clinic_details = [
        ClinicDetails(clinic_id=clinic.ClinicID, clinic_name=clinic.ClinicName)
        for clinic in clinics
    ]

    return clinic_details


def get_merchant_patients(merchantID: int, db_conn):
    '''Get all patients that belong to the merchant user'''
    return (db_conn.query(Patient)
            .join(UserPatientAccess, UserPatientAccess.PatientID == Patient.PatientID)
            .filter(UserPatientAccess.UserID == merchantID)
            .order_by(Patient.CreatedAt.desc())
            .all()
            )
