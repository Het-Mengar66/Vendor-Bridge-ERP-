from sqlalchemy import Column, String, Integer, Numeric, ForeignKey, DateTime, Text, text
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base

class Quotation(Base):
    __tablename__ = "quotations"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    quotation_number = Column(String(50), unique=True, nullable=False)
    rfq_id = Column(UUID(as_uuid=True), ForeignKey("rfqs.id"), nullable=False)
    vendor_id = Column(UUID(as_uuid=True), ForeignKey("vendors.id"), nullable=False)
    total_amount = Column(Numeric(15, 2), nullable=False)
    tax_amount = Column(Numeric(15, 2), default=0)
    grand_total = Column(Numeric(15, 2), nullable=False)
    delivery_days = Column(Integer)
    delivery_terms = Column(Text)
    notes = Column(Text)
    status = Column(String(30), default="submitted")
    submitted_at = Column(DateTime, server_default=text("now()"))
    created_at = Column(DateTime, server_default=text("now()"))
    updated_at = Column(DateTime, server_default=text("now()"))

class QuotationItem(Base):
    __tablename__ = "quotation_items"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    quotation_id = Column(UUID(as_uuid=True), ForeignKey("quotations.id", ondelete="CASCADE"))
    rfq_item_id = Column(UUID(as_uuid=True), ForeignKey("rfq_items.id"))
    unit_price = Column(Numeric(15, 2), nullable=False)
    quantity = Column(Integer, nullable=False)
    total_price = Column(Numeric(15, 2), nullable=False)
    delivery_days = Column(Integer)
    remarks = Column(Text)
    created_at = Column(DateTime, server_default=text("now()"))
