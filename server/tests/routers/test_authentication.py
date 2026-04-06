import pytest
from fastapi import status
from fastapi.testclient import TestClient

from ...main import app
from ...models.dbmodels import UserAccount, UserAccountRole, \
    UserAccountValidationToken, PasswordResetToken
from ...routers.authentication import *
from ...utils.database import get_db

VALID_PASSWORD = 'thisisavalidpasswordA1!'

client = TestClient(app)


@pytest.fixture(scope="module", autouse=True)
def setup_once_for_all_tests():

    credentials = {
        'given_names': 'Testable',
        'family_name': 'User',
        'date_of_birth': '1980-05-24',
        'gender': 'Male',
        'password': VALID_PASSWORD,
        'email': 'test@example.com',
        'phone': '',
        'account_type': 'user',
        'clinic_id': None
    }
    response = client.post('/register/', json=credentials)

    yield  # Wait until all tests have finished.


def test_login_with_valid_credentials():
    credentials = {'email': 'test@example.com',
                   'password': VALID_PASSWORD}
    response = client.post('/login/', json=credentials)
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {'message': f'Successfully logged in.'}


def test_login_with_incorrect_email():
    credentials = {'email': 'notmyemail@mail.com',
                   'password': VALID_PASSWORD}
    response = client.post('/login/', json=credentials)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {'detail': 'Incorrect username or password'}


def test_login_with_incorrect_password():
    credentials = {'email': 'test@example.com',
                   'password': 'incorrectpassword'}
    response = client.post('/login/', json=credentials)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {'detail': 'Incorrect username or password'}


def test_login_with_incorrect_credentials():
    credentials = {'email': 'notmyemail@mail.com',
                   'password': 'incorrectpassword'}
    response = client.post('/login/', json=credentials)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {'detail': 'Incorrect username or password'}


def test_login_with_empty_username():
    credentials = {'email': '', 'password': VALID_PASSWORD}
    response = client.post('/login/', json=credentials)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {'detail': 'Incorrect username or password'}


def test_login_with_empty_password():
    credentials = {'email': 'test@example.com', 'password': ''}
    response = client.post('/login/', json=credentials)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {'detail': 'Incorrect username or password'}


def test_login_with_empty_credentials():
    credentials = {'email': '', 'password': ''}
    response = client.post('/login/', json=credentials)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {'detail': 'Incorrect username or password'}


def test_login_with_no_username():
    credentials = {'email': None, 'password': VALID_PASSWORD}
    response = client.post('/login/', json=credentials)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_login_with_no_password():
    credentials = {'email': 'test@example.com', 'password': None}
    response = client.post('/login/', json=credentials)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_login_with_no_credentials():
    credentials = {'email': None, 'password': None}
    response = client.post('/login/', json=credentials)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_sql_injection_password_bypass():
    credentials = {'email': "' or 1=1; --      ", 'password': ''}
    response = client.post('/login/', json=credentials)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {'detail': 'Incorrect username or password'}


def test_get_user_matching_email():
    user = get_user('test@example.com', next(get_db()))
    assert user.Email == 'test@example.com'


def test_get_user_not_in_database():
    user = get_user("", next(get_db()))
    assert user == None


def test_authenticate_user_success():
    result = authenticate_user(
        'test@example.com', VALID_PASSWORD, next(get_db()))
    assert result


def test_authentication_incorrect_email():
    result = authenticate_user(
        'notmyemail@mail.com', VALID_PASSWORD, next(get_db()))
    assert not result


def test_authentication_incorrect_password():
    result = authenticate_user(
        'test@example.com', 'incorrectpassword', next(get_db()))
    assert not result


def test_authentication_incorrect_credentials():
    result = authenticate_user(
        'notmyemail@mail.com', 'incorrectpassword', next(get_db()))
    assert not result


def test_authentication_empty_email():
    result = authenticate_user('', VALID_PASSWORD, next(get_db()))
    assert not result


def test_authentication_empty_password():
    result = authenticate_user('test@example.com', '', next(get_db()))
    assert not result


def test_authentication_empty_credentials():
    result = authenticate_user('', '', next(get_db()))
    assert not result


def test_authentication_no_email():
    result = authenticate_user(None, VALID_PASSWORD, next(get_db()))
    assert not result


def test_authentication_no_password():
    with pytest.raises(AttributeError):
        authenticate_user('test@example.com', None, next(get_db()))


def test_authentication_no_credentials():
    result = authenticate_user(None, None, next(get_db()))
    assert not result


def test_get_current_user_success():
    credentials = {'email': 'test@example.com',
                   'password': VALID_PASSWORD}
    client.post('/login/', json=credentials)
    response = client.get('/user/me')
    assert response.status_code == status.HTTP_200_OK
    assert response.json()['email'] == 'test@example.com'


def test_get_current_user_with_invalid_token():
    credentials = {'email': 'test@example.com',
                   'password': VALID_PASSWORD}
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
    credentials = {'email': 'test@example.com',
                   'password': VALID_PASSWORD}
    client.post('/login/', json=credentials)
    change_password = {'current_password': VALID_PASSWORD,
                       'new_password': 'thisIsSafer2#',
                       'confirm_new_password': 'thisIsSafer2#'}
    response = client.post('/changePassword/', json=change_password)
    assert response.json() == {
        'message': 'User successfully changed password.'}


def test_change_password_incorrect_current():
    credentials = {'email': 'test@example.com',
                   'password': VALID_PASSWORD}
    client.post('/login/', json=credentials)
    change_password = {'current_password': '123',
                       'new_password': 'thisIsSafer2#',
                       'confirm_new_password': 'thisIsSafer2#'}
    response = client.post('/changePassword/', json=change_password)
    assert response.json() == {'detail': 'Invalid password'}


def test_change_password_not_matching():
    credentials = {'email': 'test@example.com',
                   'password': VALID_PASSWORD}
    client.post('/login/', json=credentials)
    change_password = {'current_password': 'thisIsSafer2#',
                       'new_password': '123',
                       'confirm_new_password': '321'}
    response = client.post('/changePassword/', json=change_password)
    assert response.json() == {'detail': 'Invalid password'}


def test_phone_is_valid():
    assert is_formatted_phone_valid("5555550199")


def test_phone_contains_symbols():
    assert not is_formatted_phone_valid("(555) 555-0199")


def test_phone_starting_with_plus():
    assert not is_formatted_phone_valid("+5555550199")


def test_format_phone_number():
    assert format_phone_number("+(555) 555-0199") == ("5555550199")

class TestPasswordResetFlow():
    def test_successful_reset_password_flow(self):
        """Test the reset password flow from start to finish."""
        test_email = 'test@example.com'
        response = client.post('/forgotPassword', json={'email': 'test@example.com'})
        assert response.status_code == status.HTTP_200_OK, "Failed to request password reset."

        db_conn = next(get_db())
        user = db_conn.query(UserAccount).filter_by(Email=test_email).first()
        reset_pass_request = db_conn.query(PasswordResetToken).filter_by(UserID=user.UserID).first()
        login_cred = {
            'email': test_email,
            'password': 'thisIsSafer2#',
        }
        response = client.post("/login/", json=login_cred)
        assert response.status_code == status.HTTP_200_OK, "Failed to log in"

        client.post('/logout/')
        response = client.post("/passwordReset", json={
            'token': reset_pass_request.Token,
            'password': VALID_PASSWORD,
        })
        assert response.status_code == status.HTTP_200_OK, "Failed to reset password"

        response = client.post("/login/", json=login_cred)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED, "Succeeded to log in"

        login_cred['password'] = VALID_PASSWORD
        response = client.post("/login/", json=login_cred)
        assert response.status_code == status.HTTP_200_OK, "Failed to log in"

        client.post('/logout/')


    def test_request_pass_reset_for_missing_account(self):
        """Ensure no password reset tokens are generated for non-existent users in the system"""
        db_conn = next(get_db())
        init_token_amount = len(db_conn.query(PasswordResetToken).all())
        db_conn.close()

        response = client.post('/forgotPassword', json={'email': 'fake@example.com'})
        assert response.status_code == status.HTTP_200_OK, "Failed to request password reset."

        db_conn = next(get_db())
        end_token_amount = len(db_conn.query(PasswordResetToken).all())
        db_conn.close()
        assert init_token_amount == end_token_amount, "Amount of tokens has changed."


    def test_invalid_password_on_reset(self):
        """Ensure the password used on reset is valid."""
        test_email = 'test@example.com'
        response = client.post('/forgotPassword', json={'email': 'test@example.com'})
        assert response.status_code == status.HTTP_200_OK, "Failed to request password reset."

        db_conn = next(get_db())
        user = db_conn.query(UserAccount).filter_by(Email=test_email).first()
        passwordResetToken = db_conn.query(PasswordResetToken).filter_by(UserID=user.UserID).first()
        response = client.post("/passwordReset", json={
            'token': passwordResetToken.Token,
            'password': "password",
        })
        assert response.status_code == status.HTTP_200_OK, "Critical error"

        response = client.post("/login/", json={
            'email': 'test@example.com',
            'password': 'password',
        })
        assert response.status_code == status.HTTP_401_UNAUTHORIZED, "Succeeded to log in"


    def test_invalid_reset_token_(self):
        """Ensure that an account's password is not changed if the token is missing."""
        response = client.post("/passwordReset", json={
            'token': 'invalid_token_string',
            'password': 'Qa3zxW!45SdcE#ED1c',
        })
        assert response.status_code == status.HTTP_200_OK, "Could not process request"

        response = client.post("/login/", json={
            'email': 'test@example.com',
            'password': 'Qa3zxW!45SdcE#ED1c',
        })
        assert response.status_code == status.HTTP_401_UNAUTHORIZED, "Succeeded to log in"


    def test_multiple_reset_request_tokens(self):
        """Ensure that only one password reset token can exist for a user."""
        db_conn = next(get_db())
        user = db_conn.query(UserAccount).filter_by(Email='test@example.com').first()
        tokens = db_conn.query(PasswordResetToken).filter_by(UserID=user.UserID).all()
        assert len(tokens) == 0, "No token should currently exist for user"
        db_conn.close()

        response = client.post('/forgotPassword', json={'email': 'test@example.com'})
        assert response.status_code == status.HTTP_200_OK, "Failed to request password reset"
        db_conn = next(get_db())
        first_token = db_conn.query(PasswordResetToken).filter_by(UserID=user.UserID).all()
        assert len(first_token) == 1, "One token should exist for the user"
        db_conn.close()

        response = client.post('/forgotPassword', json={'email': 'test@example.com'})
        assert response.status_code == status.HTTP_200_OK, "Failed to request password reset"
        db_conn = next(get_db())
        second_token = db_conn.query(PasswordResetToken).filter_by(UserID=user.UserID).all()
        assert len(second_token) == 1, "Only one token should exist for the user"
        db_conn.close()
