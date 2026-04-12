from datetime import datetime, date, timedelta
from decimal import Decimal
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status, Request
from pydantic import BaseModel
from fastapi_camelcase import CamelModel
from sqlalchemy.orm import Session
from html_sanitizer import Sanitizer

from ..utils.database import get_db
from ..utils.audit_log import write_audit_log
from ..models.dbmodels import (
    UserAccount,
    UserAccountRole,
    UserAccountValidationToken,
    HealthData,
    Prediction,
    Recommendation,
    LogEventType,
    Patient,
    UserPatientAccess,
    Clinic
)
from ..routers.authentication import get_current_user, get_user, get_patient_by_email, format_phone_number, is_formatted_phone_valid

NAME_MAX_LENGTH = 255
MIN_AGE = 18
gender_map = {'Male': 1, 'Female': 0}


class HealthMetric(CamelModel):
    # ISO datetime string of the prediction creation time
    date: str
    month: str
    stroke_probability: float
    cardio_probability: float
    diabetes_probability: float


class Report(CamelModel):
    patient_name: Optional[str] = None
    age: int
    weight: float
    height: float
    gender: int
    blood_glucose: float
    ap_hi: float
    ap_lo: float
    high_cholesterol: int
    hypertension: int
    heart_disease: int
    diabetes: int
    alcohol: int
    smoker: int
    marital_status: int
    working_status: int
    stroke_chance: float
    CVD_chance: float
    diabetes_chance: float
    # Optional recommendations
    exercise_recommendation: Optional[str] = None
    diet_recommendation: Optional[str] = None
    lifestyle_recommendation: Optional[str] = None
    diet_to_avoid_recommendation: Optional[str] = None


class HealthDataDates(CamelModel):
    health_data_id: int
    date: datetime


class ClinicDetails(CamelModel):
    clinic_id: int
    clinic_name: str


class Dashboard(BaseModel):
    days: int
    risks: dict
    diff: dict
    recommendations: dict


class MerchantDashboard(CamelModel):
    total_patients: int
    total_reports: int
    reports_last_30_days: int
    inactive_patients: int
    risk_distribution: dict
    report_activity: List[dict]


class UserProfileUpdate(BaseModel):
    phone_number: Optional[str] = None


class PatientProfileUpdate(CamelModel):
    given_names: Optional[str] = None
    family_name: Optional[str] = None
    gender: Optional[int] = None
    weight: Optional[float] = None
    height: Optional[float] = None
    date_of_birth: Optional[date] = None


class PatientCreationDetails(CamelModel):
    given_names: str
    family_name: str
    date_of_birth: date
    gender: str
    weight: float
    height: float


class PatientDetails(CamelModel):
    patient_info: dict
    days: int
    risks: dict
    diff: dict
    recommendations: dict


def _to_float(val) -> float:
    if isinstance(val, Decimal):
        return float(val)
    try:
        return float(val)
    except Exception:
        return 0.0


router = APIRouter()


def _validated_name(value: Optional[str], field_name: str) -> Optional[str]:
    if value is None:
        return None
    sanitizer = Sanitizer()
    cleaned = sanitizer.sanitize(value).strip()
    if len(cleaned) > 255:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"{field_name} is too long.",
        )
    return cleaned


def _to_nullable_float(value: Optional[float], field_name: str, min_v: float, max_v: float) -> Optional[float]:
    if value is None:
        return None
    if value < min_v or value > max_v:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"{field_name} must be between {min_v} and {max_v}.",
        )
    return float(value)


@router.patch("/users/me")
async def update_current_user_profile(
    payload: UserProfileUpdate,
    request: Request,
    db_conn: Session = Depends(get_db),
):
    """Updates a user's account information"""
    current_user = get_current_user(request, db_conn)
    user = get_user(current_user["email"], db_conn)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    updates = payload.dict(exclude_unset=True)
    if not updates:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="No fields to update")

    updated_fields = {}
    if "phone_number" in updates:
        formatted_phone = format_phone_number(
            updates.get("phone_number") or "")
        if not is_formatted_phone_valid(formatted_phone):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Invalid phone number",
            )
        user.PhoneNumber = formatted_phone
        updated_fields["phone_number"] = formatted_phone

    db_conn.commit()
    write_audit_log(
        db_conn,
        eventType=LogEventType.USER_PROFILE_UPDATED,
        success=True,
        userEmail=user.Email,
        device=request.headers.get("user-agent"),
        ipAddress=request.client.host if request.client else None,
        description="User updated account profile fields.",
    )

    return {"message": "Account details updated successfully", "updated": updated_fields}


@router.patch("/patients/me")
async def update_current_patient_profile(
    payload: PatientProfileUpdate,
    request: Request,
    db_conn: Session = Depends(get_db),
):
    """Update a user's patient information"""
    current_user = get_current_user(request, db_conn)
    user = get_user(current_user["email"], db_conn)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    updates = payload.dict(exclude_unset=True)
    if not updates:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="No fields to update")

    patient = get_patient_by_email(user.Email, db_conn)
    if patient is None:
        patient = Patient(
            user_id=user.UserID,
            given_names=user.Email.split("@")[0],
            family_name="",
            gender=None,
            weight=0,
            height=0,
            date_of_birth=None,
        )
        db_conn.add(patient)
        db_conn.flush()

    updated_fields = {}
    if "given_names" in updates:
        patient.GivenNames = _validated_name(
            updates.get("given_names"), "given_names")
        updated_fields["given_names"] = patient.GivenNames
    if "family_name" in updates:
        patient.FamilyName = _validated_name(
            updates.get("family_name"), "family_name")
        updated_fields["family_name"] = patient.FamilyName
    if "gender" in updates:
        gender = updates.get("gender")
        if gender is not None and gender not in (0, 1):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="gender must be 0 (Female) or 1 (Male)",
            )
        patient.Gender = gender
        updated_fields["gender"] = patient.Gender
    if "weight" in updates:
        patient.Weight = _to_nullable_float(
            updates.get("weight"), "weight", 20.0, 300.0)
        updated_fields["weight"] = float(
            patient.Weight) if patient.Weight is not None else None
    if "height" in updates:
        patient.Height = _to_nullable_float(
            updates.get("height"), "height", 90.0, 250.0)
        updated_fields["height"] = float(
            patient.Height) if patient.Height is not None else None
    if "date_of_birth" in updates:
        date_of_birth = updates.get("date_of_birth")
        if date_of_birth and date_of_birth > date.today():
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="date_of_birth cannot be in the future",
            )
        patient.DateOfBirth = date_of_birth
        updated_fields["date_of_birth"] = patient.DateOfBirth.isoformat(
        ) if patient.DateOfBirth else None

    db_conn.commit()
    write_audit_log(
        db_conn,
        eventType=LogEventType.PATIENT_PROFILE_UPDATED,
        success=True,
        userEmail=user.Email,
        device=request.headers.get("user-agent"),
        ipAddress=request.client.host if request.client else None,
        description="User updated patient profile fields.",
    )

    return {"message": "Profile updated successfully", "updated": updated_fields}


def _delete_user_data(user_id: int, db_conn: Session):
    """
    Deletes a user and all their associated data, returning a report of the deletion.
    """
    deletion_report = {}

    try:
        # Find the user to ensure they exist before proceeding
        user_to_delete = db_conn.query(UserAccount).filter(
            UserAccount.UserID == user_id).first()
        if not user_to_delete:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

        # Get patient record if it exists
        patient_record = get_patient_by_email(user_to_delete.Email, db_conn)

        # Delete Merchant Patient access
        if patient_record:
            db_conn.query(UserPatientAccess).filter(UserPatientAccess.PatientID ==
                                                    patient_record.PatientID).delete(synchronize_session=False)
        else:
            db_conn.query(UserPatientAccess).filter(
                UserPatientAccess.UserID == user_to_delete.UserID).delete(synchronize_session=False)

        # Collect all HealthDataIDs for this user
        health_ids: List[int] = [
            hid for (hid,) in db_conn.query(HealthData.HealthDataID).filter(HealthData.PatientID == patient_record.PatientID).all()
        ]

        if health_ids:
            # Delete tables that depend on HealthData first
            recs_deleted = db_conn.query(Recommendation).filter(
                Recommendation.HealthDataID.in_(health_ids)).delete(synchronize_session=False)
            deletion_report['recommendations_deleted'] = recs_deleted

            preds_deleted = db_conn.query(Prediction).filter(
                Prediction.HealthDataID.in_(health_ids)).delete(synchronize_session=False)
            deletion_report['predictions_deleted'] = preds_deleted

            # Then delete HealthData records
            health_data_deleted = db_conn.query(HealthData).filter(
                HealthData.PatientID == patient_record.PatientID).delete(synchronize_session=False)
            deletion_report['health_data_deleted'] = health_data_deleted

        # Delete tables directly associated with the user
        tokens_deleted = db_conn.query(UserAccountValidationToken).filter(
            UserAccountValidationToken.UserID == user_id).delete(synchronize_session=False)
        deletion_report['validation_tokens_deleted'] = tokens_deleted

        roles_deleted = db_conn.query(UserAccountRole).filter(
            UserAccountRole.UserID == user_id).delete(synchronize_session=False)
        deletion_report['user_roles_deleted'] = roles_deleted

        # Delete the user record itself
        db_conn.delete(user_to_delete)
        deletion_report['users_deleted'] = 1  # Since we are deleting one user

        db_conn.commit()
        return deletion_report
    except Exception as e:
        db_conn.rollback()
        # Log the exception e for debugging if needed
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=f"Failed to delete user data: {str(e)}")


@router.delete("/users/")
async def delete_user(request: Request, db_conn: Session = Depends(get_db)):
    """Delete a users account and their related data"""
    # Current request user
    current = get_current_user(request, db_conn)
    request_user_email = current.get(
        'email') if isinstance(current, dict) else None
    if not isinstance(request_user_email, str) or request_user_email.strip() == "":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    user_to_delete = get_user(request_user_email, db_conn)
    if user_to_delete is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user_id = user_to_delete.UserID

    # Perform the deletion
    _delete_user_data(user_id, db_conn)
    write_audit_log(db_conn,
                    eventType=LogEventType.ACCOUNT_DELETED,
                    success=True,
                    userEmail=user_to_delete.Email,
                    device=request.headers.get("user-agent"),
                    ipAddress=request.client.host,
                    description=f"Account deleted from database.")

    return {"message": "User and all related data deleted successfully"}

# Health analytics


@router.get("/health-analytics", response_model=List[HealthMetric])
async def get_health_analytics(
    request: Request,
    db_conn: Session = Depends(get_db),
):
    """
    Returns time-series health risk probabilities for the current user
    using historical predictions stored in the database.
    """
    user_email = get_current_user(request, db_conn)
    patient = get_patient_by_email(user_email["email"], db_conn)
    if not patient:
        return []
    patient_id = patient.PatientID

    # Join predictions with health data to scope by user, order by prediction time
    rows = (
        db_conn.query(
            getattr(Prediction, 'CreatedAt'),
            getattr(Prediction, 'StrokeChance'),
            getattr(Prediction, 'CVDChance'),
            getattr(Prediction, 'DiabetesChance'),
        )
        .join(
            HealthData,
            getattr(Prediction, 'HealthDataID') == getattr(
                HealthData, 'HealthDataID'),
        )
        .filter(getattr(HealthData, 'PatientID') == patient_id)
        .order_by(getattr(Prediction, 'CreatedAt').asc())
        .all()
    )

    def month_label(dt: datetime) -> str:
        # e.g., 'Jan 2025' to help distinguish years if data spans multiple years
        try:
            return dt.strftime("%b %Y")
        except Exception:
            return str(dt)

    data: List[HealthMetric] = []
    for created_at, stroke, cvd, diab in rows:
        data.append(
            HealthMetric(
                date=(created_at.isoformat() if isinstance(
                    created_at, datetime) else str(created_at)),
                month=month_label(created_at),
                stroke_probability=_to_float(stroke),
                cardio_probability=_to_float(cvd),
                diabetes_probability=_to_float(diab),
            )
        )

    return data

# Report Data


@router.get("/report-data/{healthDataId}")
async def get_report_data(healthDataId: int, db_conn: Session = Depends(get_db)):
    """Return data for a report"""
    validID = db_conn.query(HealthData).filter_by(
        HealthDataID=healthDataId).first()
    if not validID:
        raise HTTPException(status_code=404, detail="Report data not found")

    # Retrieve user health data
    healthData = db_conn.query(HealthData).filter(
        getattr(HealthData, 'HealthDataID') == healthDataId).first()
    predictionData = db_conn.query(Prediction).filter(
        getattr(Prediction, 'HealthDataID') == healthDataId).first()
    recommendationData = db_conn.query(Recommendation).filter(getattr(
        Recommendation, 'HealthDataID') == healthDataId).order_by(getattr(Recommendation, 'CreatedAt').desc()).first()

    patientData = db_conn.query(Patient).filter(
        Patient.PatientID == healthData.PatientID).first()
    if patientData:
        patient_name = f"{(patientData.GivenNames or '').strip()} {(patientData.FamilyName or '').strip()}".strip(
        ) or None
    else:
        patient_name = None

    # Create health report data to return
    reportData = Report(
        patientName=patient_name,
        age=int(getattr(healthData, 'Age', 0) or 0),
        weight=float(getattr(healthData, 'WeightKilograms', 0) or 0),
        height=float(getattr(healthData, 'HeightCentimetres', 0) or 0),
        gender=int(
            1 if bool(getattr(healthData, 'Gender', False) or False) else 0),
        blood_glucose=float(getattr(healthData, 'BloodGlucose', 0) or 0),
        ap_hi=float(getattr(healthData, 'APHigh', 0) or 0),
        ap_lo=float(getattr(healthData, 'APLow', 0) or 0),
        high_cholesterol=int(
            1 if bool(getattr(healthData, 'HighCholesterol', False) or False) else 0),
        hypertension=int(
            1 if bool(getattr(healthData, 'HyperTension', False) or False) else 0),
        heart_disease=int(
            1 if bool(getattr(healthData, 'HeartDisease', False) or False) else 0),
        diabetes=int(
            1 if bool(getattr(healthData, 'Diabetes', False) or False) else 0),
        alcohol=int(
            1 if bool(getattr(healthData, 'Alcohol', False) or False) else 0),
        smoker=int(getattr(healthData, 'SmokingStatus', 0) or 0),
        marital_status=int(getattr(healthData, 'MaritalStatus', 0) or 0),
        working_status=int(getattr(healthData, 'WorkingStatus', 0) or 0),
        stroke_chance=float(getattr(predictionData, 'StrokeChance', 0) or 0),
        CVD_chance=float(getattr(predictionData, 'CVDChance', 0) or 0),
        diabetes_chance=float(
            getattr(predictionData, 'DiabetesChance', 0) or 0),
        exercise_recommendation=getattr(
            recommendationData, 'ExerciseRecommendation', None) if recommendationData else None,
        diet_recommendation=getattr(
            recommendationData, 'DietRecommendation', None) if recommendationData else None,
        lifestyle_recommendation=getattr(
            recommendationData, 'LifestyleRecommendation', None) if recommendationData else None,
        diet_to_avoid_recommendation=getattr(
            recommendationData, 'DietToAvoidRecommendation', None) if recommendationData else None,
    )

    # Return reportData object
    return reportData


@router.delete("/report-data/{healthDataId}")
async def delete_report_data(healthDataId: int, db_conn: Session = Depends(get_db)):
    """Deletes data from a generated report"""
   # Raise exception if health data is not in the DB
    health_data = db_conn.query(HealthData).filter_by(
        HealthDataID=healthDataId).first()
    if not health_data:
        raise HTTPException(status_code=404, detail="Health report not found")

    try:
        # Delete recommendation and prediction data first to avoid a foreign key error
        db_conn.query(Recommendation).filter(getattr(
            Recommendation, 'HealthDataID') == healthDataId).delete(synchronize_session=False)
        db_conn.query(Prediction).filter(getattr(
            Prediction, 'HealthDataID') == healthDataId).delete(synchronize_session=False)
        # Delete health data
        db_conn.query(HealthData).filter(getattr(
            HealthData, 'HealthDataID') == healthDataId).delete(synchronize_session=False)

        db_conn.commit()
    except Exception:
        db_conn.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Failed to delete health data.")

    return {"message": "Health report data successfully deleted"}


@router.get("/merchants/reports")
async def get_merchant_reports(request: Request, db_conn: Session = Depends(get_db)):
    """Retrieves all reports a merchant can view"""
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
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Impermissible action.")

    # Get patients associated with the merchant.
    patients = get_merchant_patients(merchant.UserID, db_conn)
    patient_ids = [p.PatientID for p in patients]
    # Get patient health data.
    patient_health_data = (db_conn.query(HealthData).filter(HealthData.PatientID.in_(patient_ids))
                           .order_by(HealthData.CreatedAt.desc()).all())
    result = []
    for row in patient_health_data:

        # Get the patient's name.
        patient = db_conn.query(Patient).filter_by(
            PatientID=row.PatientID).first()

        result.append({
            "name": f'{patient.GivenNames} {patient.FamilyName}',
            "healthDataId": row.HealthDataID,
            "date": row.CreatedAt
        })

    return result


@router.get("/merchants/patient-names")
async def get_patient_names(request: Request, db_conn: Session = Depends(get_db)):
    """Retrieves patients names that are associated with the a merchant"""
    # Check if the requesting user is a merchant.
    merchant = get_current_merchant(request, db_conn)

    # Get patient data associated with the merchant.
    patients = get_merchant_patients(merchant.UserID, db_conn)

    result = []
    existing_patient = set()
    for patient in patients:

        # Get the patient's name.
        if patient.PatientID not in existing_patient:
            result.append({
                "name": f'{patient.GivenNames} {patient.FamilyName}',
                "patientId": patient.PatientID
            })
            existing_patient.add(patient.PatientID)

    return result


@router.get("/get-health-data-dates/")
async def get_health_data(request: Request, db_conn: Session = Depends(get_db)):
    """Return the dates for all health reports"""
    # Retrieve user current user information
    user_email = get_current_user(request, db_conn)
    patient = get_patient_by_email(user_email["email"], db_conn)

    # Retrieve user health data
    healthData = db_conn.query(HealthData).filter(
        HealthData.PatientID == patient.PatientID).order_by(HealthData.CreatedAt.desc()).all()

    # Filter by ID and date create to return
    healthDataDates = [HealthDataDates(
        health_data_id=data.HealthDataID, date=data.CreatedAt) for data in healthData]

    return healthDataDates


@router.get("/get-clinic-names/")
async def get_clinic_names(request: Request, db_conn: Session = Depends(get_db)):
    """Returns the name of all stored clinics"""

    # Retrieve the all clinics
    clinics = (
        db_conn.query(Clinic)
        .order_by(Clinic.ClinicID.asc())
        .all()
    )
    # Filter clinic by name and id
    clinic_details = [
        ClinicDetails(clinic_id=clinic.ClinicID, clinic_name=clinic.ClinicName)
        for clinic in clinics
    ]

    return clinic_details


@router.post("/create-patient/")
async def create_patient(patient: PatientCreationDetails, request: Request, db_conn: Session = Depends(get_db),):
    """Creates a new patient record and creates a relationship between the merchant and patient"""
    # Check if the requesting user is a merchant.
    merchant = get_current_merchant(request, db_conn)

    # Validate all user input
    if (not is_name_valid(patient.given_names) or
        not is_name_valid(patient.family_name) or
        not is_gender_valid(patient.gender) or
        not is_age_valid(patient.date_of_birth) or
        not is_weight_valid(patient.weight) or
            not is_height_valid(patient.height)):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)

    # Create new patient
    new_patient = Patient(user_id=None,
                          given_names=patient.given_names,
                          family_name=patient.family_name, gender=gender_map[patient.gender],
                          date_of_birth=patient.date_of_birth,
                          weight=patient.weight,
                          height=patient.height)
    db_conn.add(new_patient)
    db_conn.commit()

    db_conn.refresh(new_patient)
    # Provide merchant access to view patient information
    patient_id = new_patient.PatientID
    merchant_id = merchant.UserID

    merchant_access = UserPatientAccess(
        user_id=merchant_id, patient_id=patient_id)
    db_conn.add(merchant_access)
    db_conn.commit()

    return {
        "message": "Patient successfully created.",
        "patient_id": patient_id
    }


@router.delete("/remove-patient/{patient_id}")
async def remove_patient(patient_id: str, request: Request, db_conn: Session = Depends(get_db),):
    """Deletes relationship between patient and merchant"""
    # Check if the requesting user is a merchant.
    merchant = get_current_merchant(request, db_conn)
    merchant_id = merchant.UserID

    # Check if the merchant has access to the patients record
    merchant_access = db_conn.query(UserPatientAccess).filter(
        UserPatientAccess.UserID == merchant_id,
        UserPatientAccess.PatientID == patient_id
    ).first()

    if not merchant_access:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Impermissible action.")

    # Remove relationship between the merchant and patient
    db_conn.delete(merchant_access)
    db_conn.commit()

    return {'message': 'Patient successfully removed.'}


@router.get("/merchant/associated-patients")
async def associated_patients(request: Request, given_names: str = None, family_name: str = None, skip: int = 0, limit: int = 25, db_conn: Session = Depends(get_db)):
    """Deletes relationship between patient and merchant"""
    # Check if the requesting user is a merchant.
    current_merchant = get_current_merchant(request, db_conn)
    merchant_id = current_merchant.UserID

    # Retrieve patient information
    query = (db_conn.query(Patient.PatientID, Patient.GivenNames, Patient.FamilyName, Patient.Gender, Patient.DateOfBirth)
                    .join(UserPatientAccess, UserPatientAccess.PatientID == Patient.PatientID)
                    .filter(UserPatientAccess.UserID == merchant_id)
             )
    # Filter by search parameters
    if (given_names):
        query = query.filter(Patient.GivenNames.ilike(f"%{given_names}%"))
    if (family_name):
        query = query.filter(Patient.FamilyName.ilike(f"%{family_name}%"))
    # Paginate query
    total_patients = query.count()
    patient_info = query.order_by(
        Patient.CreatedAt.desc()).offset(skip).limit(limit).all()

    return {
        "patients": [
           {
               "patientId": patient.PatientID,
               "givenNames": patient.GivenNames,
               "familyName": patient.FamilyName,
               "gender": "Male" if patient.Gender == 1 else "Female" if patient.Gender == 0 else "",
               "dateOfBirth": patient.DateOfBirth.strftime("%d/%m/%Y"),
           }
            for patient in patient_info
        ],
        "totalPatients": total_patients

    }


def get_current_merchant(request: Request, db_conn):
    """Check if the current user is a merchant"""

    # Check if the requesting user is a merchant.
    current_user = get_current_user(request, db_conn)
    current_user_email = current_user.get('email')
    merchant = db_conn.query(UserAccount).filter_by(
        Email=current_user_email).first()
    if not merchant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    current_user_role = current_user.get('role')
    if not current_user_role or current_user_role.lower() != "merchant":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Impermissible action.")
    return merchant


def get_merchant_patients(merchantID: int, db_conn):
    '''Get all patients that belong to the merchant user'''
    return (db_conn.query(Patient)
            .join(UserPatientAccess, UserPatientAccess.PatientID == Patient.PatientID)
            .filter(UserPatientAccess.UserID == merchantID)
            .order_by(Patient.CreatedAt.desc())
            .all()
            )


@router.get("/dashboard", response_model=Dashboard)
async def get_dashboard(request: Request, db_conn: Session = Depends(get_db)):
    """Returns a user's dashboard information"""
    user = get_current_user(request, db_conn)
    patient = get_patient_by_email(user["email"], db_conn)

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found.")

    patient_id = patient.PatientID

    # Fetch patient health data.
    health_rows = (db_conn.query(HealthData).filter(HealthData.PatientID == patient_id)
                   .order_by(HealthData.CreatedAt.desc()).limit(5).all())

    if not health_rows:
        return Dashboard(
            days=0,
            risks={},
            diff={},
            recommendations={},
        )

    # Calculate days since previous report submission.
    days_since_prev = (datetime.now() - health_rows[0].CreatedAt).days

    predictions = (db_conn.query(Prediction).join(HealthData, Prediction.HealthDataID == HealthData.HealthDataID)
                   .filter(HealthData.PatientID == patient_id)
                   .order_by(Prediction.CreatedAt.desc()).limit(5).all())

    # Latest disease prediction.
    stroke_risk = float(predictions[0].StrokeChance) if predictions else 0.0
    diabetes_risk = float(
        predictions[0].DiabetesChance) if predictions else 0.0
    cvd_risk = float(predictions[0].CVDChance) if predictions else 0.0

    # Risk over time trends.
    risk_dates = [p.CreatedAt.strftime("%d/%m/%Y") for p in predictions]

    latest_risk_info = {
        "dates": risk_dates,
        "stroke": [float(p.StrokeChance or 0) for p in predictions],
        "diabetes": [float(p.DiabetesChance or 0) for p in predictions],
        "cvd": [float(p.CVDChance or 0) for p in predictions],
    }

    # Calculate the difference in disease percentage.
    disease_diff = {
        "stroke": 0.0,
        "cvd": 0.0,
        "diabetes": 0.0,
    }

    if predictions and len(predictions) > 1:
        current = predictions[0]
        prev = predictions[1]

        disease_diff["stroke"] = float(
            current.StrokeChance) - float(prev.StrokeChance)
        disease_diff["cvd"] = float(
            current.CVDChance) - float(prev.CVDChance)
        disease_diff["diabetes"] = float(
            current.DiabetesChance) - float(prev.DiabetesChance)

    # Get the latest patient recommendations.
    recommendation = (db_conn.query(Recommendation).join(HealthData, Recommendation.HealthDataID == HealthData.HealthDataID)
                      .filter(HealthData.PatientID == patient_id).order_by(Recommendation.CreatedAt.desc())
                      .first())

    latest_recommendations = {
        "exercise": recommendation.ExerciseRecommendation if recommendation else "No latest recommendation",
        "diet": recommendation.DietRecommendation if recommendation else "No latest recommendation",
        "lifestyle": recommendation.LifestyleRecommendation if recommendation else "No latest recommendation",
        "avoid": recommendation.DietToAvoidRecommendation if recommendation else "No latest recommendation",
    }

    return Dashboard(
        days=days_since_prev,
        risks=latest_risk_info,
        diff=disease_diff,
        recommendations=latest_recommendations,
    )


@router.get("/merchant-dashboard", response_model=MerchantDashboard)
async def get_merchant_dashboard(request: Request, db_conn: Session = Depends(get_db)):

    merchant = get_current_merchant(request, db_conn)
    merchant_id = merchant.UserID

    # get all merchant patients
    patients = get_merchant_patients(merchant_id, db_conn)
    patient_ids = [p.PatientID for p in patients]
    total_patients = len(patient_ids)

    if total_patients == 0:
        return MerchantDashboard(
            total_patients=0,
            total_reports=0,
            reports_last_30_days=0,
            inactive_patients=0,
            risk_distribution={},
            report_activity=[]
        )

    health_data = (
        db_conn.query(HealthData)
        .filter(HealthData.PatientID.in_(patient_ids))
        .all()
    )

    total_reports = len(health_data)

    # Report in last 30 days
    last_30_days = datetime.now() - timedelta(days=30)
    reports_last_30 = 0
    reports_by_date = {}

    for row in health_data:
        if row.CreatedAt >= last_30_days:
            reports_last_30 += 1

    # Inactive patients
    inactive_patients = 0

    for patient in patients:
        latest = (db_conn.query(HealthData).filter(HealthData.PatientID == patient.PatientID)
                  .order_by(HealthData.CreatedAt.desc()).first())

        if not latest or latest.CreatedAt < last_30_days:
            inactive_patients += 1

    # Total Patient Risks
    stroke_high = stroke_mod = stroke_low = 0
    cvd_high = cvd_mod = cvd_low = 0
    diabetes_high = diabetes_mod = diabetes_low = 0

    for patient in patients:
        prediction = (db_conn.query(Prediction).join(HealthData, Prediction.HealthDataID == HealthData.HealthDataID)
                      .filter(HealthData.PatientID == patient.PatientID).order_by(Prediction.CreatedAt.desc())
                      .first())

        if not prediction:
            continue

        stroke = float(prediction.StrokeChance or 0)
        cvd = float(prediction.CVDChance or 0)
        diabetes = float(prediction.DiabetesChance or 0)

        if stroke >= 50:
            stroke_high += 1
        elif stroke >= 30:
            stroke_mod += 1
        else:
            stroke_low += 1

        if cvd >= 50:
            cvd_high += 1
        elif cvd >= 30:
            cvd_mod += 1
        else:
            cvd_low += 1

        if diabetes >= 50:
            diabetes_high += 1
        elif diabetes >= 30:
            diabetes_mod += 1
        else:
            diabetes_low += 1

    # Report activity
    recent_activity = []

    reports = (db_conn.query(HealthData).filter(HealthData.PatientID.in_(patient_ids))
               .order_by(HealthData.CreatedAt.desc()).limit(20).all())

    for report in reports:
        patient = db_conn.query(Patient).filter_by(
            PatientID=report.PatientID).first()
        recent_activity.append({
            "message": f"{patient.GivenNames} {patient.FamilyName} submitted report",
            "createdAt": report.CreatedAt.isoformat()
        })

    return MerchantDashboard(
        total_patients=total_patients,
        total_reports=total_reports,
        reports_last_30_days=reports_last_30,
        inactive_patients=inactive_patients,
        risk_distribution={
            "stroke": {"high": stroke_high, "moderate": stroke_mod, "low": stroke_low},
            "cvd": {"high": cvd_high, "moderate": cvd_mod, "low": cvd_low},
            "diabetes": {"high": diabetes_high, "moderate": diabetes_mod, "low": diabetes_low},
        },
        report_activity=recent_activity
    )


@router.get("/patient-data")
async def get_patient_data(request: Request, db_conn: Session = Depends(get_db)):
    """
    Retrieves a user's patient data required for report form inputs.
    """

    # Get current user details.
    user = get_current_user(request, db_conn)
    patient = get_patient_by_email(user["email"], db_conn)

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found.")

    result = {
        "weight": float(patient.Weight) if patient.Weight else None,
        "height": float(patient.Height) if patient.Height else None,
        "gender": get_gender(patient.Gender),
        "age": get_age(patient.DateOfBirth)
    }

    return result


@router.get("/merchant/patient-data/{patient_id}")
async def get_merchant_patient_data(patient_id: int, request: Request, db_conn: Session = Depends(get_db)):
    """
    Allows merchant to retrieve a user's patient data required for report form inputs.
    """

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
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Impermissible action.")

    # Get the patient by ID.
    patient = (db_conn.query(Patient).filter(
        Patient.PatientID == patient_id).first())

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found.")

    result = {
        "weight": float(patient.Weight) if patient.Weight else None,
        "height": float(patient.Height) if patient.Height else None,
        "gender": get_gender(patient.Gender),
        "age": get_age(patient.DateOfBirth)
    }

    return result


@router.get("/patient-details/{patient_id}", response_model=PatientDetails)
async def get_dashboard(patient_id: str, request: Request, db_conn: Session = Depends(get_db)):
    """Returns a patient's details"""
    # Check if current user is a merchant
    merchant = get_current_merchant(request, db_conn)

    # Check if the merchant has access to the patients record
    merchant_id = merchant.UserID
    merchant_access = db_conn.query(UserPatientAccess).filter(
        UserPatientAccess.UserID == merchant_id,
        UserPatientAccess.PatientID == patient_id
    ).first()

    if not merchant_access:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Impermissible action.")

    query = (db_conn.query(Patient.GivenNames, Patient.FamilyName,
                           Patient.Gender, Patient.DateOfBirth, Patient.Height, Patient.Weight)
             .filter(Patient.PatientID == patient_id)
             .first())

    patient_info = {
        "givenNames": query.GivenNames,
        "familyName": query.FamilyName,
        "gender": query.Gender,
        "dateOfBirth": query.DateOfBirth.strftime("%d/%m/%Y"),
        "height": query.Height,
        "weight": query.Weight,
        "age": calculateAge(query.DateOfBirth)
    }

    # Fetch patient health data.
    health_rows = (db_conn.query(HealthData).filter(HealthData.PatientID == patient_id)
                   .order_by(HealthData.CreatedAt.desc()).limit(5).all())

    if not health_rows:
        return PatientDetails(
            patient_info=patient_info,
            days=0,
            risks={},
            diff={},
            recommendations={}
        )

    # Calculate days since previous report submission.
    days_since_prev = (datetime.now() - health_rows[0].CreatedAt).days

    predictions = (db_conn.query(Prediction).join(HealthData, Prediction.HealthDataID == HealthData.HealthDataID)
                   .filter(HealthData.PatientID == patient_id)
                   .order_by(Prediction.CreatedAt.desc()).limit(5).all())

    # Risk over time trends.
    risk_dates = [p.CreatedAt.strftime("%d/%m/%Y") for p in predictions]

    latest_risk_info = {
        "dates": risk_dates,
        "stroke": [float(p.StrokeChance or 0) for p in predictions],
        "diabetes": [float(p.DiabetesChance or 0) for p in predictions],
        "cvd": [float(p.CVDChance or 0) for p in predictions],
    }

    # Calculate the difference in disease percentage.
    disease_diff = {
        "stroke": 0.0,
        "cvd": 0.0,
        "diabetes": 0.0,
    }

    if predictions and len(predictions) > 1:
        current = predictions[0]
        prev = predictions[1]

        disease_diff["stroke"] = float(
            current.StrokeChance) - float(prev.StrokeChance)
        disease_diff["cvd"] = float(current.CVDChance) - float(prev.CVDChance)
        disease_diff["diabetes"] = float(
            current.DiabetesChance) - float(prev.DiabetesChance)

    # Get the latest patient recommendations.
    recommendation = (db_conn.query(Recommendation).join(HealthData, Recommendation.HealthDataID == HealthData.HealthDataID)
                      .filter(HealthData.PatientID == patient_id).order_by(Recommendation.CreatedAt.desc())
                      .first())

    latest_recommendations = {
        "exercise": recommendation.ExerciseRecommendation if recommendation else "No latest recommendation",
        "diet": recommendation.DietRecommendation if recommendation else "No latest recommendation",
        "lifestyle": recommendation.LifestyleRecommendation if recommendation else "No latest recommendation",
        "avoid": recommendation.DietToAvoidRecommendation if recommendation else "No latest recommendation",
    }

    return PatientDetails(
        patient_info=patient_info,
        days=days_since_prev,
        risks=latest_risk_info,
        diff=disease_diff,
        recommendations=latest_recommendations
    )


def is_name_valid(name: str):
    '''Verifies a name is valid.'''
    return name is not None or len(name) <= NAME_MAX_LENGTH


def is_age_valid(date_of_birth: date):
    '''Verifies age is valid and the user is at least 18'''

    return calculateAge(date_of_birth) >= MIN_AGE


def calculateAge(date_of_birth: date):
    '''Calculate age based on a date'''
    # Check current date
    today = date.today()
    year_diff = today.year - date_of_birth.year

    # checks if the persons birthday has happened this year
    birthday_not_passed = ((today.month, today.day) < (
        date_of_birth.month, date_of_birth.day))

    age = year_diff - birthday_not_passed
    return age


def is_gender_valid(gender: str):
    '''Verifies gender is valid'''
    return gender in gender_map


def is_weight_valid(weight: float):
    '''Verifies weight is valid'''
    return 0.0 <= weight <= 200.0


def is_height_valid(height: float):
    '''Verifies height is valid'''
    return 0.0 <= height <= 300.0


def get_age(dob):
    """Calculates an age given a date of birth."""
    if not dob:
        return None

    today = datetime.today()
    return today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))


def get_gender(gender):
    """Returns a string representation of a users gender."""
    return "Male" if gender == 1 else "Female"
