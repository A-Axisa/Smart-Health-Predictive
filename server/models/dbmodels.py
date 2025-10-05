from sqlalchemy import Column, Integer, String, DateTime, text, ForeignKey
from sqlalchemy.orm import declarative_base, relationship


Base = declarative_base()

class UserAccount(Base):
    __tablename__ = 'UserAccount'
    UserID = Column(Integer, primary_key = True)
    FullName = Column(String)
    Email = Column(String)
    PasswordHash = Column(String)
    PhoneNumber = Column(String)
    CreatedAt = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))

    userRoles = relationship("UserAccountRole", back_populates = "user")

    def __init__(self, full_name, email, password_hash, phone_number):
        self.FullName = full_name
        self.Email = email
        self.PasswordHash = password_hash
        self.PhoneNumber = phone_number

    def __repr__(self):
        return f"UserAccount(UserID={self.UserID}, FullName={self.FullName}, \
            Email={self.Email}, PasswordHash={self.PasswordHash}, \
            Phone={self.PhoneNumber}, Created={self.CreatedAt} )"


class AccountRole(Base):
    __tablename__ = 'AccountRole'
    RoleID = Column(Integer, primary_key = True)
    RoleName = Column(String)

    userRoles = relationship("UserAccountRole", back_populates = "role")
    rolePermissions = relationship("RolePermission", back_populates = "role")


class Permission(Base):
    __tablename__ = 'Permission'
    PermissionID = Column(Integer, primary_key = True)
    PermissionName = Column(String)

    permissionRoles = relationship("RolePermission", back_populates = "permission")    


class UserAccountRole(Base):
    __tablename__ = 'UserAccountRole'
    RoleID = Column(Integer, ForeignKey("AccountRole.RoleID"), primary_key = True)
    UserID = Column(Integer, ForeignKey("UserAccount.UserID"), primary_key = True)
    AssignedAT = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))

    user = relationship("UserAccount", back_populates = "userRoles")
    role = relationship("AccountRole", back_populates = "userRoles")


class RolePermission(Base):
    __tablename__ = 'RolePermission'
    RoleID = Column(Integer, ForeignKey("AccountRole.RoleID"), primary_key = True)
    PermissionID = Column(Integer, ForeignKey("Permission.PermissionID"), primary_key = True)
    AssignedAT = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))

    role = relationship("AccountRole", back_populates = "rolePermissions")
    permission = relationship("Permission", back_populates = "permissionRoles")
