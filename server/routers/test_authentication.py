import pytest
from fastapi import status
from fastapi.testclient import TestClient

from . import authentication
from ..main import app
from ..utils.database import get_db 

client = TestClient(app)

def test_login_with_valid_credentials():
    credentials = {'email':'Mock@Mail.com', 'password':'qwerty'}
    response = client.post('/login/', json=credentials)
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {'message': f'HTTP-Only cookie set successfully.'}

def test_login_with_incorrect_email():
    credentials = {'email':'notmyemail', 'password':'qwerty'}
    response = client.post('/login/', json=credentials)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {'detail':'Incorrect username or password'}

def test_login_with_incorrect_password():
    credentials = {'email':'Mock@Mail.com', 'password':'notmypassword'}
    response = client.post('/login/', json=credentials)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {'detail':'Incorrect username or password'}

def test_login_with_incorrect_credentials():
    credentials = {'email':'notmyemail', 'password':'notmypassword'}
    response = client.post('/login/', json=credentials)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {'detail':'Incorrect username or password'}

def test_login_with_empty_username():
    credentials = {'email':'', 'password':'password'}
    response = client.post('/login/', json=credentials)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {'detail':'Incorrect username or password'}

def test_login_with_empty_password():
    credentials = {'email':'Mock@Mail.com', 'password':''}
    response = client.post('/login/', json=credentials)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {'detail':'Incorrect username or password'}

def test_login_with_empty_credentials():
    credentials = {'email':'', 'password':''}
    response = client.post('/login/', json=credentials)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {'detail':'Incorrect username or password'}

def test_login_with_no_username():
    credentials = {'email':None, 'password':'password'}
    response = client.post('/login/', json=credentials)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

def test_login_with_no_password():
    credentials = {'email':'Mock@Mail.com', 'password':None}
    response = client.post('/login/', json=credentials)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

def test_login_with_no_credentials():
    credentials = {'email':None, 'password':None}
    response = client.post('/login/', json=credentials)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

def test_sql_injection_password_bypass():
    credentials = {'email':"' or 1=1; --", 'password':''}
    response = client.post('/login/', json=credentials)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {'detail':'Incorrect username or password'}

def test_get_user_matching_email():
    user = authentication.get_user('Mock@Mail.com', next(get_db()))
    assert user.Email == 'Mock@Mail.com'

def test_get_user_not_in_database():
    user = authentication.get_user("", next(get_db()))
    assert user == None

def test_authenticate_user_success():
    result = authentication.authenticate_user('Mock@Mail.com', 'qwerty', next(get_db()))
    assert result

def test_authentication_incorrect_email():
    result = authentication.authenticate_user('notmyemail', 'qwerty', next(get_db()))
    assert not result

def test_authentication_incorrect_password():
    result = authentication.authenticate_user('Mock@Mail.com', 'notmypassword', next(get_db()))
    assert not result

def test_authentication_incorrect_credentials():
    result = authentication.authenticate_user('notmyemail', 'notmypassword', next(get_db()))
    assert not result

def test_authentication_empty_email():
    result = authentication.authenticate_user('', 'qwerty', next(get_db()))
    assert not result

def test_authentication_empty_password():
    result = authentication.authenticate_user('Mock@Mail.com', '', next(get_db()))
    assert not result

def test_authentication_empty_password():
    result = authentication.authenticate_user('', '', next(get_db()))
    assert not result    

def test_authentication_no_email():
    result = authentication.authenticate_user(None, 'qwerty', next(get_db()))
    assert not result

def test_authentication_no_password():
    with pytest.raises(AttributeError):
        authentication.authenticate_user('Mock@Mail.com', None, next(get_db()))
    
def test_authentication_no_credentials():
    result = authentication.authenticate_user(None, None, next(get_db()))
    assert not result

def test_get_current_user_success():
    credentials = {'email':'Mock@Mail.com', 'password':'qwerty'}
    client.post('/login/', json=credentials)
    response = client.get('/user/me')
    assert response.status_code == status.HTTP_200_OK
    assert response.json()['Email'] == 'Mock@Mail.com'
    
