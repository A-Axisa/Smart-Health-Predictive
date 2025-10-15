# Smart-Health-Predictive

## Getting Started
### Prerequisites
- Node.js v22.x or higher
- npm
- FastApi (Python)
- Docker Desktop

### Running the Web Application
1. Open a terminal and navigate to the project directory.
2. Run the server.  
```node server\src\server.js```
3. Open a second terminal and navigate to the client folder in the project directory.  
4. Install packages with npm and run the client.  
```npm install```  
```npm start```

## Installing Required Modules
### Server
1. Open command prompt in the server directory of the project.
2. Install the modules listed in the requirements.txt.  
```pip3 install -r requirements.txt```

## FastApi
### First time set up
1. Open Command Prompt
2. Run pip install ```"fastapi[standard]"```

### Run FastApi
1. Navigate to FastApi directory
```cd server```
2. Run the server
```fastapi dev main.py```
3. Go to http://127.0.0.1:8000/docs to interact with API

### Running the Database (Docker Compose)
1. Open terminal and navigate to the server folder in the project directory.
2. Install necessary dependencies.  
```npm install dotenv mysql2```
3. Install and run Docker Desktop.
4. Navigate to the project root directory.
5. Create and start the Docker container.   
```docker compose up -d```
6. Run the initial migration script.    
```docker exec -i shp-mysql mysql -uadmin -padmin user-db < server/src/migrations/01_init_schema.sql```
7. Verify table creations in database.   
```docker exec -it shp-mysql mysql -uadmin -padmin user-db -e "SHOW TABLES;"```

## Alembic
### Setup
1. Navigate to the server directory.
2. Run the following command to downgrade the database:     
    ***Warning:** This command will drop ALL existing tables and their associated data.*    
```alembic downgrade 81a354f03cae```  
3. Run the following command to rebuild the tables:   
```alembic upgrade head``` 
4. When receiving pull requests with new versions, resume from step 3.

### Adding a Migration
**For auto-generated migrations:**
1. Navigate to ```/server/models/dbmodels.py```
2. Modify/create tables as necessary.
3. Navigate to the server directory.
4. Run the following command to create the migration:   
```alembic revision --autogenerate -m "Description of migration"```

**For manual migrations:**
1. Navigate to the server directory.
2. Run the following command to add a new version:  
```alembic revision -m "Description of migration"```
3. Navigate to ```/server/alembic/versions/versionName.py``` and locate the created version file.
4. Refer to *https://alembic.sqlalchemy.org/en/latest/ops.html* for detail on creating/dropping tables.