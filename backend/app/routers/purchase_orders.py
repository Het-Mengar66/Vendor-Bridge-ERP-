from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.purchase_order import PurchaseOrderCreate, PurchaseOrderResponse, PurchaseOrderUpdate
from app.services.po_service import POService
from uuid import UUID
from typing import List

router = APIRouter(
    prefix="/api/v1/purchase-orders",
    tags=["Purchase Orders"]
)

@router.get("/", response_model=List[PurchaseOrderResponse])
def get_purchase_orders(db: Session = Depends(get_db)):
    return POService.get_all(db)

@router.get("/{id}", response_model=PurchaseOrderResponse)
def get_purchase_order(id: UUID, db: Session = Depends(get_db)):
    po = POService.get_by_id(db, id)
    if not po:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Purchase order not found"
        )
    return po

@router.post("/", response_model=PurchaseOrderResponse, status_code=status.HTTP_201_CREATED)
def create_purchase_order(po_in: PurchaseOrderCreate, db: Session = Depends(get_db)):
    # In a real app, created_by would come from the JWT auth session.
    # For now, we mock the creating user using the requested_by / creator ID.
    return POService.create(db, po_in, created_by=po_in.approval_id)

@router.put("/{id}/status", response_model=PurchaseOrderResponse)
def update_po_status(id: UUID, po_update: PurchaseOrderUpdate, db: Session = Depends(get_db)):
    po = POService.update_status(db, id, po_update.status)
    if not po:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Purchase order not found"
        )
    return po

@router.get("/{id}/pdf")
def get_po_pdf(id: UUID, db: Session = Depends(get_db)):
    po = POService.get_by_id(db, id)
    if not po:
        raise HTTPException(status_code=404, detail="Purchase order not found")
        
    po_dict = {
        "po_number": po.po_number,
        "vendor_id": str(po.vendor_id),
        "ship_to": po.ship_to,
        "subtotal": po.subtotal,
        "tax_amount": po.tax_amount,
        "grand_total": po.grand_total,
        "created_at": po.created_at.strftime('%Y-%m-%d') if po.created_at else "",
        "items": []
    }
    for item in po.items:
        po_dict["items"].append({
            "item_name": item.item_name,
            "quantity": item.quantity,
            "unit_price": item.unit_price,
            "total_price": item.total_price
        })
        
    from app.utils.pdf_generator import generate_po_pdf
    from fastapi.responses import FileResponse
    pdf_path = generate_po_pdf(po_dict)
    
    import os
    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=500, detail="Failed to generate PDF")
        
    return FileResponse(
        path=pdf_path, 
        filename=f"{po.po_number}.pdf", 
        media_type='application/pdf'
    )
