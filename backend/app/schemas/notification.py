from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class NotificationBase(BaseModel):
    user_id: UUID
    title: str
    message: Optional[str] = None
    type: Optional[str] = None
    entity_type: Optional[str] = None
    entity_id: Optional[UUID] = None
    is_read: bool = False

class NotificationCreate(NotificationBase):
    pass

class NotificationResponse(NotificationBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
