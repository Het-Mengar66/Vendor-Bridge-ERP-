from sqlalchemy.orm import Session
from app.models.invoice import Invoice, InvoiceItem
from app.models.purchase_order import PurchaseOrder, POItem
from app.schemas.invoice import InvoiceCreate, InvoiceUpdate
from uuid import UUID
from datetime import datetime, date
import random

class InvoiceService:
    @staticmethod
    def get_all(db: Session):
        return db.query(Invoice).all()

    @staticmethod
    def get_by_id(db: Session, invoice_id: UUID):
        return db.query(Invoice).filter(Invoice.id == invoice_id).first()

    @staticmethod
    def generate_from_po(db: Session, po_id: UUID, created_by: UUID):
        db_po = db.query(PurchaseOrder).filter(PurchaseOrder.id == po_id).first()
        if not db_po:
            return None
        
        # Auto-generate invoice number
        year = datetime.utcnow().year
        rand_num = random.randint(1000, 9999)
        invoice_number = f"INV-{year}-{rand_num}"

        db_invoice = Invoice(
            invoice_number=invoice_number,
            po_id=db_po.id,
            vendor_id=db_po.vendor_id,
            bill_to=db_po.bill_to,
            subtotal=db_po.subtotal,
            tax_percentage=18.00,  # default GST
            tax_amount=db_po.tax_amount,
            grand_total=db_po.grand_total,
            invoice_date=date.today(),
            status="generated",
            created_by=created_by
        )
        db.add(db_invoice)
        db.commit()
        db.refresh(db_invoice)

        # Generate items from PO Items
        po_items = db.query(POItem).filter(POItem.po_id == po_id).all()
        for item in po_items:
            db_item = InvoiceItem(
                invoice_id=db_invoice.id,
                item_name=item.item_name,
                description=item.description,
                quantity=item.quantity,
                unit_price=item.unit_price,
                total_price=item.total_price
            )
            db.add(db_item)
        
        db.commit()
        db.refresh(db_invoice)
        return db_invoice

    @staticmethod
    def update_status(db: Session, invoice_id: UUID, status: str):
        db_invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
        if not db_invoice:
            return None
        db_invoice.status = status
        db_invoice.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_invoice)
        return db_invoice
