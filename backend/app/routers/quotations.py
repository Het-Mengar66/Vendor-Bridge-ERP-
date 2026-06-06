from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.database import get_db
from app.schemas.quotation import QuotationCreate, QuotationResponse
from app.services import quotation_service

router = APIRouter(
    prefix="/api/v1/quotations",
    tags=["Quotations"]
)

@router.post("/", response_model=QuotationResponse, status_code=status.HTTP_201_CREATED)
def submit_quotation(quotation: QuotationCreate, db: Session = Depends(get_db)):
    """Vendor submits a quotation for an RFQ"""
    # Logic to ensure the quotation doesn't already exist for this vendor/RFQ could be added here
    return quotation_service.create_quotation(db=db, quotation=quotation)

@router.get("/{quotation_id}", response_model=QuotationResponse)
def get_quotation(quotation_id: UUID, db: Session = Depends(get_db)):
    """Get details of a specific quotation"""
    db_quotation = quotation_service.get_quotation(db, quotation_id)
    if not db_quotation:
        raise HTTPException(status_code=404, detail="Quotation not found")
    return db_quotation

@router.get("/compare/{rfq_id}", response_model=List[QuotationResponse])
def compare_quotations(rfq_id: UUID, db: Session = Depends(get_db)):
    """Get all quotations for a specific RFQ to compare them"""
    return quotation_service.get_quotations_for_rfq(db, rfq_id)

@router.post("/{quotation_id}/select", response_model=QuotationResponse)
def select_quotation(quotation_id: UUID, db: Session = Depends(get_db)):
    """Select a quotation (Triggers approval workflow)"""
    db_quotation = quotation_service.update_quotation_status(db, quotation_id, "under_review")
    if not db_quotation:
        raise HTTPException(status_code=404, detail="Quotation not found")
    
    # TODO: Integration with Approval Service to trigger the workflow
    
    return db_quotation
