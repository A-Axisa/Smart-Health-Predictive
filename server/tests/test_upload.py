import pytest
from fastapi import status
from fastapi.testclient import TestClient
from ..main import app
from ..utils.database import get_db
from ..models.dbmodels import UserAccount, UserAccountRole, \
    UserAccountValidationToken, HealthData, Recommendation, Prediction
import io


client = TestClient(app)

# Test CSV data.
populated_rows = """FullName,Email,PhoneNumber,Age,WeightInKilograms,HeightCentimetres,Gender,BloodGlucose,APHigh,APLow,HighCholesterol,Exercise,HyperTension,HeartDisease,Diabetes,Alcohol,SmokingStatus,MaritalStatus,WorkingStatus
User 1,user1@example.com,0412345678,31,50,1.7,Male,4.5,135,120,1,0,1,0,1,0,Yes,Single,Private
User 2,user2@example.com,0812345678,31,60,1.7,Male,6,140,120,0,1,1,0,0,1,No,Married,Private"""

unpopulated_rows = """FullName,Email,PhoneNumber,Age,WeightInKilograms,HeightCentimetres,Gender,BloodGlucose,APHigh,APLow,HighCholesterol,Exercise,HyperTension,HeartDisease,Diabetes,Alcohol,SmokingStatus,MaritalStatus,WorkingStatus
,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,"""

one_populated_row = """FullName,Email,PhoneNumber,Age,WeightInKilograms,HeightCentimetres,Gender,BloodGlucose,APHigh,APLow,HighCholesterol,Exercise,HyperTension,HeartDisease,Diabetes,Alcohol,SmokingStatus,MaritalStatus,WorkingStatus
,,,,,,,,,,,,,,,,,,
User 2,user2@example.com,0812345678,31,60,1.7,Male,6,140,120,0,1,1,0,0,1,No,Married,Private"""

missing_email = """FullName,Email,PhoneNumber,Age,WeightInKilograms,HeightCentimetres,Gender,BloodGlucose,APHigh,APLow,HighCholesterol,Exercise,HyperTension,HeartDisease,Diabetes,Alcohol,SmokingStatus,MaritalStatus,WorkingStatus
User 1,user1@example.com,0412345678,31,50,1.7,Male,4.5,135,120,1,0,1,0,1,0,Yes,Single,Private
User 2,,0812345678,31,60,1.7,Male,6,140,120,0,1,1,0,0,1,No,Married,Private"""


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
            'username': 'AReputableClinic',
            'password': 'thisisavalidpassword',
            'email': 'myreputableclinic@example.com',
            'phone': '',
            'account_type': 'merchant'
        },
        {
            'username': 'User 1',
            'password': 'thisisalongpassword',
            'email': 'user1@example.com',
            'phone': '',
            'account_type': 'user'
        },
        {
            'username': 'User 2',
            'password': 'thisisareallylongpassword',
            'email': 'user2@example.com',
            'phone': '',
            'account_type': 'user'
        }
    ]

    for account in credentials:
        client.post("/register/", json=account)

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

    if user:
        # Delete user's HealthData.
        health_ids = [hid for (hid,) in db_conn.query(HealthData.HealthDataID)
                    .filter(HealthData.UserID == user.UserID).all()]

        if health_ids:
            db_conn.query(Recommendation).filter(Recommendation.HealthDataID.in_(health_ids)) \
                .delete(synchronize_session=False)
            db_conn.query(Prediction).filter(Prediction.HealthDataID.in_(health_ids)) \
                .delete(synchronize_session=False)
            db_conn.query(HealthData).filter(HealthData.UserID == user.UserID) \
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
