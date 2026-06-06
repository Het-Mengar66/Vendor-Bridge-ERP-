from sqlalchemy.orm import Session
from app.models.quotation import Quotation, QuotationItem
from app.schemas.quotation import QuotationCreate
from uuid import UUID
import random
import string

def generate_quotation_number():
    rand_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"QT-2026-{rand_str}"

def create_quotation(db: Session, quotation: QuotationCreate):
    db_quotation = Quotation(
        quotation_number=generate_quotation_number(),
        rfq_id=quotation.rfq_id,
        vendor_id=quotation.vendor_id,
        total_amount=quotation.total_amount,
        tax_amount=quotation.tax_amount,
        grand_total=quotation.grand_total,
        delivery_days=quotation.delivery_days,
        delivery_terms=quotation.delivery_terms,
        notes=quotation.notes,
        status="submitted"
    )
    db.add(db_quotation)
    db.commit()
    db.refresh(db_quotation)

    for item in quotation.items:
        db_item = QuotationItem(
            quotation_id=db_quotation.id,
            rfq_item_id=item.rfq_item_id,
            unit_price=item.unit_price,
            quantity=item.quantity,
            total_price=item.total_price,
            delivery_days=item.delivery_days,
            remarks=item.remarks
        )
        db.add(db_item)
    
    db.commit()
    db.refresh(db_quotation)
    return db_quotation

def get_quotation(db: Session, quotation_id: UUID):
    return db.query(Quotation).filter(Quotation.id == quotation_id).first()

def get_quotations_for_rfq(db: Session, rfq_id: UUID):
    return db.query(Quotation).filter(Quotation.rfq_id == rfq_id).all()

def update_quotation_status(db: Session, quotation_id: UUID, status: str):
    db_quotation = get_quotation(db, quotation_id)
    if db_quotation:
        db_quotation.status = status
        db.commit()
        db.refresh(db_quotation)
    return db_quotation
