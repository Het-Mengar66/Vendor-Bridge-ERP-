from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from typing import Optional
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import settings
from app.models.user import User

security = HTTPBearer(auto_error=False)

def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # 1. Development/Testing Mock Mode
    token = credentials.credentials if credentials else None
    
    if not token:
        # Fallback to local default user for easier testing if no token provided
        # Find or create a default procurement officer user for ease of local testing
        default_user = db.query(User).filter(User.email == "test@vendorbridge.app").first()
        if not default_user:
            default_user = User(
                email="test@vendorbridge.app",
                first_name="Test",
                last_name="User",
                role="procurement_officer",
                phone="1234567890",
                country="India",
                is_active=True
            )
            db.add(default_user)
            db.commit()
            db.refresh(default_user)
        return default_user

    # 2. Check Mock Tokens
    if token.startswith("mock-"):
        role = token.split("-")[1]
        if role not in ["admin", "procurement_officer", "vendor", "manager"]:
            role = "procurement_officer"
        
        mock_email = f"{role}@vendorbridge.app"
        user = db.query(User).filter(User.email == mock_email).first()
        if not user:
            user = User(
                email=mock_email,
                first_name="Mock",
                last_name=role.capitalize(),
                role=role,
                phone="1234567890",
                country="India",
                is_active=True
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        return user

    # 3. Real Supabase JWT Verification
    try:
        # Supabase uses HS256 with the Supabase JWT secret
        # In a real setup, verify using settings.SUPABASE_KEY (or jwt secret)
        payload = jwt.decode(
            token, 
            settings.SECRET_KEY,  # Replace with SUPABASE_JWT_SECRET if available
            algorithms=["HS256"], 
            options={"verify_aud": False}
        )
        supabase_uid: str = payload.get("sub")
        if supabase_uid is None:
            raise credentials_exception
    except jwt.PyJWTError:
        # If real JWT verification fails, but it looks like a test, raise exception
        raise credentials_exception

    # Query local user synced with Supabase UID
    user = db.query(User).filter(User.supabase_uid == supabase_uid).first()
    if user is None:
        # Optionally create user dynamically from token payload if email is in token
        email = payload.get("email")
        if email:
            user = User(
                email=email,
                first_name=payload.get("user_metadata", {}).get("first_name", "Supabase"),
                last_name=payload.get("user_metadata", {}).get("last_name", "User"),
                role=payload.get("user_metadata", {}).get("role", "procurement_officer"),
                supabase_uid=supabase_uid,
                is_active=True
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User profile not found in ERP local database"
            )
            
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User account is deactivated"
        )
        
    return user

# Helper dependency to enforce roles
class RoleChecker:
    def __init__(self, allowed_roles: list[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, current_user: User = Depends(get_current_user)):
        if current_user.role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation not permitted. Required roles: {self.allowed_roles}"
            )
        return current_user
