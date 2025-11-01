from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..utils.database import get_db
from ..models.dbmodels import UserAccount, UserAccountRole, AccountRole


router = APIRouter()

@router.get("/roles/")
async def getRoles(db_conn: Session = Depends(get_db)):
    roles = db_conn.query(AccountRole).all()
    
    result = []

    for role in roles:
        result.append({
            "id": role.RoleID,
            "roleName": role.RoleName,
        })

    return result


@router.post("/users/{userID}/roles/{roleID}")
async def updateUserRole(userID: int, roleID: int, db_conn: Session = Depends(get_db)):
    
    # Validate that user exists
    user = db_conn.query(UserAccount).filter(UserAccount.UserID == userID).first()
    # Validate that the role exists
    role = db_conn.query(AccountRole).filter(AccountRole.RoleID == roleID).first()
    # Validate if user has a role
    userRole = db_conn.query(UserAccountRole).filter(UserAccountRole.UserID == userID).first()

    if userRole:
        # Update current role with new roleID
        userRole.RoleID = roleID
    else:
        # If the user doesn't have a role, create a new association
        db_conn.add(UserAccountRole(UserID=userID, RoleID=roleID))

    db_conn.commit()

    # Return the updated role information
    return {"role": {"id": role.RoleID, "name": role.RoleName}}


