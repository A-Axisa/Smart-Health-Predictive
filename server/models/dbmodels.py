from sqlalchemy import Column, Integer, String, DateTime, text, Boolean, ForeignKey
from sqlalchemy.orm import declarative_base

declarative_base = declarative_base()

class UserAccount(declarative_base):
    __tablename__ = 'UserAccount'
    UserID = Column(Integer, primary_key = True)
    FullName = Column(String, nullable=False)
    Email = Column(String, unique=True)
    PasswordHash = Column(String, nullable=False)
    PhoneNumber = Column(String)
    CreatedAt = Column(DateTime, server_default=text('CURRENT_TIMESTAMP'))
    IsValidated = Column(Boolean, default=False)

    def __init__(self, full_name, email, password_hash, phone_number):
        self.FullName = full_name
        self.Email = email
        self.PasswordHash = password_hash
        self.PhoneNumber = phone_number

    def __repr__(self):
        return f'UserAccount(UserID={self.UserID}, FullName={self.FullName}, \
            Email={self.Email}, PasswordHash={self.PasswordHash}, \
            Phone={self.PhoneNumber}, Created={self.CreatedAt}, \
            IsValidated={self.IsValidated})'
    
class UserAccountRole(declarative_base):
    __tablename__ = 'UserAccountRole'
    RoleID = Column(Integer, primary_key=True)
    UserID = Column(Integer, primary_key=True)
    AssignedAt = Column(DateTime, server_default=text('CURRENT_TIMESTAMP'))

    def __init__(self, role_id, user_id):
        self.RoleID = role_id
        self.UserID = user_id

    def __repr__(self):
        return f'UserAccountRole(RoleID={self.RoleID}, UserID={self.UserID}, \
            AssignedAt={self.AssignedAt})'
    
class UserAccountValidationToken(declarative_base):
    __tablename__ = 'UserAccountValidationToken'
    UserID = Column(Integer, ForeignKey('UserAccount.UserID'), primary_key=True, nullable=False)
    ValidationToken = Column(String(128), nullable=False)
    ExpiresAt = Column(DateTime, nullable=False)

    def __init__(self, user_id, validation_token, expires_at):
        self.UserID = user_id
        self.ValidationToken = validation_token
        self.ExpiresAt = expires_at
        
    def __repr__(self):
        return f'UserAccountValidationToken(UserID={self.UserID}, \
            ValidationToken={self.ValidationToken}, ExpiresAt={self.ExpiresAt})'

    