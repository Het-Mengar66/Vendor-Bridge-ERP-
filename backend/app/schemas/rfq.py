from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional
from datetime import datetime
from uuid import UUID

# --- RFQ Item Schemas ---
class RFQItemBase(BaseModel):
    item_name: str
    description: Optional[str] = None
    quantity: int = Field(gt=0)
    unit: Optional[str] = "pcs"
    specifications: Optional[str] = None

class RFQItemCreate(RFQItemBase):
    pass

class RFQItemResponse(RFQItemBase):
    id: UUID
    rfq_id: UUID
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# --- RFQ Vendor Schemas ---
class RFQVendorBase(BaseModel):
    vendor_id: UUID

class RFQVendorCreate(RFQVendorBase):
    pass

class RFQVendorResponse(RFQVendorBase):
    id: UUID
    rfq_id: UUID
    status: str
    invited_at: datetime
    model_config = ConfigDict(from_attributes=True)

# --- RFQ Attachment Schemas ---
class RFQAttachmentBase(BaseModel):
    file_name: str
    file_url: str
    file_size: Optional[int] = None

class RFQAttachmentCreate(RFQAttachmentBase):
    pass

class RFQAttachmentResponse(RFQAttachmentBase):
    id: UUID
    rfq_id: UUID
    uploaded_at: datetime
    model_config = ConfigDict(from_attributes=True)

# --- RFQ Schemas ---
class RFQBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    deadline: datetime
    status: Optional[str] = "draft"

class RFQCreate(RFQBase):
    # Optional nested creation for items
    items: Optional[List[RFQItemCreate]] = []

class RFQUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    deadline: Optional[datetime] = None
    status: Optional[str] = None

class RFQResponse(RFQBase):
    id: UUID
    rfq_number: str
    status: str
    created_by: UUID
    created_at: datetime
    updated_at: datetime
    
    # Optionally include items/vendors/attachments if eager loaded
    items: Optional[List[RFQItemResponse]] = []
    vendors: Optional[List[RFQVendorResponse]] = []
    attachments: Optional[List[RFQAttachmentResponse]] = []
    
    model_config = ConfigDict(from_attributes=True)
