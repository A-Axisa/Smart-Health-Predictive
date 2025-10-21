from fastapi import APIRouter, Depends, HTTPException, status, Request, File, UploadFile
from typing import Optional
from pydantic import BaseModel
import joblib
import pandas as pd
from sqlalchemy.orm import Session
import csv
import codecs

from ..utils.database import get_db 
from ..models.dbmodels import HealthData, Prediction, Recommendation, UserAccount
from ..services.health_recommendation_service import get_health_recommendations
from .authentication import get_current_user, get_user, get_user_me

# HealthData
class HealthDataInput(BaseModel):
    age: int
    weight: float           # kg
    height: float           # m
    gender: int             # Female: 0, Male: = 1
    bloodGlucose: float     # mmol/L
    ap_hi: float            # Systolic Blood Pressure (mmHg)
    ap_lo: float            # Diastolic Blood Pressure (mmHg)
    highCholesterol: int    # The last 9 variables are either True or False where True = 1 and False = 0
    exercise: int
    hyperTension: int
    heartDisease: int
    diabetes: int
    alcohol: int
    smoker: int
    maritalStatus: int
    workingStatus: int
    merchantID:Optional[int] = None


#Load AI prediction models
cardioModel = joblib.load("predictionModels/model_cardio_h.joblib")
strokeModel = joblib.load("predictionModels/model_stroke_h.joblib")
diabetesModel = joblib.load("predictionModels/model_diabetes_h.joblib")


router = APIRouter()

@router.post("/AIPrediction/")
async def predict(data: HealthDataInput,request: Request, db_conn: Session = Depends(get_db), \
                  CSVUserID: Optional[int] = None):

    # Check if user input is valid
    if (
        not is_age_valid(data.age) or
        not is_weight_valid(data.weight) or
        not is_height_valid(data.height) or
        not is_gender_valid(data.gender) or
        not is_bloodGlucose_valid(data.bloodGlucose) or
        not is_ap_hi_valid(data.ap_hi) or
        not is_ap_lo_valid(data.ap_lo) or
        not is_highCholesterol_valid(data.highCholesterol) or
        not is_exercise_valid(data.exercise) or
        not is_hyperTension_valid(data.hyperTension) or
        not is_heartDisease_valid(data.heartDisease) or
        not is_diabetes_valid(data.diabetes) or
        not is_alcohol_valid(data.alcohol) or
        not is_smoker_valid(data.smoker) or
        not is_maritalStatus_valid(data.maritalStatus) or
        not is_workingStatus_valid(data.workingStatus)):

        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)
    #Calculate BMI
    if(data.height == 0):
        BMI = 0
    else:
        BMI = (data.weight/(data.height**2))
    
    # Retrieve user current user information
    user_email = get_current_user(request, db_conn)
    user = get_user(user_email["email"], db_conn)

    # Check if a UserID was passed in from CSV
    userID = CSVUserID if CSVUserID is not None else user.UserID

    healthData = HealthData(userID, data.age, data.weight, data.height, data.gender, 
                        data.bloodGlucose, data.ap_hi,data.ap_lo,data.highCholesterol,
                        data.exercise,data.hyperTension, data.heartDisease, data.diabetes, data.alcohol, 
                        data.smoker, data.maritalStatus,data.workingStatus,data.merchantID)
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
        diet_to_avoid_rec = recommendations.get("diet_to_avoid_recommendation")

        rec_row = Recommendation(
            healthDataID=healthData.HealthDataID,
            exerciseRecommendation=exercise_rec,
            dietRecommendation=diet_rec,
            lifestyleRecommendation=lifestyle_rec,
            dietToAvoidRecommendation=diet_to_avoid_rec
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
            "lifestyle": lifestyle_rec,
            "diet_to_avoid": diet_to_avoid_rec
        }
    }

@router.post("/upload")
async def uploadCSV(request: Request, file: UploadFile = File(...), \
                    db_conn: Session = Depends(get_db)):

    # Retrieve current user to pass their merchantID
    currentUser = await get_user_me(request, db_conn)
    merchantEmail = currentUser.get('email')
    merchant = db_conn.query(UserAccount).filter_by(Email=merchantEmail).first()
    
    # Validate that the upload file is in .csv format
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="File must be in .csv format")
    
    # Decode and wrap in a DictReader for reading each row
    csvReader = csv.DictReader(codecs.iterdecode(file.file, 'utf-8'))

    rowIndex = 0 # For a nicer return message
    for row in csvReader:
        # Store email if supplied, otherwise parse the next user's data
        userEmail = row.get('Email')
        if not userEmail:
            continue
        userEmail = userEmail.strip()
        
        # Retrieve the user from their email
        user = db_conn.query(UserAccount).filter_by(Email=userEmail).first()
        if not user:
            continue

        # Parse row data into JSON format
        healthData = HealthDataInput(
            UserID=user.UserID,
            age=int(row["Age"]) if row.get("Age") else 0,
            weight=float(row["WeightInKilograms"]) if row.get("WeightInKilograms") else 0,
            height=float(row["HeightMeters"]) if row.get("HeightMeters") else 0,
            gender=bool(int(row["Gender"])) if row.get("Gender") else 0,
            bloodGlucose=float(row["BloodGlucose"]) if row.get("BloodGlucose") else 0,
            ap_hi=float(row["APHigh"]) if row.get("APHigh") else 0,
            ap_lo=float(row["APLow"]) if row.get("APLow") else 0,
            highCholesterol=bool(int(row["HighCholesterol"])) if row.get("HighCholesterol") else 0,
            exercise=bool(int(row["Exercise"])) if row.get("Exercise") else 0,
            hyperTension=bool(int(row["HyperTension"])) if row.get("HyperTension") else 0,
            heartDisease=bool(int(row["HeartDisease"])) if row.get("HeartDisease") else 0,
            diabetes=bool(int(row["Diabetes"])) if row.get("Diabetes") else 0,
            alcohol=bool(int(row["Alcohol"])) if row.get("Alcohol") else 0,
            smoker=bool(int(row["SmokingStatus"])) if row.get("SmokingStatus") else 0,
            maritalStatus=bool(int(row["MaritalStatus"])) if row.get("MaritalStatus") else 0,
            workingStatus=bool(int(row["WorkingStatus"])) if row.get("WorkingStatus") else 0,
            merchantID=merchant.UserID,
        )
        # Call predict endpoint for each entry
        prediction = await predict(healthData, request, db_conn, user.UserID)
        rowIndex += 1

    file.file.close()

    return {"message" : f"Successfully uploaded {rowIndex} patient entries."}


def is_age_valid(age: int):
    return age >= 0 and age <= 100

def is_weight_valid(weight: float):
    return weight >= 0.0 and weight <= 200.0

def is_height_valid(height: float):
    return height >= 0.0 and height <= 3.0

def is_gender_valid(gender: int):
    return gender == 0 or gender == 1

def is_bloodGlucose_valid(bloodGlucose: float):
    return bloodGlucose >= 0.0 and bloodGlucose <= 20.0

def is_ap_hi_valid(ap_hi: float):
    return ap_hi >= 0.0 and ap_hi <= 200.0

def is_ap_lo_valid(ap_lo: float):
    return ap_lo >= 0.0 and ap_lo <= 200.0

def is_highCholesterol_valid(highCholesterol: int):
    return highCholesterol == 0 or highCholesterol == 1

def is_exercise_valid(exercise: int):
    return exercise == 0 or exercise == 1

def is_hyperTension_valid(hyperTension: int):
    return hyperTension == 0 or hyperTension == 1

def is_heartDisease_valid(heartDisease: int):
    return heartDisease == 0 or heartDisease == 1

def is_diabetes_valid(diabetes: int):
    return diabetes == 0 or diabetes == 1

def is_alcohol_valid(alcohol: int):
    return alcohol == 0 or alcohol == 1

def is_smoker_valid(smoker: int):
    return smoker == 0 or smoker == 1

def is_maritalStatus_valid(maritalStatus: int):
    return maritalStatus == 0 or maritalStatus == 1

def is_workingStatus_valid(workingStatus: int):
    return workingStatus == 0 or workingStatus == 1