import random
from csv import reader as csvReader

POSSIBLE_NAMES = []

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
