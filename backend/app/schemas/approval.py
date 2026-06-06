from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class ApprovalBase(BaseModel):
    rfq_id: UUID
    quotation_id: UUID
    vendor_id: UUID
    requested_by: UUID

class ApprovalCreate(ApprovalBase):
    pass

class ApprovalUpdate(BaseModel):
    status: str
    remarks: Optional[str] = None
    approved_by: UUID

class ApprovalResponse(ApprovalBase):
    id: UUID
    approved_by: Optional[UUID] = None
    status: str
    remarks: Optional[str] = None
    approval_date: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
