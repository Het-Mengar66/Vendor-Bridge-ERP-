from sqlalchemy.orm import Session
from app.models.approval import Approval
from app.models.quotation import Quotation
from app.models.purchase_order import PurchaseOrder
from app.schemas.approval import ApprovalCreate, ApprovalUpdate
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
            elif approval_update.status == "rejected":
                quotation.status = "rejected"
        
        db.commit()
        db.refresh(db_approval)
        return db_approval
