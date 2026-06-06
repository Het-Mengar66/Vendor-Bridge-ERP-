from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, date
from uuid import UUID

class POItemBase(BaseModel):
    item_name: str
    description: Optional[str] = None
    quantity: int
    unit_price: float
    total_price: float

class POItemCreate(POItemBase):
    pass

class POItemResponse(POItemBase):
    id: UUID
    po_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class PurchaseOrderBase(BaseModel):
    approval_id: UUID
    rfq_id: UUID
    vendor_id: UUID
    quotation_id: UUID
    bill_to: Optional[str] = None
    ship_to: Optional[str] = None
    subtotal: float
    tax_amount: float = 0.0
    grand_total: float
    delivery_date: Optional[date] = None

class PurchaseOrderCreate(PurchaseOrderBase):
    items: List[POItemCreate]

class PurchaseOrderUpdate(BaseModel):
    status: str

class PurchaseOrderResponse(PurchaseOrderBase):
    id: UUID
    po_number: str
    order_date: date
    status: str
    created_by: UUID
    created_at: datetime
    updated_at: datetime
    items: List[POItemResponse] = []

    class Config:
        from_attributes = True
