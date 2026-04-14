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

## FastApi Setup
### Initial Setup
1. Open Command Prompt
2. Run pip install ```"fastapi[standard]"```

### Run FastApi
1. Navigate to FastApi directory
```cd server```
2. Run the server
```fastapi dev main.py```
3. Go to http://127.0.0.1:8000/docs to interact with API

## Database Setup (Docker Compose + Alembic)
### Initial Setup
1. Have Docker running in the background.
2. Navigate to the root directory.
3. Create the container with:      
```docker compose up -d```
4. To update your database to the latest version, run the following command:      
```alembic upgrade head```  

*ADDITIONAL NOTES*:    
 Run the following command to downgrade the database:     
**Warning: This command will drop *ALL* existing tables and their associated data**    
```alembic downgrade base```  

### Adding a Migration
**Auto-generated migrations**
1. Navigate to ```/server/models/dbmodels.py``` and modify/create tables as necessary.
2. Navigate to the server directory.
3. Run the following command to ensure you are on the current version:      
```alembic upgrade head```  
4. Run the following command to create the migration:   
```alembic revision --autogenerate -m "Description of migration"```

**Manual migrations**
1. Navigate to the server directory.
2. Run the following command to add a new version:  
```alembic revision -m "Description of migration"```
3. Navigate to ```/server/alembic/versions/nameOfNewVersion.py``` and locate the created version file.
4. Refer to *https://alembic.sqlalchemy.org/en/latest/ops.html* for detail on creating/dropping tables.


## Generating Dummy Data ##
The script will generate random data directly into the database.  
The amount of data generated can be modified at the head of the script.
1. Open a terminal and navigate to the root directory of the project.
2. Run the following command to generate data:  
```python -m server.tools.generate_dummy_data```

## Running Playwright
1. If not already installed, run the command:  
```npx playwright install```
2. Open a terminal and navigate to the Client directory.
3. run the command:  
```npx playwright test```  
4. Tests will now begin running and the terminal will log the status of completed tests.
Proceeding this it will open a window in your browser with a more detailed overview. This can also
be accessed directly on http://localhost:9323/.

