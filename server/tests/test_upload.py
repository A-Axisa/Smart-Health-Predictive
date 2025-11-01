import pytest
from fastapi import status, FastAPI
from fastapi.testclient import TestClient
from ..routers.upload import router
from ..utils.database import get_db
from ..models.dbmodels import UserAccount
import io

app = FastAPI()
app.include_router(router)
client = TestClient(app)

test_populated_csv_data = """FullName,Email,PhoneNumber,Age,WeightInKilograms,HeightMeters,Gender,BloodGlucose,APHigh,APLow,HighCholesterol,Exercise,HyperTension,HeartDisease,Diabetes,Alcohol,SmokingStatus,MaritalStatus,WorkingStatus
User 1,user1@example.com,0412345678,31,50,1.7,1,4.5,135,120,1,0,1,0,1,0,1,0,1
User 2,user2@example.com,0812345678,31,60,1.7,1,6,140,120,0,1,1,0,0,1,0,1,1"""

test_one_populated_row_csv_data = """FullName,Email,PhoneNumber,Age,WeightInKilograms,HeightMeters,Gender,BloodGlucose,APHigh,APLow,HighCholesterol,Exercise,HyperTension,HeartDisease,Diabetes,Alcohol,SmokingStatus,MaritalStatus,WorkingStatus
,,,,,,,,,,,,,,,,,,
User 2,user2@example.com,0812345678,31,60,1.7,1,6,140,120,0,1,1,0,0,1,0,1,1"""

test_unpopulated_rows_csv_data = """FullName,Email,PhoneNumber,Age,WeightInKilograms,HeightMeters,Gender,BloodGlucose,APHigh,APLow,HighCholesterol,Exercise,HyperTension,HeartDisease,Diabetes,Alcohol,SmokingStatus,MaritalStatus,WorkingStatus
,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,"""

test_missing_email_csv_data = """FullName,Email,PhoneNumber,Age,WeightInKilograms,HeightMeters,Gender,BloodGlucose,APHigh,APLow,HighCholesterol,Exercise,HyperTension,HeartDisease,Diabetes,Alcohol,SmokingStatus,MaritalStatus,WorkingStatus
User 1,user1@example.com,0412345678,31,50,1.7,1,4.5,135,120,1,0,1,0,1,0,1,0,1
User 2,,0812345678,31,60,1.7,1,6,140,120,0,1,1,0,0,1,0,1,1"""


@pytest.fixture(scope="session", autouse=True)
def setup_users_for_tests():
    db_conn = next(get_db())

    test_merchant = UserAccount("Merchant User", "merchant@example.com", "validpassword", "1234567890")
    test_user1 = UserAccount("User 1", "user1@example.com", "anothervalidpassword", "0412345678")
    test_user2 = UserAccount("User 2", "user2@example.com", "yetanothervalidpassword", "0812345678")

    db_conn.add_all([test_merchant, test_user1, test_user2])
    db_conn.commit()
    test_merchant.UserID = 123
    db_conn.commit()
    yield

    db_conn.query(UserAccount).filter(UserAccount.Email == "merchant@example.com").delete()
    db_conn.query(UserAccount).filter(UserAccount.Email == "user1@example.com").delete()
    db_conn.query(UserAccount).filter(UserAccount.Email == "user2@example.com").delete()
    db_conn.commit()

def test_populated_rows_upload():
    file = io.BytesIO(test_populated_csv_data.encode("utf-8"))
    files = {"file": ("test.csv", file, "text/csv")}
    response = client.post("/upload", files=files, data={"testMerchantID": 123})
    assert response.status_code == status.HTTP_200_OK
    
    data = response.json()
    assert len(data) == 2
    assert data[0]["merchantID"] == 123
    assert data[1]["merchantID"] == 123

def test_unpopulated_rows_upload():
    file = io.BytesIO(test_unpopulated_rows_csv_data.encode("utf-8"))
    files = {"file": ("test.csv", file, "text/csv")}
    response = client.post("/upload", files=files, data={"testMerchantID": 123})
    assert response.status_code == status.HTTP_400_BAD_REQUEST

def test_one_populated_row_upload():
    file = io.BytesIO(test_one_populated_row_csv_data.encode("utf-8"))
    files = {"file": ("test.csv", file, "text/csv")}
    response = client.post("/upload", files=files, data={"testMerchantID": 123})
    assert response.status_code == status.HTTP_200_OK
    
    data = response.json()
    assert len(data) == 1
    assert data[0]["merchantID"] == 123

def test_missing_email_upload():
    file = io.BytesIO(test_missing_email_csv_data.encode("utf-8"))
    files = {"file": ("test.csv", file, "text/csv")}
    response = client.post("/upload", files=files, data={"testMerchantID": 123})
    assert response.status_code == status.HTTP_200_OK
    
    data = response.json()
    assert len(data) == 1
    assert data[0]["merchantID"] == 123    