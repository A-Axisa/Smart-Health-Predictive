from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import items, authentication

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
app.include_router(authentication.router)
