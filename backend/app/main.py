from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers import quotations, approvals, purchase_orders

# Create tables (does nothing if they already exist in Supabase)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="VendorBridge ERP API",
    description="Core API for Procurement & Vendor Management",
    version="1.0.0"
)

# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(quotations.router)
app.include_router(approvals.router)
app.include_router(purchase_orders.router)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Welcome to VendorBridge ERP API"}

