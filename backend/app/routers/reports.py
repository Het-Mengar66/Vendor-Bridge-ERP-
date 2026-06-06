from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.report_service import ReportService

router = APIRouter(
    prefix="/api/v1/reports",
    tags=["Reports & Analytics"],
)

@router.get("/dashboard-stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    return ReportService.get_dashboard_stats(db)

@router.get("/procurement-summary")
def get_procurement_summary(db: Session = Depends(get_db)):
    return ReportService.get_procurement_summary(db)

@router.get("/vendor-performance")
def get_vendor_performance(db: Session = Depends(get_db)):
    return ReportService.get_vendor_performance(db)

@router.get("/monthly-trends")
def get_monthly_trends(db: Session = Depends(get_db)):
    return ReportService.get_monthly_trends(db)

@router.get("/spending-by-category")
def get_spending_by_category(db: Session = Depends(get_db)):
    return ReportService.get_spending_by_category(db)

@router.get("/export")
def export_report_csv(db: Session = Depends(get_db)):
    import csv
    import os
    from fastapi.responses import FileResponse
    from app.models.purchase_order import PurchaseOrder
    
    pos = db.query(PurchaseOrder).all()
    
    file_path = "temp_pdfs/reports_export.csv"
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    
    with open(file_path, mode="w", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(["PO Number", "Status", "Subtotal", "Tax", "Grand Total", "Created At"])
        for po in pos:
            writer.writerow([po.po_number, po.status, po.subtotal, po.tax_amount, po.grand_total, po.created_at])
            
    return FileResponse(
        path=file_path,
        filename="procurement_report.csv",
        media_type="text/csv"
    )
