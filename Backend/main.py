# pyrefly: ignore [missing-import]

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv
import os

from api.analyze import router as analyze_router
from core.database import engine, Base
from routes import auth


# Load environment variables
load_dotenv()

app = FastAPI()


# Get CORS origins from .env
cors_origins_env = os.getenv("CORS_ORIGINS")

if cors_origins_env:
    origins = [origin.strip() for origin in cors_origins_env.split(",")]
else:
    origins = [
        "https://debugmindai.vercel.app",
        "http://localhost:3000",  # Common frontend local port
        "http://localhost:5173",  # Vite local port
    ]


# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Create database tables
Base.metadata.create_all(bind=engine)


# Register routes
app.include_router(auth.router)
app.include_router(analyze_router)


@app.get("/")
def root():
    return {
        "message": "AI Debugger Backend Running"
    }