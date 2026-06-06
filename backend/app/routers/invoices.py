from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.invoice_service import InvoiceService
from app.schemas.invoice import InvoiceResponse, InvoiceUpdate
from uuid import UUID
from typing import List

router = APIRouter(
    prefix="/api/v1/invoices",
    tags=["Invoices"],
)

# Mocked created_by UUID for now, in a real app this would come from the auth token
MOCK_USER_ID = UUID("00000000-0000-0000-0000-000000000000")

@router.get("/", response_model=List[InvoiceResponse])
def get_all_invoices(db: Session = Depends(get_db)):
    return InvoiceService.get_all(db)

@router.get("/{invoice_id}", response_model=InvoiceResponse)
def get_invoice(invoice_id: UUID, db: Session = Depends(get_db)):
    invoice = InvoiceService.get_by_id(db, invoice_id)
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return invoice

@router.post("/generate/{po_id}", response_model=InvoiceResponse)
def generate_invoice(po_id: UUID, db: Session = Depends(get_db)):
    invoice = InvoiceService.generate_from_po(db, po_id=po_id, created_by=MOCK_USER_ID)
    if not invoice:
        raise HTTPException(status_code=404, detail="Purchase Order not found")
    return invoice

@router.put("/{invoice_id}/status", response_model=InvoiceResponse)
def update_invoice_status(invoice_id: UUID, status_update: InvoiceUpdate, db: Session = Depends(get_db)):
    invoice = InvoiceService.update_status(db, invoice_id, status=status_update.status)
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return invoice

@router.get("/{invoice_id}/pdf")
def get_invoice_pdf(invoice_id: UUID, db: Session = Depends(get_db)):
    from app.utils.pdf_generator import generate_invoice_pdf
    invoice = InvoiceService.get_by_id(db, invoice_id)
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
        
    invoice_dict = {
        "invoice_number": invoice.invoice_number,
        "invoice_date": invoice.invoice_date.strftime("%Y-%m-%d"),
        "bill_to": invoice.bill_to,
        "subtotal": float(invoice.subtotal),
        "tax_percentage": float(invoice.tax_percentage),
        "tax_amount": float(invoice.tax_amount),
        "grand_total": float(invoice.grand_total),
        "items": [
            {
                "item_name": item.item_name,
                "quantity": item.quantity,
                "unit_price": float(item.unit_price),
                "total_price": float(item.total_price)
            } for item in invoice.items
        ] if hasattr(invoice, 'items') else []
    }
    
    pdf_path = generate_invoice_pdf(invoice_dict)
    return {"message": f"PDF generated", "pdf_path": pdf_path}

@router.post("/{invoice_id}/send-email")
def send_invoice_email(invoice_id: UUID, db: Session = Depends(get_db)):
    from app.utils.email_sender import send_email_with_attachment
    
    # First ensure we have a PDF generated
    invoice = InvoiceService.get_by_id(db, invoice_id)
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    # Update status to sent
    invoice = InvoiceService.update_status(db, invoice_id, "sent")
    
    # Mocking vendor email retrieval and sending
    vendor_email = "vendor@example.com"
    subject = f"Invoice {invoice.invoice_number} from VendorBridge ERP"
    body = f"Dear Vendor,\n\nPlease find attached the invoice {invoice.invoice_number} for your recent purchase order.\n\nThank you."
    
    send_email_with_attachment(to_email=vendor_email, subject=subject, body=body, attachment_path="temp_pdfs/"+invoice.invoice_number+".pdf")
    
    return {"message": f"Invoice email sent for {invoice_id}"}
