import pytest
from fastapi import status
from fastapi.testclient import TestClient

from server.main import app

# 与 test_auth 一样，模块级共享一个 TestClient，保留 Cookie 会话
client = TestClient(app)


@pytest.fixture(scope="session", autouse=True)
def setup_once_for_all_tests():
    # 与 test_auth 保持一致的固定账号；若已存在，后端可能返回非 200，这里不做强断言
    credentials = {
        "username": "Test Delete",
        "password": "thisisavalidpassword",
        "email": "testdelete@mymail.com",
        "phone": "11111111112222",
        "account_type": 1,
    }
    client.post("/register/", json=credentials)


def test_delete_requires_authentication():
    fresh = TestClient(app)
    res = fresh.delete("/users/999999")
    assert res.status_code == status.HTTP_401_UNAUTHORIZED, res.text


def test_login_and_self_delete_like_auth_flow():
    credentials = {"email": "testdelete@mymail.com", "password": "thisisavalidpassword"}
    login_res = client.post("/login/", json=credentials)
    assert login_res.status_code == status.HTTP_200_OK, f"login failed: {login_res.status_code} {login_res.text}"

    me = client.get("/user/me")
    assert me.status_code == status.HTTP_200_OK, f"/user/me failed: {me.status_code} {me.text}"
    user_id = me.json()["id"]

    delete_res = client.delete(f"/users/{user_id}")
    assert delete_res.status_code == status.HTTP_200_OK, f"delete failed: {delete_res.status_code} {delete_res.text}"
    assert delete_res.json()["message"].startswith("User and all related data deleted successfully")
