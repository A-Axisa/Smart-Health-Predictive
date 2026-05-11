import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import health_prediction, authentication, users, admin

DEFAULT_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:8000",
    "https://smart-health-predictive-test.onrender.com"
]
ENV_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "").split(",")
    if origin.strip()
]
ORIGINS = DEFAULT_ORIGINS + [
    origin for origin in ENV_ORIGINS if origin not in DEFAULT_ORIGINS
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

app.include_router(health_prediction.router)
app.include_router(authentication.router)
app.include_router(users.router)
app.include_router(admin.router)
