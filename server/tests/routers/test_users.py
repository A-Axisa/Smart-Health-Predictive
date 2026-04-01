import pytest
from fastapi import status
from fastapi.testclient import TestClient

from server.main import app

from ... models.dbmodels import HealthData, AuditLog, LogEventType
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
