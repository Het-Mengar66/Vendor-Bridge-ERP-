from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from uuid import UUID

class UserBase(BaseModel):
    email: EmailStr
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)
    role: str = Field(..., pattern="^(admin|procurement_officer|vendor|manager)$")
    country: Optional[str] = Field(None, max_length=100)
    avatar_url: Optional[str] = None
    additional_info: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserUpdate(BaseModel):
    first_name: Optional[str] = Field(None, min_length=1, max_length=100)
    last_name: Optional[str] = Field(None, min_length=1, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)
    country: Optional[str] = Field(None, max_length=100)
    avatar_url: Optional[str] = None
    additional_info: Optional[str] = None
    is_active: Optional[bool] = None

class UserRoleUpdate(BaseModel):
    role: str = Field(..., pattern="^(admin|procurement_officer|vendor|manager)$")

class UserResponse(UserBase):
    id: UUID
    is_active: bool
    supabase_uid: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
