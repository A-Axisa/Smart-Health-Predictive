
<a href="https://wellai.app/">
  <img src="client/src/assets/WellAiLogoTR.png" alt="WellAI logo" title="Well AI" height="60" align="right" >
</a>


# WellAI - Smart Health Predictive

Smart Health Predictive empowers individuals to take control of their well-being through data-driven insights. Using AI-powered health analytics, WellAI helps you understand potential health risks early and make informed lifestyle choices for a better, healthier future.


## Prerequisites
- Node.js v22+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)


## How to Build

1. To build the project:
```shell
# Navigate to https://github.com/A-Axisa/Smart-Health-Predictive

# Ensure Git is installed
# Open a terminal (Command Prompt or PowerShell for Windows, Terminal for macOS or Linux)

# Clone the repository
git clone https://github.com/A-Axisa/Smart-Health-Predictive.git

# Navigate to the project directory and run the services
docker compose up -d
```


## Services
- Frontend: http://localhost:3000/
- Backend: http://localhost:8000/
- API Docs: http://localhost:8000/docs


## Installing Dependencies (Manual)

> [!NOTE]  
> The docker-compose file already runs these commands automatically.

### Client
1. Navigate to ```root/client``` and run:
```bash
npm install
```

### Server
1. Navigate to ```root/server``` and run:
```bash
pip3 install -r requirements.txt
```


## Generating Dummy Data

The script will generate random data directly into the database.
The amount of data generated can be modified at the head of the script.

1. Navigate to the project directory:
```bash
python -m server.tools.generate_dummy_data
```


## Using Alembic

To update your database to the latest migration run:
```bash
alembic upgrade head
```

To remove all tables and data run:
```bash
alembic downgrade base
```  


### Adding a Migration

1. Navigate to ```root/server/models/dbmodels.py``` and modify/ create tables as necessary.
2. Navigate to ```root/server``` and run:   
```bash
alembic upgrade head
alembic revision --autogenerate -m "Your migration description."

# This will auto-generate a version in /root/server/alembic/versions/
```  

Refer to the [Alembic Docs](https://alembic.sqlalchemy.org/en/latest/ops.html) for more detail.


## Testing

To run all integration tests, navigate to ```root/server```:
```bash
# Run the tests
pytest
```

### End-to-end Testing
1. If not already installed, run the command:  
```bash
npx playwright install
```
2. Navigate to the ```root/client```:
```bash
npx playwright test
```  
Tests will now begin running and the terminal will log the status of completed tests.
Following this it will open a window in your browser with a more detailed overview. This can also
be accessed directly on http://localhost:9323/.

### Load Testing
1. If not already install k6 on your machine
2. Navigate to the project directory:
```bash
# There are currently a number of test types you can run:
# - average
# - breakpoint
# - smoke
# - soak
# - spike
# - stress

# To ensure that k6 is operational, run:

k6 run \
  -e BASEURL=http://localhost:8000 \
  -e ADMIN_EMAIL=SHP_Admin@example.com -e ADMIN_PASSWORD=password12345678 \
  -e MERCHANT_EMAIL=service@example.com -e MERCHANT_PASSWORD=thisismypassword \
  -e USER_EMAIL=audrey.young@example.com -e USER_PASSWORD=whyaretherebirds \
  load-tests/tests/smoke.js
```


[Return to top](#wellai---smart-health-predictive)