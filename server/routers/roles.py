from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..utils.database import get_db
from ..models.dbmodels import AccountRole


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
