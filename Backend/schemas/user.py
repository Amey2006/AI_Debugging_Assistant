from pydantic import BaseModel
from pydantic import EmailStr


class UserCreate(BaseModel):
    email: str
    password: str
    username: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr

    class Config:
        from_attributes = True