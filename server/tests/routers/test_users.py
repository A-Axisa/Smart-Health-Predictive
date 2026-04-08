import pytest
from fastapi import status
from fastapi.testclient import TestClient
from datetime import datetime

from server.main import app

from ... models.dbmodels import HealthData, AuditLog, LogEventType, Patient
from ... main import app
from ... utils.database import get_db

client = TestClient(app)


@pytest.fixture(scope="session", autouse=True)
def setup_once_for_all_tests():
    # Delete user details
    credentials = {
        'given_names': 'Testable',
        'family_name': 'DeleteMe',
        'date_of_birth': '1980-05-24',
        'gender': 'Male',
        'password': 'thisisavalidpasswordA1!',
        'email': 'testdelete@mymail.com',
        'phone': '',
        'account_type': 'user'
    }
    client.post("/register/", json=credentials)

    # User for /patient-data
    credentials = {
        'given_names': 'non',
        'family_name': 'existent',
        'date_of_birth': '1980-05-24',
        'gender': 'Female',
        'password': 'thisisavalidpasswordA1!',
        'email': 'nopatientdata@example.com',
        'phone': '',
        'account_type': 'user'
    }
    client.post("/register/", json=credentials)

    credentials = {
        'given_names': 'Real',
        'family_name': 'User',
        'date_of_birth': '1980-05-24',
        'gender': 'Male',
        'password': 'thisisavalidpasswordA1!',
        'email': 'RealGuy@example.com',
        'phone': '',
        'account_type': 'user'
    }
    client.post("/register/", json=credentials)

    login_credentials = {'email': 'RealGuy@example.com',
                         'password': 'thisisavalidpasswordA1!'}
    client.post('/login/', json=login_credentials)

    testHealthData = {
        "age": 35,
        "weight": 70,
        "height": 170,
        "gender": "Male",
        "blood_glucose": 7.5,
        "ap_hi": 120,
        "ap_lo": 80,
        "high_cholesterol": 0,
        "hyper_tension": 0,
        "heart_disease": 0,
        "diabetes": 0,
        "alcohol": 1,
        "smoker": "No",
        "marital_status": "Married",
        "working_status": "Private",
        "stroke": 0
    }
    client.post("/healthPrediction/", json=testHealthData)
    # Return the testHeatlhData to use in tests
    yield testHealthData


def test_delete_requires_authentication():
    fresh = TestClient(app)
    res = fresh.delete("/users/")
    assert res.status_code == status.HTTP_401_UNAUTHORIZED, res.text


def test_login_and_self_delete_like_auth_flow():
    credentials = {"email": "testdelete@mymail.com",
                   "password": "thisisavalidpasswordA1!"}
    login_res = client.post("/login/", json=credentials)
    assert login_res.status_code == status.HTTP_200_OK, f"login failed: {login_res.status_code} {login_res.text}"

    me = client.get("/user/me")
    assert me.status_code == status.HTTP_200_OK, f"/user/me failed: {me.status_code} {me.text}"

    delete_res = client.delete("/users/")
    assert delete_res.status_code == status.HTTP_200_OK, f"delete failed: {delete_res.status_code} {delete_res.text}"
    assert delete_res.json()["message"].startswith(
        "User and all related data deleted successfully")

    db_conn = next(get_db())
    log = (
        db_conn.query(AuditLog)
        .filter(AuditLog.EventType == LogEventType.ACCOUNT_DELETED.value)
        .filter(AuditLog.UserEmail == "testdelete@mymail.com")
        .order_by(AuditLog.LogID.desc())
        .first()
    )
    assert log is not None
    assert log.Success is True


def test_get_invalid_data():
    response = client.get(f"/reportData/{-1}")
    assert response.json() == {"detail": "Report data not found"}


def test_delete_data():
    db_conn = next(get_db())
    healthData = db_conn.query(HealthData).order_by(
        HealthData.HealthDataID.desc()).first()
    response = client.delete(f"/reportData/{healthData.HealthDataID}")
    assert response.status_code == 200
    assert response.json() == {
        "message": "Health report data successfully deleted"}


def test_delete_non_existing_data():
    response = client.delete(f"/reportData/{-1}")
    assert response.status_code == 404
    assert response.json() == {"detail": "Health report not found"}


def test_get_patient_data_returns_correct_fields():
    credentials = {
        "email": "RealGuy@example.com",
        "password": "thisisavalidpasswordA1!"
    }
    client.post('/login/', json=credentials)
    response = client.get("/patient-data")
    data = response.json()

    assert response.status_code == status.HTTP_200_OK
    assert data.keys() == {"weight", "height", "gender", "age"}
    assert data["gender"] == "Male"
    assert data["age"] == datetime.today().year - 1980 - ((datetime.today().month, datetime.today().day) < (5, 24))


def test_get_patient_data_has_empty_fields():
    credentials = {
        "email": "nopatientdata@example.com",
        "password": "thisisavalidpasswordA1!"
    }
    client.post('/login/', json=credentials)
    response = client.get("/patient-data")
    data = response.json()
    
    # Gender and age are required for registration, therefore omitted.
    assert response.status_code == status.HTTP_200_OK
    assert data["weight"] is None
    assert data["height"] is None
    
    
def test_create_patient():
    # Login as Merchant
    credentials = {"email": "service@example.com",
                   "password": "thisismypassword"}
    login_res = client.post("/login/", json=credentials)
    assert login_res.status_code == status.HTTP_200_OK
    assert login_res.json() == {'message': f'Successfully logged in.'}
    # Patient Details
    patient = {
        "given_names": "John",
        "family_name": "Smith",
        "date_of_birth": "1988-04-04",
        "gender": "Male",
        "weight": 80,
        "height": 200
    }
    # Create Patient Record
    response = client.post("/create-patient", json=patient)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["message"] == 'Patient successfully created.'
    assert isinstance(response.json()["patient_id"], int)


def test_create_patient_non_merchant():
    # Login as a standard user
    credentials = {"email": "RealGuy@example.com",
                   "password": "thisisavalidpasswordA1!"}
    login_res = client.post("/login/", json=credentials)
    assert login_res.status_code == status.HTTP_200_OK
    assert login_res.json() == {'message': f'Successfully logged in.'}
    # Patient Details
    patient = {
        "given_names": "John",
        "family_name": "Smith",
        "date_of_birth": "1988-04-04",
        "gender": "Male",
        "weight": 80,
        "height": 200
    }
    # Try to Create Patient Record
    response = client.post("/create-patient", json=patient)
    assert response.status_code == status.HTTP_403_FORBIDDEN


def test_create_patient_invalid_age():
    # Login as Merchant
    credentials = {"email": "service@example.com",
                   "password": "thisismypassword"}
    login_res = client.post("/login/", json=credentials)
    assert login_res.status_code == status.HTTP_200_OK
    assert login_res.json() == {'message': f'Successfully logged in.'}
    # Patient Details where the patient is too young
    patient = {
        "given_names": "John",
        "family_name": "Smith",
        "date_of_birth": "2015-04-04",
        "gender": "Male",
        "weight": 80,
        "height": 200
    }
    # Try to Create Patient Record
    response = client.post("/create-patient", json=patient)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_create_patient_invalid_weight():
    # Login as Merchant
    credentials = {"email": "service@example.com",
                   "password": "thisismypassword"}
    login_res = client.post("/login/", json=credentials)
    assert login_res.status_code == status.HTTP_200_OK
    assert login_res.json() == {'message': f'Successfully logged in.'}
    # Patient Details where weight is outside of range (0-200 kg)
    patient = {
        "given_names": "John",
        "family_name": "Smith",
        "date_of_birth": "1988-04-04",
        "gender": "Male",
        "weight": 210,
        "height": 200
    }
    # Try to Create Patient Record
    response = client.post("/create-patient", json=patient)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    patient["weight"] = -10
    response = client.post("/create-patient", json=patient)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_create_patient_invalid_height():
    # Login as Merchant
    credentials = {"email": "service@example.com",
                   "password": "thisismypassword"}
    login_res = client.post("/login/", json=credentials)
    assert login_res.status_code == status.HTTP_200_OK
    assert login_res.json() == {'message': f'Successfully logged in.'}
    # Patient Details where height is outside of range (0-300 CM)
    patient = {
        "given_names": "John",
        "family_name": "Smith",
        "date_of_birth": "1988-04-04",
        "gender": "Male",
        "weight": 80,
        "height": 302
    }
    # Try to Create Patient Record
    response = client.post("/create-patient", json=patient)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    patient["height"] = -10
    response = client.post("/create-patient", json=patient)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_remove_patient():
    # Login as Merchant
    credentials = {"email": "service@example.com",
                   "password": "thisismypassword"}
    login_res = client.post("/login/", json=credentials)
    assert login_res.status_code == status.HTTP_200_OK
    assert login_res.json() == {'message': f'Successfully logged in.'}
    # Patient Details
    patient = {
        "given_names": "Timmy",
        "family_name": "Smith",
        "date_of_birth": "1988-04-04",
        "gender": "Male",
        "weight": 80,
        "height": 180
    }
    # Create Patient
    response = client.post("/create-patient", json=patient)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["message"] == "Patient successfully created."
    assert isinstance(response.json()["patient_id"], int)

    response = client.delete(
        f"/remove-patient/{response.json()["patient_id"]}")
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {'message': f'Patient successfully removed.'}
