from sqlalchemy import Column, Integer, String, DateTime, text, Boolean, Numeric, ForeignKey
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
            Phone={self.PhoneNumber}, Created={self.CreatedAt} )'


class HealthData(declarative_base()):
    __tablename__ = 'HealthData'
    # Keys
    HealthDataID = Column(Integer, primary_key=True)
    UserID = Column(Integer, ForeignKey(UserAccount.UserID))

    # Variables
    Age = Column(Integer)
    WeightKilograms = Column(Numeric(5, 2))
    HeightMeters = Column(Numeric(3, 2))
    Gender = Column(Boolean)
    BloodGlucose = Column(Numeric(5, 2))
    APHigh = Column(Numeric(5, 2))
    APLow = Column(Numeric(5, 2))
    HighCholesterol = Column(Boolean)
    Exercise = Column(Boolean)
    HyperTension = Column(Boolean)
    HeartDisease = Column(Boolean)
    Diabetes = Column(Boolean)
    Alcohol = Column(Boolean)
    SmokingStatus = Column(Boolean)
    MaritalStatus = Column(Boolean)
    WorkingStatus = Column(Boolean)
    CreatedAt = Column(DateTime, server_default=text('CURRENT_TIMESTAMP'))

    def __init__(self, UserID, age, weight, height, gender, bloodGlucose, ap_hi, 
                ap_lo, highCholesterol, exercise, hyperTension, heartDisease,
                diabetes, alcohol, smoker, maritalStatus, workingStatus):
        self.UserID = UserID
        self.Age= age
        self.WeightKilograms = weight
        self.HeightMeters = height
        self.Gender = gender
        self.BloodGlucose  = bloodGlucose
        self.APHigh = ap_hi
        self.APLow = ap_lo
        self.HighCholesterol = highCholesterol
        self.Exercise = exercise
        self.HyperTension = hyperTension
        self.HeartDisease = heartDisease
        self.Diabetes = diabetes
        self.Alcohol = alcohol
        self.SmokingStatus = smoker
        self.MaritalStatus = maritalStatus
        self.WorkingStatus = workingStatus

    def __repr__(self):
        return f'HealthData(HealthDataID = {self.HealthDataID}, UserID={self.UserID}, age={self.Age}, weight={self.WeightKilograms}, \
            height={self.HeightMeters}, gender={self.Gender}, bloodGlucose={self.BloodGlucose }, \
            ap_hi={self.APHigh}, ap_lo={self.APLow}, highCholesterol={self.HighCholesterol}, \
            exercise={self.Exercise}, hyperTension={self.HyperTension}, heartDisease={self.HeartDisease}, \
            diabetes={self.Diabetes}, alcohol={self.Alcohol}, smoker={self.SmokingStatus}, \
            maritalStatus={self.MaritalStatus}, workingStatus={self.WorkingStatus}, Created={self.CreatedAt} )'


class Prediction(declarative_base()):

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

    
