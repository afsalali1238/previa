from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from auth.verify import get_current_user

load_dotenv()

app = FastAPI(title="Prometric Hero API")

# CORS configuration
origins = [
    "http://localhost:5173",  # React default port
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to Prometric Hero API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/protected")
async def protected_route(user = Depends(get_current_user)):
    return {"message": "You are authenticated", "user_id": user['uid']}