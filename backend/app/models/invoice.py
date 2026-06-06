from sqlalchemy import Column, String, Integer, Numeric, ForeignKey, DateTime, Date, Text, text
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base

class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    invoice_number = Column(String(50), unique=True, nullable=False)
    po_id = Column(UUID(as_uuid=True), ForeignKey("purchase_orders.id"), nullable=False)
    vendor_id = Column(UUID(as_uuid=True), ForeignKey("vendors.id"), nullable=False)
    bill_to = Column(Text)
    subtotal = Column(Numeric(15, 2), nullable=False)
    tax_percentage = Column(Numeric(5, 2), default=18.00)
    tax_amount = Column(Numeric(15, 2), nullable=False)
    grand_total = Column(Numeric(15, 2), nullable=False)
    invoice_date = Column(Date, server_default=text("CURRENT_DATE"))
    due_date = Column(Date)
    status = Column(String(30), default="generated")
    pdf_url = Column(Text)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, server_default=text("now()"))
    updated_at = Column(DateTime, server_default=text("now()"))

class InvoiceItem(Base):
    __tablename__ = "invoice_items"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    invoice_id = Column(UUID(as_uuid=True), ForeignKey("invoices.id", ondelete="CASCADE"))
    item_name = Column(String(255), nullable=False)
    description = Column(Text)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Numeric(15, 2), nullable=False)
    tax_percent = Column(Numeric(5, 2), default=0)
    tax_amount = Column(Numeric(15, 2), default=0)
    total_price = Column(Numeric(15, 2), nullable=False)
    created_at = Column(DateTime, server_default=text("now()"))
