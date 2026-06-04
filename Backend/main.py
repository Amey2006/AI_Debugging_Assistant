# pyrefly: ignore [missing-import]
from fastapi import FastAPI
from api.analyze import router as analyze_router
from core.database import (
    engine,
    Base
)

# pyrefly: ignore [missing-import]
from routes import auth

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth.router)
app.include_router(analyze_router)

@app.get("/")
def root():
    return {
        "message": "AI Debugger Backend Running"
    }


