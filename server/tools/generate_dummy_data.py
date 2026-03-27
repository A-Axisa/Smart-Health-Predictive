import random
from csv import reader as csvReader

UNIQUE_ID_RANGE = 2100000000
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

