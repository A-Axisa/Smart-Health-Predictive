from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import items,AIPrediction, getHealthDataDates, getReportData, authentication, health_analytics, health_analytics, users, roles, userRoles 

ORIGINS = [
    "http://localhost:3000",
    "http://localhost:8000",
]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

app.include_router(items.router)
app.include_router(AIPrediction.router)
app.include_router(getHealthDataDates.router)
app.include_router(getReportData.router)
app.include_router(authentication.router)
app.include_router(health_analytics.router)
app.include_router(users.router)
app.include_router(roles.router)
app.include_router(userRoles.router)