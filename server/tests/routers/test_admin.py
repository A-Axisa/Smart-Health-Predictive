import pytest
from fastapi import status
from fastapi.testclient import TestClient

from server.main import app
from server.utils.database import get_db
from server.models.dbmodels import AuditLog, LogEventType

client = TestClient(app)


@pytest.fixture(scope="session", autouse=True)
def setup_once_for_all_tests():
    # Similar to test_auth
    credentials = {
        'given_names': 'Testable',
        'family_name': 'User',
        'date_of_birth': '1980-05-24',
        'gender': 'Male',
        'password': 'thisisavalidpasswordA1!',
        'email': 'test@example.com',
        'phone': '',
        'account_type': 'user'
    }
    client.post("/register/", json=credentials)


def test_admin_can_delete_user():
    # 1. Create a new user to be deleted
    user_to_delete_email = "user.to.be.deleted.by.admin@example.com"
    user_to_delete_credentials = {
        "given_names": "User ToBeDeleted",
        "family_name": "",
        "date_of_birth": "1980-05-24",
        "gender": "Male",
        "password": "password123456789A2@",
        "email": user_to_delete_email,
        "phone": "",
        "account_type": "user"
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
    users_res = admin_client.get("/users")
    assert users_res.status_code == status.HTTP_200_OK
    users_payload = users_res.json()
    users = users_payload["users"]
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
    users_res_after_delete = admin_client.get("/users")
    assert users_res_after_delete.status_code == status.HTTP_200_OK
    users_after_delete_payload = users_res_after_delete.json()
    users_after_delete = users_after_delete_payload["users"]
    user_found = any(
        user['email'] == user_to_delete_email for user in users_after_delete)
    assert not user_found, f"User with email {user_to_delete_email} was found in the user list after deletion."


def test_role_change_writes_audit_log():
    user_email = "role.change.audit@example.com"
    credentials = {
        "given_names": "Role",
        "family_name": "Target",
        "date_of_birth": "1980-05-24",
        "gender": "Male",
        "password": "password123456789A2@",
        "email": user_email,
        "phone": "",
        "account_type": "user"
    }
    register_res = client.post("/register/", json=credentials)
    assert register_res.status_code == status.HTTP_200_OK

    admin_client = TestClient(app)
    login_res = admin_client.post("/login/", json={"email": "SHP_Admin@example.com", "password": "password12345678"})
    assert login_res.status_code == status.HTTP_200_OK

    roles_res = admin_client.get("/roles")
    assert roles_res.status_code == status.HTTP_200_OK
    roles = roles_res.json()
    standard_user_role = next((role for role in roles if role["name"] == "standard_user"), None)
    assert standard_user_role is not None

    update_res = admin_client.patch(f"/users/{user_email}/roles/{standard_user_role['id']}")
    assert update_res.status_code == status.HTTP_200_OK

    db_conn = next(get_db())
    log = (
        db_conn.query(AuditLog)
        .filter(AuditLog.EventType == LogEventType.ROLE_CHANGED.value)
        .filter(AuditLog.Description.ilike(f"%{user_email}%"))
        .order_by(AuditLog.LogID.desc())
        .first()
    )
    assert log is not None
    assert log.Success is True
    assert log.UserEmail == "SHP_Admin@example.com"

    cleanup_res = admin_client.delete(f"/users/{user_email}")
    assert cleanup_res.status_code == status.HTTP_200_OK


def test_admin_users_supports_search_query():
    user_email = "search.query.target@example.com"
    credentials = {
        "given_names": "Searchable",
        "family_name": "Target",
        "date_of_birth": "1980-05-24",
        "gender": "Male",
        "password": "password123456789A2@",
        "email": user_email,
        "phone": "",
        "account_type": "user"
    }
    register_res = client.post("/register/", json=credentials)
    assert register_res.status_code == status.HTTP_200_OK

    admin_client = TestClient(app)
    login_res = admin_client.post("/login/", json={"email": "SHP_Admin@example.com", "password": "password12345678"})
    assert login_res.status_code == status.HTTP_200_OK

    users_res = admin_client.get("/users", params={"search": "search.query.target", "skip": 0, "limit": 50})
    assert users_res.status_code == status.HTTP_200_OK
    payload = users_res.json()
    assert "users" in payload
    assert "total" in payload
    assert any(user["email"] == user_email for user in payload["users"])

    cleanup_res = admin_client.delete(f"/users/{user_email}")
    assert cleanup_res.status_code == status.HTTP_200_OK


def test_non_admin_delete_attempt_writes_failed_audit_log():
    attacker_email = "audit.attacker@example.com"
    victim_email = "audit.victim@example.com"

    for email in [attacker_email, victim_email]:
        register_res = client.post("/register/", json={
            "given_names": "Audit",
            "family_name": "User",
            "date_of_birth": "1980-05-24",
            "gender": "Male",
            "password": "password123456789A2@",
            "email": email,
            "phone": "",
            "account_type": "user"
        })
        assert register_res.status_code == status.HTTP_200_OK

    non_admin_client = TestClient(app)
    login_res = non_admin_client.post("/login/", json={"email": attacker_email, "password": "password123456789A2@"})
    assert login_res.status_code == status.HTTP_200_OK

    delete_res = non_admin_client.delete(f"/users/{victim_email}")
    assert delete_res.status_code == status.HTTP_403_FORBIDDEN

    db_conn = next(get_db())
    log = (
        db_conn.query(AuditLog)
        .filter(AuditLog.EventType == LogEventType.ACCOUNT_DELETED.value)
        .filter(AuditLog.Success == False)
        .filter(AuditLog.UserEmail == attacker_email)
        .order_by(AuditLog.LogID.desc())
        .first()
    )
    assert log is not None
    assert "Unauthorized delete attempt" in (log.Description or "")

    admin_client = TestClient(app)
    admin_login = admin_client.post("/login/", json={"email": "SHP_Admin@example.com", "password": "password12345678"})
    assert admin_login.status_code == status.HTTP_200_OK
    assert admin_client.delete(f"/users/{attacker_email}").status_code == status.HTTP_200_OK
    assert admin_client.delete(f"/users/{victim_email}").status_code == status.HTTP_200_OK
