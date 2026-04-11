import pytest
from fastapi import status
from fastapi.testclient import TestClient
from ...main import app
from ...utils.database import get_db
from ...models.dbmodels import UserAccount, UserAccountRole, \
    UserAccountValidationToken, HealthData, Recommendation, Prediction, Patient, UserPatientAccess, AuditLog, LogEventType
from ...routers.health_prediction import sanitize_health_data, validate_sanitized_data, HealthDataInput, MerchantHealthDataInput
import io


client = TestClient(app)

# Test CSV data.
populated_rows = """GivenNames,LastName,Email,PhoneNumber,Age,WeightKilograms,HeightCentimetres,Gender,BloodGlucose,APHigh,APLow,HighCholesterol,HyperTension,HeartDisease,Diabetes,Alcohol,SmokingStatus,MaritalStatus,WorkingStatus,Stroke
User,1,user1@example.com,0412345678,31,50,170,Male,4.5,135,120,1,1,0,1,0,Yes,Single,Private,1
User,2,user2@example.com,0812345678,31,60,170,Male,6,140,120,0,1,0,0,1,No,Married,Private,0"""

unpopulated_rows = """GivenNames,LastName,Email,PhoneNumber,Age,WeightKilograms,HeightCentimetres,Gender,BloodGlucose,APHigh,APLow,HighCholesterol,HyperTension,HeartDisease,Diabetes,Alcohol,SmokingStatus,MaritalStatus,WorkingStatus,Stroke
,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,"""

one_populated_row = """GivenNames,LastName,Email,PhoneNumber,Age,WeightKilograms,HeightCentimetres,Gender,BloodGlucose,APHigh,APLow,HighCholesterol,HyperTension,HeartDisease,Diabetes,Alcohol,SmokingStatus,MaritalStatus,WorkingStatus,Stroke
,,,,,,,,,,,,,,,,,,,
User,2,user2@example.com,0812345678,31,60,170,Male,6,140,120,0,1,0,0,1,No,Married,Private,0"""

missing_email = """GivenNames,LastName,Email,PhoneNumber,Age,WeightKilograms,HeightCentimetres,Gender,BloodGlucose,APHigh,APLow,HighCholesterol,HyperTension,HeartDisease,Diabetes,Alcohol,SmokingStatus,MaritalStatus,WorkingStatus,Stroke
User,1,user1@example.com,0412345678,31,50,170,Male,4.5,135,120,1,1,0,1,0,Yes,Single,Private,1
User,2,,0812345678,31,60,170,Male,6,140,120,0,1,0,0,1,No,Married,Private,0"""


@pytest.fixture(scope="session", autouse=True)
def setup_users_for_tests():

    emails = [
        "myreputableclinic@example.com",
        "user1@example.com",
        "user2@example.com",
    ]

    # Delete test user's if they still exist.
    for email in emails:
        delete_user_and_data(email)

    credentials = [
        {
            "given_names": "AReputableClinic",
            "family_name": "",
            "date_of_birth": None,
            "gender": None,
            "password": "thisisavalidpasswordA1!",
            "email": "myreputableclinic@example.com",
            "phone": "",
            "account_type": "merchant",
            "clinic_id": 1
        },
        {
            "given_names": "User",
            "family_name": "1",
            "date_of_birth": "2002-03-22",
            "gender": "Male",
            "password": "thisisalongpassword4$R",
            "email": "user1@example.com",
            "phone": "",
            "account_type": "user",
            "clinic_id": None
        },
        {
            "given_names": "User",
            "family_name": "2",
            "date_of_birth": "2000-03-22",
            "gender": "Female",
            "password": "thisisareallylongpassword%5V",
            "email": "user2@example.com",
            "phone": "",
            "account_type": "user",
            "clinic_id": None
        }
    ]

    for account in credentials:
        client.post("/register/", json=account)

    # Give merchant access to view new patient records
    db_conn = next(get_db())
    merchant = db_conn.query(UserAccount).filter_by(
        Email="myreputableclinic@example.com").first()
    user1 = (
        db_conn.query(Patient)
        .join(UserAccount, Patient.UserID == UserAccount.UserID)
        .filter(UserAccount.Email == "user1@example.com")
        .first()
    )
    user2 = (
        db_conn.query(Patient)
        .join(UserAccount, Patient.UserID == UserAccount.UserID)
        .filter(UserAccount.Email == "user2@example.com")
        .first()
    )

    permission1 = UserPatientAccess(merchant.UserID, user1.PatientID)
    permission2 = UserPatientAccess(merchant.UserID, user2.PatientID)

    db_conn.add(permission1)
    db_conn.add(permission2)
    db_conn.commit()
    # Create login payload for the test merchant.
    merchant_credentials = {'email': 'myreputableclinic@example.com',
                            'password': 'thisisavalidpasswordA1!'}

    client.post("/login/", json=merchant_credentials)

    yield

    # Delete each test user after tests.
    for email in emails:
        delete_user_and_data(email)

# Helper function to delete a user and all their data.


def delete_user_and_data(email: str):
    db_conn = next(get_db())

    # Get the user.
    user = db_conn.query(UserAccount).filter_by(Email=email).first()
    patient_record = (
        db_conn.query(Patient)
        .join(UserAccount, Patient.UserID == UserAccount.UserID)
        .filter(UserAccount.Email == email)
        .first()
    )

    if user:
        # Delete Merchant Patient access
        if patient_record:
            db_conn.query(UserPatientAccess).filter(UserPatientAccess.PatientID ==
                                                    patient_record.PatientID).delete(synchronize_session=False)
        else:
            db_conn.query(UserPatientAccess).filter(
                UserPatientAccess.UserID == user.UserID).delete(synchronize_session=False)

        # Delete user's HealthData.
        if patient_record:
            health_ids = [hid for (hid,) in db_conn.query(HealthData.HealthDataID)
                          .filter(HealthData.PatientID == patient_record.PatientID).all()]

            if health_ids:
                db_conn.query(Recommendation).filter(Recommendation.HealthDataID.in_(health_ids)) \
                    .delete(synchronize_session=False)
                db_conn.query(Prediction).filter(Prediction.HealthDataID.in_(health_ids)) \
                    .delete(synchronize_session=False)
                db_conn.query(HealthData).filter(HealthData.PatientID == patient_record.PatientID) \
                    .delete(synchronize_session=False)

        # Delete user's role and token.
        db_conn.query(UserAccountRole).filter(UserAccountRole.UserID == user.UserID) \
            .delete(synchronize_session=False)
        db_conn.query(UserAccountValidationToken).filter(UserAccountValidationToken.UserID == user.UserID) \
            .delete(synchronize_session=False)

        # Delete the user.
        db_conn.delete(user)
        db_conn.commit()

# Helper function to upload csv.


def upload_csv(data: str):
    file = io.BytesIO(data.encode("utf-8"))
    encoded_file = {"uploaded_file": ("test.csv", file, "text/csv")}
    return client.post("/upload/", files=encoded_file)

# Helper function to return a count of all HealthData rows.


def count_health_data():
    db_conn = next(get_db())
    return db_conn.query(HealthData).count()


def test_populated_rows_upload():
    pre_count = count_health_data()
    response = upload_csv(populated_rows)
    post_count = count_health_data()
    body = response.json()

    assert response.status_code == status.HTTP_200_OK
    assert body["processed"] == 2
    assert body["skipped"] == 0
    assert post_count == pre_count + 2


def test_unpopulated_rows_upload():
    pre_count = count_health_data()
    response = upload_csv(unpopulated_rows)
    post_count = count_health_data()
    body = response.json()

    assert response.status_code == status.HTTP_200_OK
    assert body["processed"] == 0
    assert body["skipped"] == 2
    assert post_count == pre_count


def test_one_populated_row_upload():
    pre_count = count_health_data()
    response = upload_csv(one_populated_row)
    post_count = count_health_data()
    body = response.json()

    assert response.status_code == status.HTTP_200_OK
    assert body["processed"] == 1
    assert body["skipped"] == 1
    assert post_count == pre_count + 1


def test_missing_email_upload():
    pre_count = count_health_data()
    response = upload_csv(missing_email)
    post_count = count_health_data()
    body = response.json()

    assert response.status_code == status.HTTP_200_OK
    assert body["processed"] == 1
    assert body["skipped"] == 1
    assert post_count == pre_count + 1


def test_csv_upload_writes_data_import_audit_log():
    response = upload_csv(one_populated_row)
    assert response.status_code == status.HTTP_200_OK

    db_conn = next(get_db())
    log = (
        db_conn.query(AuditLog)
        .filter(AuditLog.EventType == LogEventType.DATA_IMPORT.value)
        .filter(AuditLog.UserEmail == "myreputableclinic@example.com")
        .order_by(AuditLog.LogID.desc())
        .first()
    )

    assert log is not None
    assert log.Success is True
    assert "CSV upload processed" in (log.Description or "")
    assert "test.csv" in (log.Description or "")


# ============== Sanitization Function Unit Tests ==============

class TestSanitizeHealthData:
    """Test suite for sanitize_health_data function."""

    def test_sanitize_whitespace_in_gender(self):
        """Gender field with leading/trailing spaces."""
        data = HealthDataInput(
            age=30, weight=75.0, height=170.0, gender=" Male ",
            blood_glucose=5.5, ap_hi=120, ap_lo=80,
            high_cholesterol=0, hypertension=0, heart_disease=0,
            diabetes=0, alcohol=0,
            smoker="Yes", marital_status="Married", working_status="Private", stroke=0
        )
        result = sanitize_health_data(data)
        assert result is not None
        assert result["gender"] == "Male"

    def test_sanitize_case_insensitive_gender(self):
        """Gender field case-insensitive."""
        data = HealthDataInput(
            age=30, weight=75.0, height=170.0, gender="female",
            blood_glucose=5.5, ap_hi=120, ap_lo=80,
            high_cholesterol=0, hypertension=0, heart_disease=0,
            diabetes=0, alcohol=0,
            smoker="Yes", marital_status="Married", working_status="Private", stroke=0
        )
        result = sanitize_health_data(data)
        assert result is not None
        assert result["gender"] == "Female"

    def test_sanitize_case_insensitive_smoker(self):
        """Smoker field case-insensitive."""
        data = HealthDataInput(
            age=30, weight=75.0, height=170.0, gender="Male",
            blood_glucose=5.5, ap_hi=120, ap_lo=80,
            high_cholesterol=0, hypertension=0, heart_disease=0,
            diabetes=0, alcohol=0,
            smoker="NO", marital_status="Married", working_status="Private", stroke=0
        )
        result = sanitize_health_data(data)
        assert result is not None
        assert result["smoker"] == "No"

    def test_sanitize_former_smoker_with_spaces(self):
        """Former smoker with leading/trailing spaces and mixed case."""
        data = HealthDataInput(
            age=30, weight=75.0, height=170.0, gender="Male",
            blood_glucose=5.5, ap_hi=120, ap_lo=80,
            high_cholesterol=0, hypertension=0, heart_disease=0,
            diabetes=0, alcohol=0,
            smoker="  FORMER SMOKER  ", marital_status="Married", working_status="Private", stroke=0
        )
        result = sanitize_health_data(data)
        assert result is not None
        assert result["smoker"] == "Former smoker"

    def test_sanitize_decimal_precision_clamping(self):
        """Blood glucose clamped to 2 decimal places."""
        data = HealthDataInput(
            age=30, weight=75.12345, height=170.6789, gender="Male",
            blood_glucose=5.6789, ap_hi=120.123, ap_lo=80.999,
            high_cholesterol=0, hypertension=0, heart_disease=0,
            diabetes=0, alcohol=0,
            smoker="Yes", marital_status="Married", working_status="Private", stroke=0
        )
        result = sanitize_health_data(data)
        assert result is not None
        assert result["blood_glucose"] == 5.68
        assert result["weight"] == 75.12
        assert result["height"] == 170.68
        assert result["ap_hi"] == 120.12
        assert result["ap_lo"] == 81.0

    def test_sanitize_invalid_gender_returns_none(self):
        """Invalid gender value returns None in sanitized dict."""
        data = HealthDataInput(
            age=30, weight=75.0, height=170.0, gender="InvalidGender",
            blood_glucose=5.5, ap_hi=120, ap_lo=80,
            high_cholesterol=0, hypertension=0, heart_disease=0,
            diabetes=0, alcohol=0,
            smoker="Yes", marital_status="Married", working_status="Private", stroke=0
        )
        result = sanitize_health_data(data)
        assert result is not None
        assert result["gender"] is None

    def test_sanitize_case_insensitive_marital_status(self):
        """Marital status case-insensitive."""
        data = HealthDataInput(
            age=30, weight=75.0, height=170.0, gender="Male",
            blood_glucose=5.5, ap_hi=120, ap_lo=80,
            high_cholesterol=0, hypertension=0, heart_disease=0,
            diabetes=0, alcohol=0,
            smoker="Yes", marital_status="  MARRIED  ", working_status="Private", stroke=0
        )
        result = sanitize_health_data(data)
        assert result is not None
        assert result["marital_status"] == "Married"


class TestValidateSanitizedData:
    """Test suite for validate_sanitized_data function."""

    def test_validate_valid_sanitized_data(self):
        """Validate correctly sanitized data."""
        sanitized = {
            "age": 30,
            "weight": 75.0,
            "height": 170.0,
            "gender": "Male",
            "blood_glucose": 5.5,
            "ap_hi": 120.0,
            "ap_lo": 80.0,
            "high_cholesterol": 0,
            "hypertension": 0,
            "heart_disease": 0,
            "diabetes": 0,
            "alcohol": 0,
            "smoker": "Yes",
            "marital_status": "Married",
            "working_status": "Private",
            "stroke": 0,
            "patient_id": None
        }
        assert validate_sanitized_data(sanitized) is True

    def test_validate_rejects_none_gender(self):
        """Validation fails when gender is None."""
        sanitized = {
            "age": 30,
            "weight": 75.0,
            "height": 170.0,
            "gender": None,  # Invalid
            "blood_glucose": 5.5,
            "ap_hi": 120.0,
            "ap_lo": 80.0,
            "high_cholesterol": 0,
            "hypertension": 0,
            "heart_disease": 0,
            "diabetes": 0,
            "alcohol": 0,
            "smoker": "Yes",
            "marital_status": "Married",
            "working_status": "Private",
            "stroke": 0,
            "patient_id": None
        }
        assert validate_sanitized_data(sanitized) is False

    def test_validate_rejects_none_smoker(self):
        """Validation fails when smoker is None."""
        sanitized = {
            "age": 30,
            "weight": 75.0,
            "height": 170.0,
            "gender": "Male",
            "blood_glucose": 5.5,
            "ap_hi": 120.0,
            "ap_lo": 80.0,
            "high_cholesterol": 0,
            "hypertension": 0,
            "heart_disease": 0,
            "diabetes": 0,
            "alcohol": 0,
            "smoker": None,  # Invalid
            "marital_status": "Married",
            "working_status": "Private",
            "stroke": 0,
            "patient_id": None
        }
        assert validate_sanitized_data(sanitized) is False

    def test_validate_rejects_out_of_range_age(self):
        """Validation fails for age out of range."""
        sanitized = {
            "age": 150,  # Invalid
            "weight": 75.0,
            "height": 170.0,
            "gender": "Male",
            "blood_glucose": 5.5,
            "ap_hi": 120.0,
            "ap_lo": 80.0,
            "high_cholesterol": 0,
            "hypertension": 0,
            "heart_disease": 0,
            "diabetes": 0,
            "alcohol": 0,
            "smoker": "Yes",
            "marital_status": "Married",
            "working_status": "Private",
            "stroke": 0,
            "patient_id": None
        }
        assert validate_sanitized_data(sanitized) is False

    def test_validate_rejects_none_dict(self):
        """Validation fails for None dictionary."""
        assert validate_sanitized_data(None) is False


class TestHealthPredictionEndpointSanitization:
    """Integration tests for /health-prediction/ endpoint with sanitization."""

    def test_healthprediction_with_lowercase_gender(self):
        """User health prediction endpoint accepts lowercase gender."""
        login_payload = {'email': 'user1@example.com',
                         'password': 'thisisalongpassword4$R'}
        client.post("/login/", json=login_payload)

        health_data = {
            "age": 30,
            "weight": 75.0,
            "height": 170.0,
            "gender": "male",  # lowercase
            "blood_glucose": 5.5,
            "ap_hi": 120,
            "ap_lo": 80,
            "high_cholesterol": 0,
            "hypertension": 0,
            "heart_disease": 0,
            "diabetes": 0,
            "alcohol": 0,
            "smoker": "Yes",
            "marital_status": "Married",
            "working_status": "Private",
            "stroke": 0
        }

        response = client.post("/health-prediction/", json=health_data)
        assert response.status_code == status.HTTP_200_OK
        body = response.json()
        assert "cardioProbability" in body
        assert "strokeProbability" in body
        assert "diabetesProbability" in body

    def test_healthprediction_with_whitespace_smoker(self):
        """User health prediction endpoint accepts smoker with leading/trailing spaces."""
        login_payload = {'email': 'user1@example.com',
                         'password': 'thisisalongpassword4$R'}
        client.post("/login/", json=login_payload)

        health_data = {
            "age": 30,
            "weight": 75.0,
            "height": 170.0,
            "gender": "Male",
            "blood_glucose": 5.5,
            "ap_hi": 120,
            "ap_lo": 80,
            "high_cholesterol": 0,
            "hypertension": 0,
            "heart_disease": 0,
            "diabetes": 0,
            "alcohol": 0,
            "smoker": "  No  ",  # whitespace
            "marital_status": "Married",
            "working_status": "Private",
            "stroke": 0
        }

        response = client.post("/health-prediction/", json=health_data)
        assert response.status_code == status.HTTP_200_OK
        body = response.json()
        assert "cardioProbability" in body


class TestCSVUploadSanitization:
    """Integration tests for /upload endpoint with sanitization."""

    @pytest.fixture(autouse=True)
    def ensure_merchant_login(self):
        """Ensure CSV upload tests always run with merchant auth context."""
        merchant_credentials = {
            'email': 'myreputableclinic@example.com',
            'password': 'thisisavalidpasswordA1!'
        }
        client.post("/login/", json=merchant_credentials)

    def test_csv_upload_with_case_variations(self):
        """CSV upload handles case variations in categorical fields."""
        csv_data = """GivenNames,LastName,Email,PhoneNumber,Age,WeightKilograms,HeightCentimetres,Gender,BloodGlucose,APHigh,APLow,HighCholesterol,HyperTension,HeartDisease,Diabetes,Alcohol,SmokingStatus,MaritalStatus,WorkingStatus,Stroke
User,3,user1@example.com,0412345678,31,50,170,male,4.5,135,120,1,1,0,1,0,no,single,private,1"""

        pre_count = count_health_data()
        response = upload_csv(csv_data)
        post_count = count_health_data()
        body = response.json()

        assert response.status_code == status.HTTP_200_OK
        assert body["processed"] == 1
        assert post_count == pre_count + 1

    def test_csv_upload_with_invalid_gender_skipped(self):
        """CSV upload skips rows with invalid gender after attempted sanitization."""
        csv_data = """GivenNames,LastName,Email,PhoneNumber,Age,WeightKilograms,HeightCentimetres,Gender,BloodGlucose,APHigh,APLow,HighCholesterol,HyperTension,HeartDisease,Diabetes,Alcohol,SmokingStatus,MaritalStatus,WorkingStatus,Stroke
User,4,user1@example.com,0412345678,31,50,170,InvalidGender,4.5,135,120,1,1,0,1,0,Yes,Single,Private,1"""

        pre_count = count_health_data()
        response = upload_csv(csv_data)
        post_count = count_health_data()
        body = response.json()

        assert response.status_code == status.HTTP_200_OK
        assert body["skipped"] == 1
        assert post_count == pre_count
