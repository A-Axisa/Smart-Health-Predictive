import random
from csv import reader as csvReader
from datetime import datetime, timedelta
from enum import Enum
from ..utils.database import get_db
from ..models.dbmodels import UserAccount, UserAccountRole, Patient, \
    HealthData, Recommendation, Prediction, Clinic, UserPatientAccess, \
    AuditLog, LogEventType

# These values can be changed to adjust the amount of data generated.
ADMIN_AMT = 2
STANDARD_USER_AMT = 64
REPORTS_PER_STANDARD_USER = 8
MERCHANT_AMT = 10
PATIENTS_PER_MERCHANT = 5
REPORTS_PER_MERCHANT_PATIENT = 3
CLINIC_AMT = 6


UNIQUE_ID_RANGE = 2100000000
TOKEN_VERSION_RANGE = 10000
NAME_FILEPATH = 'server/tools/names.csv'
PASSWORD_HASH = (
    '$argon2id$v=19$m=19456,t=2,p=1$MzTHleFMLuRjzV0EBw5SHw'
    '$PMjErE7kYpUJmIzsZrwUj5KNQUXy9XFn+kNYJE4PGms'
)
HEIGHT_MIN_M = 120.00
HEIGHT_MAX_M = 200.00
WEIGHT_MIN_KG = 40.0
WEIGHT_MAX_KG = 240.0
START_DATETIME = datetime(year=2020, month=1, day=1)
END_DATETIME = datetime.now()
EXERCISE_REC = [
    'Aim for 150 minutes/week of moderate-intensity activity '
    '(e.g., brisk walking) split across 3–5 days.',
    'Aim for 150 minutes/week of moderate-intensity activity '
    '(e.g., brisk walking) split across 3–5 days. Avoid '
    'high-intensity bouts initially; focus on consistency while pursuing '
    'smoking cessation.',
]
DIET_REC = [
    'Adopt a balanced plate: 1/2 non-starchy vegetables, 1/4 lean protein'
    ', 1/4 whole grains. Limit processed foods and sugary drinks.',
    'Adopt a balanced plate: 1/2 non-starchy vegetables, 1/4 lean protein,'
    ' 1/4 whole grains. Limit processed foods and sugary drinks. Increase '
    'soluble fiber (oats, legumes) and healthy fats (olive oil, nuts); '
    'reduce saturated fats.',
]
LIFESTYLE_REC = [
    'Sleep 7–9 hours nightly, manage stress with short daily breathing or '
    'mindfulness. Hydrate adequately.',
    'Sleep 7–9 hours nightly, manage stress with short daily breathing or '
    'mindfulness. Hydrate adequately. Begin a smoking cessation plan '
    '(nicotine replacement or counseling). Limit alcohol (≤2 standard '
    'drinks/day for men, ≤1 for women; aim for several alcohol-free '
    'days/week).'
]
AVOID_REC = [
    'Limit ultra-processed foods, high-sugar desserts, and trans-fat '
    'containing snacks. Minimize high-sodium processed meats.',
    'Limit ultra-processed foods, high-sugar desserts, and '
    'trans-fat containing snacks. Minimize high-sodium processed meats.',
]

possible_names = []
field_taken_ids = {}


class UserRoleID(Enum):
    'Possible roles a user can have.'
    ADMIN = 1901881405
    STANDARD = 331928555
    MERCHANT = 62809281


def load_names_csv(filename: str):
    '''Loads all the names in the CSV file to use in the dummy data'''
    with open(filename, encoding="utf-8") as csv_file:
        csv_reader = csvReader(csv_file, delimiter=',')
        for row in csv_reader:
            for name in row:
                possible_names.append(name)


def get_random_names(amount: int = 1):
    '''Randomly selects a list of names from all possible names.
       Names are replaced with '---' if there are no possible names'''

    if len(possible_names) <= 0:
        return ['---'] * amount

    names = []
    for _ in range(amount):
        names.append(random.choice(possible_names))
    return names


def get_random_unique_id(field_name: str = ''):
    '''Returns a randomly generated ID that is unique to a given field.'''
    # Ensure there is a bucket for the supplied field.
    if field_name not in field_taken_ids:
        field_taken_ids[field_name] = {}

    # Produce an ID that is not currently taken.
    new_id = random.randrange(UNIQUE_ID_RANGE)
    while new_id in field_taken_ids[field_name]:
        new_id = random.randrange(UNIQUE_ID_RANGE)
    field_taken_ids[field_name][new_id] = new_id
    return new_id


def get_random_datetime(start_time: datetime, end_time: datetime):
    '''Get a random datetime between two dates'''
    delta_in_seconds = (end_time - start_time).total_seconds()
    random_interval = random.uniform(0, delta_in_seconds)
    return start_time + timedelta(seconds=random_interval)


def generate_clinic(created_at: datetime = None):
    '''Returns a clinic with a unique ID and random details.'''
    if created_at is None:
        created_at = get_random_datetime(START_DATETIME, END_DATETIME)
    names = get_random_names(2)
    clinic_name =  names[0] + ' ' + names[1] + ' ' + 'Clinic'
    return {
        "ClinicID": get_random_unique_id('clinic'),
        "ClinicName": clinic_name,
        "CreatedAt": created_at,
    }


def generate_account(
    created_at: datetime,
    given_name: str = None,
    family_name: str = None,
    clinic_id: int = None,
):
    '''Returns an account with a unique ID and random details.'''
    if given_name is None:
        given_name = get_random_names()[0]
    if family_name is None:
        family_name = get_random_names()[0]
    email = given_name + '.' \
        + family_name + '.' \
        + str(random.randrange(0, 99999999)) +'@example.com'

    return {
        'UserID': get_random_unique_id('account'),
        'Email': email,
        'PasswordHash': PASSWORD_HASH,
        'PhoneNumber': '',
        'ClinicID': clinic_id,
        'CreatedAt': created_at,
        'IsValidated': True,
        'TokenVersion': random.randrange(TOKEN_VERSION_RANGE),
    }


def generate_patient(
    created_at: datetime,
    given_name: str = None,
    family_name: str = None,
    user_id: str = None
):
    '''Returns a patient with a unique ID and random details.'''
    if given_name is None:
        given_name = get_random_names()[0]
    if family_name is None:
        family_name = get_random_names()[0]

    return {
        'PatientID': get_random_unique_id('patient'),
        'UserID': user_id,
        'GivenNames': given_name,
        'FamilyName': family_name,
        'Gender':random.randrange(2),
        'Weight': round(random.uniform(WEIGHT_MIN_KG, WEIGHT_MAX_KG), 2),
        'Height': round(random.uniform(HEIGHT_MIN_M, HEIGHT_MAX_M), 2),
        'DOB': datetime.now(),
        'CreatedAt': created_at,
    }


def generate_health_data(created_at: datetime, patient: dict):
    '''Returns health report with a unique ID, patient information, 
       and random details.'''
    blood_glucose = round(random.uniform(2.00, 10.00), 2)
    return {
        'HealthDataID': get_random_unique_id('HealthData'),
        'PatientID': patient['PatientID'],
        'Gender': patient['Gender'],
        'Age': 18,
        'WeightKilograms': patient['Weight'],
        'HeightCentimeters': patient['Height'],
        'Alcohol': random.randrange(2),
        'SmokingStatus': random.randrange(2),
        'MaritalStatus': random.randrange(2),
        'WorkingStatus': random.randrange(3),
        'Hypertension': random.randrange(2),
        'HeartDisease': random.randrange(2),
        'Diabetes': blood_glucose >= 7.6,
        'BloodGlucose': blood_glucose,
        'CreatedAt': created_at,
        'APHigh': round(random.uniform(50.00, 100.00), 2),
        'APLow': round(random.uniform(50.00, 200.00), 2),
        'HighCholesterol': random.randrange(2),
        'Stroke': random.randrange(2),
    }


def generate_recommendation(created_at: datetime, health_data_id: int):
    '''Returns a recommendation with a unique ID and random information
       for a health report.'''
    return {
        'RecommendationID': get_random_unique_id('recommendation'),
        'HealthDataID': health_data_id,
        'ExerciseRecommendation':random.choice(EXERCISE_REC),
        'DietRecommendation':random.choice(DIET_REC),
        'LifestyleRecommendation':random.choice(LIFESTYLE_REC),
        'DietToAvoidRecommendation':random.choice(AVOID_REC),
        'CreatedAt': created_at,
    }


def generate_prediction(created_at: datetime, health_data_id: int,):
    '''Returns a prediction with a unique ID and random information
       for a health report.'''
    return {
        'PredictionID': get_random_unique_id('prediction'),
        'HealthDataID': health_data_id,
        'StrokeChance': round(random.random()*99, 2),
        'CVDChance': round(random.random()*99, 2),
        'DiabetesChance': round(random.random()*99, 2),
        'CreatedAt': created_at,
    }


def generate_user_account_role(
    created_at: datetime,
    user_id: int,
    user_role_id: UserRoleID
):
    '''Returns a user account role for the given user and role.'''
    return {
        'RoleID': user_role_id.value,
        'UserID': user_id,
        'AssignedAt': created_at,
    }

def generate_user_patient_access(
    created_at: datetime,
    user_id: int,
    patient_id: int
):
    '''Returns data that links a patient to a merchant.'''
    return {
        'UserID': user_id,
        'PatientID': patient_id,
        'CreatedAt': created_at,
    }


def generate_audit_log(
    created_at: datetime,
    event_type: str,
    success: bool,
    email: str,
    ip: str = None,
    device: str = None,
    description: str = None
):
    '''Generate date for an AuditLog with a unique ID'''
    return {
        'LogID': get_random_unique_id('Log'),
        'EventType': event_type,
        'Success': success,
        'UserID': None,
        'UserEmail': email,
        'IPAdress': ip,
        'Device': device,
        'Description': description,
        "CreatedAt": created_at,
    }


def create_users(
    amount: int,
    user_role: UserRoleID,
    clinic_id: int = None,
    start_date: datetime = None,
    end_date: datetime = None
):
    '''Returns randomly generated data representing a collection of users.'''
    if start_date is None:
        start_date = START_DATETIME
    if end_date is None:
        end_date = END_DATETIME

    accounts = []
    patients = []
    roles = []
    logs = []
    for _ in range(amount):
        name = get_random_names(2)
        created_at = get_random_datetime(start_date, end_date)
        new_account = generate_account(created_at, name[0], name[1], clinic_id)
        new_patient = generate_patient(
            created_at,
            name[0],
            name[1],
            new_account['UserID']
        )
        accounts.append(new_account)
        patients.append(new_patient)
        roles.append(generate_user_account_role(
            created_at,
            new_account['UserID'],
            user_role)
        )
        logs.append(generate_audit_log(
            created_at,
            LogEventType.REGISTRATION,
            True,
            new_account['Email'],
            description='Successfully registered an account.'
        ))
    return {
        'Accounts': accounts,
        'Patients': patients,
        'Roles': roles,
        'AuditLogs': logs
    }


def create_health_reports_for_user(patient: dict, amount:int, email=None):
    '''Returns randomly generated the health data, recommendations, and 
       predictions for a patient.'''
    health_data = []
    recommendations = []
    predictions = []
    logs = []
    for _ in range(amount):
        created_at = get_random_datetime(patient['CreatedAt'], END_DATETIME)
        new_health_data = generate_health_data(created_at, patient)
        health_data.append(new_health_data)
        recommendations.append(
            generate_recommendation(created_at, new_health_data['HealthDataID']))
        predictions.append(
            generate_prediction(created_at, new_health_data['HealthDataID']))
        logs.append(generate_audit_log(
            created_at - timedelta(minutes=random.randrange(1, 15)),
            LogEventType.LOGIN,
            True,
            email,
            description='Successful login attempt.'
        ))
        logs.append(generate_audit_log(
            created_at,
            LogEventType.PREDICTION_REQUEST,
            True,
            email,
            description='Successful prediction request.'
        ))
        logs.append(generate_audit_log(
            created_at + timedelta(minutes=random.randrange(5, 29)),
            LogEventType.LOGOUT,
            True,
            email,
            description='Successfully logged out.'
        ))
    return {
        'HealthData': health_data,
        'Recommendations': recommendations,
        'Predictions': predictions,
        'AuditLogs': logs,
    }


def create_health_reports_for_merchant(
    merchant: dict,
    patients: list,
    reports_per_user: int
):
    '''Generates all the health reports for patients in a list'''
    health_data = []
    recommendations = []
    predictions = []
    logs = []
    for patient in patients:
        reports = create_health_reports_for_user(patient, reports_per_user, merchant['Email'])
        health_data.extend(reports['HealthData'])
        recommendations.extend(reports['Recommendations'])
        predictions.extend(reports['Predictions'])
        logs.extend(reports['AuditLogs'])
    return {
        'HealthData': health_data,
        'Recommendations': recommendations,
        'Predictions': predictions,
        'AuditLogs': logs,
    }

def create_patients_for_merchant(merchant: dict,
    num_of_patients: int,
    num_of_reports: int
):
    '''Returns a patients and their related health data for a merchant'''
    created_at_dates = [get_random_datetime(
        merchant['CreatedAt'],
        END_DATETIME
    ) for _ in range(num_of_patients)]
    patients = [generate_patient(date) for date in created_at_dates]
    merchant_access = [generate_user_patient_access(
        patient['CreatedAt'],
        merchant['UserID'],
        patient['PatientID']
    ) for patient in patients]
    health_reports = create_health_reports_for_merchant(
        merchant,
        patients,
        num_of_reports
    )
    return {
       'Patients': patients,
       'Access': merchant_access,
       'HealthData': health_reports['HealthData'],
       'Recommendations': health_reports['Recommendations'],
       'Predictions': health_reports['Predictions'],
       'AuditLogs': health_reports['AuditLogs']
    }


def generate_dummy_data_in_db():
    '''Generates and inserts dummy data into the database.'''
    load_names_csv(NAME_FILEPATH)
    conn = next(get_db())

    users = create_users(STANDARD_USER_AMT, UserRoleID.STANDARD)
    health_data = []
    recommendations = []
    predictions = []
    logs = users['AuditLogs']
    for i in range(STANDARD_USER_AMT):
        reports = create_health_reports_for_user(
            users['Patients'][i],
            REPORTS_PER_STANDARD_USER,
            users['Accounts'][i]['Email']
        )
        health_data.extend(reports['HealthData'])
        recommendations.extend(reports['Recommendations'])
        predictions.extend(reports['Predictions'])
        logs.extend(reports['AuditLogs'])
    conn.bulk_insert_mappings(UserAccount, users['Accounts'])
    conn.bulk_insert_mappings(UserAccountRole, users['Roles'])
    conn.bulk_insert_mappings(Patient, users['Patients'])
    conn.bulk_insert_mappings(HealthData, health_data)
    conn.bulk_insert_mappings(Recommendation, recommendations)
    conn.bulk_insert_mappings(Prediction, predictions)
    conn.bulk_insert_mappings(AuditLog, logs)


    clinics = []
    for _ in range(CLINIC_AMT):
        clinics.append(generate_clinic())
    conn.bulk_insert_mappings(Clinic, clinics)


    merchant_users = create_users(
        MERCHANT_AMT,
        UserRoleID.MERCHANT,
        random.choice(clinics)['ClinicID']
    )
    conn.bulk_insert_mappings(UserAccount, merchant_users['Accounts'])
    conn.bulk_insert_mappings(UserAccountRole, merchant_users['Roles'])
    conn.bulk_insert_mappings(Patient, merchant_users['Patients'])
    conn.bulk_insert_mappings(AuditLog, merchant_users['AuditLogs'])
    for merchant in merchant_users['Accounts']:
        merchant_patients = create_patients_for_merchant(
            merchant,
            PATIENTS_PER_MERCHANT,
            REPORTS_PER_MERCHANT_PATIENT
        )
        conn.bulk_insert_mappings(Patient, merchant_patients['Patients'])
        conn.bulk_insert_mappings(UserPatientAccess, merchant_patients['Access'])
        conn.bulk_insert_mappings(HealthData, merchant_patients['HealthData'])
        conn.bulk_insert_mappings(Recommendation, merchant_patients['Recommendations'])
        conn.bulk_insert_mappings(Prediction, merchant_patients['Predictions'])
        conn.bulk_insert_mappings(AuditLog, merchant_patients['AuditLogs'])


    admin_users = create_users(ADMIN_AMT, UserRoleID.ADMIN)
    conn.bulk_insert_mappings(UserAccount, admin_users['Accounts'])
    conn.bulk_insert_mappings(UserAccountRole, admin_users['Roles'])
    conn.bulk_insert_mappings(Patient, admin_users['Patients'])
    conn.bulk_insert_mappings(AuditLog, admin_users['AuditLogs'])

    conn.commit()

generate_dummy_data_in_db()
