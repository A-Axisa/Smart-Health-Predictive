import pytest
from fastapi import status
from fastapi.testclient import TestClient
from ...main import app
from ...utils.database import get_db
from ...models.dbmodels import UserAccount, UserAccountRole, \
    UserAccountValidationToken, HealthData, Recommendation, Prediction, Patient, UserPatientAccess
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
            "last_name": "",
            "date_of_birth": None,
            "gender": None,
            "password": "thisisavalidpassword",
            "email": "myreputableclinic@example.com",
            "phone": "",
            "account_type": "merchant",
            "clinic_id": 1
        },
        {
            "given_names": "User",
            "last_name": "1",
            "date_of_birth": "2002-03-22",
            "gender": "Male",
            "password": "thisisalongpassword",
            "email": "user1@example.com",
            "phone": "",
            "account_type": "user",
            "clinic_id": None
        },
        {
            "given_names": "User",
            "last_name": "2",
            "date_of_birth": "2000-03-22",
            "gender": "Female",
            "password": "thisisareallylongpassword",
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
                            'password': 'thisisavalidpassword'}

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
