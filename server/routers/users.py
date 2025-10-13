from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from ..utils.database import get_db
from ..models.dbmodels import UserAccount, UserAccountRole, AccountRole, HealthData, UserAccountValidationToken
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

@router.delete("/users/{user_id}")
async def delete_user(user_id: int, request: Request, db_conn: Session = Depends(get_db)):
    # Get current user
    request_user_email = get_current_user(request, db_conn)['email']
    request_user = get_user(request_user_email, db_conn)

    # Get user to delete
    user_to_delete = db_conn.query(UserAccount).filter(UserAccount.UserID == user_id).first()

    if not user_to_delete:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    # Check permissions
    user_role = db_conn.query(AccountRole).join(UserAccountRole).filter(UserAccountRole.UserID == request_user.UserID).first()
    
    is_admin = user_role and user_role.RoleName == "administrator" # Assuming "administrator" is the role name for admins TODO: to config

    if request_user.UserID != user_id and not is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this user")

    # Delete related data
    db_conn.query(UserAccountRole).filter(UserAccountRole.UserID == user_id).delete()
    db_conn.query(HealthData).filter(HealthData.UserID == user_id).delete()
    db_conn.query(UserAccountValidationToken).filter(UserAccountValidationToken.UserID == user_id).delete()
    
    # Delete user
    db_conn.delete(user_to_delete)
    db_conn.commit()

    return {"message": "User and related data deleted successfully"}
