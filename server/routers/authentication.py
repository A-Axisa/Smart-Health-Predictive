import os
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone
from secrets import token_urlsafe

import bcrypt
import jwt
from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from jwt.exceptions import InvalidTokenError
from pydantic import BaseModel
from sqlalchemy.orm import Session

from ..utils.database import get_db 
from ..models.dbmodels import UserAccount, UserAccountRole, UserAccountValidationToken

ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 30
STANDARD_ACCOUNT_ROLE_ID = 1
MERCHANT_ACCOUNT_ROLE_ID = 3
VALIDATION_TOKEN_LENGTH = 128
VALIDATION_EXPIRATION_IN_HOURS = 24

class UserRegistrationDetails(BaseModel):
    username: str
    password: str
    email: str
    phone: str
    account_type: int

class LoginCredentials(BaseModel):
    email: str
    password: str

class TokenData(BaseModel):
    email: str
    ip_address: str
    version: int

load_dotenv()

router = APIRouter()

@router.post("/register")
async def register(user_reg: UserRegistrationDetails, \
                   db_conn: Session = Depends(get_db)):

    # Always hash the password to obfuscate success and failure.
    password_hash = bcrypt.hashpw(user_reg.password.encode('utf-8'), \
                                  bcrypt.gensalt(rounds=15))
    new_user = UserAccount(
        user_reg.username,
        user_reg.email,
        password_hash,
        user_reg.phone
    )

    # Add the user if the email doesn't already exist.
    user = db_conn.query(UserAccount).filter_by(Email=user_reg.email).first()
    if not user:        
        db_conn.add(new_user)

    # Confirm the account type.
    if user_reg.account_type != STANDARD_ACCOUNT_ROLE_ID and \
        user_reg.account_type != MERCHANT_ACCOUNT_ROLE_ID:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail='No such role exists',
        )

    # Get the ID of the new user
    new_user_id = db_conn.query(UserAccount.UserID). \
        filter_by(Email=user_reg.email).first()[0]
    role = UserAccountRole(user_reg.account_type, new_user_id)

    # Create account validation token
    validation_token = token_urlsafe(VALIDATION_TOKEN_LENGTH)
    expires_at = datetime.now(timezone.utc) + \
        timedelta(hours=VALIDATION_EXPIRATION_IN_HOURS)
    acc_validation_token = UserAccountValidationToken(new_user_id, \
                                                      validation_token,
                                                        expires_at)

    # Add the role and validation token if the user is new.
    if not user:
        db_conn.add(role)
        db_conn.add(acc_validation_token)

    db_conn.commit()

    return {'message': 'User successfully created.'}

@router.post('/login')
async def login(request: Request, response: Response, user_cred: LoginCredentials, db_conn: Session = Depends(get_db)):
    user = authenticate_user(user_cred.email, user_cred.password, db_conn)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Incorrect username or password',
        )

    # Update the token version number in the db.
    user.TokenVersion += 1
    db_conn.commit()

    # Create the jwt token
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
        secure=False, # Set to false for development
        samesite='Strict'
    )

    return {'message': f'HTTP-Only cookie set successfully.'}

def authenticate_user(email: str, password: str, db_conn: Session):
    user = db_conn.query(UserAccount).filter_by(Email=email).first()
    if not user:
        return False
    if not verify_password(password, user.PasswordHash):
        return False
    return user

def verify_password(password_text: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password_text.encode('utf-8'), password_hash.encode('utf-8'))

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=10)
    to_encode.update({'exp':expire})

    return jwt.encode(to_encode, os.environ['SECRET_KEY'], algorithm=ALGORITHM)

@router.get('/user/me')
async def get_user_me(request: Request, db_conn: Session = Depends(get_db)):
    return get_current_user(request, db_conn)

def get_current_user(request: Request, db_conn: Session):  
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
        payload = jwt.decode(token, os.environ['SECRET_KEY'], algorithms=[ALGORITHM])
        token_data = TokenData(
            email=payload.get('sub'),
            ip_address=payload.get('ip_address'),
            version=payload.get('version')
        )
        if token_data.email is None or not \
            token_data.ip_address == request.client.host:
            raise credentials_exception

    except InvalidTokenError:
        raise credentials_exception
    
    # Retrieve the user from the database
    user = get_user(token_data.email, db_conn)
    if not user.TokenVersion == token_data.version:
        raise credentials_exception

    if user is None:
        raise credentials_exception
    
    return {'email': user.Email}

def get_user(email: str, db_conn: Session):
    return db_conn.query(UserAccount).filter_by(Email=email).first()

@router.post('/logout')
def logout_current_user(request: Request, response: Response, db_conn: Session = Depends(get_db)):
    user = get_current_user(request, db_conn)
    invalidate_access_token(user.Email, db_conn)

    response.delete_cookie(
        key='auth_token',
        httponly=True,
        secure=False, # Set to false for development
        samesite='Strict'
    )

def invalidate_access_token(email: str, db_conn: Session):
    user = db_conn.query(UserAccount).filter_by(Email=email).first()
    user.TokenVersion += 1
    db_conn.commit()
