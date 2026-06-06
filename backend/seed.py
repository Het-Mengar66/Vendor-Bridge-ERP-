import sys
import uuid
import asyncio
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models.vendor import Vendor
from app.models.user import User

def seed_db():
    print("Seeding database...")
    db = SessionLocal()
    
    try:
        # Create a mock admin user if none exists
        admin = db.query(User).filter(User.email == "admin@vendorbridge.com").first()
        if not admin:
            admin_id = uuid.uuid4()
            admin = User(
                id=admin_id,
                email="admin@vendorbridge.com",
                first_name="Admin",
                last_name="User",
                role="admin"
            )
            db.add(admin)
            db.commit()
            print(f"Created Admin User: {admin.email}")
            
        # Seed Vendors
        vendors = [
            Vendor(
                company_name="Infra Supplies Pvt Ltd",
                contact_name="John Doe",
                email="john@infrasupplies.com",
                gst_number="27AABCU9603R1ZM",
                city="Mumbai",
                country="India",
                category="Hardware",
                status="active",
                rating=4.5,
                created_by=admin.id
            ),
            Vendor(
                company_name="Office Tech Co",
                contact_name="Jane Smith",
                email="jane@officetech.com",
                gst_number="29BBBCU9603R1ZN",
                city="Bangalore",
                country="India",
                category="IT Equipment",
                status="pending",
                rating=0,
                created_by=admin.id
            ),
            Vendor(
                company_name="Global Steel Corp",
                contact_name="Robert Johnson",
                email="contact@globalsteel.com",
                gst_number="12ABCDE1234F1Z5",
                city="Chicago",
                country="USA",
                category="Hardware",
                status="active",
                rating=4.8,
                created_by=admin.id
            ),
            Vendor(
                company_name="Cloud Networks LLC",
                contact_name="Sarah Williams",
                email="sarah@cloudnetworks.net",
                gst_number="98XYZAB8765C2Y9",
                city="London",
                country="UK",
                category="Software",
                status="blocked",
                rating=2.1,
                created_by=admin.id
            )
        ]
        
        for v in vendors:
            existing = db.query(Vendor).filter(Vendor.email == v.email).first()
            if not existing:
                db.add(v)
                
        db.commit()
        print("Successfully seeded vendors.")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
