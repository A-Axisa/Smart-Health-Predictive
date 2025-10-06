from datetime import datetime
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List, Optional

from ..utils.database import get_db 
from ..models.dbmodels import HealthData, Prediction, Recommendation

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
    # Optional recommendations
    exerciseRecommendation: Optional[str] = None
    dietRecommendation: Optional[str] = None
    lifestyleRecommendation: Optional[str] = None
    dietToAvoidRecommendation: Optional[str] = None
    


router = APIRouter()

@router.get("/getReportData/{healthDataId}")
async def getReportData(healthDataId:int, db_conn: Session = Depends(get_db)):
    # Retrieve user health data
    healthData = db_conn.query(HealthData).filter(getattr(HealthData, 'HealthDataID') == healthDataId).first()
    predictionData = db_conn.query(Prediction).filter(getattr(Prediction, 'HealthDataID') == healthDataId).first()
    recommendationData = db_conn.query(Recommendation).filter(getattr(Recommendation, 'HealthDataID') == healthDataId).order_by(getattr(Recommendation, 'CreatedAt').desc()).first()
    
    # Create health report data to return
    reportData = Report(
        age=int(getattr(healthData, 'Age', 0) or 0),
        weight=float(getattr(healthData, 'WeightKilograms', 0) or 0),
        height=float(getattr(healthData, 'HeightMeters', 0) or 0),
        gender=int(1 if bool(getattr(healthData, 'Gender', False) or False) else 0),
        bloodGlucose=float(getattr(healthData, 'BloodGlucose', 0) or 0),
        ap_hi=float(getattr(healthData, 'APHigh', 0) or 0),
        ap_lo=float(getattr(healthData, 'APLow', 0) or 0),
        highCholesterol=int(1 if bool(getattr(healthData, 'HighCholesterol', False) or False) else 0),
        exercise=int(1 if bool(getattr(healthData, 'Exercise', False) or False) else 0),
        hyperTension=int(1 if bool(getattr(healthData, 'HyperTension', False) or False) else 0),
        heartDisease=int(1 if bool(getattr(healthData, 'HeartDisease', False) or False) else 0),
        diabetes=int(1 if bool(getattr(healthData, 'Diabetes', False) or False) else 0),
        alcohol=int(1 if bool(getattr(healthData, 'Alcohol', False) or False) else 0),
        smoker=int(1 if bool(getattr(healthData, 'SmokingStatus', False) or False) else 0),
        maritalStatus=int(1 if bool(getattr(healthData, 'MaritalStatus', False) or False) else 0),
        workingStatus=int(1 if bool(getattr(healthData, 'WorkingStatus', False) or False) else 0),
        strokeChance=float(getattr(predictionData, 'StrokeChance', 0) or 0),
        CVDChance=float(getattr(predictionData, 'CVDChance', 0) or 0),
        diabetesChance=float(getattr(predictionData, 'DiabetesChance', 0) or 0),
        exerciseRecommendation=getattr(recommendationData, 'ExerciseRecommendation', None) if recommendationData else None,
        dietRecommendation=getattr(recommendationData, 'DietRecommendation', None) if recommendationData else None,
        lifestyleRecommendation=getattr(recommendationData, 'LifestyleRecommendation', None) if recommendationData else None,
        dietToAvoidRecommendation=getattr(recommendationData, 'DietToAvoidRecommendation', None) if recommendationData else None,
    )

    # Return reportData object
    return reportData

