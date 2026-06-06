from sqlalchemy import Column, String, DateTime, text, Boolean, Text
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    user_id = Column(UUID(as_uuid=True), nullable=False) # User notified (raw column, no FK relation)
    title = Column(String(300), nullable=False)
    message = Column(Text, nullable=True)
    type = Column(String(50), nullable=True)             # e.g., 'rfq', 'approval', 'invoice', 'system'
    entity_type = Column(String(50), nullable=True)
    entity_id = Column(UUID(as_uuid=True), nullable=True)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=text("now()"))
