from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.report_service import ReportService

router = APIRouter(
    prefix="/reports",
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
