# pyrefly: ignore [missing-import]
from fastapi import FastAPI
from api.analyze import router as analyze_router
from core.database import (
    engine,
    Base
)

# pyrefly: ignore [missing-import]
from routes import auth
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

# Parse CORS origins from environment, fallback to allowing all if not specified
cors_origins_env = os.environ.get("CORS_ORIGINS", "*")
origins = [origin.strip() for origin in cors_origins_env.split(",")] if cors_origins_env else ["*"]

# 2. Add the CORS middleware to your FastAPI app
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # Allows requests from your React app
    allow_credentials=True,
    allow_methods=["*"],              # Allows all HTTP methods (POST, GET, etc.)
    allow_headers=["*"],              # Allows all headers
)
Base.metadata.create_all(bind=engine)


app.include_router(auth.router)
app.include_router(analyze_router)

@app.get("/")
def root():
    return {
        "message": "AI Debugger Backend Running"
    }

