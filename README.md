<div align="center">

<img src="https://img.shields.io/badge/VendorBridge-ERP-7C3AED?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyTDIgN2wxMCA1IDEwLTV6TTIgMTdsOSA1IDktNVY3bC05IDV6Ii8+PC9zdmc+" alt="VendorBridge"/>

# VendorBridge ERP

### Next-Generation Procurement & Vendor Management Platform


[![TypeScript](https://img.shields.io/badge/TypeScript-67.4%25-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-31.6%25-3776AB?style=flat-square&logo=python)](https://www.python.org/)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Core Modules](#-core-modules)
- [System Architecture](#-system-architecture)
- [Application Flow](#-application-flow)
- [Module Flowcharts](#-module-flowcharts)
  - [Authentication Flow](#1-authentication-flow)
  - [Vendor Lifecycle](#2-vendor-lifecycle)
  - [RFQ → Quotation → PO Pipeline](#3-rfq--quotation--po-pipeline)
  - [Approval Workflow](#4-approval-workflow)
  - [Invoice Flow](#5-invoice-flow)
- [Database Schema](#-database-schema)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)
- [Setup & Installation](#-setup--installation)
- [API Reference](#-api-reference)
- [Team](#-team)

---

## 🚀 Overview

**VendorBridge** is an enterprise-grade ERP platform built to streamline the entire vendor procurement lifecycle — from vendor onboarding and RFQ creation to AI-assisted quotation comparison, purchase order generation, and invoice management.

Built for the hackathon under the theme of **Next-Generation Procurement**, VendorBridge replaces fragmented, manual procurement workflows with a unified, role-based, data-driven platform.

### Key Stats (Demo Data)
| Metric | Value |
|--------|-------|
| Total Vendors | 24 |
| Active RFQs | 12 |
| Pending Approvals | 5 |
| Total PO Value | ₹2.3L |

---

## 🎯 Problem Statement

Traditional procurement systems suffer from:

- **Fragmented communication** between procurement teams and vendors
- **Manual, error-prone** quotation comparison processes
- **No visibility** into approval chains or PO status
- **Zero audit trail** for compliance and reporting
- **Slow vendor onboarding** with no standardized workflow

VendorBridge solves all of the above in one unified platform.

---

## 🧩 Core Modules

| Module | Description |
|--------|-------------|
| 🏠 **Dashboard** | Real-time KPIs — vendor count, active RFQs, pending approvals, total PO value |
| 👥 **Vendor Management** | Add/edit/block vendors; GST-based profiles; status tracking (Active / Pending / Blocked) |
| 📄 **RFQs** | Create and publish Requests for Quotation with deadlines; track draft → published → closed |
| 💬 **Quotations** | Collect and compare vendor quotes against RFQs |
| ✅ **Approvals** | Role-based multi-level approval chain for POs and vendor onboarding |
| 🛒 **Purchase Orders** | Auto-generate POs from approved quotations |
| 🧾 **Invoices** | Invoice receipt, matching against POs, and payment tracking |
| 📊 **Reports** | Procurement analytics, vendor performance, spend analysis |
| 📡 **Activity** | Full audit log of all system actions |

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                          │
│                   React + TypeScript Frontend                   │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│   │Dashboard │ │ Vendors  │ │  RFQs /  │ │  PO / Invoices / │ │
│   │          │ │Management│ │Quotations│ │     Reports      │ │
│   └──────────┘ └──────────┘ └──────────┘ └──────────────────┘ │
└────────────────────────┬────────────────────────────────────────┘
                         │ REST API (JSON over HTTPS)
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PYTHON BACKEND (FastAPI)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌────────────────────────┐  │
│  │  Auth &     │  │  Business   │  │    AI / Analytics      │  │
│  │  RBAC Layer │  │  Logic APIs │  │    Engine              │  │
│  └─────────────┘  └─────────────┘  └────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │               ORM / Database Layer                        │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATABASE                                  │
│         PostgreSQL / SQLite (dev) — Relational Schema           │
│  Users │ Vendors │ RFQs │ Quotations │ POs │ Invoices │ Logs   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Application Flow

The top-level user journey through the platform:

```
                          ┌─────────────────┐
                          │   Landing Page   │
                          │  (Register/Login)│
                          └────────┬────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │       Authentication         │
                    │  JWT Token issued on login   │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │         Dashboard            │
                    │  KPIs · Charts · Activity    │
                    └──────────────┬──────────────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
          │                        │                        │
          ▼                        ▼                        ▼
  ┌───────────────┐      ┌──────────────────┐     ┌─────────────────┐
  │ Vendor Mgmt   │      │   RFQ Module      │     │  Purchase Orders │
  │               │      │                  │     │                 │
  │ Add · Edit    │      │ Create · Publish  │     │ View · Track    │
  │ Block · View  │      │ Track · Close     │     │ Download        │
  └───────────────┘      └────────┬─────────┘     └────────┬────────┘
                                  │                         │
                                  ▼                         ▼
                         ┌─────────────────┐     ┌─────────────────┐
                         │   Quotations    │     │    Invoices     │
                         │                 │     │                 │
                         │ Collect · Score │     │ Match · Approve │
                         │ Compare · Award │     │ Pay · Track     │
                         └────────┬────────┘     └─────────────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │    Approvals    │
                         │                 │
                         │ Review · Accept │
                         │ Reject · Notify │
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │  Reports &      │
                         │  Activity Log   │
                         └─────────────────┘
```

---

## 📊 Module Flowcharts

### 1. Authentication Flow

```
  ┌──────────┐     ┌──────────────────────────────────────┐
  │  User    │     │            VendorBridge               │
  └────┬─────┘     └────────────────────────┬─────────────┘
       │                                     │
       │──── Visit /login or /register ─────▶│
       │                                     │
       │◀─── Render Auth Form ───────────────│
       │                                     │
       │──── Submit credentials ────────────▶│
       │                                     │
       │                     ┌───────────────▼──────────────┐
       │                     │  Validate email + password    │
       │                     └───────────────┬──────────────┘
       │                                     │
       │                             ┌───────▼────────┐
       │                             │  Valid? ───NO──▶│ Return 401  │
       │                             └───────┬────────┘
       │                                   YES
       │                                     │
       │                     ┌───────────────▼──────────────┐
       │                     │  Issue JWT + identify ROLE    │
       │                     │  (Admin / Procurement Officer │
       │                     │   / Approver / Viewer)        │
       │                     └───────────────┬──────────────┘
       │                                     │
       │◀─── JWT Token + Redirect ──────────│
       │         to Dashboard               │
       │                                     │
  ┌────▼────────────────────────────────────▼──────────────┐
  │         Role-Based Access Control (RBAC)                │
  │                                                         │
  │  Admin          → Full access                           │
  │  Procurement    → RFQ, Quotation, PO, Vendor            │
  │  Approver       → Approvals module only                 │
  │  Viewer         → Read-only dashboard + reports         │
  └─────────────────────────────────────────────────────────┘
```

---

### 2. Vendor Lifecycle

```
  ┌─────────────────────────────────────────────────────────────┐
  │                    VENDOR LIFECYCLE                          │
  └─────────────────────────────────────────────────────────────┘

   Admin/Procurement Officer
          │
          ▼
  ┌───────────────┐
  │  Add Vendor   │  ← Company Name, GST Number, Contact,
  │               │     Location, Category
  └───────┬───────┘
          │
          ▼
  ┌───────────────┐
  │    PENDING    │  ← Awaiting verification / approval
  └───────┬───────┘
          │
    ┌─────▼──────┐
    │  Verified? │
    └─────┬──────┘
          │
    ┌─────┴────────────┐
    │                  │
   YES                 NO
    │                  │
    ▼                  ▼
┌────────┐        ┌─────────┐
│ ACTIVE │        │ BLOCKED │
│        │        │         │
│ Can    │        │ Cannot  │
│ receive│        │ receive │
│ RFQs   │        │ RFQs    │
└────┬───┘        └─────────┘
     │
     ▼
  Vendor participates in
  RFQ → Quotation → PO pipeline

  Status can be toggled:
  ACTIVE ◄──────────► BLOCKED  (Admin action)
```

---

### 3. RFQ → Quotation → PO Pipeline

```
  ┌──────────────────────────────────────────────────────────────────┐
  │              CORE PROCUREMENT PIPELINE                           │
  └──────────────────────────────────────────────────────────────────┘

  [PROCUREMENT OFFICER]
         │
         ▼
  ┌─────────────────┐
  │  Create RFQ     │  ← Title, Description, Items, Deadline
  │  (DRAFT)        │
  └────────┬────────┘
           │
           ▼
  ┌─────────────────┐
  │  Publish RFQ    │  ← RFQ-YYYY-NNN auto-assigned
  │  (PUBLISHED)    │    Vendors notified
  └────────┬────────┘
           │
           │─────────────────────────────────────┐
           │                                     │
           ▼                                     ▼
  ┌─────────────────┐                  ┌──────────────────┐
  │  Vendor A       │                  │  Vendor B / C    │
  │  Submits Quote  │                  │  Submit Quotes   │
  └────────┬────────┘                  └────────┬─────────┘
           │                                    │
           └────────────────┬───────────────────┘
                            │
                            ▼
                   ┌────────────────┐
                   │  Quotations    │
                   │  Collected     │
                   └───────┬────────┘
                           │
                           ▼
                   ┌────────────────┐
                   │  Close RFQ     │  ← Deadline reached or
                   │  (CLOSED)      │    manual close
                   └───────┬────────┘
                           │
                           ▼
                   ┌────────────────┐
                   │  Compare &     │  ← Price, delivery time,
                   │  Evaluate      │    vendor score, AI assist
                   └───────┬────────┘
                           │
                           ▼
                   ┌────────────────┐
                   │  Select Best   │
                   │  Quotation     │
                   └───────┬────────┘
                           │
                           ▼
                   ┌────────────────┐
                   │  Generate PO   │  ← Auto-filled from
                   │  (Draft)       │    quotation data
                   └───────┬────────┘
                           │
                           ▼
                   ┌────────────────┐
                   │  APPROVAL      │  ← See Approval Flow ↓
                   │  WORKFLOW      │
                   └───────┬────────┘
                           │
                           ▼
                   ┌────────────────┐
                   │  PO ISSUED     │  ← Vendor receives PO
                   └───────┬────────┘
                           │
                           ▼
                   ┌────────────────┐
                   │  Invoice &     │
                   │  Payment       │
                   └────────────────┘
```

---

### 4. Approval Workflow

```
  ┌───────────────────────────────────────────────────────────────┐
  │                    APPROVAL WORKFLOW                          │
  └───────────────────────────────────────────────────────────────┘

  Trigger: PO created / Vendor onboarded
           │
           ▼
  ┌─────────────────┐
  │  Approval       │  ← System creates approval request
  │  Request        │    with item, value, requester info
  │  Created        │
  └────────┬────────┘
           │
           ▼
  ┌─────────────────┐
  │  Notified to    │
  │  Approver(s)    │
  └────────┬────────┘
           │
           ▼
  ┌─────────────────────────────────────────┐
  │           Approver Reviews               │
  │                                          │
  │   - Views item details                   │
  │   - Checks vendor profile                │
  │   - Reviews quotation & pricing          │
  └──────────────┬──────────────────────────┘
                 │
          ┌──────▼───────┐
          │   Decision?   │
          └──────┬───────┘
                 │
      ┌──────────┼──────────┐
      │          │          │
    APPROVE   REQUEST     REJECT
      │       CHANGES       │
      │          │          │
      ▼          ▼          ▼
  ┌───────┐  ┌───────┐  ┌───────────┐
  │  PO   │  │ Back  │  │ Requester │
  │Issued │  │  to   │  │ Notified  │
  │       │  │Requstr│  │ Reason    │
  └───────┘  └───────┘  │ Logged    │
                         └───────────┘

  Dashboard KPI: "Pending Approvals" counter decrements on action.
  All decisions logged in Activity feed with timestamp + actor.
```

---

### 5. Invoice Flow

```
  PO ISSUED
      │
      ▼
  ┌─────────────────┐
  │  Vendor delivers│
  │  goods/services │
  └────────┬────────┘
           │
           ▼
  ┌─────────────────┐
  │  Vendor submits │
  │  Invoice        │
  └────────┬────────┘
           │
           ▼
  ┌─────────────────────────────────┐
  │  3-Way Match                    │
  │  PO ↔ Invoice ↔ Delivery Note   │
  └────────┬────────────────────────┘
           │
    ┌──────▼───────┐
    │   Match OK?  │
    └──────┬───────┘
           │
    ┌──────┴────────────┐
    │                   │
   YES                  NO
    │                   │
    ▼                   ▼
┌────────┐         ┌──────────────┐
│Approve │         │Flag Discrepancy│
│Invoice │         │Notify Teams  │
└────┬───┘         └──────────────┘
     │
     ▼
┌────────────┐
│  Payment   │
│  Processed │
└────────────┘
```

---

## 🗄 Database Schema

```
┌──────────────────────┐         ┌──────────────────────┐
│        USERS         │         │       VENDORS        │
├──────────────────────┤         ├──────────────────────┤
│ id (PK)              │         │ id (PK)              │
│ first_name           │         │ company_name         │
│ last_name            │         │ gst_number           │
│ email (unique)       │         │ contact_name         │
│ password_hash        │         │ email                │
│ role                 │         │ location             │
│ created_at           │         │ category             │
└──────────┬───────────┘         │ status               │
           │                     │ created_by (FK→Users)│
           │                     └──────────┬───────────┘
           │                                │
           │           ┌────────────────────┘
           │           │
           ▼           ▼
┌──────────────────────────────────────────────────────────┐
│                         RFQS                             │
├──────────────────────────────────────────────────────────┤
│ id (PK)  │ rfq_number  │ title  │ description            │
│ status (draft/published/closed)                          │
│ created_by (FK→Users)  │ deadline  │ created_at          │
└────────────────────────────────────────┬─────────────────┘
                                         │
                                         ▼
┌──────────────────────────────────────────────────────────┐
│                      QUOTATIONS                          │
├──────────────────────────────────────────────────────────┤
│ id (PK)  │ rfq_id (FK→RFQs)  │ vendor_id (FK→Vendors)   │
│ amount  │ delivery_days  │ notes  │ status  │ created_at  │
└────────────────────────────────────────┬─────────────────┘
                                         │
                                         ▼
┌──────────────────────────────────────────────────────────┐
│                    PURCHASE_ORDERS                        │
├──────────────────────────────────────────────────────────┤
│ id (PK)  │ po_number  │ quotation_id (FK→Quotations)     │
│ vendor_id (FK→Vendors)  │ total_value  │ status          │
│ created_by (FK→Users)  │ approved_by  │ created_at       │
└────────────────────────────────────────┬─────────────────┘
                                         │
                    ┌────────────────────┴──────────────────┐
                    │                                       │
                    ▼                                       ▼
     ┌────────────────────────────┐      ┌───────────────────────────┐
     │         APPROVALS          │      │          INVOICES          │
     ├────────────────────────────┤      ├───────────────────────────┤
     │ id (PK)                    │      │ id (PK)                   │
     │ po_id (FK→PurchaseOrders)  │      │ po_id (FK→PurchaseOrders) │
     │ approver_id (FK→Users)     │      │ vendor_id (FK→Vendors)    │
     │ status                     │      │ amount                    │
     │ decision_at                │      │ status                    │
     │ notes                      │      │ received_at               │
     └────────────────────────────┘      └───────────────────────────┘
```

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React** | UI framework |
| **TypeScript** | Type-safe development |
| **Tailwind CSS / CSS Modules** | Styling |
| **React Router** | Client-side routing |
| **Axios / Fetch** | API communication |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Python** | Backend language |
| **FastAPI** | REST API framework |
| **SQLAlchemy** | ORM |
| **JWT (python-jose)** | Authentication |
| **Pydantic** | Data validation |
| **PostgreSQL / SQLite** | Database |

---

## 📁 Project Structure

```
Vendor-Bridge-ERP/
├── frontend/                  # React + TypeScript app
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard/
│   │   │   ├── Vendors/
│   │   │   ├── RFQs/
│   │   │   ├── Quotations/
│   │   │   ├── Approvals/
│   │   │   ├── PurchaseOrders/
│   │   │   ├── Invoices/
│   │   │   ├── Reports/
│   │   │   └── Activity/
│   │   ├── components/        # Shared UI components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API service layer
│   │   ├── context/           # Auth & global state
│   │   └── types/             # TypeScript interfaces
│   └── package.json
│
├── backend/                   # Python FastAPI app
│   ├── app/
│   │   ├── routers/           # Route handlers
│   │   │   ├── auth.py
│   │   │   ├── vendors.py
│   │   │   ├── rfqs.py
│   │   │   ├── quotations.py
│   │   │   ├── approvals.py
│   │   │   ├── purchase_orders.py
│   │   │   └── invoices.py
│   │   ├── models/            # SQLAlchemy models
│   │   ├── schemas/           # Pydantic schemas
│   │   ├── services/          # Business logic
│   │   ├── dependencies.py    # Auth & DB deps
│   │   └── main.py            # App entrypoint
│   └── requirements.txt
│
├── package.json               # Root scripts
├── .gitignore
└── README.md
```

---

## 📸 Screenshots

| Screen | Description |
|--------|-------------|
| **Login** | JWT-based sign-in with role selection on registration |
| **Register** | Account creation with role assignment (Procurement Officer, Admin, etc.) |
| **Dashboard** | Live KPIs: 24 vendors, 12 active RFQs, 5 pending approvals, $2.3L PO value |
| **Vendor Management** | Searchable vendor list with GST numbers, status badges (Active / Pending / Blocked) |
| **RFQs** | Card-based RFQ view with status (Published / Draft / Closed), deadlines, and quote counts |

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js ≥ 18
- Python ≥ 3.10
- pip

### 1. Clone the repository
```bash
git clone https://github.com/Het-Mengar66/Vendor-Bridge-ERP-.git
cd Vendor-Bridge-ERP-
```

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
# Configure environment
cp .env.example .env
# Edit .env with your DB URL and JWT secret

# Run migrations
python -m alembic upgrade head

# Start the server
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
# Configure API base URL
cp .env.example .env.local
# VITE_API_URL=http://localhost:8000

npm run dev
```

### 4. Access
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`
- API Docs (Swagger): `http://localhost:8000/docs`

---

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/login` | Login, returns JWT |
| `POST` | `/auth/register` | Register new user |
| `GET` | `/vendors` | List all vendors |
| `POST` | `/vendors` | Add new vendor |
| `PATCH` | `/vendors/{id}/status` | Update vendor status |
| `GET` | `/rfqs` | List all RFQs |
| `POST` | `/rfqs` | Create RFQ |
| `PATCH` | `/rfqs/{id}/publish` | Publish RFQ |
| `GET` | `/quotations` | List quotations |
| `POST` | `/quotations` | Submit quotation |
| `GET` | `/approvals` | List pending approvals |
| `POST` | `/approvals/{id}/decide` | Approve / Reject |
| `GET` | `/purchase-orders` | List POs |
| `POST` | `/purchase-orders` | Create PO from quotation |
| `GET` | `/invoices` | List invoices |
| `POST` | `/invoices` | Submit invoice |
| `GET` | `/reports/summary` | Procurement analytics |

All authenticated endpoints require: `Authorization: Bearer <token>`

---

## 👥 Team

Built with ❤️ for the hackathon.

| Name | 
|------|
| Het Mengar |
| Neel Shah | 

---

<div align="center">

**VendorBridge** — Procurement, Reimagined.

*Built at Hackathon 2026*

</div>
