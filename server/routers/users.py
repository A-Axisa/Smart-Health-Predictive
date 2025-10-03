from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..utils.database import get_db
from ..models.dbmodels import UserAccount


router = APIRouter()

@router.get("/users/")
async def readUser(db_conn: Session = Depends(get_db)):
    users = db_conn.query(UserAccount).all()
    
    result = []

    for user in users:
        result.append({
            "id": user.UserID,
            "fullName": user.FullName,
            "email": user.Email,
            "phoneNumber": user.PhoneNumber,
            "createdAt": user.CreatedAt
        })

    return result
