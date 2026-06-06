from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
from uuid import UUID

class ActivityLogBase(BaseModel):
    user_id: Optional[UUID] = None
    action_type: str
    entity_type: str
    entity_id: UUID
    description: str
    metadata: Optional[Dict[str, Any]] = None

class ActivityLogCreate(ActivityLogBase):
    pass

class ActivityLogResponse(ActivityLogBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
