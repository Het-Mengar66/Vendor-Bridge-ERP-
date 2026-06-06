from sqlalchemy import Column, String, DateTime, text, JSON
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    user_id = Column(UUID(as_uuid=True), nullable=True) # UUID of user who performed the action (raw column, no FK relation)
    action_type = Column(String(50), nullable=False)   # e.g., 'rfq_created', 'quotation_submitted', 'approval_approved', etc.
    entity_type = Column(String(50), nullable=False)   # e.g., 'rfq', 'quotation', 'approval', 'po', 'invoice'
    entity_id = Column(UUID(as_uuid=True), nullable=False)
    description = Column(String, nullable=False)
    meta_data = Column("metadata", JSON, nullable=True)             # Extra data as JSON
    created_at = Column(DateTime, server_default=text("now()"))
