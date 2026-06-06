from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
import app.models  # Ensures models are imported so Base metadata is populated

from app.routers.auth import router as auth_router
from app.routers.vendors import router as vendors_router
from app.routers.rfqs import router as rfqs_router
from app.routers import quotations, approvals, purchase_orders, invoices, ai_agent, reports, activity, notifications

# Create tables in database if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="VendorBridge ERP API",
    description="Backend API for VendorBridge Procurement & Vendor Management ERP",
    version="1.0.0"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify frontend URL e.g., ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/v1")
app.include_router(vendors_router, prefix="/api/v1")
app.include_router(rfqs_router, prefix="/api/v1")

app.include_router(quotations.router)
app.include_router(approvals.router)
app.include_router(purchase_orders.router)
app.include_router(invoices.router)
app.include_router(ai_agent.router)
app.include_router(reports.router)
app.include_router(activity.router)
app.include_router(notifications.router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "Welcome to VendorBridge ERP API",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
