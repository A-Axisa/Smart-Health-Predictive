import pytest
from fastapi import status
from fastapi.testclient import TestClient

from ...main import app
from ...models.dbmodels import UserAccount, UserAccountRole, \
    UserAccountValidationToken
from ...routers.authentication import *
from ...utils.database import get_db

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_once_for_all_tests():
    db_conn = next(get_db())

    # Delete the test account if it exists to prepare for test 
    prev_account = db_conn.query(UserAccount).filter_by(Email="test@example.com").first()
    if prev_account:
        user_id = prev_account.UserID

        # Delete user data from tables using user ID as a FK
        db_conn.query(UserAccountValidationToken) \
            .filter(UserAccountValidationToken.UserID == user_id) \
            .delete(synchronize_session=False)
        db_conn.query(UserAccountRole) \
            .filter(UserAccountRole.UserID == user_id) \
            .delete(synchronize_session=False)

        # Delete user account
        db_conn.delete(prev_account)
        db_conn.commit()
        
    credentials = {
        'username':'Testable User',
        'password':'thisisavalidpassword',
        'email': 'test@example.com',
        'phone': '',
        'account_type': 'user'
    }
    response = client.post('/register/', json=credentials)

    yield # Wait until all tests have finished.

    # Perform clean-up after all tests.
    # Remove the test user.
    user = db_conn.query(UserAccount).filter_by(Email="test@example.com").first()
    if user:
        db_conn.query(UserAccountValidationToken) \
            .filter(UserAccountValidationToken.UserID == user.UserID) \
            .delete(synchronize_session=False)
        db_conn.query(UserAccountRole). \
            filter(UserAccountRole.UserID == user.UserID). \
            delete(synchronize_session=False)
        db_conn.delete(user)
        db_conn.commit()     


def test_login_with_valid_credentials():
    credentials = {'email':'test@example.com', 'password':'thisisavalidpassword'}
    response = client.post('/login/', json=credentials)
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {'message': f'Successfully logged in.'}


def test_login_with_incorrect_email():
    credentials = {'email':'notmyemail@mail.com', 'password':'thisisavalidpassword'}
    response = client.post('/login/', json=credentials)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {'detail':'Incorrect username or password'}


def test_login_with_incorrect_password():
    credentials = {'email':'test@example.com', 'password':'incorrectpassword'}
    response = client.post('/login/', json=credentials)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {'detail':'Incorrect username or password'}


def test_login_with_incorrect_credentials():
    credentials = {'email':'notmyemail@mail.com', 'password':'incorrectpassword'}
    response = client.post('/login/', json=credentials)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {'detail':'Incorrect username or password'}


def test_login_with_empty_username():
    credentials = {'email':'', 'password':'thisisavalidpassword'}
    response = client.post('/login/', json=credentials)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {'detail':'Incorrect username or password'}


def test_login_with_empty_password():
    credentials = {'email':'test@example.com', 'password':''}
    response = client.post('/login/', json=credentials)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {'detail':'Incorrect username or password'}


def test_login_with_empty_credentials():
    credentials = {'email':'', 'password':''}
    response = client.post('/login/', json=credentials)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {'detail':'Incorrect username or password'}


def test_login_with_no_username():
    credentials = {'email':None, 'password':'thisisavalidpassword'}
    response = client.post('/login/', json=credentials)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_login_with_no_password():
    credentials = {'email':'test@example.com', 'password':None}
    response = client.post('/login/', json=credentials)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_login_with_no_credentials():
    credentials = {'email':None, 'password':None}
    response = client.post('/login/', json=credentials)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_sql_injection_password_bypass():
    credentials = {'email':"' or 1=1; --      ", 'password':''}
    response = client.post('/login/', json=credentials)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {'detail':'Incorrect username or password'}


def test_get_user_matching_email():
    user = get_user('test@example.com', next(get_db()))
    assert user.Email == 'test@example.com'


def test_get_user_not_in_database():
    user = get_user("", next(get_db()))
    assert user == None


def test_authenticate_user_success():
    result = authenticate_user('test@example.com', 'thisisavalidpassword', next(get_db()))
    assert result


def test_authentication_incorrect_email():
    result = authenticate_user('notmyemail@mail.com', 'thisisavalidpassword', next(get_db()))
    assert not result


def test_authentication_incorrect_password():
    result = authenticate_user('test@example.com', 'incorrectpassword', next(get_db()))
    assert not result


def test_authentication_incorrect_credentials():
    result = authenticate_user('notmyemail@mail.com', 'incorrectpassword', next(get_db()))
    assert not result


def test_authentication_empty_email():
    result = authenticate_user('', 'thisisavalidpassword', next(get_db()))
    assert not result


def test_authentication_empty_password():
    result = authenticate_user('test@example.com', '', next(get_db()))
    assert not result


def test_authentication_empty_credentials():
    result = authenticate_user('', '', next(get_db()))
    assert not result    


def test_authentication_no_email():
    result = authenticate_user(None, 'thisisavalidpassword', next(get_db()))
    assert not result


def test_authentication_no_password():
    with pytest.raises(AttributeError):
        authenticate_user('test@example.com', None, next(get_db()))


def test_authentication_no_credentials():
    result = authenticate_user(None, None, next(get_db()))
    assert not result


def test_get_current_user_success():
    credentials = {'email':'test@example.com', 'password':'thisisavalidpassword'}
    client.post('/login/', json=credentials)
    response = client.get('/user/me')
    assert response.status_code == status.HTTP_200_OK
    assert response.json()['email'] == 'test@example.com'


def test_get_current_user_with_invalid_token():
    credentials = {'email':'test@example.com', 'password':'thisisavalidpassword'}
    client.post('/login/', json=credentials)
    invalidate_access_token(credentials['email'], next(get_db()))
    response = client.get('/user/me')
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {'detail': 'Could not validate credentials'}


def test_logout_current_user():
    client.post('/logout/')
    response = client.get('/user/me')
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {'detail': 'Could not validate credentials'}


def test_valid_password():
    result = is_password_valid('Amf0fFKp_43rQv$3')
    assert result


def test_password_too_long():
    result = is_password_valid(
        'Amf0fFKp_43rQv$3L$M^mEG;ag;aejp5mpjiga;oigaA$W$?gw?GhawH<whhaA463_)es2')
    assert not result


def test_valid_email():
    result = is_email_valid("newemail@test.com")
    assert result


def test_validate_none_email():
    result = is_email_valid(None)
    assert not result


def test_validate_empty_email():
    result = is_email_valid("")
    assert not result


def test_change_password():
    credentials = {'email':'test@example.com', 'password':'thisisavalidpassword'}
    client.post('/login/', json=credentials)
    change_password = {'current_password':'thisisavalidpassword',
                       'new_password':'thisIsSafer',
                       'confirm_new_password':'thisIsSafer' }
    response = client.post('/changePassword/',json=change_password)
    assert response.json() == {'message': 'User successfully changed password.'}


def test_change_password_incorrect_current():
    credentials = {'email':'test@example.com', 'password':'thisisavalidpassword'}
    client.post('/login/', json=credentials)
    change_password = {'current_password':'123',
                       'new_password':'thisIsSafer',
                       'confirm_new_password':'thisIsSafer' }
    response = client.post('/changePassword/',json=change_password)
    assert response.json() == {'detail' : 'Invalid password'}


def test_change_password_not_matching():
    credentials = {'email':'test@example.com', 'password':'thisisavalidpassword'}
    client.post('/login/', json=credentials)
    change_password = {'current_password':'thisIsSafer',
                       'new_password':'123',
                       'confirm_new_password':'321' }
    response = client.post('/changePassword/',json=change_password)
    assert response.json() == {'detail' : 'Invalid password'}
