from sqlalchemy.orm import Session
from app.models.purchase_order import PurchaseOrder, POItem
from app.schemas.purchase_order import PurchaseOrderCreate, PurchaseOrderUpdate
from uuid import UUID
from datetime import datetime
import random

class POService:
    @staticmethod
    def get_all(db: Session):
        return db.query(PurchaseOrder).all()

    @staticmethod
    def get_by_id(db: Session, po_id: UUID):
        return db.query(PurchaseOrder).filter(PurchaseOrder.id == po_id).first()

    @staticmethod
    def create(db: Session, po_in: PurchaseOrderCreate, created_by: UUID):
        # Generate PO number like PO-2026-XXXXX
        year = datetime.utcnow().year
        rand_num = random.randint(1000, 9999)
        po_number = f"PO-{year}-{rand_num}"

        db_po = PurchaseOrder(
            po_number=po_number,
            approval_id=po_in.approval_id,
            rfq_id=po_in.rfq_id,
            vendor_id=po_in.vendor_id,
            quotation_id=po_in.quotation_id,
            bill_to=po_in.bill_to,
            ship_to=po_in.ship_to,
            subtotal=po_in.subtotal,
            tax_amount=po_in.tax_amount,
            grand_total=po_in.grand_total,
            delivery_date=po_in.delivery_date,
            status="created",
            created_by=created_by
        )
        db.add(db_po)
        db.commit()
        db.refresh(db_po)

        # Create Items
        for item in po_in.items:
            db_item = POItem(
                po_id=db_po.id,
                item_name=item.item_name,
                description=item.description,
                quantity=item.quantity,
                unit_price=item.unit_price,
                total_price=item.total_price
            )
            db.add(db_item)
        
        db.commit()
        db.refresh(db_po)
        return db_po

    @staticmethod
    def update_status(db: Session, po_id: UUID, status: str):
        db_po = db.query(PurchaseOrder).filter(PurchaseOrder.id == po_id).first()
        if not db_po:
            return None
        db_po.status = status
        db_po.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_po)
        return db_po
