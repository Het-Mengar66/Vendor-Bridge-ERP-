from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.ai.agent import agent
from app.services.quotation_service import get_quotations_for_rfq
from uuid import UUID

router = APIRouter(
    prefix="/ai",
    tags=["AI Agent"],
)

@router.post("/analyze-quotations/{rfq_id}")
def analyze_quotations(rfq_id: UUID, db: Session = Depends(get_db)):
    # Fetch quotations for the RFQ
    rfq_quots = get_quotations_for_rfq(db, rfq_id)
    
    if not rfq_quots:
        raise HTTPException(status_code=404, detail="No quotations found for this RFQ")
        
    # Format quotations for agent
    formatted_quots = []
    for q in rfq_quots:
        formatted_quots.append({
            "id": str(q.id),
            "vendor_id": str(q.vendor_id),
            "total_amount": float(q.total_amount),
            "delivery_days": q.delivery_days
        })
        
    result = agent.run_analysis(str(rfq_id), formatted_quots)
    return result

@router.get("/analysis-result/{rfq_id}")
def get_analysis_result(rfq_id: UUID, db: Session = Depends(get_db)):
    # Mock retrieval of past analysis
    return {"message": f"Cached result for {rfq_id} would be here in a real implementation"}
