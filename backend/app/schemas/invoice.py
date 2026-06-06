from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, date
from uuid import UUID

class InvoiceItemBase(BaseModel):
    item_name: str
    description: Optional[str] = None
    quantity: int
    unit_price: float
    tax_percent: float = 0.0
    tax_amount: float = 0.0
    total_price: float

class InvoiceItemCreate(InvoiceItemBase):
    pass

class InvoiceItemResponse(InvoiceItemBase):
    id: UUID
    invoice_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class InvoiceBase(BaseModel):
    po_id: UUID
    vendor_id: UUID
    bill_to: Optional[str] = None
    subtotal: float
    tax_percentage: float = 18.0
    tax_amount: float
    grand_total: float
    due_date: Optional[date] = None

class InvoiceCreate(InvoiceBase):
    items: List[InvoiceItemCreate]

class InvoiceUpdate(BaseModel):
    status: str

class InvoiceResponse(InvoiceBase):
    id: UUID
    invoice_number: str
    invoice_date: date
    status: str
    pdf_url: Optional[str] = None
    created_by: UUID
    created_at: datetime
    updated_at: datetime
    items: List[InvoiceItemResponse] = []

    class Config:
        from_attributes = True
