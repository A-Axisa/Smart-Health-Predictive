from sqlalchemy import Column, Integer, String, DateTime, text, Boolean, Numeric, ForeignKey
from sqlalchemy.orm import declarative_base



class UserAccount(declarative_base()):
    __tablename__ = 'UserAccount'
    UserID = Column(Integer, primary_key = True)
    FullName = Column(String)
    Email = Column(String)
    PasswordHash = Column(String)
    PhoneNumber = Column(String)
    CreatedAt = Column(DateTime, server_default=text('CURRENT_TIMESTAMP'))

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
    age = Column(Integer)
    weight = Column(Numeric(5, 2))
    height = Column(Numeric(3, 2))
    gender = Column(Boolean)
    bloodGlucose = Column(Numeric(5, 2))
    ap_hi = Column(Numeric(4, 2))
    ap_lo = Column(Numeric(4, 2))
    highCholesterol = Column(Boolean)
    exercise = Column(Boolean)
    hyperTension = Column(Boolean)
    heartDisease = Column(Boolean)
    diabetes = Column(Boolean)
    alcohol = Column(Boolean)
    smoker = Column(Boolean)
    maritalStatus = Column(Boolean)
    workingStatus = Column(Boolean)
    CreatedAt = Column(DateTime, server_default=text('CURRENT_TIMESTAMP'))

    def __init__(self, UserID, age, weight, height, gender, bloodGlucose, ap_hi, 
                ap_lo, highCholesterol, exercise, hyperTension, heartDisease,
                diabetes, alcohol, smoker, maritalStatus, workingStatus):
        self.UserID = UserID
        self.age = age
        self.weight = weight
        self.height = height
        self.gender = gender
        self.bloodGlucose = bloodGlucose
        self.ap_hi = ap_hi
        self.ap_lo = ap_lo
        self.highCholesterol = highCholesterol
        self.exercise = exercise
        self.hyperTension = hyperTension
        self.heartDisease = heartDisease
        self.diabetes = diabetes
        self.alcohol = alcohol
        self.smoker = smoker
        self.maritalStatus = maritalStatus
        self.workingStatus = workingStatus

    def __repr__(self):
        return f'HealthData(HealthDataID = {self.HealthDataID}, UserID={self.UserID}, age={self.age}, weight={self.weight}, \
            height={self.height}, gender={self.gender}, bloodGlucose={self.bloodGlucose}, \
            ap_hi={self.ap_hi}, ap_lo={self.ap_lo}, highCholesterol={self.highCholesterol}, \
            exercise={self.exercise}, hyperTension={self.hyperTension}, heartDisease={self.heartDisease}, \
            diabetes={self.diabetes}, alcohol={self.alcohol}, smoker={self.smoker}, \
            maritalStatus={self.maritalStatus}, workingStatus={self.workingStatus}, Created={self.CreatedAt} )'


class Prediction(declarative_base()):

    __tablename__ = 'Prediction'
    # Keys
    PredictionID = Column(Integer, primary_key=True)
    HealthDataID = Column(Integer, ForeignKey(HealthData.HealthDataID))

    # Variables
    strokeChance = Column(Numeric(4, 2))
    diabetesChance = Column(Numeric(4, 2))
    CVDChance = Column(Numeric(4, 2))
    CreatedAt = Column(DateTime, server_default=text('CURRENT_TIMESTAMP'))

    def __init__(self, strokeChance, diabetesChance, CVDChance):
        self.strokeChance = strokeChance
        self.diabetesChance = diabetesChance
        self.CVDChance = CVDChance

    def __repr__(self):
        return f'Prediction(PredictionID = {self.PredictionID}, HealthDataID = {self.HealthDataID}, StrokeChance = {self.strokeChance}, \
        DiabetesChance = {self.diabetesChance}, CVDChance = {self.CVDChance}, Created={self.CreatedAt})'
