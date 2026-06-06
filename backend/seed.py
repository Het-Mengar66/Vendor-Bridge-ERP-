"""
Comprehensive seed script to populate the VendorBridge ERP database
with realistic demo data for Purchase Orders, Quotations, Invoices,
RFQs, Approvals, and Activity Logs.
"""
import uuid
import random
from datetime import datetime, timedelta, date
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.user import User
from app.models.vendor import Vendor
from app.models.rfq import RFQ, RFQItem
from app.models.quotation import Quotation, QuotationItem
from app.models.approval import Approval
from app.models.purchase_order import PurchaseOrder, POItem
from app.models.invoice import Invoice, InvoiceItem
from app.models.activity_log import ActivityLog


def seed_demo_data():
    print("=" * 60)
    print("  VendorBridge ERP — Seeding Demo Data")
    print("=" * 60)
    db = SessionLocal()

    try:
        # ── Step 1: Ensure Admin User Exists ──
        admin = db.query(User).filter(User.email == "admin@vendorbridge.com").first()
        if not admin:
            admin = User(
                id=uuid.uuid4(),
                email="admin@vendorbridge.com",
                first_name="Admin",
                last_name="User",
                role="admin"
            )
            db.add(admin)
            db.commit()
            print("[OK] Created Admin User")
        else:
            print("[SKIP]  Admin User already exists")

        admin_id = admin.id

        # ── Step 2: Ensure Vendors Exist ──
        vendor_data = [
            {"company_name": "Tech Solutions Inc.", "contact_name": "Rajesh Kumar", "email": "rajesh@techsolutions.in",
             "gst_number": "27AABCU9603R1ZM", "city": "Mumbai", "country": "India", "category": "IT Equipment",
             "status": "active", "rating": 4.7},
            {"company_name": "Industrial Storage Co", "contact_name": "Priya Sharma", "email": "priya@industrialstorage.com",
             "gst_number": "29BBBCU9603R1ZN", "city": "Delhi", "country": "India", "category": "Hardware",
             "status": "active", "rating": 4.2},
            {"company_name": "Global Networks LLC", "contact_name": "James Wilson", "email": "james@globalnetworks.com",
             "gst_number": "12ABCDE1234F1Z5", "city": "Chicago", "country": "USA", "category": "Networking",
             "status": "active", "rating": 4.5},
            {"company_name": "Office Mart Supplies", "contact_name": "Sarah Chen", "email": "sarah@officemart.co",
             "gst_number": "98XYZAB8765C2Y9", "city": "Singapore", "country": "Singapore", "category": "Office Supplies",
             "status": "active", "rating": 3.9},
        ]

        vendors = []
        for vd in vendor_data:
            v = db.query(Vendor).filter(Vendor.email == vd["email"]).first()
            if not v:
                v = Vendor(**vd, created_by=admin_id)
                db.add(v)
                db.commit()
                db.refresh(v)
                print(f"  [OK] Created Vendor: {vd['company_name']}")
            else:
                print(f"  [SKIP]  Vendor exists: {vd['company_name']}")
            vendors.append(v)

        # ── Step 3: Create RFQs with Items ──
        rfq_templates = [
            {
                "title": "Office Laptop Procurement Q3 2026",
                "description": "Procurement of 50 business laptops for the engineering team with i7 processors and 16GB RAM.",
                "category": "IT Equipment",
                "status": "published",
                "items": [
                    {"item_name": "Dell Latitude 5540 Laptop", "description": "14-inch, i7, 16GB RAM, 512GB SSD", "quantity": 30, "unit": "pcs"},
                    {"item_name": "HP ProBook 450 G10", "description": "15.6-inch, i7, 16GB RAM, 256GB SSD", "quantity": 20, "unit": "pcs"},
                ]
            },
            {
                "title": "Warehouse Racking System Installation",
                "description": "Heavy-duty industrial racking system for the new Pune warehouse facility.",
                "category": "Hardware",
                "status": "published",
                "items": [
                    {"item_name": "Heavy Duty Pallet Rack", "description": "5-tier, 3m x 1.2m x 0.6m, 500kg/shelf", "quantity": 40, "unit": "sets"},
                    {"item_name": "Anti-Slip Floor Mats", "description": "Industrial grade, 2m x 1m", "quantity": 100, "unit": "pcs"},
                    {"item_name": "Safety Bollards", "description": "Steel, yellow powder-coated, 1m height", "quantity": 20, "unit": "pcs"},
                ]
            },
            {
                "title": "Network Infrastructure Upgrade",
                "description": "Upgrade the corporate network with enterprise-grade switches, routers, and access points.",
                "category": "Networking",
                "status": "published",
                "items": [
                    {"item_name": "Cisco Catalyst 9300 Switch", "description": "48-port PoE+, Layer 3 managed", "quantity": 10, "unit": "pcs"},
                    {"item_name": "Ubiquiti UniFi AP", "description": "Wi-Fi 6, ceiling mount", "quantity": 50, "unit": "pcs"},
                ]
            },
            {
                "title": "Office Furniture & Stationery Bulk Order",
                "description": "Quarterly bulk order for office furniture and stationery across all 3 branch offices.",
                "category": "Office Supplies",
                "status": "closed",
                "items": [
                    {"item_name": "Ergonomic Office Chair", "description": "Mesh back, adjustable lumbar", "quantity": 25, "unit": "pcs"},
                    {"item_name": "Standing Desk Converter", "description": "Sit-stand, 80cm width", "quantity": 15, "unit": "pcs"},
                    {"item_name": "Whiteboard 4x3 ft", "description": "Magnetic, wall-mounted", "quantity": 10, "unit": "pcs"},
                ]
            },
        ]

        rfqs = []
        rfq_items_map = {}  # rfq_id -> [rfq_item objects]
        rfq_counter = 1
        for idx, tmpl in enumerate(rfq_templates):
            rfq_num = f"RFQ-2026-{str(rfq_counter).zfill(3)}"
            existing = db.query(RFQ).filter(RFQ.rfq_number == rfq_num).first()
            if existing:
                print(f"  [SKIP]  RFQ exists: {rfq_num}")
                rfqs.append(existing)
                items = db.query(RFQItem).filter(RFQItem.rfq_id == existing.id).all()
                rfq_items_map[existing.id] = items
                rfq_counter += 1
                continue

            rfq = RFQ(
                id=uuid.uuid4(),
                rfq_number=rfq_num,
                title=tmpl["title"],
                description=tmpl["description"],
                category=tmpl["category"],
                deadline=datetime.utcnow() + timedelta(days=random.randint(7, 30)),
                status=tmpl["status"],
                created_by=admin_id,
            )
            db.add(rfq)
            db.commit()
            db.refresh(rfq)

            rfq_items = []
            for item_data in tmpl["items"]:
                ri = RFQItem(
                    id=uuid.uuid4(),
                    rfq_id=rfq.id,
                    item_name=item_data["item_name"],
                    description=item_data["description"],
                    quantity=item_data["quantity"],
                    unit=item_data["unit"],
                )
                db.add(ri)
                rfq_items.append(ri)

            db.commit()
            for ri in rfq_items:
                db.refresh(ri)

            rfq_items_map[rfq.id] = rfq_items
            rfqs.append(rfq)
            rfq_counter += 1
            print(f"  [OK] Created RFQ: {rfq_num} — {tmpl['title']}")

        # ── Step 4: Create Quotations (each vendor quotes on an RFQ) ──
        quotations = []
        quot_counter = 1
        vendor_rfq_pairs = [
            (0, 0), (1, 0),  # Vendors 0,1 quote on RFQ 0
            (1, 1), (2, 1),  # Vendors 1,2 quote on RFQ 1
            (2, 2), (0, 2),  # Vendors 2,0 quote on RFQ 2
            (3, 3), (1, 3),  # Vendors 3,1 quote on RFQ 3
        ]

        for v_idx, r_idx in vendor_rfq_pairs:
            vendor = vendors[v_idx]
            rfq = rfqs[r_idx]
            quot_num = f"QT-2026-{str(quot_counter).zfill(3)}"

            existing = db.query(Quotation).filter(Quotation.quotation_number == quot_num).first()
            if existing:
                print(f"  [SKIP]  Quotation exists: {quot_num}")
                quotations.append(existing)
                quot_counter += 1
                continue

            # Price items with some randomness
            items_for_rfq = rfq_items_map.get(rfq.id, [])
            subtotal = 0
            quot_items_to_add = []
            for ri in items_for_rfq:
                unit_price = round(random.uniform(500, 15000), 2)
                total = round(unit_price * ri.quantity, 2)
                subtotal += total
                quot_items_to_add.append({
                    "rfq_item_id": ri.id,
                    "unit_price": unit_price,
                    "quantity": ri.quantity,
                    "total_price": total,
                    "delivery_days": random.randint(5, 30),
                    "remarks": random.choice(["Best price guaranteed", "Volume discount applied", "Express delivery available", "Standard terms"]),
                })

            tax = round(subtotal * 0.18, 2)
            grand_total = round(subtotal + tax, 2)

            statuses = ["submitted", "under_review", "accepted"]
            quot = Quotation(
                id=uuid.uuid4(),
                quotation_number=quot_num,
                rfq_id=rfq.id,
                vendor_id=vendor.id,
                total_amount=subtotal,
                tax_amount=tax,
                grand_total=grand_total,
                delivery_days=random.randint(7, 30),
                delivery_terms=random.choice(["FOB Destination", "CIF Mumbai", "Ex-Works", "DDP Warehouse"]),
                notes=random.choice([
                    "Prices valid for 30 days.",
                    "Bulk discount included. Warranty: 2 years.",
                    "Free installation included.",
                    "Payment terms: Net 30 days.",
                ]),
                status=random.choice(statuses),
            )
            db.add(quot)
            db.commit()
            db.refresh(quot)

            for qi_data in quot_items_to_add:
                qi = QuotationItem(
                    id=uuid.uuid4(),
                    quotation_id=quot.id,
                    **qi_data
                )
                db.add(qi)
            db.commit()

            quotations.append(quot)
            quot_counter += 1
            print(f"  [OK] Created Quotation: {quot_num} by {vendor.company_name}")

        # ── Step 5: Create Approvals ──
        approvals = []
        approval_quots = quotations[:4]  # Approve first 4 quotations
        for quot in approval_quots:
            existing = db.query(Approval).filter(Approval.quotation_id == quot.id).first()
            if existing:
                approvals.append(existing)
                print(f"  [SKIP]  Approval exists for {quot.quotation_number}")
                continue

            appr = Approval(
                id=uuid.uuid4(),
                rfq_id=quot.rfq_id,
                quotation_id=quot.id,
                vendor_id=quot.vendor_id,
                requested_by=admin_id,
                approved_by=admin_id,
                status=random.choice(["approved", "approved", "pending"]),
                remarks=random.choice(["Approved - best value", "Approved after review", "Pricing within budget"]),
                approval_date=datetime.utcnow() - timedelta(days=random.randint(1, 5)),
            )
            db.add(appr)
            db.commit()
            db.refresh(appr)
            approvals.append(appr)
            print(f"  [OK] Created Approval for {quot.quotation_number}")

        # ── Step 6: Create Purchase Orders ──
        purchase_orders = []
        po_counter = 1
        po_statuses = ["created", "sent", "fulfilled", "sent"]

        for i, appr in enumerate(approvals):
            po_num = f"PO-2026-{str(40 + po_counter).zfill(3)}"
            existing = db.query(PurchaseOrder).filter(PurchaseOrder.po_number == po_num).first()
            if existing:
                purchase_orders.append(existing)
                print(f"  [SKIP]  PO exists: {po_num}")
                po_counter += 1
                continue

            quot = [q for q in quotations if q.id == appr.quotation_id][0]
            po = PurchaseOrder(
                id=uuid.uuid4(),
                po_number=po_num,
                approval_id=appr.id,
                rfq_id=appr.rfq_id,
                vendor_id=appr.vendor_id,
                quotation_id=appr.quotation_id,
                bill_to="VendorBridge ERP Pvt Ltd\n123 Business Park, Sector 62\nNoida, UP 201301, India",
                ship_to=random.choice([
                    "Warehouse A, Plot 45, Pune MIDC\nPune 411057, India",
                    "Office Block C, Tech Park\nBangalore 560066, India",
                    "Unit 12, Industrial Area\nGurgaon 122001, India",
                ]),
                subtotal=quot.total_amount,
                tax_amount=quot.tax_amount,
                grand_total=quot.grand_total,
                delivery_date=date.today() + timedelta(days=random.randint(10, 45)),
                status=po_statuses[i % len(po_statuses)],
                created_by=admin_id,
            )
            db.add(po)
            db.commit()
            db.refresh(po)

            # Add PO items from quotation
            rfq_for_po = [r for r in rfqs if r.id == appr.rfq_id][0]
            rfq_items_for_po = rfq_items_map.get(rfq_for_po.id, [])
            for ri in rfq_items_for_po:
                up = round(random.uniform(800, 12000), 2)
                poi = POItem(
                    id=uuid.uuid4(),
                    po_id=po.id,
                    item_name=ri.item_name,
                    description=ri.description,
                    quantity=ri.quantity,
                    unit_price=up,
                    total_price=round(up * ri.quantity, 2),
                )
                db.add(poi)
            db.commit()

            purchase_orders.append(po)
            po_counter += 1
            print(f"  [OK] Created PO: {po_num} (Status: {po.status})")

        # ── Step 7: Create Invoices ──
        invoice_statuses = ["generated", "paid", "overdue", "sent"]
        inv_counter = 1
        for i, po in enumerate(purchase_orders):
            inv_num = f"INV-2026-{str(85 + inv_counter).zfill(3)}"
            existing = db.query(Invoice).filter(Invoice.invoice_number == inv_num).first()
            if existing:
                print(f"  [SKIP]  Invoice exists: {inv_num}")
                inv_counter += 1
                continue

            inv = Invoice(
                id=uuid.uuid4(),
                invoice_number=inv_num,
                po_id=po.id,
                vendor_id=po.vendor_id,
                bill_to=po.bill_to,
                subtotal=po.subtotal,
                tax_percentage=18.00,
                tax_amount=po.tax_amount,
                grand_total=po.grand_total,
                invoice_date=date.today() - timedelta(days=random.randint(1, 15)),
                due_date=date.today() + timedelta(days=random.randint(-5, 30)),
                status=invoice_statuses[i % len(invoice_statuses)],
                created_by=admin_id,
            )
            db.add(inv)
            db.commit()
            db.refresh(inv)

            # Add Invoice items
            po_items = db.query(POItem).filter(POItem.po_id == po.id).all()
            for pi in po_items:
                tax_pct = 18.00
                tax_amt = round(float(pi.total_price) * 0.18, 2)
                ii = InvoiceItem(
                    id=uuid.uuid4(),
                    invoice_id=inv.id,
                    item_name=pi.item_name,
                    description=pi.description,
                    quantity=pi.quantity,
                    unit_price=pi.unit_price,
                    tax_percent=tax_pct,
                    tax_amount=tax_amt,
                    total_price=pi.total_price,
                )
                db.add(ii)
            db.commit()

            inv_counter += 1
            print(f"  [OK] Created Invoice: {inv_num} (Status: {inv.status})")

        # ── Step 8: Create Activity Logs ──
        activity_entries = [
            {"action_type": "rfq_created", "entity_type": "rfq", "description": "Published RFQ for Office Laptop Procurement Q3 2026"},
            {"action_type": "rfq_created", "entity_type": "rfq", "description": "Published RFQ for Warehouse Racking System Installation"},
            {"action_type": "quotation_submitted", "entity_type": "quotation", "description": "Tech Solutions Inc. submitted quotation QT-2026-001"},
            {"action_type": "quotation_submitted", "entity_type": "quotation", "description": "Industrial Storage Co submitted quotation QT-2026-002"},
            {"action_type": "quotation_submitted", "entity_type": "quotation", "description": "Global Networks LLC submitted quotation QT-2026-005"},
            {"action_type": "approval_approved", "entity_type": "approval", "description": "Approved quotation QT-2026-001 from Tech Solutions Inc."},
            {"action_type": "approval_approved", "entity_type": "approval", "description": "Approved quotation QT-2026-003 from Industrial Storage Co"},
            {"action_type": "po_created", "entity_type": "po", "description": "Generated Purchase Order PO-2026-041"},
            {"action_type": "po_created", "entity_type": "po", "description": "Generated Purchase Order PO-2026-042"},
            {"action_type": "po_issued", "entity_type": "po", "description": "Issued PO-2026-041 to vendor Tech Solutions Inc."},
            {"action_type": "invoice_generated", "entity_type": "invoice", "description": "Generated Invoice INV-2026-086 for PO-2026-041"},
            {"action_type": "invoice_generated", "entity_type": "invoice", "description": "Generated Invoice INV-2026-087 for PO-2026-042"},
            {"action_type": "invoice_paid", "entity_type": "invoice", "description": "Invoice INV-2026-087 marked as paid"},
            {"action_type": "vendor_approved", "entity_type": "vendor", "description": "Approved vendor: Office Mart Supplies"},
            {"action_type": "rfq_created", "entity_type": "rfq", "description": "Published RFQ for Network Infrastructure Upgrade"},
        ]

        # Only add if no activity logs exist
        existing_count = db.query(ActivityLog).count()
        if existing_count < 5:
            for i, entry in enumerate(activity_entries):
                entity_id = rfqs[0].id if entry["entity_type"] == "rfq" else \
                           quotations[0].id if entry["entity_type"] == "quotation" else \
                           approvals[0].id if entry["entity_type"] == "approval" else \
                           purchase_orders[0].id if entry["entity_type"] == "po" else \
                           vendors[0].id
                log = ActivityLog(
                    id=uuid.uuid4(),
                    user_id=admin_id,
                    action_type=entry["action_type"],
                    entity_type=entry["entity_type"],
                    entity_id=entity_id,
                    description=entry["description"],
                    meta_data={"seeded": True},
                    created_at=datetime.utcnow() - timedelta(hours=len(activity_entries) - i),
                )
                db.add(log)
            db.commit()
            print(f"  [OK] Created {len(activity_entries)} Activity Log entries")
        else:
            print(f"  [SKIP]  Activity logs already seeded ({existing_count} entries)")

        print()
        print("=" * 60)
        print("  [OK] SEEDING COMPLETE!")
        print("=" * 60)
        print(f"  Vendors:         {len(vendors)}")
        print(f"  RFQs:            {len(rfqs)}")
        print(f"  Quotations:      {len(quotations)}")
        print(f"  Approvals:       {len(approvals)}")
        print(f"  Purchase Orders: {len(purchase_orders)}")
        print(f"  Invoices:        {inv_counter - 1}")
        print(f"  Activity Logs:   {len(activity_entries)}")
        print("=" * 60)

    except Exception as e:
        print(f"\n[ERR] Error seeding database: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_demo_data()
