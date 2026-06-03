from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from schemas.user import (
    UserCreate,
    UserLogin,
    UserResponse
)

from core.database import get_db

from services.auth_service import (
    create_user,
    authenticate_user
)

from core.security import create_access_token

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)


@router.post(
    "/register",
    response_model=UserResponse
)
def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    return create_user(db, user)


@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    db_user = authenticate_user(
        db,
        user.email,
        user.password
    )

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    token = create_access_token({
        "sub": db_user.email
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }