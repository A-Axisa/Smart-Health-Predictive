import random
from csv import reader as csvReader
from datetime import datetime
from enum import Enum
from ..utils.database import get_db
from ..models.dbmodels import UserAccount, UserAccountRole, Patient, \
    HealthData, Recommendation, Prediction, Clinic



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
        'LastName': family_name,
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
        'HealthDataID': get_random_unique_id('health_data'),
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
        'accounts': accounts,
        'patients': patients,
        'roles': roles,
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
        'health_data': health_data,
        'recommendations': recommendations,
        'predictions': predictions,
    }


def generate_dummy_data_in_db():
    '''Generates and inserts dummy data into the database.'''
    load_names_csv(NAME_FILEPATH)
    conn = next(get_db())

    standard_users = create_users(30, UserRoleID.STANDARD)
    health_data = []
    recommendations = []
    predictions = []
    for patient in standard_users['patients']:
        reports = create_health_reports_for_user(patient, random.randrange(0, 10))
        health_data.extend(reports['health_data'])
        recommendations.extend(reports['recommendations'])
        predictions.extend(reports['predictions'])
    conn.bulk_insert_mappings(UserAccount, standard_users['accounts'])
    conn.bulk_insert_mappings(UserAccountRole, standard_users['roles'])
    conn.bulk_insert_mappings(Patient, standard_users['patients'])
    conn.bulk_insert_mappings(HealthData, health_data)
    conn.bulk_insert_mappings(Recommendation, recommendations)
    conn.bulk_insert_mappings(Prediction, predictions)

    clinics = []
    for _ in range(4):
        clinics.append(generate_clinic())
    conn.bulk_insert_mappings(Clinic, clinics)

    merchant_users = create_users(5, UserRoleID.MERCHANT, random.choice(clinics)['ClinicID'])
    conn.bulk_insert_mappings(UserAccount, merchant_users['accounts'])
    conn.bulk_insert_mappings(UserAccountRole, merchant_users['roles'])
    conn.bulk_insert_mappings(Patient, merchant_users['patients'])

    admin_users = create_users(5, UserRoleID.ADMIN)
    conn.bulk_insert_mappings(UserAccount, admin_users['accounts'])
    conn.bulk_insert_mappings(UserAccountRole, admin_users['roles'])
    conn.bulk_insert_mappings(Patient, admin_users['patients'])

    conn.commit()


generate_dummy_data_in_db()
