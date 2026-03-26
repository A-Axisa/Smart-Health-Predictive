import os
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone, UTC
from secrets import token_urlsafe

import jwt
import phonenumbers
from email_validator import validate_email, EmailNotValidError
from fastapi import APIRouter, Depends, HTTPException, status, Request, \
    Response
from fastapi.responses import HTMLResponse
from jwt.exceptions import InvalidTokenError
from pwdlib import PasswordHash
from pwdlib.hashers.argon2 import Argon2Hasher
from pydantic import BaseModel
from sqlalchemy.orm import Session

from ..utils.database import get_db
from ..models.dbmodels import UserAccount, UserAccountRole, \
    UserAccountValidationToken, AccountRole, LogEventType
from ..utils.email_service import send_email
from ..utils.audit_log import write_audit_log

EMAIL_VALIDATION_ENABLED = False
ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 30
VALIDATION_TOKEN_LENGTH = 128
VALIDATION_EXPIRATION_IN_HOURS = 24
PASSWORD_MAX_LENGTH = 64
PASSWORD_MIN_LENGTH = 15
EMAIL_MAX_LENGTH = 255
NAME_MAX_LENGTH = 255
PHONE_MAX_LENGTH = 20
ACCOUNT_TYPE = {
    'user': 331928555,
    'merchant': 62809281
}
VALID_PASSWORD_SYMBOLS = "~!@#$%^&*()_+[]\{\}|:;,.?/"

class UserRegistrationDetails(BaseModel):
    username: str
    password: str
    email: str
    phone: str
    account_type: str


class LoginCredentials(BaseModel):
    email: str
    password: str


class TokenData(BaseModel):
    email: str
    ip_address: str
    version: int


class ChangePasswordDetails(BaseModel):
    current_password: str
    new_password: str
    confirm_new_password: str


load_dotenv()

router = APIRouter()
owasp_argon2_hasher = Argon2Hasher(
    memory_cost=19456,  # 19 MiB
    time_cost=2,
    parallelism=1,
)
password_hasher = PasswordHash((owasp_argon2_hasher,))


@router.post("/register")
async def register(user_reg: UserRegistrationDetails,
                   db_conn: Session = Depends(get_db)):
    '''Register a new account for the user provided the details are valid.'''

    formatted_phone = format_phone_number(user_reg.phone)

    # Ensure user inputs are valid.
    if (not is_email_valid(user_reg.email) or
            not is_password_valid(user_reg.password) or
            not is_name_valid(user_reg.username) or
            not is_formatted_phone_valid(user_reg.phone) or
            not is_role_valid(user_reg.account_type)):
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)

    password_hash = password_hasher.hash(user_reg.password)
    new_user = UserAccount(
        user_reg.username,
        user_reg.email,
        password_hash,
        formatted_phone
    )

    # Only add the user to the database of they don't exist.
    user = db_conn.query(UserAccount).filter_by(Email=user_reg.email).first()
    if not user:
        db_conn.add(new_user)

    # The user's ID is needed for to assign a role.
    new_user_id = db_conn.query(UserAccount.UserID). \
        filter_by(Email=user_reg.email).first()[0]
    role = UserAccountRole(ACCOUNT_TYPE[user_reg.account_type], new_user_id)

    # Require validation to confirm the user can access the email.
    validation_token = token_urlsafe(VALIDATION_TOKEN_LENGTH)
    expires_at = datetime.now(UTC) + \
        timedelta(hours=VALIDATION_EXPIRATION_IN_HOURS)
    acc_validation_token = UserAccountValidationToken(new_user_id,
                                                      validation_token,
                                                      expires_at)

    if not user:
        db_conn.add(role)
        db_conn.add(acc_validation_token)
        db_conn.commit()
        write_audit_log(db_conn,
                        eventType=LogEventType.REGISTRATION,
                        success=True,
                        userEmail=new_user.Email,
                        description="Successfully registered an account.")

        if EMAIL_VALIDATION_ENABLED:
            _send_validation_email(new_user, validation_token)
    else:
        db_conn.commit()

    return {'message': 'User successfully created.'}


def _send_validation_email(user: UserAccount, token: str):
    """Helper function to send a validation email."""
    validation_url = f"http://localhost:8000/validate-email?token={token}"
    email_subject = "Validate your account"
    email_content = f"""
    <html>
        <body>
            <h1>Welcome to Smart Health Predictive!</h1>
            <p>Please click the link below to validate your email address:</p>
            <a href="{validation_url}">{validation_url}</a>
        </body>
    </html>
    """
    send_email(
        recipient=user.Email,
        subject=email_subject,
        content=email_content,
        content_type="html"
    )


@router.get("/validate-email")
async def validate_email_address(token: str, db_conn: Session = Depends(get_db)):
    validation_failure_exception = HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Invalid or expired validation token."
    )

    # Find the token in the database
    validation_token_entry = db_conn.query(
        UserAccountValidationToken).filter_by(ValidationToken=token).first()

    # Check if the token exists
    if not validation_token_entry:
        raise validation_failure_exception

    # Check if the token has expired
    if validation_token_entry.ExpiresAt < datetime.utcnow():
        raise validation_failure_exception

    # Get the user associated with the token
    user = db_conn.query(UserAccount).filter_by(
        UserID=validation_token_entry.UserID).first()
    if not user:
        # This should not happen if database integrity is maintained
        raise validation_failure_exception

    # Update the user's validation status
    user.IsValidated = True

    # Optionally, delete the token after use
    db_conn.delete(validation_token_entry)

    db_conn.commit()
    
    write_audit_log(db_conn,
                    eventType=LogEventType.EMAIL_VALIDATION,
                    success=True,
                    userEmail=user.Email,
                    description=f"Email successfully validated.")

    html_content = """
    <html>
        <head>
            <title>Email Validation</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
                .container { display: inline-block; text-align: left; padding: 20px; border: 1px solid #ccc; border-radius: 10px; }
                h1 { color: #127067; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Email Validated Successfully!</h1>
                <p>Your email has been successfully validated. You can now close this window and log in to your account.</p>
            </div>
        </body>
    </html>
    """
    return HTMLResponse(content=html_content)


@router.post('/login')
async def login(request: Request, response: Response, user_cred: LoginCredentials, 
                db_conn: Session = Depends(get_db)):
    '''Authenticates a user with the credentials and provides an access token.'''

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail='Incorrect username or password',
    )

    # Ensure user inputs are valid.
    if len(user_cred.password) < 1 or \
            not is_email_valid(user_cred.email):
        raise credentials_exception

    user = authenticate_user(user_cred.email, user_cred.password, db_conn)
    if not user:
        # Log failed login attempts.
        write_audit_log(db_conn,
                        eventType=LogEventType.LOGIN,
                        success=False,
                        userEmail=user.Email,
                        device=request.headers.get("user-agent"),
                        ipAddress=request.client.host,
                        description="Login failed with incorrect credentials.")
        raise credentials_exception

    # Invalidate previous access token.
    user.TokenVersion += 1
    db_conn.commit()

    # Provide the user a new access token.
    expiration = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    data = {
        'sub': user.Email,
        'ip_address': request.client.host,
        'version': user.TokenVersion
    }
    token = create_access_token(data, expiration)

    response.set_cookie(
        key='auth_token',
        value=token,
        httponly=True,
        secure=False,  # Set to false for development
        samesite='Strict'
    )
    write_audit_log(db_conn,
                    eventType=LogEventType.LOGIN,
                    success=True,
                    userEmail=user.Email,
                    device=request.headers.get("user-agent"),
                    ipAddress=request.client.host,
                    description=f"Successful login attempt.")

    return {'message': 'Successfully logged in.'}


def authenticate_user(email: str, password: str, db_conn: Session):
    '''Authenticates a user from the provided email and password.'''
    user = db_conn.query(UserAccount).filter_by(Email=email).first()
    if not user:
        return False

    if EMAIL_VALIDATION_ENABLED and not user.IsValidated:
        return False

    if not verify_password(password, user.PasswordHash):
        return False
    return user


def verify_password(password_text: str, password_hash: str) -> bool:
    '''Verifies a given password matches with a password hash.'''
    return password_hasher.verify(password_text, password_hash)


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    '''Returns JWT containing the access token with the given data.'''
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=10)
    to_encode.update({'exp': expire})

    return jwt.encode(to_encode, os.environ['SECRET_KEY'], algorithm=ALGORITHM)


@router.get('/user/me')
async def get_user_me(request: Request, db_conn: Session = Depends(get_db)):
    '''Endpoint for retrieving the currently active user on a device.'''
    return get_current_user(request, db_conn)


def get_current_user(request: Request, db_conn: Session):
    '''Returns user information from the http-only cookie on their device.'''
    
    # Prepare an exception for invalid or missing credentials.
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail='Could not validate credentials'
    )

    token = request.cookies.get('auth_token')
    if token is None:
        raise credentials_exception

    # Extract the data from the jwt token.
    try:
        payload = jwt.decode(
            token, os.environ['SECRET_KEY'], algorithms=[ALGORITHM])
        token_data = TokenData(
            email=payload.get('sub'),
            ip_address=payload.get('ip_address'),
            version=payload.get('version')
        )
        if token_data.email is None or not \
                token_data.ip_address == request.client.host:
            raise credentials_exception

    except InvalidTokenError as exc:
        raise credentials_exception from exc

    # Retrieve the user from the database
    user = get_user(token_data.email, db_conn)
    if not user.TokenVersion == token_data.version:
        raise credentials_exception

    if user is None:
        raise credentials_exception

     # Retrieve user role form the DB
    user_role = get_user_role(user.Email, db_conn)
    if user_role is None:
        raise credentials_exception

    return {
        'name': user.FullName,
        'email': user.Email,
        'role': user_role
    }


def get_user(email: str, db_conn: Session):
    '''Returns user account details from the database using an email.'''
    return db_conn.query(UserAccount).filter_by(Email=email).first()


def get_user_role(email: str, db_conn: Session):
    '''Returns the role for a given a user by email.'''
    user_role = (db_conn.query(AccountRole.RoleName)
                 .join(UserAccountRole, UserAccountRole.RoleID == AccountRole.RoleID)
                 .join(UserAccount, UserAccount.UserID == UserAccountRole.UserID)
                 .filter(UserAccount.Email == email)
                 .first())
    return user_role[0]


@router.post('/logout')
def logout_current_user(request: Request, response: Response, db_conn: Session = Depends(get_db)):
    '''Deletes the user cookie and invalidates their access token.'''
    user = get_current_user(request, db_conn)
    invalidate_access_token(user['email'], db_conn)

    response.delete_cookie(
        key='auth_token',
        httponly=True,
        secure=False,  # Set to false for development
        samesite='Strict'
    )


def invalidate_access_token(email: str, db_conn: Session):
    '''Increase the user's token version number.'''
    user = db_conn.query(UserAccount).filter_by(Email=email).first()
    user.TokenVersion += 1
    db_conn.commit()


def is_password_valid(password: str):
    '''Verifies the password follows policy rules.'''

    contains_lower = any(c.islower() for c in password)
    contains_upper = any(c.isupper() for c in password)
    contains_number = any(c.isnumeric() for c in password)
    contains_symbol = any(char in VALID_PASSWORD_SYMBOLS for char in password)
    valid_length = len(password) <= PASSWORD_MAX_LENGTH and \
        len(password) >= PASSWORD_MIN_LENGTH

    return contains_lower \
        and contains_upper \
        and contains_number \
        and contains_symbol \
        and valid_length


def is_email_valid(email: str):
    '''Verifies a password follow the pattern xxx@xxx.xxx.'''
    if not email:
        return False
    try:
        validate_email(email, check_deliverability=False)
    except EmailNotValidError:
        return False
    return len(email) < EMAIL_MAX_LENGTH


def format_phone_number(phone: str):
    '''Removes spaces, hyphens, and brackets from a phone number string'''
    return phone.replace('-', '').replace(' ', ''). \
        replace('(', '').replace(')', '')


def is_formatted_phone_valid(phone: str):
    '''Verifies a phone number is empty or a valid number.'''
    if phone == '':
        return True

    # Only allow for numbers after the plus sign.
    if not phone[1:].isalpha:
        return False
    try:
        phonenumbers.parse(phone)
    except phonenumbers.NumberParseException:
        return False
    return True


def is_name_valid(name: str):
    '''Verifies a name is valid.'''
    return name is not None or len(name) <= NAME_MAX_LENGTH



def is_role_valid(role: str):
    '''Verifies the role is valid for registration.'''
    return role in ACCOUNT_TYPE.keys()


@router.post('/changePassword')
def change_password_current_user(password_details: ChangePasswordDetails, request: Request, db_conn: Session = Depends(get_db)):
    # Retrieve current user data
    user_email = get_current_user(request, db_conn)
    user = get_user(user_email["email"], db_conn)

    # Check the password is correct
    if not verify_password(password_details.current_password, user.PasswordHash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid password")
    # Check the new password is confirmed correct
    if password_details.new_password != password_details.confirm_new_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid password")

    # Hash password
    new_password_hash = password_hasher.hash(
        password_details.new_password.encode('utf-8'))

    # Change current password to new password
    user.PasswordHash = new_password_hash
    db_conn.commit()
    write_audit_log(db_conn,
                    eventType=LogEventType.PASSWORD_CHANGE,
                    success=True,
                    userEmail=user_email["email"],
                    device=request.headers.get("user-agent"),
                    ipAddress=request.client.host,
                    description=f"Password successfully changed.")

    return {'message': 'User successfully changed password.'}
