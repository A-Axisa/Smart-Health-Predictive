from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List, Optional

from ..utils.database import get_db 
from ..models.dbmodels import HealthData, Prediction, Recommendation, UserAccount
from .authentication import get_user_me

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

@router.get("/reportData/{healthDataId}")
async def get_report_data(healthDataId:int, db_conn: Session = Depends(get_db)):
   
    validID = db_conn.query(HealthData).filter_by(HealthDataID=healthDataId).first()
    if not validID:
        raise HTTPException(status_code=404, detail="Report data not found")
   
   
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

@router.delete("/reportData/{healthDataId}")
async def delete_report_data(healthDataId:int, db_conn: Session = Depends(get_db)):
   
   # Raise exception if health data is not in the DB
    health_data = db_conn.query(HealthData).filter_by(HealthDataID=healthDataId).first()
    if not health_data:
        raise HTTPException(status_code=404, detail="Health report not found")
   
    try:
        # Delete recommendation and prediction data first to avoid a foreign key error
        db_conn.query(Recommendation).filter(getattr(Recommendation, 'HealthDataID') == healthDataId).delete(synchronize_session=False)
        db_conn.query(Prediction).filter(getattr(Prediction, 'HealthDataID') == healthDataId).delete(synchronize_session=False)
        # Delete health data
        db_conn.query(HealthData).filter(getattr(HealthData, 'HealthDataID') == healthDataId).delete(synchronize_session=False)
        
        db_conn.commit()
    except Exception:
        db_conn.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to delete health data.")

    return {"message": "Health report data successfully deleted"}

@router.get("/merchants/reports")
async def get_patient_reports(request: Request, db_conn: Session = Depends(get_db)):
    #  Retrieve the current merchant
    currentUser = await get_user_me(request, db_conn)
    merchantEmail = currentUser.get('email')
    merchant = db_conn.query(UserAccount).filter_by(Email=merchantEmail).first()
    
    # Filter health data submitted by the merchant
    patientData = db_conn.query(HealthData).filter(HealthData.MerchantID == merchant.UserID) \
                .order_by(HealthData.CreatedAt.asc()).all()
    
    data = []

    # Add each user and their corrosponding health data
    for row in patientData:
        # Query to access patient name
        patient = db_conn.query(UserAccount).filter_by(UserID=row.UserID).first()

        data.append({
            "name" : patient.FullName,
            "healthDataID" : row.HealthDataID,
            "date" : row.CreatedAt
        })

    return data
