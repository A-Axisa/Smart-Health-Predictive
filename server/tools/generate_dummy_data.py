import random
from csv import reader as csvReader

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
        "clinic_id": get_random_unique_id('clinic'),
        "clinic_name": clinic_name,
        "created_at": "",
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
        'user_id': get_random_unique_id('account'),
        'email': email,
        'password_hash': PASSWORD_HASH,
        'phone_number': '',
        'clinic_id': clinic_id,
        'created_at': '',
        'is_validated': True,
        'token_version': random.randrange(TOKEN_VERSION_RANGE),
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
        'patient_id': get_random_unique_id('patient'),
        'user_id': user_id,
        'given_name': given_name,
        'family_name': family_name,
        'gender':random.randrange(2),
        'weight': round(random.uniform(WEIGHT_MIN_KG, WEIGHT_MAX_KG), 2),
        'height': round(random.uniform(HEIGHT_MIN_M, HEIGHT_MAX_M), 2),
        'dob':'',
        'created_at':'',
    }
