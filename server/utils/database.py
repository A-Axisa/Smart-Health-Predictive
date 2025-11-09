import os
from dotenv import load_dotenv

from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

# Load environment variables.
load_dotenv()

DATABASE_URL = 'mysql+pymysql://{}:{}@{}:{}/{}'.format(
    os.environ['MYSQL_USER'],
    os.environ['MYSQL_PASSWORD'],
    os.environ['MYSQL_HOST'],
    os.environ['MYSQL_PORT'],
    os.environ['MYSQL_DATABASE']
)

# Create the database connection manager.
engine = create_engine(DATABASE_URL)
session_local = sessionmaker(autocommit=False, bind=engine)


def get_db():
    '''Returns a session used to communicate with the database with Object 
    Relation Mapper (ORM) Objects.'''
    db = session_local()
    try:
        yield db
    finally:
        db.close()
