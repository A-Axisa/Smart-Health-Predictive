import pytest
from fastapi import status, FastAPI
from fastapi.testclient import TestClient
from ..routers.users import router
from ..utils.database import get_db
from ..models.dbmodels import UserAccount
import io

app = FastAPI()
app.include_router(router)
client = TestClient(app)

populated_rows = """FullName,Email,PhoneNumber,Age,WeightInKilograms,HeightCentimetres,Gender,BloodGlucose,APHigh,APLow,HighCholesterol,Exercise,HyperTension,HeartDisease,Diabetes,Alcohol,SmokingStatus,MaritalStatus,WorkingStatus
User 1,user1@example.com,0412345678,31,50,1.7,1,4.5,135,120,1,0,1,0,1,0,1,0,1
User 2,user2@example.com,0812345678,31,60,1.7,1,6,140,120,0,1,1,0,0,1,0,1,1"""

unpopulated_rows = """FullName,Email,PhoneNumber,Age,WeightInKilograms,HeightCentimetres,Gender,BloodGlucose,APHigh,APLow,HighCholesterol,Exercise,HyperTension,HeartDisease,Diabetes,Alcohol,SmokingStatus,MaritalStatus,WorkingStatus
,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,"""

one_populated_row = """FullName,Email,PhoneNumber,Age,WeightInKilograms,HeightCentimetres,Gender,BloodGlucose,APHigh,APLow,HighCholesterol,Exercise,HyperTension,HeartDisease,Diabetes,Alcohol,SmokingStatus,MaritalStatus,WorkingStatus
,,,,,,,,,,,,,,,,,,
User 2,user2@example.com,0812345678,31,60,1.7,1,6,140,120,0,1,1,0,0,1,0,1,1"""

missing_email = """FullName,Email,PhoneNumber,Age,WeightInKilograms,HeightCentimetres,Gender,BloodGlucose,APHigh,APLow,HighCholesterol,Exercise,HyperTension,HeartDisease,Diabetes,Alcohol,SmokingStatus,MaritalStatus,WorkingStatus
User 1,user1@example.com,0412345678,31,50,1.7,1,4.5,135,120,1,0,1,0,1,0,1,0,1
User 2,,0812345678,31,60,1.7,1,6,140,120,0,1,1,0,0,1,0,1,1"""


@pytest.fixture(scope="session", autouse=True)
def setup_users_for_tests():

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

    merchant_credentials = {'email': 'myreputableclinic@example.com',
                            'password': 'thisisavalidpassword'}
    
    client.post("/login/", json=merchant_credentials)

def upload_csv(data: str):
    file = io.BytesIO(data.encode("utf-8"))
    encoded_file = {"uploaded_file": ("test.csv", file, "text/csv")}
    return client.post("/upload/", files=encoded_file)

def test_populated_rows_upload():
    response = upload_csv(populated_rows)
    body = response.json()

    assert response.status_code == status.HTTP_200_OK
    assert body["processed"] == 2
    assert body["skipped"] == 0

def test_unpopulated_rows_upload():
    response = upload_csv(unpopulated_rows)
    body = response.json()

    assert response.status_code == status.HTTP_200_OK
    assert body["processed"] == 0
    assert body["skipped"] == 2

def test_one_populated_row_upload():
    response = upload_csv(one_populated_row)
    body = response.json()

    assert response.status_code == status.HTTP_200_OK
    assert body["processed"] == 1
    assert body["skipped"] == 1

def test_missing_email_upload():
    response = upload_csv(missing_email)
    body = response.json()

    assert response.status_code == status.HTTP_200_OK
    assert body["processed"] == 1
    assert body["skipped"] == 1
