from datetime import datetime
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List

from ..utils.database import get_db 
from ..models.dbmodels import HealthData, Prediction

class Report(BaseModel):
    age: int
    weight: float
    height: float
    gender: int
    bloodGlucose: float
    ap_hi: float            
    ap_lo: float            
    highCholesterol: int    
    exercise: int
    hyperTension: int
    heartDisease: int
    diabetes: int
    alcohol: int
    smoker: int
    maritalStatus: int
    workingStatus: int
    strokeChance: float
    CVDChance : float
    diabetesChance : float
    


router = APIRouter()

@router.get("/getReportData/{healthDataId}")
async def getReportData(healthDataId:int, db_conn: Session = Depends(get_db)):
    # Retrieve user health data
    healthData = db_conn.query(HealthData).filter(HealthData.HealthDataID == healthDataId).first()
    predictionData = db_conn.query(Prediction).filter(Prediction.HealthDataID == healthDataId).first()
    
    # Create health report data to return
    reportData = Report(age=healthData.Age,weight=healthData.WeightKilograms,height=healthData.HeightMeters,gender=healthData.Gender,
                        bloodGlucose=healthData.BloodGlucose,ap_hi=healthData.APHigh,ap_lo=healthData.APLow,highCholesterol=healthData.HighCholesterol,
                        exercise=healthData.Exercise,hyperTension=healthData.HyperTension,heartDisease=healthData.HeartDisease,
                        diabetes=healthData.Diabetes,alcohol=healthData.Alcohol,smoker=healthData.SmokingStatus,
                        maritalStatus=healthData.MaritalStatus,workingStatus=healthData.WorkingStatus,
                        strokeChance=predictionData.StrokeChance,CVDChance=predictionData.CVDChance,diabetesChance=predictionData.DiabetesChance)

    # Return reportData object
    return reportData

