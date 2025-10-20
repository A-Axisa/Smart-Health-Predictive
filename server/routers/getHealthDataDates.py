from datetime import datetime
from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List

from ..utils.database import get_db 
from ..models.dbmodels import HealthData, Prediction
from .authentication import get_current_user, get_user

class HealthDataDates(BaseModel):
    healthDataID: int
    date: datetime


router = APIRouter()

@router.get("/getHealthDataDates/")
async def getHealthData(request: Request, db_conn: Session = Depends(get_db)):
    # Retrieve user current user information
    user_email = get_current_user(request, db_conn)
    user = get_user(user_email["email"], db_conn)

    # Retrieve user health data
    healthData = db_conn.query(HealthData).filter(HealthData.UserID == user.UserID).order_by(HealthData.CreatedAt.desc()).all()
    
    # Filter by ID and date create to return
    healthDataDates = [HealthDataDates(healthDataID=data.HealthDataID,date=data.CreatedAt) for data in healthData]

    return healthDataDates

