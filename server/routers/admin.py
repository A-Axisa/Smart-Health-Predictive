from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import List
from ..utils.database import get_db
from ..models.dbmodels import (
    UserAccount,
    UserAccountRole,
    AccountRole,
    UserAccountValidationToken,
    HealthData,
    Prediction,
    Recommendation,
)
from ..routers.authentication import get_current_user

router = APIRouter()


@router.get("/roles")
async def get_roles(db_conn: Session = Depends(get_db)):

    roles = db_conn.query(AccountRole).all()

    result = []
    for role in roles:
        result.append({
            "id": role.RoleID if role else None,
            "name": role.RoleName if role else None,
        })

    return result


@router.get("/users")
async def get_users(db_conn: Session = Depends(get_db)):

    # Query all users and their associated role.
    users = db_conn.query(UserAccount, AccountRole) \
        .filter(UserAccount.IsValidated == 1) \
        .outerjoin(UserAccountRole, UserAccount.UserID == UserAccountRole.UserID) \
        .outerjoin(AccountRole, UserAccountRole.RoleID == AccountRole.RoleID) \
        .all()

    result = []
    for user, role in users:
        result.append({
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


@router.patch("/users/{user_email}/roles/{role_id}")
async def update_user_role(user_email: str, role_id: int,
                           db_conn: Session = Depends(get_db)):

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
        health_ids: List[int] = [
            hid for (hid,) in db_conn.query(HealthData.HealthDataID).filter(HealthData.UserID == user_to_delete.UserID).all()
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
                HealthData.UserID == user_to_delete.UserID).delete(synchronize_session=False)
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

    return {
        "message": f"User with Email {user_email} and all related data deleted successfully",
        "deletion_report": deletion_report
    }


@router.get("/users/merchants/")
async def get_invalid_merchant_accounts(db_conn: Session = Depends(get_db)):

    # Query all invalid merchant accounts.
    invalid_merchant_accounts = db_conn.query(UserAccount) \
        .outerjoin(UserAccountRole, UserAccount.UserID == UserAccountRole.UserID) \
        .outerjoin(AccountRole, UserAccountRole.RoleID == AccountRole.RoleID) \
        .filter(AccountRole.RoleName == "merchant") \
        .filter(UserAccount.IsValidated == 0) \
        .all()

    result = []
    for merchant in invalid_merchant_accounts:
        result.append({
            "fullName": merchant.FullName,
            "email": merchant.Email,
            "phoneNumber": merchant.PhoneNumber,
            "createdAt": merchant.CreatedAt,
        })

    return result


@router.patch("/users/merchants/{merchant_email}")
async def validate_merchant(merchant_email: str, request: Request, db_conn: Session = Depends(get_db)):

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

    return {"message": f"Merchant: {merchant.FullName} has been successfully validated."}
