from datetime import datetime, timedelta, timezone
from fastapi import APIRouter
from pydantic import BaseModel
import joblib
import pandas as pd
from sqlalchemy.orm import Session

from ..utils.database import get_db 
from ..models.dbmodels import HealthData, Prediction

# HealthData
class HealthData(BaseModel):
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
async def predict(data: HealthData):
    #Calculate BMI
    if(data.height == 0):
        BMI = 0
    else:
        BMI = (data.weight/(data.height**2))
    
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

    return {
    "cardioProbability": round(float(cardioPrediction[0][1]) * 100, 2),
    "strokeProbability": round(float(strokePrediction[0][1]) * 100, 2),
    "diabetesProbability": round(float(diabetesPrediction[0][1]) * 100, 2)
}