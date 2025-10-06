from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends
from pydantic import BaseModel
import joblib
import pandas as pd
from sqlalchemy.orm import Session

from ..utils.database import get_db 
from ..models.dbmodels import HealthData, Prediction, Recommendation
from ..services.health_recommendation_service import get_health_recommendations

# HealthData
class HealthDataInput(BaseModel):
    userId: int
    age: int
    weight: float
    height: float
    gender: int
    bloodGlucose: float
    ap_hi: float            # Value provided in model unsure what it is
    ap_lo: float            # Value provided in model unsure what it is
    highCholesterol: int    # The last 9 variables are either True or False where True = 1 and False = 0
    exercise: int
    hyperTension: int
    heartDisease: int
    diabetes: int
    alcohol: int
    smoker: int
    maritalStatus: int
    workingStatus: int


#Load AI prediction models
cardioModel = joblib.load("predictionModels/model_cardio_h.joblib")
strokeModel = joblib.load("predictionModels/model_stroke_h.joblib")
diabetesModel = joblib.load("predictionModels/model_diabetes_h.joblib")


router = APIRouter()

@router.post("/AIPrediction/")
async def predict(data: HealthDataInput, db_conn: Session = Depends(get_db)):
    #Calculate BMI
    if(data.height == 0):
        BMI = 0
    else:
        BMI = (data.weight/(data.height**2))
    
    healthData = HealthData(data.userId, data.age, data.weight, data.height, data.gender, 
                        data.bloodGlucose, data.ap_hi,data.ap_lo,data.highCholesterol,
                        data.exercise,data.hyperTension, data.heartDisease, data.diabetes, data.alcohol, 
                        data.smoker, data.maritalStatus,data.workingStatus)
    # Store health data into the database
    db_conn.add(healthData)
    db_conn.commit() 
    # Refresh to retrieve primary key for prediction data
    db_conn.refresh(healthData)

    #Cardio Dataframe
    cardio_df = pd.DataFrame([[
        data.age,
        data.gender,
        BMI,
        data.height,
        data.ap_hi,
        data.ap_lo,
        data.highCholesterol,
        data.bloodGlucose,
        data.smoker,
        data.alcohol
    ]])
    # Cardio prediction
    cardioPrediction = cardioModel.predict_proba(cardio_df)
    cardioPrediction = round(float(cardioPrediction[0][1]) * 100, 2)
    #Stoke Dataframe
    stroke_df = pd.DataFrame([[
        data.gender,
        data.age,
        data.heartDisease,
        data.maritalStatus,
        data.workingStatus,
        data.bloodGlucose,
        data.weight,
        data.height,
        BMI,
        data.smoker
    ]])
    
    # Stroke Prediction
    strokePrediction = strokeModel.predict_proba(stroke_df)
    strokePrediction = round(float(strokePrediction[0][1]) * 100, 2)   
    #diabetes Dataframe
    diabetes_df = pd.DataFrame([[
        data.gender,
        data.age,
        data.heartDisease,
        data.smoker,
        data.weight,
        data.height,
        BMI,
        data.bloodGlucose
    ]])

    # diabetes prediction
    diabetesPrediction = diabetesModel.predict_proba(diabetes_df)
    diabetesPrediction = round(float(diabetesPrediction[0][1]) * 100, 2)

    # Create prediction object for storage
    prediction = Prediction(healthData.HealthDataID, strokePrediction, diabetesPrediction,cardioPrediction)
    
    # Store prediction
    db_conn.add(prediction)
    db_conn.commit()

    # Generate AI-based health recommendations (best-effort; non-fatal if fails)
    recommendations = None
    try:
        _hd_id = getattr(healthData, 'HealthDataID', None)
        if _hd_id is not None:
            recommendations = get_health_recommendations(db_conn=db_conn, health_data_id=int(_hd_id))
        else:
            recommendations = {"error": "Missing HealthDataID"}
    except Exception as e:
        recommendations = {"error": str(e)}

    # Persist recommendations when available
    exercise_rec = None
    diet_rec = None
    lifestyle_rec = None
    if isinstance(recommendations, dict) and "error" not in recommendations:
        exercise_rec = recommendations.get("exercise_recommendation")
        diet_rec = recommendations.get("diet_recommendation")
        lifestyle_rec = recommendations.get("lifestyle_recommendation")

        rec_row = Recommendation(
            healthDataID=healthData.HealthDataID,
            exerciseRecommendation=exercise_rec,
            dietRecommendation=diet_rec,
            lifestyleRecommendation=lifestyle_rec
        )
        db_conn.add(rec_row)
        db_conn.commit()

    return {
        "cardioProbability": cardioPrediction,
        "strokeProbability": strokePrediction,
        "diabetesProbability": diabetesPrediction,
        "recommendations": {
            "exercise": exercise_rec,
            "diet": diet_rec,
            "lifestyle": lifestyle_rec
        }
    }