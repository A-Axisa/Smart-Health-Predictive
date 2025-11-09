import pytest
from fastapi import status, Depends
from fastapi.testclient import TestClient
from ..models.dbmodels import HealthData
from ..main import app
from ..utils.database import get_db

client = TestClient(app)


@pytest.fixture(scope="session", autouse=True)
def setup_once_for_all_tests():
    testHealthData = {
        "userId": 1,
        "age": 35,
        "weight": 70,
        "height": 1.70,
        "gender": 1,
        "bloodGlucose": 95,
        "ap_hi": 120,
        "ap_lo": 80,
        "highCholesterol": 0,
        "exercise": 1,
        "hyperTension": 0,
        "heartDisease": 0,
        "diabetes": 0,
        "alcohol": 1,
        "smoker": 0,
        "maritalStatus": 1,
        "workingStatus": 1,
        "merchantID": None
    }

    client.post("/healthPrediction/", json=testHealthData)
    # Return the testHeatlhData to use in tests
    yield testHealthData


def test_get_data(setup_once_for_all_tests):
    testHealthData = setup_once_for_all_tests
    db_conn = next(get_db())
    healthDataID = db_conn.query(HealthData.HealthDataID).order_by(
        HealthData.HealthDataID.desc()).first()[0]

    response = client.get(f"/reportData/{healthDataID}")

    healthData = response.json()
    print(healthData)
    # Check the returned data matched the health data we used to create a prediction
    assert healthData["age"] == testHealthData["age"]
    assert float(healthData["weight"]) == testHealthData["weight"]
    assert float(healthData["height"]) == testHealthData["height"]
    assert healthData["gender"] == testHealthData["gender"]
    assert float(healthData["bloodGlucose"]) == testHealthData["bloodGlucose"]
    assert float(healthData["ap_hi"]) == testHealthData["ap_hi"]
    assert float(healthData["ap_lo"]) == testHealthData["ap_lo"]
    assert healthData["highCholesterol"] == testHealthData["highCholesterol"]
    assert healthData["exercise"] == testHealthData["exercise"]
    assert healthData["hyperTension"] == testHealthData["hyperTension"]
    assert healthData["heartDisease"] == testHealthData["heartDisease"]
    assert healthData["diabetes"] == testHealthData["diabetes"]
    assert healthData["alcohol"] == testHealthData["alcohol"]
    assert healthData["smoker"] == testHealthData["smoker"]
    assert healthData["maritalStatus"] == testHealthData["maritalStatus"]
    assert healthData["workingStatus"] == testHealthData["workingStatus"]


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
