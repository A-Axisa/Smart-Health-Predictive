import pytest
from fastapi import status
from fastapi.testclient import TestClient

from server.main import app

client = TestClient(app)

@pytest.fixture(scope="session", autouse=True)
def setup_once_for_all_tests():
    # Similar to test_auth
    credentials = {
        "username": "Test Delete",
        "password": "thisisavalidpasswordA1!",
        "email": "testdelete@mymail.com",
        "phone": "",
        "account_type": "user",
    }
    client.post("/register/", json=credentials)

def test_admin_can_delete_user():
    # 1. Create a new user to be deleted
    user_to_delete_email = "user.to.be.deleted.by.admin@example.com"
    user_to_delete_credentials = {
        "username": "User ToBeDeleted",
        "password": "password123456789A2$",
        "email": user_to_delete_email,
        "phone": "",
        "account_type": "user",
    }
    register_res = client.post("/register/", json=user_to_delete_credentials)
    assert register_res.status_code == status.HTTP_200_OK, f"Failed to create user for deletion test: {register_res.text}"

    # 2. Login as admin
    admin_client = TestClient(app)
    admin_credentials = {"email": "SHP_Admin@example.com",
                         "password": "password12345678"}
    login_res = admin_client.post("/login/", json=admin_credentials)
    assert login_res.status_code == status.HTTP_200_OK, f"Admin login failed: {login_res.text}"

    # 3. Get the user ID of the new user
    users_res = admin_client.get("/users/")
    assert users_res.status_code == status.HTTP_200_OK
    users = users_res.json()
    user_found = any(user['email'] == user_to_delete_email for user in users)
    assert user_found, f"Could not find user {user_to_delete_email} to delete."

    # 4. Admin deletes the user
    delete_res = admin_client.delete(f"/users/{user_to_delete_email}")
    assert delete_res.status_code == status.HTTP_200_OK, f"Admin failed to delete user: {delete_res.text}"

    # 5. Verify the response
    response_json = delete_res.json()
    assert "message" in response_json
    assert "deletion_report" in response_json
    assert response_json["message"].startswith(
        f"User with Email {user_to_delete_email} and all related data deleted successfully")
    assert response_json["deletion_report"]["users_deleted"] == 1

    # 6. Verify the user is actually deleted
    users_res_after_delete = admin_client.get("/users/")
    assert users_res_after_delete.status_code == status.HTTP_200_OK
    users_after_delete = users_res_after_delete.json()
    user_found = any(
        user['email'] == user_to_delete_email for user in users_after_delete)
    assert not user_found, f"User with email {user_to_delete_email} was found in the user list after deletion."
