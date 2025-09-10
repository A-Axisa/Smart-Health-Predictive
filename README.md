# Smart-Health-Predictive

## Getting Started
### Prerequisites
- Node.js v22.x or higher
- npm
- Docker Desktop

### Running the Web Application
1. Open a terminal and navigate to the project directory.
2. Run the server.  
```node server\src\server.js```
3. Open a second terminal and navigate to the client folder in the project directory.  
4. Install packages with npm and run the client.  
```npm install```  
```npm start```

### Running the Database (Docker)
1. Open terminal and navigate to Smart-Health-Predictive\server\
2. Install necessary dependencies:
```npm install dotenv mysql2```
3. Install and run Docker Desktop.
4. Navigate to the project root directory (Smart-Health-Predictive\).
5. Create and start the Docker container:
```docker compose up -d```
6. Run the initial migration script:
```docker exec -i shp-mysql mysql -uadmin -padmin user-db < server/src/migrations/01_init_schema.sql```
7. Verify table creation in database:
```docker exec -it shp-mysql mysql -uadmin -padmin user-db -e "SHOW TABLES;"```