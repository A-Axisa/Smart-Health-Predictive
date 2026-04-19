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

# Get the absolute path to the CA certificate
cert_path = os.path.join(os.path.dirname(__file__), '..', 'certs', 'DigiCertGlobalRootCA.crt.pem')

# Create the database connection manager with SSL enabled (for Azure MySQL)
engine = create_engine(
    DATABASE_URL,
    connect_args={
        'ssl_ca': cert_path  # Path to CA certificate
    }
)
session_local = sessionmaker(autocommit=False, bind=engine)


def get_db():
    '''Returns a session used to communicate with the database with Object 
    Relation Mapper (ORM) Objects.'''
    db = session_local()
    try:
        yield db
    finally:
        db.close()
