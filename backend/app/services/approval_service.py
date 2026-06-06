from sqlalchemy.orm import Session
from app.models.approval import Approval
from app.models.quotation import Quotation
from app.models.purchase_order import PurchaseOrder
from app.schemas.approval import ApprovalCreate, ApprovalUpdate
from app.schemas.purchase_order import PurchaseOrderCreate, POItemCreate
from app.services.po_service import POService
from app.services.activity_service import ActivityService
from app.schemas.activity_log import ActivityLogCreate
from uuid import UUID
from datetime import datetime

class ApprovalService:
    @staticmethod
    def get_all(db: Session):
        return db.query(Approval).all()

    @staticmethod
    def get_by_id(db: Session, approval_id: UUID):
        return db.query(Approval).filter(Approval.id == approval_id).first()

    @staticmethod
    def create(db: Session, approval_in: ApprovalCreate):
        db_approval = Approval(
            rfq_id=approval_in.rfq_id,
            quotation_id=approval_in.quotation_id,
            vendor_id=approval_in.vendor_id,
            requested_by=approval_in.requested_by,
            status="pending"
        )
        db.add(db_approval)
        db.commit()
        db.refresh(db_approval)
        
        # Log activity
        ActivityService.create_log(db, ActivityLogCreate(
            user_id=approval_in.requested_by,
            action="Submitted for Approval",
            entity_type="approval",
            entity_id=db_approval.id,
            target=str(db_approval.id)
        ))
        
        return db_approval

    @staticmethod
    def update_status(db: Session, approval_id: UUID, approval_update: ApprovalUpdate):
        db_approval = db.query(Approval).filter(Approval.id == approval_id).first()
        if not db_approval:
            return None
        
        db_approval.status = approval_update.status
        db_approval.remarks = approval_update.remarks
        db_approval.approved_by = approval_update.approved_by
        db_approval.approval_date = datetime.utcnow()
        db_approval.updated_at = datetime.utcnow()
        
        # Update associated quotation status
        quotation = db.query(Quotation).filter(Quotation.id == db_approval.quotation_id).first()
        if quotation:
            if approval_update.status == "approved":
                quotation.status = "accepted"
                
                # Auto-generate PO
                po_items = [
                    POItemCreate(
                        item_name="RFQ Item", # Ideally join with RFQItem to get actual name
                        quantity=item.quantity,
                        unit_price=item.unit_price,
                        total_price=item.total_price
                    ) for item in quotation.items
                ]
                
                po_create = PurchaseOrderCreate(
                    approval_id=db_approval.id,
                    rfq_id=db_approval.rfq_id,
                    vendor_id=db_approval.vendor_id,
                    quotation_id=db_approval.quotation_id,
                    subtotal=quotation.total_amount,
                    tax_amount=quotation.tax_amount,
                    grand_total=quotation.grand_total,
                    items=po_items
                )
                POService.create(db, po_in=po_create, created_by=approval_update.approved_by)
                
            elif approval_update.status == "rejected":
                quotation.status = "rejected"
        
        # Log activity
        ActivityService.create_log(db, ActivityLogCreate(
            user_id=approval_update.approved_by,
            action=f"Marked Approval as {approval_update.status}",
            entity_type="approval",
            entity_id=db_approval.id,
            target=str(db_approval.id)
        ))
        
        db.commit()
        db.refresh(db_approval)
        return db_approval
