from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..utils.database import get_db
from ..models.dbmodels import UserAccount, UserAccountRole, AccountRole


router = APIRouter()

@router.get("/users/")
async def getUsers(db_conn: Session = Depends(get_db)):
    users = db_conn.query(UserAccount, AccountRole.RoleName). \
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
            "roles": role
        })

    return result
