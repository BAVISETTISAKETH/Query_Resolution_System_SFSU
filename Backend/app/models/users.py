from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str
    role: str

class UserResponse(UserBase):
    id: str
    role: str
    
    class Config:
        orm_mode = True
