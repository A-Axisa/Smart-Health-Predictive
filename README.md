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

## FastApi
### First time set up
1. Open Command Prompt
2. Run pip install "fastapi[standard]"

### Run FastApi
1. Navigate to FastApi Directory
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