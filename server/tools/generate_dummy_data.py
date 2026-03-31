import random
from csv import reader as csvReader
from datetime import datetime, timedelta
from enum import Enum
from ..utils.database import get_db
from ..models.dbmodels import UserAccount, UserAccountRole, Patient, \
    HealthData, Recommendation, Prediction, Clinic, UserPatientAccess

ADMIN_AMT = 2
STANDARD_USER_AMT = 64
MERCHANT_AMT = 8
CLINIC_AMT = 4

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


def generate_clinic():
    '''Returns a clinic with a unique ID and random details.'''
    names = get_random_names(2)
    clinic_name =  names[0] + ' ' + names[1] + ' ' + 'Clinic'
    return {
        "ClinicID": get_random_unique_id('clinic'),
        "ClinicName": clinic_name,
        "CreatedAt": datetime.now(),
    }


def generate_account(
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
        'CreatedAt': datetime.now(),
        'IsValidated': True,
        'TokenVersion': random.randrange(TOKEN_VERSION_RANGE),
    }


def generate_patient(
    given_name: str = None,
    family_name: str = None,
    user_id: str = None,
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
        'CreatedAt': datetime.now(),
    }


def generate_health_data(patient: dict):
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
        'CreatedAt': datetime.now(),
        'APHigh': round(random.uniform(50.00, 100.00), 2),
        'APLow': round(random.uniform(50.00, 200.00), 2),
        'HighCholesterol': random.randrange(2),
        'Stroke': random.randrange(2),
    }


def generate_recommendation(health_data_id: int):
    '''Returns a recommendation with a unique ID and random information
       for a health report.'''
    return {
        'RecommendationID': get_random_unique_id('recommendation'),
        'HealthDataID': health_data_id,
        'ExerciseRecommendation':'',
        'DietRecommendation':'',
        'LifestyleRecommendation':'',
        'DietToAvoid_Recommendation':'',
        'CreatedAt': datetime.now(),
    }


def generate_prediction(health_data_id: int):
    '''Returns a prediction with a unique ID and random information
       for a health report.'''
    return {
        'PredictionID': get_random_unique_id('prediction'),
        'HealthDataID': health_data_id,
        'StrokeChance': round(random.random(), 2),
        'CardioChance': round(random.random(), 2),
        'DiabetesChance': round(random.random(), 2),
        'CreatedAt': datetime.now(),
    }


def generate_user_account_role(
    user_id: int,
    user_role_id: UserRoleID,
):
    '''Returns a user account role for the given user and role.'''
    return {
        'RoleID': user_role_id.value,
        'UserID': user_id,
        'AssignedAt': datetime.now()
    }

def generate_user_patient_access(
    user_id: int,
    patient_id: int,
):
    '''Returns data that links a patient to a merchant.'''
    return {
        'UserID': user_id,
        'PatientID': patient_id,
        'CreatedAt': datetime.now(),
    }


def create_users(amount: int, user_role: UserRoleID, clinic_id: int = None):
    '''Returns randomly generated data representing a collection of users.'''
    accounts = []
    patients = []
    roles = []
    for _ in range(amount):
        name = get_random_names(2)
        new_account = generate_account(name[0], name[1], clinic_id)
        new_patient = generate_patient(name[0], name[1], new_account['UserID'])
        accounts.append(new_account)
        patients.append(new_patient)
        roles.append(generate_user_account_role(new_account['UserID'], user_role))

    return {
        'Accounts': accounts,
        'Patients': patients,
        'Roles': roles,
    }


def create_health_reports_for_user(patient: dict, amount:int):
    '''Returns randomly generated the health data, recommendations, and 
       predictions for a patient.'''
    health_data = []
    recommendations = []
    predictions = []
    for _ in range(amount):
        new_health_data = generate_health_data(patient)
        health_data.append(new_health_data)
        recommendations.append(
            generate_recommendation(new_health_data['HealthDataID']))
        predictions.append(
            generate_prediction(new_health_data['HealthDataID']))

    return {
        'HealthData': health_data,
        'Recommendations': recommendations,
        'Predictions': predictions,
    }

def create_health_reports_for_multiple_users(
    patients: list,
    reports_per_user: int
):
    '''Generates all the health reports for patients in a list'''
    health_data = []
    recommendations = []
    predictions = []
    for patient in patients:
        reports = create_health_reports_for_user(patient, reports_per_user)
        health_data.extend(reports['HealthData'])
        recommendations.extend(reports['Recommendations'])
        predictions.extend(reports['Predictions'])

    return {
        'HealthData': health_data,
        'Recommendations': recommendations,
        'Predictions': predictions,
    }

def create_patients_for_merchant(merchant: dict,
    num_of_patients: int,
    num_of_reports: int
):
    '''Returns a patients and their related health data for a merchant'''
    patients = [generate_patient() for _ in range(num_of_patients)]
    merchant_access = [generate_user_patient_access(
        merchant['UserID'],
        x['PatientID']
    ) for x in patients]
    health_reports = create_health_reports_for_multiple_users(
        patients,
        num_of_reports
    )
    return {
       'Patients': patients,
       'Access': merchant_access,
       'HealthData': health_reports['HealthData'],
       'Recommendations': health_reports['Recommendations'],
       'Predictions': health_reports['Predictions'],
    }

def generate_dummy_data_in_db():
    '''Generates and inserts dummy data into the database.'''
    load_names_csv(NAME_FILEPATH)
    conn = next(get_db())

    standard_users = create_users(STANDARD_USER_AMT, UserRoleID.STANDARD)
    health_reports = create_health_reports_for_multiple_users(
        standard_users['Patients'],
        10
    )
    conn.bulk_insert_mappings(UserAccount, standard_users['Accounts'])
    conn.bulk_insert_mappings(UserAccountRole, standard_users['Roles'])
    conn.bulk_insert_mappings(Patient, standard_users['Patients'])
    conn.bulk_insert_mappings(HealthData, health_reports['HealthData'])
    conn.bulk_insert_mappings(Recommendation, health_reports['Recommendations'])
    conn.bulk_insert_mappings(Prediction, health_reports['Predictions'])

    # Clinics
    clinics = []
    for _ in range(CLINIC_AMT):
        clinics.append(generate_clinic())
    conn.bulk_insert_mappings(Clinic, clinics)

    merchant_users = create_users(
        MERCHANT_AMT,
        UserRoleID.MERCHANT,
        random.choice(clinics)['ClinicID'])
    for merchant in merchant_users['Accounts']:
        merchant_patients = create_patients_for_merchant(merchant, 10, 10)
        conn.bulk_insert_mappings(Patient, merchant_patients['Patients'])
        conn.bulk_insert_mappings(UserPatientAccess, merchant_patients['Access'])
        conn.bulk_insert_mappings(HealthData, merchant_patients['HealthData'])
        conn.bulk_insert_mappings(Recommendation, merchant_patients['Recommendations'])
        conn.bulk_insert_mappings(Prediction, merchant_patients['Predictions'])
    conn.bulk_insert_mappings(UserAccount, merchant_users['Accounts'])
    conn.bulk_insert_mappings(UserAccountRole, merchant_users['Roles'])
    conn.bulk_insert_mappings(Patient, merchant_users['Patients'])

    admin_users = create_users(ADMIN_AMT, UserRoleID.ADMIN)
    conn.bulk_insert_mappings(UserAccount, admin_users['Accounts'])
    conn.bulk_insert_mappings(UserAccountRole, admin_users['Roles'])
    conn.bulk_insert_mappings(Patient, admin_users['Patients'])

    conn.commit()


