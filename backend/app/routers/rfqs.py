from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
import uuid

from app.database import get_db
from app.models.rfq import RFQ, RFQItem, RFQVendor
from app.schemas.rfq import RFQCreate, RFQResponse, RFQUpdate, RFQVendorCreate
from app.models.user import User
from app.dependencies import get_current_user

router = APIRouter(
    prefix="/rfqs",
    tags=["RFQs"]
)

@router.post("/", response_model=RFQResponse, status_code=status.HTTP_201_CREATED)
def create_rfq(rfq_in: RFQCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in ["procurement_officer", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized to create RFQs")
    
    # Generate an RFQ number
    count = db.query(RFQ).count()
    rfq_number = f"RFQ-2026-{count + 1:03d}"
    
    db_rfq = RFQ(
        rfq_number=rfq_number,
        title=rfq_in.title,
        description=rfq_in.description,
        category=rfq_in.category,
        deadline=rfq_in.deadline,
        status=rfq_in.status,
        created_by=current_user.id
    )
    db.add(db_rfq)
    db.commit()
    db.refresh(db_rfq)
    
    if rfq_in.items:
        for item in rfq_in.items:
            db_item = RFQItem(
                rfq_id=db_rfq.id,
                item_name=item.item_name,
                description=item.description,
                quantity=item.quantity,
                unit=item.unit,
                specifications=item.specifications
            )
            db.add(db_item)
        db.commit()
        db.refresh(db_rfq)
        
    return db_rfq

@router.get("/", response_model=List[RFQResponse])
def list_rfqs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    rfqs = db.query(RFQ).offset(skip).limit(limit).all()
    return rfqs

@router.get("/{rfq_id}", response_model=RFQResponse)
def get_rfq(rfq_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    rfq = db.query(RFQ).filter(RFQ.id == rfq_id).first()
    if not rfq:
        raise HTTPException(status_code=404, detail="RFQ not found")
    return rfq

@router.put("/{rfq_id}", response_model=RFQResponse)
def update_rfq(rfq_id: UUID, rfq_in: RFQUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    rfq = db.query(RFQ).filter(RFQ.id == rfq_id).first()
    if not rfq:
        raise HTTPException(status_code=404, detail="RFQ not found")
        
    if current_user.role not in ["procurement_officer", "admin"] or rfq.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this RFQ")
        
    update_data = rfq_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(rfq, key, value)
        
    db.commit()
    db.refresh(rfq)
    return rfq

@router.post("/{rfq_id}/vendors", status_code=status.HTTP_201_CREATED)
def assign_vendors(rfq_id: UUID, vendors_in: List[RFQVendorCreate], db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    rfq = db.query(RFQ).filter(RFQ.id == rfq_id).first()
    if not rfq:
        raise HTTPException(status_code=404, detail="RFQ not found")
        
    assigned = []
    for vendor in vendors_in:
        # Check if already assigned
        existing = db.query(RFQVendor).filter(RFQVendor.rfq_id == rfq_id, RFQVendor.vendor_id == vendor.vendor_id).first()
        if not existing:
            new_assignment = RFQVendor(rfq_id=rfq_id, vendor_id=vendor.vendor_id)
            db.add(new_assignment)
            assigned.append(new_assignment)
            
    db.commit()
    return {"message": f"{len(assigned)} vendors assigned successfully"}
