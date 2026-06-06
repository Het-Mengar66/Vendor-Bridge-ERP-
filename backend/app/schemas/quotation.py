from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from uuid import UUID

class QuotationItemBase(BaseModel):
    rfq_item_id: UUID
    unit_price: float
    quantity: int
    total_price: float
    delivery_days: Optional[int] = None
    remarks: Optional[str] = None

class QuotationItemCreate(QuotationItemBase):
    pass

class QuotationItemResponse(QuotationItemBase):
    id: UUID
    quotation_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class QuotationBase(BaseModel):
    rfq_id: UUID
    vendor_id: UUID
    total_amount: float
    tax_amount: float = 0.0
    grand_total: float
    delivery_days: Optional[int] = None
    delivery_terms: Optional[str] = None
    notes: Optional[str] = None

class QuotationCreate(QuotationBase):
    items: List[QuotationItemCreate]

class QuotationResponse(QuotationBase):
    id: UUID
    quotation_number: str
    status: str
    submitted_at: datetime
    created_at: datetime
    updated_at: datetime
    items: List[QuotationItemResponse] = []

    class Config:
        from_attributes = True
