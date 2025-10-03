from datetime import datetime, timedelta, timezone
from secrets import token_urlsafe

import bcrypt
from fastapi import APIRouter, Depends
from pydantic import BaseModel, EmailStr
from pydantic_extra_types.phone_numbers import PhoneNumber
from sqlalchemy.orm import Session

from ..utils.database import get_db 
from ..models.dbmodels import UserAccount, UserAccountRole

STANDARD_ACCOUNT_ROLE_ID = 1
VALIDATION_TOKEN_LENGTH = 128
VALIDATION_EXPIRATION_IN_HOURS = 24

class UserRegistrationDetails(BaseModel):
    username: str
    password: str
    email: EmailStr
    phone: PhoneNumber

router = APIRouter()

@router.post("/register/")
async def register(user_reg: UserRegistrationDetails, \
                   db_conn: Session = Depends(get_db)):

    # Always hash the password to obfuscate success and failure.
    password_hash = bcrypt.hashpw(user_reg.password.encode('utf-8'), \
                                  bcrypt.gensalt(rounds=15))
    new_user = UserAccount(
        user_reg.username,
        user_reg.email,
        password_hash,
        user_reg.phone.removeprefix('tel:')
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
    expires_at = datetime.now(timezone.utc) + timedelta(hours=VALIDATION_EXPIRATION_IN_HOURS)
    
    # Add the role if they are a new user.
    if not user:
        db_conn.add(role)
    
    db_conn.commit()

    return {'message': 'User successfully created.'}
