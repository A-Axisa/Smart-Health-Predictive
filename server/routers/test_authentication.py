import pytest
from fastapi import status
from fastapi.testclient import TestClient

from . import authentication
from ..main import app
from ..utils.database import get_db 

client = TestClient(app)

@pytest.fixture(scope="session", autouse=True)
def setup_once_for_all_tests():
    credentials = {'username':'Testable User',
                   'password':'thisisavalidpassword',
                   'email': 'test@mymail.com',
                   'phone': '01189998819991197253',
                   'account_type': 1
                    }
    response = client.post('/register/', json=credentials)

def test_login_with_valid_credentials():
    credentials = {'email':'test@mymail.com', 'password':'thisisavalidpassword'}
    response = client.post('/login/', json=credentials)
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {'message': f'HTTP-Only cookie set successfully.'}

def test_login_with_incorrect_email():
    credentials = {'email':'notmyemail@mail.com', 'password':'thisisavalidpassword'}
    response = client.post('/login/', json=credentials)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {'detail':'Incorrect username or password'}

def test_login_with_incorrect_password():
    credentials = {'email':'test@mymail.com', 'password':'incorrectpassword'}
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
    credentials = {'email':'test@mymail.com', 'password':''}
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
    credentials = {'email':'test@mymail.com', 'password':None}
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
    user = authentication.get_user('test@mymail.com', next(get_db()))
    assert user.Email == 'test@mymail.com'

def test_get_user_not_in_database():
    user = authentication.get_user("", next(get_db()))
    assert user == None

def test_authenticate_user_success():
    result = authentication.authenticate_user('test@mymail.com', 'thisisavalidpassword', next(get_db()))
    assert result

def test_authentication_incorrect_email():
    result = authentication.authenticate_user('notmyemail@mail.com', 'thisisavalidpassword', next(get_db()))
    assert not result

def test_authentication_incorrect_password():
    result = authentication.authenticate_user('test@mymail.com', 'incorrectpassword', next(get_db()))
    assert not result

def test_authentication_incorrect_credentials():
    result = authentication.authenticate_user('notmyemail@mail.com', 'incorrectpassword', next(get_db()))
    assert not result

def test_authentication_empty_email():
    result = authentication.authenticate_user('', 'thisisavalidpassword', next(get_db()))
    assert not result

def test_authentication_empty_password():
    result = authentication.authenticate_user('test@mymail.com', '', next(get_db()))
    assert not result

def test_authentication_empty_password():
    result = authentication.authenticate_user('', '', next(get_db()))
    assert not result    

def test_authentication_no_email():
    result = authentication.authenticate_user(None, 'thisisavalidpassword', next(get_db()))
    assert not result

def test_authentication_no_password():
    with pytest.raises(AttributeError):
        authentication.authenticate_user('test@mymail.com', None, next(get_db()))
    
def test_authentication_no_credentials():
    result = authentication.authenticate_user(None, None, next(get_db()))
    assert not result

def test_get_current_user_success():
    credentials = {'email':'test@mymail.com', 'password':'thisisavalidpassword'}
    client.post('/login/', json=credentials)
    response = client.get('/user/me')
    assert response.status_code == status.HTTP_200_OK
    assert response.json()['email'] == 'test@mymail.com'
    
def test_get_current_user_no_cookie():
    credentials = {'email':'test@mymail.com', 'password':'thisisavalidpassword'}
    client.post('/login/', json=credentials)
    authentication.invalidate_access_token(credentials['email'], next(get_db()))
    response = client.get('/user/me')
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {'detail': 'Could not validate credentials'}

def test_logout_current_user():
    client.post('/logout/')
    response = client.get('/user/me')
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {'detail': 'Could not validate credentials'}

