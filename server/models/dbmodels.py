from sqlalchemy import Column, Integer, String, DateTime, text, Boolean, Numeric, ForeignKey, Text
from sqlalchemy.orm import declarative_base, relationship


Base = declarative_base()


class TestTable(Base):
    __tablename__ = 'TestTable'
    TestID = Column(Integer, primary_key=True)
    Name = Column(String(255))
    Number = Column(String(20))

    def __init__(self, name, number):
        self.Name = name
        self.Number = number

    def __repr__(self):
        return f'TestTable(TestID={self.TestID}, Name={self.Name}, Number={self.Number})'


class UserAccount(Base):
    __tablename__ = 'UserAccount'
    UserID = Column(Integer, primary_key=True)
    FullName = Column(String(255), nullable=False)
    Email = Column(String(255), unique=True)
    PasswordHash = Column(String(255), nullable=False)
    PhoneNumber = Column(String(20))
    CreatedAt = Column(DateTime, server_default=text('CURRENT_TIMESTAMP'))
    IsValidated = Column(Boolean, default=False)
    TokenVersion = Column(Integer, nullable=False, default=0)

    userRoles = relationship("UserAccountRole", back_populates="user")

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


class AccountRole(Base):
    __tablename__ = 'AccountRole'
    RoleID = Column(Integer, primary_key=True)
    RoleName = Column(String(100))

    userRoles = relationship("UserAccountRole", back_populates="role")
    rolePermissions = relationship("RolePermission", back_populates="role")

    def __init__(self, RoleName):
        self.RoleName = RoleName

    def __repr__(self):
        return f'AccountRole(RoleID={self.RoleID}, RoleName={self.RoleName})'


class Permission(Base):
    __tablename__ = 'Permission'
    PermissionID = Column(Integer, primary_key=True)
    PermissionName = Column(String(100))

    permissionRoles = relationship(
        "RolePermission", back_populates="permission")

    def __init__(self, PermissionName):
        self.PermissionName = PermissionName

    def __repr__(self):
        return f'Permission(PermissionID={self.PermissionID}, PermissionName={self.PermissionName})'


class UserAccountRole(Base):
    __tablename__ = 'UserAccountRole'
    RoleID = Column(Integer, ForeignKey(
        "AccountRole.RoleID"), primary_key=True)
    UserID = Column(Integer, ForeignKey(
        "UserAccount.UserID"), primary_key=True)
    AssignedAt = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))

    user = relationship("UserAccount", back_populates="userRoles")
    role = relationship("AccountRole", back_populates="userRoles")

    def __init__(self, RoleID, UserID):
        self.RoleID = RoleID
        self.UserID = UserID

    def __repr(self):
        return f'UserAccountRole(RoleID={self.RoleID}, UserID={self.UserID}, \
                AssignedAt={self.AssignedAt})'


class RolePermission(Base):
    __tablename__ = 'RolePermission'
    RoleID = Column(Integer, ForeignKey(
        "AccountRole.RoleID"), primary_key=True)
    PermissionID = Column(Integer, ForeignKey(
        "Permission.PermissionID"), primary_key=True)
    AssignedAt = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))

    role = relationship("AccountRole", back_populates="rolePermissions")
    permission = relationship("Permission", back_populates="permissionRoles")

    def __init__(self, RoleID, PermissionID):
        self.RoleID = RoleID
        self.PermissionID = PermissionID

    def __repr__(self):
        return f'RolePermission(RoleID={self.RoleID}, PermissionID={self.PermissionID}, \
                AssignedAt={self.AssignedAt})'


class HealthData(Base):
    __tablename__ = 'HealthData'
    # Keys
    HealthDataID = Column(Integer, primary_key=True)
    UserID = Column(Integer, ForeignKey(UserAccount.UserID))

    # Variables
    Age = Column(Integer)
    WeightKilograms = Column(Numeric(5, 2))
    HeightCentimetres = Column(Numeric(5, 2))
    Gender = Column(Boolean)
    BloodGlucose = Column(Numeric(5, 2))
    APHigh = Column(Numeric(5, 2))
    APLow = Column(Numeric(5, 2))
    HighCholesterol = Column(Boolean)
    HyperTension = Column(Boolean)
    HeartDisease = Column(Boolean)
    Diabetes = Column(Boolean)
    Alcohol = Column(Boolean)
    SmokingStatus = Column(Integer)
    MaritalStatus = Column(Integer)
    WorkingStatus = Column(Integer)
    CreatedAt = Column(DateTime, server_default=text('CURRENT_TIMESTAMP'))
    MerchantID = Column(Integer, nullable=True)

    def __init__(self, UserID, age, weight, height, gender, bloodGlucose, ap_hi,
                 ap_lo, highCholesterol, hyperTension, heartDisease,
                 diabetes, alcohol, smoker, maritalStatus, workingStatus, merchantID):
        self.UserID = UserID
        self.Age = age
        self.WeightKilograms = weight
        self.HeightCentimetres = height
        self.Gender = gender
        self.BloodGlucose = bloodGlucose
        self.APHigh = ap_hi
        self.APLow = ap_lo
        self.HighCholesterol = highCholesterol
        self.HyperTension = hyperTension
        self.HeartDisease = heartDisease
        self.Diabetes = diabetes
        self.Alcohol = alcohol
        self.SmokingStatus = smoker
        self.MaritalStatus = maritalStatus
        self.WorkingStatus = workingStatus
        self.MerchantID = merchantID

    def __repr__(self):
        return f'HealthData(HealthDataID = {self.HealthDataID}, UserID={self.UserID}, age={self.Age}, weight={self.WeightKilograms}, \
            height={self.HeightCentimetres}, gender={self.Gender}, bloodGlucose={self.BloodGlucose}, \
            ap_hi={self.APHigh}, ap_lo={self.APLow}, highCholesterol={self.HighCholesterol}, \
            hyperTension={self.HyperTension}, heartDisease={self.HeartDisease}, \
            diabetes={self.Diabetes}, alcohol={self.Alcohol}, smoker={self.SmokingStatus}, \
            maritalStatus={self.MaritalStatus}, workingStatus={self.WorkingStatus}, Created={self.CreatedAt},  MerchantID={self.MerchantID} )'


class Prediction(Base):

    __tablename__ = 'Prediction'
    # Keys
    PredictionID = Column(Integer, primary_key=True)
    HealthDataID = Column(Integer, ForeignKey(HealthData.HealthDataID))

    # Variables
    StrokeChance = Column(Numeric(4, 2))
    DiabetesChance = Column(Numeric(4, 2))
    CVDChance = Column(Numeric(4, 2))
    CreatedAt = Column(DateTime, server_default=text('CURRENT_TIMESTAMP'))

    def __init__(self, healthDataID, strokeChance, diabetesChance, CVDChance):
        self.HealthDataID = healthDataID
        self.StrokeChance = strokeChance
        self.DiabetesChance = diabetesChance
        self.CVDChance = CVDChance

    def __repr__(self):
        return f'Prediction(PredictionID = {self.PredictionID}, HealthDataID = {self.HealthDataID}, StrokeChance = {self.StrokeChance}, \
        DiabetesChance = {self.DiabetesChance}, CVDChance = {self.CVDChance}, Created={self.CreatedAt})'


class UserAccountValidationToken(Base):
    __tablename__ = 'UserAccountValidationToken'
    UserID = Column(Integer, ForeignKey('UserAccount.UserID'),
                    primary_key=True, nullable=False)
    ValidationToken = Column(String(999), nullable=False)
    ExpiresAt = Column(DateTime, nullable=False)

    def __init__(self, user_id, validation_token, expires_at):
        self.UserID = user_id
        self.ValidationToken = validation_token
        self.ExpiresAt = expires_at

    def __repr__(self):
        return f'UserAccountValidationToken(UserID={self.UserID}, \
            ValidationToken={self.ValidationToken}, ExpiresAt={self.ExpiresAt})'


class Recommendation(Base):
    __tablename__ = 'Recommendation'

    # Keys
    RecommendationID = Column(Integer, primary_key=True)
    HealthDataID = Column(Integer, ForeignKey('HealthData.HealthDataID'))

    # Content
    ExerciseRecommendation = Column(Text)
    DietRecommendation = Column(Text)
    LifestyleRecommendation = Column(Text)
    DietToAvoidRecommendation = Column(Text)
    CreatedAt = Column(DateTime, server_default=text('CURRENT_TIMESTAMP'))

    def __init__(self, healthDataID, exerciseRecommendation, dietRecommendation, lifestyleRecommendation, dietToAvoidRecommendation=None):
        self.HealthDataID = healthDataID
        self.ExerciseRecommendation = exerciseRecommendation
        self.DietRecommendation = dietRecommendation
        self.LifestyleRecommendation = lifestyleRecommendation
        self.DietToAvoidRecommendation = dietToAvoidRecommendation

    def __repr__(self):
        return (f'Recommendation(RecommendationID={self.RecommendationID}, '
                f'HealthDataID={self.HealthDataID}, '
                f'CreatedAt={self.CreatedAt})')
