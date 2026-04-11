from fastapi import APIRouter, Depends, HTTPException, status, Request, File, UploadFile
from typing import Optional
from pydantic import BaseModel
import joblib
import pandas as pd
from sqlalchemy.orm import Session
import csv
import codecs

from ..utils.database import get_db
from ..models.dbmodels import HealthData, Prediction, Recommendation, UserAccount, UserPatientAccess, Patient, LogEventType
from ..services.health_recommendation_service import get_health_recommendations
from .authentication import get_current_user, get_user, get_patient_by_email
from ..utils.audit_log import write_audit_log

# HealthData


class HealthDataInput(BaseModel):
    age: int
    weight: float           # kg
    height: float           # cm
    gender: str
    blood_glucose: float     # mmol/L
    ap_hi: float            # Systolic Blood Pressure (mmHg)
    ap_lo: float            # Diastolic Blood Pressure (mmHg)
    high_cholesterol: int
    hyper_tension: int
    heart_disease: int
    diabetes: int
    alcohol: int
    smoker: str
    marital_status: str
    working_status: str
    stroke: int


class MerchantHealthDataInput(BaseModel):
    age: int
    weight: float           # kg
    height: float           # cm
    gender: str
    blood_glucose: float     # mmol/L
    ap_hi: float            # Systolic Blood Pressure (mmHg)
    ap_lo: float            # Diastolic Blood Pressure (mmHg)
    high_cholesterol: int
    hyper_tension: int
    heart_disease: int
    diabetes: int
    alcohol: int
    smoker: str
    marital_status: str
    working_status: str
    stroke: int
    patient_id: int


# Load AI prediction models
cardio_model = joblib.load("prediction_models/model_cardio_h.joblib")
stroke_model = joblib.load("prediction_models/model_stroke_h.joblib")
diabetes_model = joblib.load("prediction_models/model_diabetes_h.joblib")


gender_map = {'Male': 1, 'Female': 0}
smoker_map = {'No': 0, 'Yes': 1, 'Former smoker': 2}
marital_map = {'Divorced': 0, 'Single': 0, 'Married': 1, 'Widow': 2}
working_map = {
    'Homemaker': 0, 'Unemployed': 0, 'Retired': 0,
    'Private': 1, 'Self-employed': 1, 'Student': 2,
    'Working': 3, 'Public': 4
}


router = APIRouter()


def build_model_input_df(model, values):
    feature_names = getattr(model, "feature_names_in_", None)
    if feature_names is not None and len(feature_names) == len(values):
        return pd.DataFrame([values], columns=list(feature_names))
    return pd.DataFrame([values])


@router.post("/healthPrediction/")
async def predict(data: HealthDataInput, request: Request, db_conn: Session = Depends(get_db),
                  csv_patient_id: Optional[int] = None):

    # Sanitize and normalize health data
    sanitized_data = sanitize_health_data(data)
    
    # Check if sanitized data is valid
    if not validate_sanitized_data(sanitized_data):
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)

    # Calculate BMI using sanitized height and weight
    if (sanitized_data["height"] == 0):
        BMI = 0
    else:
        # Calculate BMI ( BMI = Weight(kg)/Height(m)^2 )
        BMI = (sanitized_data["weight"]/((sanitized_data["height"]/100)**2))

    # Retrieve user current user information
    user_email = get_current_user(request, db_conn)
    patient = get_patient_by_email(user_email["email"], db_conn)

    # Update Weight & Height based on sanitized input.
    patient.Weight = sanitized_data["weight"]
    patient.Height = sanitized_data["height"]

    # Get the CSV patients's ID, otherwise uses the authenticated user's ID.
    patient_id = csv_patient_id if csv_patient_id is not None else patient.PatientID
    healthData = HealthData(patient_id, sanitized_data["age"], sanitized_data["weight"], sanitized_data["height"], gender_map[sanitized_data["gender"]],
                            sanitized_data["blood_glucose"], sanitized_data["ap_hi"], sanitized_data["ap_lo"], sanitized_data["high_cholesterol"],
                            sanitized_data["hyper_tension"], sanitized_data["heart_disease"], sanitized_data["diabetes"], sanitized_data["alcohol"],
                            smoker_map[sanitized_data["smoker"]],  marital_map[sanitized_data["marital_status"]], working_map[sanitized_data["working_status"]], sanitized_data["stroke"])

    # Store health data into the database
    db_conn.add(healthData)
    db_conn.commit()
    # Refresh to retrieve primary key for prediction data
    db_conn.refresh(healthData)

    # Cardio Dataframe
    cardio_values = [
        sanitized_data["age"],
        gender_map[sanitized_data["gender"]],
        BMI,
        sanitized_data["height"],
        sanitized_data["ap_hi"],
        sanitized_data["ap_lo"],
        sanitized_data["high_cholesterol"],
        sanitized_data["blood_glucose"],
        smoker_map[sanitized_data["smoker"]],
        sanitized_data["alcohol"]
    ]
    cardio_df = build_model_input_df(cardio_model, cardio_values)
    # Cardio prediction
    cardioPrediction = cardio_model.predict_proba(cardio_df)
    cardioPrediction = round(float(cardioPrediction[0][1]) * 100, 2)
    # Stoke Dataframe
    stroke_values = [
        gender_map[sanitized_data["gender"]],
        sanitized_data["age"],
        sanitized_data["heart_disease"],
        marital_map[sanitized_data["marital_status"]],
        working_map[sanitized_data["working_status"]],
        sanitized_data["blood_glucose"],
        sanitized_data["weight"],
        sanitized_data["height"],
        BMI,
        smoker_map[sanitized_data["smoker"]]
    ]
    stroke_df = build_model_input_df(stroke_model, stroke_values)

    # Stroke Prediction
    strokePrediction = stroke_model.predict_proba(stroke_df)
    strokePrediction = round(float(strokePrediction[0][1]) * 100, 2)
    # diabetes Dataframe
    diabetes_values = [
        gender_map[sanitized_data["gender"]],
        sanitized_data["age"],
        sanitized_data["heart_disease"],
        smoker_map[sanitized_data["smoker"]],
        sanitized_data["weight"],
        sanitized_data["height"],
        BMI,
        sanitized_data["blood_glucose"]
    ]
    diabetes_df = build_model_input_df(diabetes_model, diabetes_values)

    # diabetes prediction
    diabetesPrediction = diabetes_model.predict_proba(diabetes_df)
    diabetesPrediction = round(float(diabetesPrediction[0][1]) * 100, 2)

    # Create prediction object for storage
    prediction = Prediction(
        healthData.HealthDataID, strokePrediction, diabetesPrediction, cardioPrediction)

    # Store prediction
    db_conn.add(prediction)
    db_conn.commit()

    # Generate AI-based health recommendations (best-effort; non-fatal if fails)
    recommendations = None
    try:
        _hd_id = getattr(healthData, 'HealthDataID', None)
        if _hd_id is not None:
            recommendations = get_health_recommendations(
                db_conn=db_conn, health_data_id=int(_hd_id))
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

    write_audit_log(db_conn,
                    eventType=LogEventType.PREDICTION_REQUEST,
                    success=True,
                    userEmail=user_email["email"],
                    device=request.headers.get("user-agent"),
                    ipAddress=request.client.host,
                    description=f"Generated health prediction for {user_email['email']}.")

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
async def upload_csv(request: Request, uploaded_file: UploadFile = File(...),
                     db_conn: Session = Depends(get_db)):

    # Check if the uploaded file is correct format.
    if not uploaded_file.filename.lower().endswith('.csv'):
        raise HTTPException(status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                            detail="Only .csv file type is supported.")

    # Get the merchant uploading the CSV.
    current_user = get_current_user(request, db_conn)
    current_user_email = current_user.get('email')
    merchant = db_conn.query(UserAccount).filter_by(
        Email=current_user_email).first()

    if not merchant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    # Decode file stream and iterate rows as dictionaries.
    csv_reader = csv.DictReader(codecs.iterdecode(uploaded_file.file, 'utf-8'))

    processed_rows = 0
    skipped_rows = 0

    for row in csv_reader:

        # Check if row entry has an email.
        user_email = row.get('Email')
        if not user_email:
            skipped_rows += 1
            continue

        user_email = user_email.strip()
        patient = get_patient_by_email(user_email, db_conn)

        if not patient:
            skipped_rows += 1
            # TODO: Create the Patient if they don't exist.
            continue

        try:
            health_data = MerchantHealthDataInput(
                age=int(row["Age"]) if row.get("Age") else 0,
                weight=float(row["WeightKilograms"]) if row.get(
                    "WeightKilograms") else 0,
                height=float(row["HeightCentimetres"]) if row.get(
                    "HeightCentimetres") else 0,
                gender=str(row["Gender"]) if row.get("Gender") else "",
                blood_glucose=float(row["BloodGlucose"]) if row.get(
                    "BloodGlucose") else 0,
                ap_hi=float(row["APHigh"]) if row.get("APHigh") else 0,
                ap_lo=float(row["APLow"]) if row.get("APLow") else 0,
                high_cholesterol=int(row["HighCholesterol"]) if row.get(
                    "HighCholesterol") else 0,
                hyper_tension=int(row["HyperTension"]) if row.get(
                    "HyperTension") else 0,
                heart_disease=int(row["HeartDisease"]) if row.get(
                    "HeartDisease") else 0,
                diabetes=int(row["Diabetes"]) if row.get("Diabetes") else 0,
                alcohol=int(row["Alcohol"]) if row.get("Alcohol") else 0,
                smoker=str(row["SmokingStatus"]) if row.get(
                    "SmokingStatus") else "",
                marital_status=str(row["MaritalStatus"]) if row.get(
                    "MaritalStatus") else "",
                working_status=str(row["WorkingStatus"]) if row.get(
                    "WorkingStatus") else "",
                stroke=int(row["Stroke"]) if row.get("Stroke") else 0,
                patient_id=patient.PatientID
            )
            # Sanitize data before passing to merchant_predict
            sanitized = sanitize_health_data(health_data)
            if sanitized is None or not validate_sanitized_data(sanitized):
                skipped_rows += 1
                continue
            # Pass each HealthDataInput object to the predict endpoint.
            await merchant_predict(health_data, request, db_conn)
            processed_rows += 1
        except (ValueError, KeyError, TypeError) as e:
            skipped_rows += 1
            continue

    uploaded_file.file.close()

    if merchant:
        write_audit_log(
            db_conn=db_conn,
            eventType=LogEventType.DATA_IMPORT,
            success=True,
            userID=merchant.UserID,
            userEmail=merchant.Email,
            ipAddress=request.client.host,
            device=request.headers.get("user-agent"),
            description=f"CSV upload processed for {uploaded_file.filename}: processed={processed_rows}, skipped={skipped_rows}."
        )

    return {
        "message": "Upload successful.",
        "processed": processed_rows,
        "skipped": skipped_rows,
    }


@router.post("/merchantHealthPrediction/")
async def merchant_predict(data: MerchantHealthDataInput, request: Request, db_conn: Session = Depends(get_db)):

    # Check if the requesting user is a merchant.
    current_user = get_current_user(request, db_conn)
    current_user_email = current_user.get('email')
    merchant = db_conn.query(UserAccount).filter_by(
        Email=current_user_email).first()
    if not merchant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    current_user_role = current_user.get('role')
    if not current_user_role or current_user_role.lower() != 'merchant':
        write_audit_log(db_conn,
                        eventType=LogEventType.PREDICTION_REQUEST,
                        success=False,
                        userEmail=current_user_email,
                        device=request.headers.get("user-agent"),
                        ipAddress=request.client.host,
                        description=f"Unauthorized merchant prediction attempt for patient_id={data.patient_id}.")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Impermissible action.")

    # Sanitize and normalize health data
    sanitized_data = sanitize_health_data(data)
    
    # Check if sanitized data is valid
    if not validate_sanitized_data(sanitized_data):
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)

    # Retrieve patient information
    patient = db_conn.query(Patient).filter(
        sanitized_data["patient_id"] == Patient.PatientID).first()

    # Update Weight & Height based on sanitized input.
    patient.Weight = sanitized_data["weight"]
    patient.Height = sanitized_data["height"]

    # Check if the merchant has permission to view the patients record
    if (merchant_view_patient(merchant.UserID, patient.PatientID, db_conn) == False):
        write_audit_log(db_conn,
                        eventType=LogEventType.PREDICTION_REQUEST,
                        success=False,
                        userID=merchant.UserID,
                        userEmail=merchant.Email,
                        device=request.headers.get("user-agent"),
                        ipAddress=request.client.host,
                        description=f"Merchant attempted prediction for inaccessible patient_id={patient.PatientID}.")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Impermissible action.")

    # Calculate BMI
    if (sanitized_data["height"] == 0):
        BMI = 0
    else:
        # Calculate BMI ( BMI = Weight(kg)/Height(m)^2 )
        BMI = (sanitized_data["weight"]/((sanitized_data["height"]/100)**2))

    # Get the CSV user's ID, otherwise uses the authenticated user's ID.
    healthData = HealthData(patient.PatientID, sanitized_data["age"], sanitized_data["weight"], sanitized_data["height"], gender_map[sanitized_data["gender"]],
                            sanitized_data["blood_glucose"], sanitized_data["ap_hi"], sanitized_data["ap_lo"], sanitized_data["high_cholesterol"],
                            sanitized_data["hyper_tension"], sanitized_data["heart_disease"], sanitized_data["diabetes"], sanitized_data["alcohol"],
                            smoker_map[sanitized_data["smoker"]],  marital_map[sanitized_data["marital_status"]], working_map[sanitized_data["working_status"]], sanitized_data["stroke"])
    # Store health data into the database
    db_conn.add(healthData)
    db_conn.commit()
    # Refresh to retrieve primary key for prediction data
    db_conn.refresh(healthData)

    # Cardio Dataframe
    cardio_values = [
        sanitized_data["age"],
        gender_map[sanitized_data["gender"]],
        BMI,
        sanitized_data["height"],
        sanitized_data["ap_hi"],
        sanitized_data["ap_lo"],
        sanitized_data["high_cholesterol"],
        sanitized_data["blood_glucose"],
        smoker_map[sanitized_data["smoker"]],
        sanitized_data["alcohol"]
    ]
    cardio_df = build_model_input_df(cardio_model, cardio_values)
    # Cardio prediction
    cardioPrediction = cardio_model.predict_proba(cardio_df)
    cardioPrediction = round(float(cardioPrediction[0][1]) * 100, 2)
    # Stoke Dataframe
    stroke_values = [
        gender_map[sanitized_data["gender"]],
        sanitized_data["age"],
        sanitized_data["heart_disease"],
        marital_map[sanitized_data["marital_status"]],
        working_map[sanitized_data["working_status"]],
        sanitized_data["blood_glucose"],
        sanitized_data["weight"],
        sanitized_data["height"],
        BMI,
        smoker_map[sanitized_data["smoker"]]
    ]
    stroke_df = build_model_input_df(stroke_model, stroke_values)

    # Stroke Prediction
    strokePrediction = stroke_model.predict_proba(stroke_df)
    strokePrediction = round(float(strokePrediction[0][1]) * 100, 2)
    # diabetes Dataframe
    diabetes_values = [
        gender_map[sanitized_data["gender"]],
        sanitized_data["age"],
        sanitized_data["heart_disease"],
        smoker_map[sanitized_data["smoker"]],
        sanitized_data["weight"],
        sanitized_data["height"],
        BMI,
        sanitized_data["blood_glucose"]
    ]
    diabetes_df = build_model_input_df(diabetes_model, diabetes_values)

    # diabetes prediction
    diabetesPrediction = diabetes_model.predict_proba(diabetes_df)
    diabetesPrediction = round(float(diabetesPrediction[0][1]) * 100, 2)

    # Create prediction object for storage
    prediction = Prediction(
        healthData.HealthDataID, strokePrediction, diabetesPrediction, cardioPrediction)

    # Store prediction
    db_conn.add(prediction)
    db_conn.commit()

    # Generate AI-based health recommendations (best-effort; non-fatal if fails)
    recommendations = None
    try:
        _hd_id = getattr(healthData, 'HealthDataID', None)
        if _hd_id is not None:
            recommendations = get_health_recommendations(
                db_conn=db_conn, health_data_id=int(_hd_id))
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
    write_audit_log(db_conn,
                    eventType=LogEventType.PREDICTION_REQUEST,
                    success=True,
                    userID=merchant.UserID,
                    userEmail=merchant.Email,
                    device=request.headers.get("user-agent"),
                    ipAddress=request.client.host,
                    description=f"Merchant generated health prediction for patient ID {patient.PatientID}.")
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


def is_age_valid(age: int):
    return age >= 0 and age <= 100


def is_weight_valid(weight: float):
    return weight >= 0.0 and weight <= 200.0


def is_height_valid(height: float):
    return height >= 0.0 and height <= 300


def is_gender_valid(gender: int):
    return gender in gender_map


def is_blood_glucose_valid(blood_glucose: float):
    return blood_glucose >= 0.0 and blood_glucose <= 20.0


def is_ap_hi_valid(ap_hi: float):
    return ap_hi >= 0.0 and ap_hi <= 200.0


def is_ap_lo_valid(ap_lo: float):
    return ap_lo >= 0.0 and ap_lo <= 200.0


def is_high_cholesterol_valid(high_cholesterol: int):
    return high_cholesterol == 0 or high_cholesterol == 1


def is_hyper_tension_valid(hyper_tension: int):
    return hyper_tension == 0 or hyper_tension == 1


def is_heart_disease_valid(heart_disease: int):
    return heart_disease == 0 or heart_disease == 1


def is_diabetes_valid(diabetes: int):
    return diabetes == 0 or diabetes == 1


def is_alcohol_valid(alcohol: int):
    return alcohol == 0 or alcohol == 1


def is_smoker_valid(smoker: str):
    return smoker in smoker_map


def is_marital_status_valid(marital_status: str):
    return marital_status in marital_map


def is_working_status_valid(working_status: str):
    return working_status in working_map


def is_stroke_valid(stroke: int):
    return stroke == 0 or stroke == 1


def sanitize_health_data(data: HealthDataInput):
    """
    Sanitise and normalize health data following phone sanitisation pattern.
    Handles whitespace trimming, case normalization for categorical values,
    and decimal precision for numeric values.
    Returns normalized dict or None if any field fails critical validation.
    """
    def normalize_categorical(value, mapping, field_name):
        """Helper: case-insensitive lookup with fallback to None."""
        if not isinstance(value, str):
            return None
        
        stripped = value.strip()
        # Try exact match first
        if stripped in mapping:
            return stripped
        
        # Try case-insensitive match
        for key in mapping.keys():
            if key.lower() == stripped.lower():
                return key
        
        # No match found
        return None
    
    # Normalize categorical fields
    gender = normalize_categorical(data.gender, gender_map, "gender")
    smoker = normalize_categorical(data.smoker, smoker_map, "smoker")
    marital_status = normalize_categorical(data.marital_status, marital_map, "marital_status")
    working_status = normalize_categorical(data.working_status, working_map, "working_status")
    
    # Sanitize numeric fields (clamp to 2 decimal places)
    try:
        weight = round(float(data.weight), 2)
        height = round(float(data.height), 2)
        blood_glucose = round(float(data.blood_glucose), 2)
        ap_hi = round(float(data.ap_hi), 2)
        ap_lo = round(float(data.ap_lo), 2)
    except (ValueError, TypeError):
        # If conversion fails, return None to indicate invalid data
        return None
    
    return {
        "age": data.age,
        "weight": weight,
        "height": height,
        "gender": gender,
        "blood_glucose": blood_glucose,
        "ap_hi": ap_hi,
        "ap_lo": ap_lo,
        "high_cholesterol": data.high_cholesterol,
        "hyper_tension": data.hyper_tension,
        "heart_disease": data.heart_disease,
        "diabetes": data.diabetes,
        "alcohol": data.alcohol,
        "smoker": smoker,
        "marital_status": marital_status,
        "working_status": working_status,
        "stroke": data.stroke,
        "patient_id": getattr(data, 'patient_id', None)
    }


def validate_sanitized_data(sanitized_data: dict):
    """
    Validates all sanitized/normalized data fields.
    Returns True only if all fields are valid after sanitization.
    """
    if sanitized_data is None:
        return False
    
    if (
            not is_age_valid(sanitized_data.get("age")) or
            not is_weight_valid(sanitized_data.get("weight")) or
            not is_height_valid(sanitized_data.get("height")) or
            sanitized_data.get("gender") is None or sanitized_data.get("gender") not in gender_map or
            not is_blood_glucose_valid(sanitized_data.get("blood_glucose")) or
            not is_ap_hi_valid(sanitized_data.get("ap_hi")) or
            not is_ap_lo_valid(sanitized_data.get("ap_lo")) or
            not is_high_cholesterol_valid(sanitized_data.get("high_cholesterol")) or
            not is_hyper_tension_valid(sanitized_data.get("hyper_tension")) or
            not is_heart_disease_valid(sanitized_data.get("heart_disease")) or
            not is_diabetes_valid(sanitized_data.get("diabetes")) or
            not is_alcohol_valid(sanitized_data.get("alcohol")) or
            sanitized_data.get("smoker") is None or sanitized_data.get("smoker") not in smoker_map or
            sanitized_data.get("marital_status") is None or sanitized_data.get("marital_status") not in marital_map or
            sanitized_data.get("working_status") is None or sanitized_data.get("working_status") not in working_map or
            not is_stroke_valid(sanitized_data.get("stroke"))):
        return False
    
    return True


def validate_all_input(data: HealthDataInput):
    """
    Validates all user inputs
    """
    if (
            not is_age_valid(data.age) or
            not is_weight_valid(data.weight) or
            not is_height_valid(data.height) or
            not is_gender_valid(data.gender) or
            not is_blood_glucose_valid(data.blood_glucose) or
            not is_ap_hi_valid(data.ap_hi) or
            not is_ap_lo_valid(data.ap_lo) or
            not is_high_cholesterol_valid(data.high_cholesterol) or
            not is_hyper_tension_valid(data.hyper_tension) or
            not is_heart_disease_valid(data.heart_disease) or
            not is_diabetes_valid(data.diabetes) or
            not is_alcohol_valid(data.alcohol) or
            not is_smoker_valid(data.smoker) or
            not is_marital_status_valid(data.marital_status) or
            not is_working_status_valid(data.working_status) or
            not is_stroke_valid(data.stroke)):

        return False

    return True


def merchant_view_patient(user_id: int, patient_id: int, db_conn: Session):
    """
    Returns True if the merchant is linked to the patient, False if they can not.
    """
    access = db_conn.query(UserPatientAccess).filter_by(
        UserID=user_id,
        PatientID=patient_id
    ).first()
    return access is not None
