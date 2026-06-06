from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.approval import ApprovalCreate, ApprovalUpdate, ApprovalResponse
from app.services.approval_service import ApprovalService
from uuid import UUID
from typing import List

router = APIRouter(
    prefix="/api/v1/approvals",
    tags=["Approvals"]
)

@router.get("/", response_model=List[ApprovalResponse])
def get_approvals(db: Session = Depends(get_db)):
    return ApprovalService.get_all(db)

@router.get("/{id}", response_model=ApprovalResponse)
def get_approval(id: UUID, db: Session = Depends(get_db)):
    approval = ApprovalService.get_by_id(db, id)
    if not approval:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Approval request not found"
        )
    return approval

@router.post("/", response_model=ApprovalResponse, status_code=status.HTTP_210_CREATED)
def create_approval(approval_in: ApprovalCreate, db: Session = Depends(get_db)):
    return ApprovalService.create(db, approval_in)

@router.post("/{id}/approve", response_model=ApprovalResponse)
def approve_request(id: UUID, approval_update: ApprovalUpdate, db: Session = Depends(get_db)):
    approval_update.status = "approved"
    approval = ApprovalService.update_status(db, id, approval_update)
    if not approval:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Approval request not found"
        )
    return approval

@router.post("/{id}/reject", response_model=ApprovalResponse)
def reject_request(id: UUID, approval_update: ApprovalUpdate, db: Session = Depends(get_db)):
    approval_update.status = "rejected"
    approval = ApprovalService.update_status(db, id, approval_update)
    if not approval:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Approval request not found"
        )
    return approval
