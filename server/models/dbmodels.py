from sqlalchemy import Column, Integer, String, DateTime, text
from sqlalchemy.orm import declarative_base

declarative_base = declarative_base()

class UserAccount(declarative_base):
    __tablename__ = 'UserAccount'
    UserID = Column(Integer, primary_key = True)
    FullName = Column(String)
    Email = Column(String)
    PasswordHash = Column(String)
    PhoneNumber = Column(String)
    CreatedAt = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))

    def __init__(self, full_name, email, password_hash, phone_number):
        self.FullName = full_name
        self.Email = email
        self.PasswordHash = password_hash
        self.PhoneNumber = phone_number

    def __repr__(self):
        return f"UserAccount(UserID={self.UserID}, FullName={self.FullName}, \
            Email={self.Email}, PasswordHash={self.PasswordHash}, \
            Phone={self.PhoneNumber}, Created={self.CreatedAt} )"
    