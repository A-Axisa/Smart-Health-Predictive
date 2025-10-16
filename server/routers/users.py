from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import List

from ..utils.database import get_db
from ..models.dbmodels import (
    UserAccount,
    UserAccountRole,
    AccountRole,
    HealthData,
    UserAccountValidationToken,
    Prediction,
    Recommendation,
)
from ..routers.authentication import get_current_user, get_user


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

    # Delete related data in an ordered, atomic way
    try:
        # Collect all HealthDataIDs for this user
        health_ids: List[int] = [
            hid for (hid,) in db_conn.query(HealthData.HealthDataID).filter(HealthData.UserID == user_id).all()
        ]

        if health_ids:
            # Delete tables that depend on HealthData first to avoid foreign key violations
            db_conn.query(Recommendation).filter(Recommendation.healthDataID.in_(health_ids)).delete(synchronize_session=False)
            db_conn.query(Prediction).filter(Prediction.healthDataID.in_(health_ids)).delete(synchronize_session=False)
            # Then delete HealthData records
            db_conn.query(HealthData).filter(HealthData.healthDataID.in_(health_ids)).delete(synchronize_session=False)

        # Delete tables directly associated with the user
        db_conn.query(UserAccountValidationToken).filter(UserAccountValidationToken.UserID == user_id).delete(synchronize_session=False)
        db_conn.query(UserAccountRole).filter(UserAccountRole.UserID == user_id).delete(synchronize_session=False)

        # Delete the user record itself
        db_conn.delete(user_to_delete)

        db_conn.commit()
    except Exception:
        db_conn.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to delete user data.")

    return {"message": "User and all related data deleted successfully"}
