from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from app.database import get_db
from app.models.vendor import Vendor
from app.models.user import User
from app.schemas.vendor import VendorCreate, VendorUpdate, VendorResponse
from app.dependencies import get_current_user, RoleChecker

router = APIRouter(prefix="/vendors", tags=["Vendors"])

# Role checkers
officer_or_admin = RoleChecker(["admin", "procurement_officer", "manager"])
admin_only = RoleChecker(["admin"])

@router.get("/", response_model=List[VendorResponse])
def list_vendors(
    search: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(officer_or_admin)
):
    query = db.query(Vendor)
    
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (Vendor.company_name.ilike(search_filter)) |
            (Vendor.contact_name.ilike(search_filter)) |
            (Vendor.email.ilike(search_filter)) |
            (Vendor.gst_number.ilike(search_filter))
        )
        
    if category:
        query = query.filter(Vendor.category == category)
        
    if status:
        query = query.filter(Vendor.status == status)
        
    return query.offset(offset).limit(limit).all()

@router.post("/", response_model=VendorResponse, status_code=status.HTTP_201_CREATED)
def create_vendor(
    vendor_in: VendorCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role == "vendor":
        # Vendors can only create their own profile
        vendor_in.user_id = current_user.id
    elif current_user.role not in ["admin", "procurement_officer", "manager"]:
        raise HTTPException(status_code=403, detail="Not authorized to create vendors")
    # Check if vendor email is unique
    existing_vendor = db.query(Vendor).filter(Vendor.email == vendor_in.email).first()
    if existing_vendor:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A vendor with this email already exists"
        )
        
    db_vendor = Vendor(
        **vendor_in.model_dump(),
        created_by=current_user.id
    )
    db.add(db_vendor)
    db.commit()
    db.refresh(db_vendor)
    return db_vendor

@router.get("/me", response_model=VendorResponse)
def get_my_vendor(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "vendor":
        raise HTTPException(status_code=400, detail="Only vendors have a vendor profile")
    vendor = db.query(Vendor).filter(Vendor.user_id == current_user.id).first()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor profile not found")
    return vendor

@router.get("/{id}", response_model=VendorResponse)
def get_vendor(
    id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    vendor = db.query(Vendor).filter(Vendor.id == id).first()
    if not vendor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vendor not found"
        )
        
    # Vendors can only see themselves. Admin/Officer can see any.
    if current_user.role == "vendor" and vendor.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to view this vendor's details"
        )
        
    return vendor

@router.put("/{id}", response_model=VendorResponse)
def update_vendor(
    id: UUID,
    vendor_update: VendorUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    vendor = db.query(Vendor).filter(Vendor.id == id).first()
    if not vendor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vendor not found"
        )
        
    if current_user.role == "vendor" and vendor.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only update your own profile")
    elif current_user.role not in ["admin", "procurement_officer", "manager", "vendor"]:
        raise HTTPException(status_code=403, detail="Not authorized to update vendors")
        
    # If email is being updated, check uniqueness
    if vendor_update.email and vendor_update.email != vendor.email:
        existing = db.query(Vendor).filter(Vendor.email == vendor_update.email).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A vendor with this email already exists"
            )
            
    for field, value in vendor_update.model_dump(exclude_unset=True).items():
        setattr(vendor, field, value)
        
    db.add(vendor)
    db.commit()
    db.refresh(vendor)
    return vendor

@router.delete("/{id}", response_model=VendorResponse)
def deactivate_vendor(
    id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only)
):
    vendor = db.query(Vendor).filter(Vendor.id == id).first()
    if not vendor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vendor not found"
        )
        
    # Mark status as blocked/inactive instead of hard delete
    vendor.status = "inactive"
    db.add(vendor)
    db.commit()
    db.refresh(vendor)
    return vendor
