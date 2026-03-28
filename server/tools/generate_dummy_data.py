import random
from csv import reader as csvReader
from enum import Enum

UNIQUE_ID_RANGE = 2100000000
TOKEN_VERSION_RANGE = 10000
PASSWORD_HASH = (
    '$argon2id$v=19$m=19456,t=2,p=1$MzTHleFMLuRjzV0EBw5SHw'
    '$PMjErE7kYpUJmIzsZrwUj5KNQUXy9XFn+kNYJE4PGms'
)
HEIGHT_MIN_M = 120.00
HEIGHT_MAX_M = 200.00
WEIGHT_MIN_KG = 40.0
WEIGHT_MAX_KG = 240.0
POSSIBLE_NAMES = []
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
                POSSIBLE_NAMES.append(name)


def get_random_names(amount: int = 1):
    '''Randomly selects a list of names from all possible names.
       Names are replaced with '---' if there are no possible names'''

    if len(POSSIBLE_NAMES) <= 0:
        return ['---'] * amount

    names = []
    for _ in range(amount):
        names.append(random.choice(POSSIBLE_NAMES))
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
        "CreatedAt": "",
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
    email = given_name + '.' + family_name + '.' + '@example.com'

    return {
        'UserID': get_random_unique_id('account'),
        'Email': email,
        'PasswordHash': PASSWORD_HASH,
        'PhoneNumber': '',
        'ClinicID': clinic_id,
        'CreatedAt': '',
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
        'DOB':'',
        'CreatedAt':'',
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
        'CreatedAt': '',
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
        'CreatedAt':'',
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
        'CreatedAt':'',
    }

def generate_user_account_role(
    user_id: int,
    user_role_id: UserRoleID,
):
    '''Returns a user account role for the given user and role.'''
    return {
        'RoleID': user_role_id.value,
        'UserID': user_id,
        'AssignedAt': ''
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
