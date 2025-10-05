from datetime import datetime
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List

from ..utils.database import get_db 
from ..models.dbmodels import HealthData, Prediction

class HealthDataDates(BaseModel):
    healthDataID: int
    date: datetime


router = APIRouter()

@router.get("/getHealthDataDates/{userId}")
async def getHealthData(userId:int, db_conn: Session = Depends(get_db)):
    # Retrieve user health data
    healthData = db_conn.query(HealthData).filter(HealthData.UserID == userId).order_by(HealthData.CreatedAt.desc()).all()
    
    # Filter by ID and date create to return
    healthDataDates = [HealthDataDates(healthDataID=data.HealthDataID,date=data.CreatedAt) for data in healthData]

    return healthDataDates

