from datetime import datetime, timedelta, timezone
from secrets import token_urlsafe

import bcrypt
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from ..utils.database import get_db 
from ..models.dbmodels import UserAccount, UserAccountRole, UserAccountValidationToken

STANDARD_ACCOUNT_ROLE_ID = 1
VALIDATION_TOKEN_LENGTH = 128
VALIDATION_EXPIRATION_IN_HOURS = 24

class UserRegistrationDetails(BaseModel):
    username: str
    password: str
    email: str
    phone: str

class LoginCredentials(BaseModel):
    email: str
    password: str
    
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
        
    # Load the user with the added details
    new_user_id = db_conn.query(UserAccount.UserID). \
        filter_by(Email=user_reg.email).first()[0]
    role = UserAccountRole(STANDARD_ACCOUNT_ROLE_ID, new_user_id)

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
async def login(user_cred: LoginCredentials, db_conn: Session = Depends(get_db)):
    user = authenticate_user(user_cred.email, user_cred.password, db_conn)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Incorrect username or password',
            headers={"WWW-Authenticate": "Bearer"}
        )

    return {'message': 'Login successful.', 'username':user.FullName}

def authenticate_user(email: str, password: str, db_conn: Session):
    user = db_conn.query(UserAccount).filter_by(Email=email).first()
    if not user:
        return False
    if not verify_password(password, user.PasswordHash):
        return False
    return user

def verify_password(password_text: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password_text.encode('utf-8'), password_hash.encode('utf-8'))

