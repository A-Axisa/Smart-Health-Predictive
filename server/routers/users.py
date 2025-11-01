from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel
from ..utils.database import get_db
from .authentication import get_current_user, get_user
from ..models.dbmodels import (
    UserAccount,
    UserAccountRole,
    AccountRole,
    HealthData,
    UserAccountValidationToken,
    Prediction,
    Recommendation,
    HealthData,
    Prediction
)
from ..routers.authentication import get_current_user, get_user

# Health Analysis
class HealthMetric(BaseModel):
    # ISO datetime string of the prediction creation time
    date: str
    month: str
    strokeProbability: float
    cardioProbability: float
    diabetesProbability: float


def _to_float(val) -> float:
    if isinstance(val, Decimal):
        return float(val)
    try:
        return float(val)
    except Exception:
        return 0.0


router = APIRouter()

@router.get("/users/")
async def getUsers(db_conn: Session = Depends(get_db)):
    users = db_conn.query(UserAccount, AccountRole). \
        outerjoin(UserAccountRole, UserAccount.UserID == UserAccountRole.UserID). \
        outerjoin(AccountRole, UserAccountRole.RoleID == AccountRole.RoleID). \
        all()
    
    result = []

    for user, role in users:
        result.append({
            "id": user.UserID,
            "fullName": user.FullName,
            "email": user.Email,
            "phoneNumber": user.PhoneNumber,
            "createdAt": user.CreatedAt,
            "role": {
                "id": role.RoleID if role else None,
                "name": role.RoleName if role else None
            }
        })

    return result

def _delete_user_data(user_id: int, db_conn: Session):
    """
    Deletes a user and all their associated data, returning a report of the deletion.
    """
    deletion_report = {}

    try:
        # Find the user to ensure they exist before proceeding
        user_to_delete = db_conn.query(UserAccount).filter(UserAccount.UserID == user_id).first()
        if not user_to_delete:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

        # Collect all HealthDataIDs for this user
        health_ids: List[int] = [
            hid for (hid,) in db_conn.query(HealthData.HealthDataID).filter(HealthData.UserID == user_id).all()
        ]

        if health_ids:
            # Delete tables that depend on HealthData first
            recs_deleted = db_conn.query(Recommendation).filter(Recommendation.HealthDataID.in_(health_ids)).delete(synchronize_session=False)
            deletion_report['recommendations_deleted'] = recs_deleted

            preds_deleted = db_conn.query(Prediction).filter(Prediction.HealthDataID.in_(health_ids)).delete(synchronize_session=False)
            deletion_report['predictions_deleted'] = preds_deleted
            
            # Then delete HealthData records
            health_data_deleted = db_conn.query(HealthData).filter(HealthData.UserID == user_id).delete(synchronize_session=False)
            deletion_report['health_data_deleted'] = health_data_deleted

        # Delete tables directly associated with the user
        tokens_deleted = db_conn.query(UserAccountValidationToken).filter(UserAccountValidationToken.UserID == user_id).delete(synchronize_session=False)
        deletion_report['validation_tokens_deleted'] = tokens_deleted

        roles_deleted = db_conn.query(UserAccountRole).filter(UserAccountRole.UserID == user_id).delete(synchronize_session=False)
        deletion_report['user_roles_deleted'] = roles_deleted

        # Delete the user record itself
        db_conn.delete(user_to_delete)
        deletion_report['users_deleted'] = 1 # Since we are deleting one user

        db_conn.commit()
        return deletion_report
    except Exception as e:
        db_conn.rollback()
        # Log the exception e for debugging if needed
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to delete user data: {str(e)}")

@router.delete("/users/{user_id}")
async def delete_user_by_admin(user_id: int, request: Request, db_conn: Session = Depends(get_db)):
    # Get the current user making the request
    current_user_data = get_current_user(request, db_conn)
    requesting_user_email = current_user_data.get('email')
    
    # Verify the requesting user is an administrator
    admin_user = db_conn.query(UserAccount).filter(UserAccount.Email == requesting_user_email).first()
    if not admin_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not identify the requesting user.")

    user_role = db_conn.query(AccountRole).join(UserAccountRole, AccountRole.RoleID == UserAccountRole.RoleID).filter(UserAccountRole.UserID == admin_user.UserID).first()

    if not user_role or user_role.RoleName.lower() != 'admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to delete users.")

    # Prevent admin from deleting themselves
    if admin_user.UserID == user_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Administrators cannot delete their own accounts.")

    # Find the user to delete to get their details before deletion
    user_to_delete = db_conn.query(UserAccount).filter(UserAccount.UserID == user_id).first()
    if not user_to_delete:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User to delete not found.")
    
    # Perform the deletion and get the report
    deletion_report = _delete_user_data(user_id, db_conn)

    return {
        "message": f"User with ID {user_id} and all related data deleted successfully",
        "deletion_report": deletion_report
    }


@router.delete("/users/")
async def delete_user(request: Request, db_conn: Session = Depends(get_db)):
    # Current request user
    current = get_current_user(request, db_conn)
    request_user_email = current.get('email') if isinstance(current, dict) else None
    if not isinstance(request_user_email, str) or request_user_email.strip() == "":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    user_to_delete = get_user(request_user_email, db_conn)
    if user_to_delete is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user_id = user_to_delete.UserID

    # Perform the deletion
    _delete_user_data(user_id, db_conn)

    return {"message": "User and all related data deleted successfully"}


@router.get("/users/merchants/")
async def get_invalid_merchant_accounts(db_conn: Session = Depends(get_db)):
    invalid_merchant_accounts = db_conn.query(UserAccount) \
                            .outerjoin(UserAccountRole, UserAccount.UserID == UserAccountRole.UserID) \
                            .outerjoin(AccountRole, UserAccountRole.RoleID == AccountRole.RoleID) \
                            .filter(AccountRole.RoleName == "merchant") \
                            .filter(UserAccount.IsValidated == 0) \
                            .all()
    
    data = []

    for merchant in invalid_merchant_accounts:
        data.append({
            "fullName": merchant.FullName,
            "email": merchant.Email,
            "phoneNumber": merchant.PhoneNumber,
            "createdAt": merchant.CreatedAt,
        })

    return data


@router.post("/users/merchants/{merchant_email}")
async def validate_merchant(merchant_email: str, request: Request, db_conn: Session = Depends(get_db)):
    # Validate the requesting user
    admin_email = get_current_user(request, db_conn)
    admin = db_conn.query(UserAccount).filter(UserAccount.Email == admin_email.get("email")).first()

    # Verify the requesting user is an administrator
    if not admin:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not identify the requesting user.")

    user_role = db_conn.query(AccountRole).join(UserAccountRole, AccountRole.RoleID == UserAccountRole.RoleID) \
        .filter(UserAccountRole.UserID == admin.UserID).first()

    if not user_role or user_role.RoleName.lower() != 'admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to delete users.")
    
    # Begin merchant Validation
    merchant = db_conn.query(UserAccount).filter(UserAccount.Email == merchant_email).first()

    # Ensure that user is a merchant
    if not merchant:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Merchant user not found.")
    
    merchant.IsValidated = 1
    db_conn.commit()

    return {"message" : f"Merchant: {merchant.FullName} has been successfully validated."}


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
    user = get_user(user_email["email"], db_conn)
    if not user:
        return []
    user_id = user.UserID

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
            getattr(Prediction, 'HealthDataID') == getattr(HealthData, 'HealthDataID'),
        )
        .filter(getattr(HealthData, 'UserID') == user_id)
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
                date=(created_at.isoformat() if isinstance(created_at, datetime) else str(created_at)),
                month=month_label(created_at),
                strokeProbability=_to_float(stroke),
                cardioProbability=_to_float(cvd),
                diabetesProbability=_to_float(diab),
            )
        )

    return data