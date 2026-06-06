import os
from uuid import UUID
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors

# In a real app, this should upload to Supabase storage.
# For now, we will just save to a local temporary directory.

TEMP_PDF_DIR = "temp_pdfs"

def generate_invoice_pdf(invoice_data: dict) -> str:
    """
    Generates a PDF for the given invoice_data using reportlab.
    Returns the file path of the generated PDF.
    """
    if not os.path.exists(TEMP_PDF_DIR):
        os.makedirs(TEMP_PDF_DIR)
        
    invoice_number = invoice_data.get("invoice_number", "INV-UNKNOWN")
    file_path = os.path.join(TEMP_PDF_DIR, f"{invoice_number}.pdf")
    
    c = canvas.Canvas(file_path, pagesize=letter)
    width, height = letter
    
    # Header
    c.setFont("Helvetica-Bold", 24)
    c.drawString(50, height - 50, "INVOICE")
    
    c.setFont("Helvetica", 12)
    c.drawString(50, height - 80, f"Invoice Number: {invoice_number}")
    c.drawString(50, height - 100, f"Date: {invoice_data.get('invoice_date', datetime.today().strftime('%Y-%m-%d'))}")
    
    # Bill To
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, height - 140, "Bill To:")
    c.setFont("Helvetica", 12)
    bill_to = invoice_data.get("bill_to") or "N/A"
    c.drawString(50, height - 160, bill_to)
    
    # Items Header
    y = height - 220
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Item")
    c.drawString(300, y, "Qty")
    c.drawString(400, y, "Unit Price")
    c.drawString(500, y, "Total")
    
    c.line(50, y - 5, 550, y - 5)
    
    # Items
    c.setFont("Helvetica", 12)
    y -= 25
    items = invoice_data.get("items", [])
    for item in items:
        c.drawString(50, y, str(item.get("item_name", "Item")))
        c.drawString(300, y, str(item.get("quantity", 0)))
        c.drawString(400, y, f"${item.get('unit_price', 0):.2f}")
        c.drawString(500, y, f"${item.get('total_price', 0):.2f}")
        y -= 20
    
    c.line(50, y - 5, 550, y - 5)
    y -= 25
    
    # Totals
    c.setFont("Helvetica-Bold", 12)
    c.drawString(400, y, "Subtotal:")
    c.drawString(500, y, f"${invoice_data.get('subtotal', 0):.2f}")
    y -= 20
    c.drawString(400, y, f"Tax ({invoice_data.get('tax_percentage', 18)}%):")
    c.drawString(500, y, f"${invoice_data.get('tax_amount', 0):.2f}")
    y -= 20
    c.drawString(400, y, "Grand Total:")
    c.drawString(500, y, f"${invoice_data.get('grand_total', 0):.2f}")
    
    c.save()
    
    return file_path

def generate_po_pdf(po_data: dict) -> str:
    """
    Generates a PDF for the given Purchase Order.
    Returns the file path of the generated PDF.
    """
    if not os.path.exists(TEMP_PDF_DIR):
        os.makedirs(TEMP_PDF_DIR)
        
    po_number = po_data.get("po_number", "PO-UNKNOWN")
    file_path = os.path.join(TEMP_PDF_DIR, f"{po_number}.pdf")
    
    c = canvas.Canvas(file_path, pagesize=letter)
    width, height = letter
    
    # Header
    c.setFont("Helvetica-Bold", 24)
    c.drawString(50, height - 50, "PURCHASE ORDER")
    
    c.setFont("Helvetica", 12)
    c.drawString(50, height - 80, f"PO Number: {po_number}")
    c.drawString(50, height - 100, f"Date: {po_data.get('created_at', datetime.today().strftime('%Y-%m-%d'))}")
    
    # Bill To / Ship To
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, height - 140, "Vendor:")
    c.setFont("Helvetica", 12)
    c.drawString(50, height - 160, str(po_data.get("vendor_id", "N/A")))
    
    c.setFont("Helvetica-Bold", 12)
    c.drawString(300, height - 140, "Ship To:")
    c.setFont("Helvetica", 12)
    c.drawString(300, height - 160, po_data.get("ship_to", "N/A"))
    
    # Items Header
    y = height - 220
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Item")
    c.drawString(300, y, "Qty")
    c.drawString(400, y, "Unit Price")
    c.drawString(500, y, "Total")
    
    c.line(50, y - 5, 550, y - 5)
    
    # Items
    c.setFont("Helvetica", 12)
    y -= 25
    items = po_data.get("items", [])
    for item in items:
        c.drawString(50, y, str(item.get("item_name", "Item")))
        c.drawString(300, y, str(item.get("quantity", 0)))
        c.drawString(400, y, f"${item.get('unit_price', 0):.2f}")
        c.drawString(500, y, f"${item.get('total_price', 0):.2f}")
        y -= 20
    
    c.line(50, y - 5, 550, y - 5)
    y -= 25
    
    # Totals
    c.setFont("Helvetica-Bold", 12)
    c.drawString(400, y, "Subtotal:")
    c.drawString(500, y, f"${po_data.get('subtotal', 0):.2f}")
    y -= 20
    c.drawString(400, y, f"Tax:")
    c.drawString(500, y, f"${po_data.get('tax_amount', 0):.2f}")
    y -= 20
    c.drawString(400, y, "Grand Total:")
    c.drawString(500, y, f"${po_data.get('grand_total', 0):.2f}")
    
    c.save()
    
    return file_path
