from fastapi import APIRouter, Depends, UploadFile, File, Request, HTTPException
from sqlalchemy.orm import Session
from ..utils.database import get_db
from ..models.dbmodels import UserAccount
from .authentication import get_user_me
from pydantic import BaseModel
from typing import Optional
import csv
import codecs


class HealthDataInput(BaseModel):
    userId: int
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
    merchantID:Optional[int] = None


router = APIRouter()


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

    data = []

    for row in csvReader:
        # Store email if supplied, otherwise parse the next user's data
        userEmail = row.get('Email')
        if not userEmail:
            continue
        
        # Retrieve the user from their email
        user = db_conn.query(UserAccount).filter_by(Email=userEmail).first()
        if not user:
            continue

        # Parse row data into JSON format
        healthData = HealthDataInput(
            userId=user.UserID,
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
        data.append(healthData.model_dump()) # dict() is depreciated

    file.file.close()

    return data
