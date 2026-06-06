from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.activity_service import ActivityService
from app.schemas.activity_log import ActivityLogResponse, ActivityLogCreate
from typing import List, Optional

router = APIRouter(
    prefix="/api/v1/activity",
    tags=["Activity Logs"],
)

@router.get("/logs", response_model=List[ActivityLogResponse])
def get_activity_logs(
    filter: Optional[str] = Query("all", description="Filter by entity type (all, rfq, quotation, approval, po, invoice)"),
    db: Session = Depends(get_db)
):
    return ActivityService.get_all(db, filter_type=filter)

@router.post("/logs", response_model=ActivityLogResponse)
def create_activity_log(log_in: ActivityLogCreate, db: Session = Depends(get_db)):
    return ActivityService.create_log(db, log_in)
