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
        self.WeightKilogramsKilograms = weight
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
        return f'HealthData(HealthDataID = {self.HealthDataID}, UserID={self.UserID}, age={self.age}, weight={self.WeightKilograms}, \
            height={self.height}, gender={self.Gender}, bloodGlucose={self.BloodGlucose }, \
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
