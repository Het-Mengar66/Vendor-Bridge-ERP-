# VendorBridge ERP — Complete Implementation Blueprint

> **Procurement & Vendor Management ERP Platform**
> Repository: [Vendor-Bridge-ERP-](https://github.com/Het-Mengar66/Vendor-Bridge-ERP-.git)

---

## 1. Project Overview

### 1.1 Vision
VendorBridge is a centralized ERP platform that digitizes procurement operations — managing vendors, RFQs, quotations, approvals, purchase orders, and invoices. It eliminates manual procurement inefficiencies through structured workflows, centralized vendor communication, and real-time tracking.

### 1.2 Core Workflow (CRITICAL — Must Not Break)

```mermaid
flowchart LR
    A["1. Procurement Officer\ncreates RFQ"] --> B["2. Vendors receive\ninvitations & submit\nquotations"]
    B --> C["3. Procurement team\ncompares quotations"]
    C --> D["4. Approval workflow\nis initiated"]
    D --> E["5. Approved quotations\ngenerate Purchase Orders"]
    E --> F["6. Invoice generated\nfrom Purchase Order"]
    F --> G["7. Invoice printed\nor emailed"]
    G --> H["8. Activities tracked\nvia logs & analytics"]
```

> [!IMPORTANT]
> Every feature, API endpoint, and UI component must respect this 8-step sequential workflow. No step can be skipped or reordered. The database schema and state machines are designed to enforce this.

### 1.3 User Roles

| Role | Permissions |
|------|------------|
| **Admin** | Manage users, manage vendors, view procurement analytics, full system control |
| **Procurement Officer** | Create RFQs, compare quotations, generate POs, generate invoices |
| **Vendor** | Submit quotations, track RFQ status, view purchase orders |
| **Manager / Approver** | Approve/reject procurement requests, monitor workflows |

---

## 2. Tech Stack

### 2.1 Architecture Overview

```mermaid
graph TB
    subgraph Frontend["Frontend (Next.js 14)"]
        UI["shadcn/ui + Tailwind CSS"]
        Pages["App Router Pages"]
        State["React Context / Zustand"]
    end

    subgraph Backend["Backend (FastAPI)"]
        API["REST API Endpoints"]
        Auth["Auth Middleware"]
        Services["Business Logic Services"]
        AI["LangGraph AI Agent"]
    end

    subgraph Database["Database (Supabase)"]
        PG["PostgreSQL"]
        SupaAuth["Supabase Auth"]
        Storage["Supabase Storage"]
        RLS["Row Level Security"]
    end

    Frontend -->|HTTP/REST| Backend
    Backend -->|SQL/ORM| Database
    AI -->|Analyze| Services
    SupaAuth -->|JWT| Auth
    Storage -->|Files| Frontend
```

### 2.2 Stack Details

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend** | Next.js | 14 (App Router) | SSR/SSG React framework |
| **UI Library** | shadcn/ui | Latest | Pre-built accessible components |
| **Styling** | Tailwind CSS | 3.x | Utility-first CSS |
| **State Mgmt** | Zustand | 4.x | Lightweight client state |
| **Backend** | FastAPI | 0.100+ | Async Python REST API |
| **ORM** | SQLAlchemy | 2.x | Database ORM |
| **DB Migrations** | Alembic | Latest | Schema migrations |
| **Database** | Supabase (PostgreSQL) | Latest | Managed Postgres + Auth + Storage |
| **Auth** | Supabase Auth | Built-in | JWT-based authentication |
| **AI Agent** | LangGraph | Latest | Quotation analysis & recommendations |
| **LLM** | Google Gemini / OpenAI | Latest | LLM for AI agent |
| **PDF Generation** | ReportLab / WeasyPrint | Latest | Invoice PDF generation |
| **Email** | FastAPI-Mail / Resend | Latest | Invoice email delivery |
| **Validation** | Pydantic | 2.x | Request/response validation |
| **HTTP Client** | Axios | Latest | Frontend API calls |

---

## 3. Project Folder Structure

### 3.1 Monorepo Layout

```
VendorBridge-ERP/
├── .github/
│   ├── workflows/
│   │   ├── ci-frontend.yml          # Frontend CI
│   │   └── ci-backend.yml           # Backend CI
│   └── PULL_REQUEST_TEMPLATE.md
│
├── frontend/                         # Next.js 14 App
│   ├── public/
│   │   └── assets/
│   ├── src/
│   │   ├── app/                      # App Router
│   │   │   ├── (auth)/               # Auth group
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── register/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── forgot-password/
│   │   │   │       └── page.tsx
│   │   │   ├── (dashboard)/          # Protected group
│   │   │   │   ├── layout.tsx        # Sidebar + Header layout
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── vendors/
│   │   │   │   │   ├── page.tsx      # Vendor list
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx  # Vendor detail
│   │   │   │   ├── rfqs/
│   │   │   │   │   ├── page.tsx      # RFQ list
│   │   │   │   │   ├── create/
│   │   │   │   │   │   └── page.tsx  # Create RFQ (multi-step)
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx  # RFQ detail
│   │   │   │   ├── quotations/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── submit/[rfqId]/
│   │   │   │   │   │   └── page.tsx  # Vendor submits quotation
│   │   │   │   │   └── compare/[rfqId]/
│   │   │   │   │       └── page.tsx  # Compare quotations
│   │   │   │   ├── approvals/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── purchase-orders/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── invoices/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── reports/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── activity/
│   │   │   │       └── page.tsx
│   │   │   ├── layout.tsx            # Root layout
│   │   │   ├── page.tsx              # Landing → redirect
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── ui/                   # shadcn/ui components
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   └── Footer.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── StatsCard.tsx
│   │   │   │   ├── RecentOrders.tsx
│   │   │   │   └── ProcurementChart.tsx
│   │   │   ├── vendors/
│   │   │   │   ├── VendorTable.tsx
│   │   │   │   ├── VendorForm.tsx
│   │   │   │   └── VendorFilters.tsx
│   │   │   ├── rfqs/
│   │   │   │   ├── RFQForm.tsx
│   │   │   │   ├── RFQStepper.tsx
│   │   │   │   └── RFQTable.tsx
│   │   │   ├── quotations/
│   │   │   │   ├── QuotationForm.tsx
│   │   │   │   ├── ComparisonTable.tsx
│   │   │   │   └── AIInsightPanel.tsx
│   │   │   ├── approvals/
│   │   │   │   ├── ApprovalTimeline.tsx
│   │   │   │   └── ApprovalActions.tsx
│   │   │   ├── invoices/
│   │   │   │   ├── InvoicePreview.tsx
│   │   │   │   └── InvoiceActions.tsx
│   │   │   └── shared/
│   │   │       ├── DataTable.tsx
│   │   │       ├── StatusBadge.tsx
│   │   │       ├── FileUpload.tsx
│   │   │       └── ConfirmDialog.tsx
│   │   ├── lib/
│   │   │   ├── api.ts                # Axios instance + interceptors
│   │   │   ├── supabase.ts           # Supabase client
│   │   │   ├── utils.ts              # Helpers
│   │   │   └── constants.ts
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useVendors.ts
│   │   │   ├── useRFQs.ts
│   │   │   └── useApprovals.ts
│   │   ├── store/
│   │   │   └── authStore.ts          # Zustand auth store
│   │   └── types/
│   │       └── index.ts              # TypeScript interfaces
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── next.config.js
│
├── backend/                           # FastAPI App
│   ├── app/
│   │   ├── main.py                    # FastAPI app entry
│   │   ├── config.py                  # Settings / env vars
│   │   ├── database.py                # SQLAlchemy engine + session
│   │   ├── dependencies.py            # Dependency injection
│   │   ├── models/                    # SQLAlchemy models
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── vendor.py
│   │   │   ├── rfq.py
│   │   │   ├── quotation.py
│   │   │   ├── approval.py
│   │   │   ├── purchase_order.py
│   │   │   ├── invoice.py
│   │   │   ├── activity_log.py
│   │   │   └── notification.py
│   │   ├── schemas/                   # Pydantic schemas
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── vendor.py
│   │   │   ├── rfq.py
│   │   │   ├── quotation.py
│   │   │   ├── approval.py
│   │   │   ├── purchase_order.py
│   │   │   ├── invoice.py
│   │   │   └── activity_log.py
│   │   ├── routers/                   # API route handlers
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── users.py
│   │   │   ├── vendors.py
│   │   │   ├── rfqs.py
│   │   │   ├── quotations.py
│   │   │   ├── approvals.py
│   │   │   ├── purchase_orders.py
│   │   │   ├── invoices.py
│   │   │   ├── reports.py
│   │   │   ├── activity.py
│   │   │   └── ai_agent.py
│   │   ├── services/                  # Business logic
│   │   │   ├── __init__.py
│   │   │   ├── auth_service.py
│   │   │   ├── vendor_service.py
│   │   │   ├── rfq_service.py
│   │   │   ├── quotation_service.py
│   │   │   ├── approval_service.py
│   │   │   ├── po_service.py
│   │   │   ├── invoice_service.py
│   │   │   ├── email_service.py
│   │   │   ├── pdf_service.py
│   │   │   ├── report_service.py
│   │   │   └── activity_service.py
│   │   ├── ai/                        # LangGraph AI Agent
│   │   │   ├── __init__.py
│   │   │   ├── agent.py               # LangGraph graph definition
│   │   │   ├── nodes.py               # Graph nodes
│   │   │   ├── state.py               # Agent state schema
│   │   │   ├── tools.py               # Agent tools
│   │   │   └── prompts.py             # System prompts
│   │   ├── middleware/
│   │   │   ├── auth_middleware.py
│   │   │   └── cors_middleware.py
│   │   └── utils/
│   │       ├── pdf_generator.py
│   │       ├── email_sender.py
│   │       └── helpers.py
│   ├── alembic/                       # DB migrations
│   │   ├── versions/
│   │   ├── env.py
│   │   └── alembic.ini
│   ├── tests/
│   ├── requirements.txt
│   └── Dockerfile
│
├── docs/
│   ├── problem-statement.pdf
│   ├── ui-mockup.jpeg
│   └── api-spec.md
│
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
```

---

## 4. Database Schema (Supabase / PostgreSQL)

### 4.1 Entity Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ VENDORS : manages
    USERS ||--o{ RFQS : creates
    USERS ||--o{ APPROVALS : approves
    USERS ||--o{ ACTIVITY_LOGS : generates

    VENDORS ||--o{ QUOTATIONS : submits
    VENDORS ||--o{ VENDOR_CATEGORIES : belongs_to
    VENDORS ||--o{ PURCHASE_ORDERS : receives
    VENDORS ||--o{ INVOICES : billed_to

    RFQS ||--o{ RFQ_ITEMS : contains
    RFQS ||--o{ RFQ_VENDORS : assigned_to
    RFQS ||--o{ QUOTATIONS : receives
    RFQS ||--o{ RFQ_ATTACHMENTS : has

    QUOTATIONS ||--o{ QUOTATION_ITEMS : contains
    QUOTATIONS ||--o| APPROVALS : triggers
    
    APPROVALS ||--o| PURCHASE_ORDERS : generates
    
    PURCHASE_ORDERS ||--o{ PO_ITEMS : contains
    PURCHASE_ORDERS ||--o| INVOICES : generates

    INVOICES ||--o{ INVOICE_ITEMS : contains
```

### 4.2 Table Definitions

#### `users`
```sql
CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email         VARCHAR(255) UNIQUE NOT NULL,
    first_name    VARCHAR(100) NOT NULL,
    last_name     VARCHAR(100) NOT NULL,
    phone         VARCHAR(20),
    role          VARCHAR(30) NOT NULL CHECK (role IN ('admin', 'procurement_officer', 'vendor', 'manager')),
    country       VARCHAR(100),
    avatar_url    TEXT,
    is_active     BOOLEAN DEFAULT TRUE,
    supabase_uid  UUID UNIQUE,                -- Links to Supabase Auth
    additional_info TEXT,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
);
```

#### `vendors`
```sql
CREATE TABLE vendors (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name  VARCHAR(255) NOT NULL,
    contact_name  VARCHAR(200),
    email         VARCHAR(255) UNIQUE NOT NULL,
    phone         VARCHAR(20),
    gst_number    VARCHAR(50),
    address       TEXT,
    city          VARCHAR(100),
    state         VARCHAR(100),
    country       VARCHAR(100),
    category      VARCHAR(100),              -- e.g., Hardware, Furniture, Software
    status        VARCHAR(30) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending', 'blocked')),
    rating        NUMERIC(3,2) DEFAULT 0,    -- 0.00 to 5.00
    user_id       UUID REFERENCES users(id), -- If vendor has a user account
    created_by    UUID REFERENCES users(id),
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
);
```

#### `rfqs` (Request for Quotation)
```sql
CREATE TABLE rfqs (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rfq_number    VARCHAR(50) UNIQUE NOT NULL,  -- Auto: RFQ-2026-001
    title         VARCHAR(300) NOT NULL,
    description   TEXT,
    category      VARCHAR(100),
    deadline      TIMESTAMPTZ NOT NULL,
    status        VARCHAR(30) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed', 'cancelled')),
    created_by    UUID REFERENCES users(id) NOT NULL,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
);
```

#### `rfq_items`
```sql
CREATE TABLE rfq_items (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rfq_id        UUID REFERENCES rfqs(id) ON DELETE CASCADE,
    item_name     VARCHAR(255) NOT NULL,
    description   TEXT,
    quantity      INTEGER NOT NULL,
    unit          VARCHAR(50) DEFAULT 'pcs',  -- pcs, kg, litre, etc.
    specifications TEXT,
    created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

#### `rfq_vendors` (Which vendors are invited to an RFQ)
```sql
CREATE TABLE rfq_vendors (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rfq_id        UUID REFERENCES rfqs(id) ON DELETE CASCADE,
    vendor_id     UUID REFERENCES vendors(id),
    invited_at    TIMESTAMPTZ DEFAULT NOW(),
    status        VARCHAR(30) DEFAULT 'invited' CHECK (status IN ('invited', 'responded', 'declined')),
    UNIQUE(rfq_id, vendor_id)
);
```

#### `rfq_attachments`
```sql
CREATE TABLE rfq_attachments (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rfq_id        UUID REFERENCES rfqs(id) ON DELETE CASCADE,
    file_name     VARCHAR(255) NOT NULL,
    file_url      TEXT NOT NULL,               -- Supabase Storage URL
    file_size     BIGINT,
    uploaded_at   TIMESTAMPTZ DEFAULT NOW()
);
```

#### `quotations`
```sql
CREATE TABLE quotations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quotation_number VARCHAR(50) UNIQUE NOT NULL, -- Auto: QT-2026-001
    rfq_id          UUID REFERENCES rfqs(id) NOT NULL,
    vendor_id       UUID REFERENCES vendors(id) NOT NULL,
    total_amount    NUMERIC(15,2) NOT NULL,
    tax_amount      NUMERIC(15,2) DEFAULT 0,
    grand_total     NUMERIC(15,2) NOT NULL,
    delivery_days   INTEGER,
    delivery_terms  TEXT,
    notes           TEXT,
    status          VARCHAR(30) DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'under_review', 'accepted', 'rejected')),
    submitted_at    TIMESTAMPTZ DEFAULT NOW(),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(rfq_id, vendor_id)
);
```

#### `quotation_items`
```sql
CREATE TABLE quotation_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quotation_id    UUID REFERENCES quotations(id) ON DELETE CASCADE,
    rfq_item_id     UUID REFERENCES rfq_items(id),
    unit_price      NUMERIC(15,2) NOT NULL,
    quantity        INTEGER NOT NULL,
    total_price     NUMERIC(15,2) NOT NULL,
    delivery_days   INTEGER,
    remarks         TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

#### `approvals`
```sql
CREATE TABLE approvals (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rfq_id          UUID REFERENCES rfqs(id) NOT NULL,
    quotation_id    UUID REFERENCES quotations(id) NOT NULL,
    vendor_id       UUID REFERENCES vendors(id) NOT NULL,
    requested_by    UUID REFERENCES users(id) NOT NULL,
    approved_by     UUID REFERENCES users(id),
    status          VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    remarks         TEXT,
    approval_date   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

#### `purchase_orders`
```sql
CREATE TABLE purchase_orders (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    po_number       VARCHAR(50) UNIQUE NOT NULL,  -- Auto: PO-2026-001
    approval_id     UUID REFERENCES approvals(id) NOT NULL,
    rfq_id          UUID REFERENCES rfqs(id) NOT NULL,
    vendor_id       UUID REFERENCES vendors(id) NOT NULL,
    quotation_id    UUID REFERENCES quotations(id) NOT NULL,
    bill_to         TEXT,
    ship_to         TEXT,
    subtotal        NUMERIC(15,2) NOT NULL,
    tax_amount      NUMERIC(15,2) DEFAULT 0,
    grand_total     NUMERIC(15,2) NOT NULL,
    order_date      DATE DEFAULT CURRENT_DATE,
    delivery_date   DATE,
    status          VARCHAR(30) DEFAULT 'created' CHECK (status IN ('created', 'sent', 'acknowledged', 'fulfilled', 'cancelled')),
    created_by      UUID REFERENCES users(id) NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

#### `po_items`
```sql
CREATE TABLE po_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    po_id           UUID REFERENCES purchase_orders(id) ON DELETE CASCADE,
    item_name       VARCHAR(255) NOT NULL,
    description     TEXT,
    quantity        INTEGER NOT NULL,
    unit_price      NUMERIC(15,2) NOT NULL,
    total_price     NUMERIC(15,2) NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

#### `invoices`
```sql
CREATE TABLE invoices (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number  VARCHAR(50) UNIQUE NOT NULL,  -- Auto: INV-2026-001
    po_id           UUID REFERENCES purchase_orders(id) NOT NULL,
    vendor_id       UUID REFERENCES vendors(id) NOT NULL,
    bill_to         TEXT,
    subtotal        NUMERIC(15,2) NOT NULL,
    tax_percentage  NUMERIC(5,2) DEFAULT 18.00,   -- GST
    tax_amount      NUMERIC(15,2) NOT NULL,
    grand_total     NUMERIC(15,2) NOT NULL,
    invoice_date    DATE DEFAULT CURRENT_DATE,
    due_date        DATE,
    status          VARCHAR(30) DEFAULT 'generated' CHECK (status IN ('generated', 'sent', 'paid', 'overdue', 'cancelled')),
    pdf_url         TEXT,                          -- Supabase Storage URL
    created_by      UUID REFERENCES users(id) NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

#### `invoice_items`
```sql
CREATE TABLE invoice_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id      UUID REFERENCES invoices(id) ON DELETE CASCADE,
    item_name       VARCHAR(255) NOT NULL,
    description     TEXT,
    quantity        INTEGER NOT NULL,
    unit_price      NUMERIC(15,2) NOT NULL,
    tax_percent     NUMERIC(5,2) DEFAULT 0,
    tax_amount      NUMERIC(15,2) DEFAULT 0,
    total_price     NUMERIC(15,2) NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

#### `activity_logs`
```sql
CREATE TABLE activity_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id),
    action_type     VARCHAR(50) NOT NULL,   -- 'rfq_created', 'quotation_submitted', 'approval_approved', etc.
    entity_type     VARCHAR(50) NOT NULL,   -- 'rfq', 'quotation', 'approval', 'po', 'invoice'
    entity_id       UUID NOT NULL,
    description     TEXT NOT NULL,
    metadata        JSONB,                  -- Extra data as JSON
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

#### `notifications`
```sql
CREATE TABLE notifications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id) NOT NULL,
    title           VARCHAR(300) NOT NULL,
    message         TEXT,
    type            VARCHAR(50),             -- 'rfq', 'approval', 'invoice', 'system'
    entity_type     VARCHAR(50),
    entity_id       UUID,
    is_read         BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 5. API Design (FastAPI Backend)

### 5.1 Base URL
```
Development:  http://localhost:8000/api/v1
Production:   https://api.vendorbridge.app/api/v1
```

### 5.2 Endpoint Map

#### Auth (`/api/v1/auth`)
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | Login with email/password | Public |
| POST | `/forgot-password` | Send reset link | Public |
| POST | `/reset-password` | Reset with token | Public |
| GET | `/me` | Get current user profile | All |
| PUT | `/me` | Update profile | All |
| POST | `/logout` | Logout (invalidate session) | All |

#### Users (`/api/v1/users`) — Admin only
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List all users (paginated) |
| GET | `/{id}` | Get user by ID |
| PUT | `/{id}` | Update user |
| DELETE | `/{id}` | Deactivate user |
| PUT | `/{id}/role` | Change user role |

#### Vendors (`/api/v1/vendors`)
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/` | List vendors (search, filter, paginate) | Officer, Admin |
| POST | `/` | Add new vendor | Officer, Admin |
| GET | `/{id}` | Get vendor details | Officer, Admin, Vendor(self) |
| PUT | `/{id}` | Update vendor | Officer, Admin |
| DELETE | `/{id}` | Deactivate vendor | Admin |
| GET | `/{id}/quotations` | Get vendor's quotation history | Officer, Admin |
| GET | `/{id}/purchase-orders` | Get vendor's POs | Officer, Admin, Vendor(self) |

#### RFQs (`/api/v1/rfqs`)
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/` | List RFQs | Officer, Admin |
| POST | `/` | Create new RFQ | Officer |
| GET | `/{id}` | Get RFQ details | Officer, Admin, Vendor(assigned) |
| PUT | `/{id}` | Update RFQ (if draft) | Officer |
| POST | `/{id}/publish` | Publish RFQ → Send to vendors | Officer |
| POST | `/{id}/close` | Close RFQ | Officer |
| GET | `/{id}/vendors` | Get assigned vendors | Officer, Admin |
| POST | `/{id}/vendors` | Assign vendors to RFQ | Officer |
| POST | `/{id}/attachments` | Upload attachment | Officer |
| GET | `/{id}/quotations` | Get all quotations for this RFQ | Officer, Admin |

#### Quotations (`/api/v1/quotations`)
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/` | List quotations | Officer, Admin |
| POST | `/` | Submit quotation for an RFQ | Vendor |
| GET | `/{id}` | Get quotation details | All(authorized) |
| PUT | `/{id}` | Update quotation (if editable) | Vendor |
| GET | `/compare/{rfq_id}` | Compare quotations for an RFQ | Officer, Admin |
| POST | `/{id}/select` | Select quotation → triggers approval | Officer |

#### AI Agent (`/api/v1/ai`)
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| POST | `/analyze-quotations/{rfq_id}` | AI analyzes & recommends best quotation | Officer |
| GET | `/analysis-result/{rfq_id}` | Get AI analysis result | Officer |

#### Approvals (`/api/v1/approvals`)
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/` | List pending approvals | Manager, Admin |
| GET | `/{id}` | Get approval details | Manager, Admin, Officer |
| POST | `/{id}/approve` | Approve → Auto-generate PO | Manager |
| POST | `/{id}/reject` | Reject with remarks | Manager |
| GET | `/{id}/timeline` | Get approval timeline | All(authorized) |

#### Purchase Orders (`/api/v1/purchase-orders`)
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/` | List POs | Officer, Admin, Vendor(own) |
| GET | `/{id}` | Get PO details | All(authorized) |
| PUT | `/{id}/status` | Update PO status | Officer, Admin |
| POST | `/{id}/generate-invoice` | Generate invoice from PO | Officer |

#### Invoices (`/api/v1/invoices`)
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/` | List invoices | Officer, Admin |
| GET | `/{id}` | Get invoice details | All(authorized) |
| GET | `/{id}/pdf` | Download invoice as PDF | All(authorized) |
| POST | `/{id}/send-email` | Email invoice to vendor | Officer |
| PUT | `/{id}/status` | Update invoice status | Officer, Admin |

#### Reports (`/api/v1/reports`)
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/dashboard-stats` | Dashboard metrics | Officer, Admin |
| GET | `/procurement-summary` | Spending summaries | Admin |
| GET | `/vendor-performance` | Vendor performance analytics | Admin |
| GET | `/monthly-trends` | Monthly procurement trends | Admin |
| GET | `/spending-by-category` | Spending by category | Admin |
| GET | `/export` | Export report as CSV/PDF | Admin |

#### Activity & Notifications (`/api/v1/activity`)
| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/logs` | Get activity logs (filtered) | Admin, Officer |
| GET | `/notifications` | Get user notifications | All |
| PUT | `/notifications/{id}/read` | Mark notification as read | All |
| PUT | `/notifications/read-all` | Mark all as read | All |

---

## 6. UI Screens (Mapped from Mockup)

> [!NOTE]
> Each screen maps directly to the mockup provided. The sidebar navigation is consistent across all protected screens with: Dashboard, Vendors, RFQs, Quotations, Approvals, Purchase Orders, Invoices, Reports, Activity.

### Screen 1: Login Page
- **Route**: `/login`
- **Components**: Logo/photo placeholder, email input, password input, "Log In" button, "Forgot Password" link, "Sign Up" link
- **shadcn components**: `Card`, `Input`, `Button`, `Label`
- **API**: `POST /auth/login`

### Screen 2: Registration Page
- **Route**: `/register`
- **Components**: Photo upload, First Name, Last Name, Email, Phone, Role dropdown (admin/officer), Country, Additional info textarea, "Register" button
- **shadcn components**: `Card`, `Input`, `Button`, `Select`, `Textarea`, `Avatar`
- **API**: `POST /auth/register`

### Screen 3: Dashboard / Home (Main Landing Page)
- **Route**: `/dashboard`
- **Components**:
  - **Header**: "Welcome back, Procurement Officer - Today's Overview"
  - **Stats Cards (4x)**: Active RFQs (12), Pending Approvals (5), Total Spent ($2.3L), Vendor Count (3)
  - **Recent Purchase Orders Table**: columns — Vendor, Item, Amount, Status, Date
  - **Quick Action Buttons**: "+ Create RFQ", "Add Vendor", "View Reports"
- **shadcn components**: `Card`, `Table`, `Badge`, `Button`
- **API**: `GET /reports/dashboard-stats`, `GET /purchase-orders?limit=5`

### Screen 4: Vendors Page
- **Route**: `/vendors`
- **Components**:
  - **Header**: "Vendors — Manage supplier profiles and registrations"
  - **"+ Add Vendor" Button** (top right)
  - **Search Bar**: search by name, GST number, category
  - **Filter Tabs**: All, Active, Inactive, Pending, Blocked
  - **Vendor Table**: columns — Name, Category, GST No., Location, Contact, Status, Actions
- **shadcn components**: `Input`, `Tabs`, `Table`, `Badge`, `Button`, `DropdownMenu`
- **API**: `GET /vendors`, `POST /vendors`, `PUT /vendors/{id}`

### Screen 5: Create RFQ Page (Multi-step Form)
- **Route**: `/rfqs/create`
- **Components**:
  - **3-Step Stepper**: ① Details → ② Items → ③ Review & Send
  - **Step 1**: RFQ title, Category dropdown, Priority select, Deadline date picker
  - **Step 2**: Item table (add/remove rows — name, qty, unit, specs), Description textarea
  - **Step 3**: Review summary, Vendor assignment checkboxes, Attachment upload area
  - **Buttons**: "Save as Draft", "Send to Vendors"
  - **Attachment area**: "Drag & drop files or click to upload"
- **shadcn components**: `Stepper` (custom), `Input`, `Select`, `DatePicker`, `Table`, `Checkbox`, `Button`, `Textarea`
- **API**: `POST /rfqs`, `POST /rfqs/{id}/vendors`, `POST /rfqs/{id}/attachments`, `POST /rfqs/{id}/publish`

### Screen 6: Quotation Submission Page (Vendor View)
- **Route**: `/quotations/submit/[rfqId]`
- **Components**:
  - **Header**: "Submit Quotation — RFQ: Office Furniture Procurement Q2 – Deadline: 18 June 2026"
  - **RFQ Details Section**: Company info, standing, rank
  - **Item Quotation Table**: columns — Item, Qty, Unit Price, Total, Delivery Days
  - **Tax & GST Section**: Subtotal, GST (18%), Discount, Grand Total
  - **Notes textarea**
  - **Buttons**: "Attach Documents", "Save Draft", "Submit Quotation"
- **shadcn components**: `Card`, `Table`, `Input`, `Textarea`, `Button`
- **API**: `POST /quotations`, `PUT /quotations/{id}`

### Screen 7: Quotation Comparison Page
- **Route**: `/quotations/compare/[rfqId]`
- **Components**:
  - **Header**: "Quotation Comparison — RFQ: Office Furniture Procurement Q2 — 3 quotations received"
  - **Tab-based comparison**: One tab per vendor (e.g., "Infra Supplies Pvt Ltd", "Vendors VTK", "Office Tech Co")
  - **Comparison Table**: Rows for each item; columns — Price, Qty, Total per vendor
  - **Highlight**: Lowest price cells highlighted in green
  - **Delivery comparison**: Delivery days per vendor
  - **Action Buttons**: "Accept & Approve", "Reject", "View AI Analysis"
  - **Note**: "Once a final pick is made, sending request to approval workflow"
  - **AI Insight Panel**: LangGraph-powered recommendation with reasoning
- **shadcn components**: `Tabs`, `Table`, `Badge`, `Button`, `Card`, `Alert`
- **API**: `GET /quotations/compare/{rfq_id}`, `POST /ai/analyze-quotations/{rfq_id}`, `POST /quotations/{id}/select`

### Screen 8: Approval Workflow Page
- **Route**: `/approvals/[id]`
- **Components**:
  - **Header**: "Approval Workflow — RFQ: Office Furniture Q2 — Vendor: Infra Supplies — ₹98400"
  - **Progress Steps (visual)**: ① → ② → ③ (with status indicators)
  - **Approval History Panel**: Timeline of who approved/rejected and when with status icons
  - **Quotation Summary Card**: Vendor name, amount, delivery days
  - **Action Buttons (Manager view)**: "Approve" (green), "Reject" (red)
  - **Remarks textarea**: "Add your remarks or conditions..."
- **shadcn components**: `Card`, `Timeline` (custom), `Button`, `Textarea`, `Badge`
- **API**: `GET /approvals/{id}`, `POST /approvals/{id}/approve`, `POST /approvals/{id}/reject`

### Screen 9: Purchase Order & Invoice Page
- **Route**: `/purchase-orders/[id]` (with invoice generation)
- **Components**:
  - **Header**: "Purchase Order & Invoice — PO-2026-auto-generated-after-approval"
  - **Action Tabs**: "Download", "Print", "Email"
  - **PO Details**: Bill To, Vendor info, PO Number, Dates (Order date, Delivery date)
  - **Items Table**: columns — Item, Qty, Unit Price, Total
  - **Totals Section**: Subtotal, Tax (GST), Discount, Grand Total
  - **Status Buttons**: "Confirm Pending Payment", "Mark as Paid"
- **shadcn components**: `Card`, `Table`, `Button`, `Badge`, `Separator`
- **API**: `GET /purchase-orders/{id}`, `POST /purchase-orders/{id}/generate-invoice`, `GET /invoices/{id}/pdf`, `POST /invoices/{id}/send-email`

### Screen 10: Activity & Logs Page
- **Route**: `/activity`
- **Components**:
  - **Header**: "Activity & Logs — Procurement audit trail"
  - **Filter Tabs**: All, RFQs, Approvals, Invoices, Vendors
  - **Activity Timeline**: Chronological list with colored icons per type
  - **Each entry**: Icon, description, timestamp, entity link
  - **Example entries**: "Quotation submitted", "Approval pending", "RFQ published", "Vendor registered"
- **shadcn components**: `Tabs`, `Card`, `Badge`, `ScrollArea`
- **API**: `GET /activity/logs?filter=all`

### Screen 11: Reports & Analytics Page
- **Route**: `/reports`
- **Components**:
  - **Header**: "Reports & Analytics — Procurement Insights: May 2026"
  - **Date filter**: "This Month" / "This Quarter" / "Custom Range" + "Export" button
  - **Stats Cards (4x)**: Total Spend (₹12.4L), Active Vendors (28), Procurement Savings (84%), Orders Closed (3)
  - **Spend by Category Chart**: Bar chart — Hardware, Furniture, Software, Logistics with percentages
  - **Top Vendors by Spend Table**: Vendor name, Spend amount, PO count
  - **Monthly Trends Chart**: Bar chart showing month-over-month trends
- **shadcn components**: `Card`, `Table`, `Button`, `Select`
- **Chart library**: `recharts` (works well with Next.js)
- **API**: `GET /reports/procurement-summary`, `GET /reports/vendor-performance`, `GET /reports/monthly-trends`, `GET /reports/spending-by-category`

---

## 7. AI Agent — LangGraph Quotation Analyzer

### 7.1 Purpose
The AI agent analyzes multiple vendor quotations for an RFQ and provides:
- **Best value recommendation** (considering price, delivery time, vendor rating)
- **Risk assessment** per vendor
- **Comparison summary** in natural language

### 7.2 Architecture

```mermaid
graph TD
    A["Trigger: POST /ai/analyze-quotations/rfq_id"] --> B["Fetch Quotations Node"]
    B --> C["Parse & Normalize Node"]
    C --> D["Score Quotations Node"]
    D --> E["LLM Analysis Node"]
    E --> F["Generate Recommendation Node"]
    F --> G["Return Result"]

    subgraph LangGraph State
        S1["quotations: list"]
        S2["scores: dict"]
        S3["llm_analysis: str"]
        S4["recommendation: dict"]
    end
```

### 7.3 Graph Nodes

| Node | Description | Input | Output |
|------|-------------|-------|--------|
| `fetch_quotations` | Loads all quotations for the RFQ from DB | `rfq_id` | `quotations[]` |
| `parse_normalize` | Normalizes prices, delivery times, ratings | `quotations[]` | `normalized_data` |
| `score_quotations` | Calculates composite score (40% price, 30% delivery, 30% rating) | `normalized_data` | `scores{}` |
| `llm_analysis` | Sends data to LLM for natural language analysis | `scores{}, quotations[]` | `analysis_text` |
| `generate_recommendation` | Produces final recommendation with reasoning | `analysis_text, scores{}` | `recommendation{}` |

### 7.4 Scoring Formula
```python
composite_score = (
    0.40 * (1 - normalized_price)    +   # Lower price = better
    0.30 * (1 - normalized_delivery) +   # Faster delivery = better
    0.30 * normalized_vendor_rating      # Higher rating = better
)
```

### 7.5 LLM Prompt Template
```
You are a procurement analysis expert. Analyze the following vendor 
quotations for RFQ: {rfq_title}.

Quotations:
{quotation_details}

Provide:
1. A ranked recommendation with the best vendor and reasoning.
2. Key risks for each vendor.
3. A concise comparison summary.

Be factual and data-driven. Consider price, delivery timeline, and 
vendor reliability.
```

### 7.6 Output Schema
```json
{
  "recommended_vendor_id": "uuid",
  "recommended_vendor_name": "Infra Supplies Pvt Ltd",
  "composite_scores": {
    "vendor_1": 0.85,
    "vendor_2": 0.72,
    "vendor_3": 0.68
  },
  "analysis_summary": "Infra Supplies offers the best value...",
  "risk_assessment": {
    "vendor_1": "Low risk — established supplier with consistent delivery",
    "vendor_2": "Medium risk — new vendor, limited track record",
    "vendor_3": "Low risk — competitive pricing but longer delivery"
  },
  "comparison_table": [...]
}
```

---

## 8. Git Collaboration Strategy

> [!IMPORTANT]
> This branching strategy is critical for multi-developer collaboration. Follow it strictly to avoid merge conflicts.

### 8.1 Branch Model

```mermaid
gitgraph
    commit id: "Initial Setup"
    branch develop
    checkout develop
    commit id: "Project scaffold"
    
    branch feature/auth
    checkout feature/auth
    commit id: "Login page"
    commit id: "Register page"
    checkout develop
    merge feature/auth
    
    branch feature/vendors
    checkout feature/vendors
    commit id: "Vendor CRUD"
    commit id: "Vendor table"
    checkout develop
    merge feature/vendors
    
    branch feature/rfq
    checkout feature/rfq
    commit id: "RFQ creation"
    commit id: "RFQ stepper"
    checkout develop
    merge feature/rfq
    
    checkout main
    merge develop id: "v1.0 Release"
```

### 8.2 Branch Naming Convention

| Branch Type | Pattern | Example | Purpose |
|-------------|---------|---------|---------|
| **Main** | `main` | `main` | Production-ready code only |
| **Develop** | `develop` | `develop` | Integration branch for features |
| **Feature** | `feature/<module>` | `feature/vendor-management` | New feature development |
| **Feature (FE)** | `feature/fe-<module>` | `feature/fe-dashboard` | Frontend-specific feature |
| **Feature (BE)** | `feature/be-<module>` | `feature/be-rfq-api` | Backend-specific feature |
| **Bugfix** | `bugfix/<description>` | `bugfix/login-validation` | Bug fixes |
| **Hotfix** | `hotfix/<description>` | `hotfix/invoice-pdf-crash` | Critical production fixes |

### 8.3 Recommended Branch Assignments (Avoid Conflicts)

> [!TIP]
> Assign **separate modules** to each developer. Since frontend and backend are in different folders, two devs can work on the same module if one does FE and the other does BE.

#### If 2 Developers:

| Developer | Branches | Files/Folders They Own |
|-----------|----------|----------------------|
| **Dev A (Frontend)** | `feature/fe-auth`, `feature/fe-dashboard`, `feature/fe-vendors`, `feature/fe-rfq`, `feature/fe-quotations`, etc. | `frontend/` folder only |
| **Dev B (Backend)** | `feature/be-auth`, `feature/be-vendors`, `feature/be-rfq`, `feature/be-quotations`, `feature/be-ai-agent`, etc. | `backend/` folder only |

#### If 3+ Developers:

| Developer | Module Ownership |
|-----------|-----------------|
| **Dev A** | Auth (FE+BE) + Vendor Management (FE+BE) |
| **Dev B** | RFQ (FE+BE) + Quotations (FE+BE) + AI Agent (BE) |
| **Dev C** | Approvals (FE+BE) + PO & Invoice (FE+BE) + Reports (FE+BE) + Activity (FE+BE) |

### 8.4 Workflow Rules

```
1. NEVER push directly to `main` or `develop`
2. ALWAYS create a feature branch from `develop`
3. ALWAYS create a Pull Request (PR) to merge into `develop`
4. Require at least 1 code review before merge
5. Use "Squash and Merge" for clean history
6. Pull latest `develop` before starting a new feature
7. Resolve conflicts locally, never on GitHub
```

### 8.5 Git Commands Cheat Sheet

```bash
# Initial setup (one-time)
git clone https://github.com/Het-Mengar66/Vendor-Bridge-ERP-.git
cd Vendor-Bridge-ERP-
git checkout -b develop
git push -u origin develop

# Starting a new feature
git checkout develop
git pull origin develop
git checkout -b feature/fe-dashboard

# Working on feature
git add .
git commit -m "feat(dashboard): add stats cards component"
git push -u origin feature/fe-dashboard

# Create PR on GitHub: feature/fe-dashboard → develop

# After PR is merged, sync locally
git checkout develop
git pull origin develop
git branch -d feature/fe-dashboard          # delete local branch

# Release to production
git checkout main
git merge develop
git push origin main
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

### 8.6 Commit Message Convention
```
feat(module): description        # New feature
fix(module): description         # Bug fix  
docs(module): description        # Documentation
style(module): description       # Formatting, no code change
refactor(module): description    # Code refactoring
test(module): description        # Adding tests
chore(module): description       # Build, CI, etc.

Examples:
feat(vendors): add vendor registration form
fix(auth): resolve JWT token expiry issue
feat(ai-agent): implement quotation scoring algorithm
docs(readme): update setup instructions
```

---

## 9. Environment Variables

### `.env.example`
```env
# ============= Frontend =============
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# ============= Backend =============
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret

# AI Agent
GOOGLE_API_KEY=your-gemini-api-key          # or OPENAI_API_KEY
LLM_MODEL=gemini-2.0-flash                  # or gpt-4o

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
# OR use Resend
RESEND_API_KEY=your-resend-key

# General
SECRET_KEY=your-random-secret-key
ENVIRONMENT=development
```

---

## 10. Development Phases & Timeline

### Phase 1: Foundation (Days 1-2)
| Task | Owner | Branch |
|------|-------|--------|
| Init Next.js 14 project with shadcn/ui + Tailwind | FE Dev | `feature/fe-project-setup` |
| [x] Init FastAPI project with SQLAlchemy + Alembic | BE Dev | `feature/be-project-setup` |
| [x] Setup Supabase project (DB + Auth + Storage) | BE Dev | `feature/be-supabase-setup` |
| [x] Create all DB tables via migrations | BE Dev | `feature/be-database-schema` |
| [x] Setup CORS, middleware, error handling | BE Dev | `feature/be-middleware` |
| Build sidebar + header layout | FE Dev | `feature/fe-layout` |
| Implement Login + Register pages | FE Dev | `feature/fe-auth` |
| Implement Auth API (register/login/me) | BE Dev | `feature/be-auth-api` |

### Phase 2: Core Modules (Days 3-4)
| Task | Owner | Branch |
|------|-------|--------|
| Vendor CRUD (API + DB) | BE Dev | `feature/be-vendors` |
| Vendor Management page (list, add, filter) | FE Dev | `feature/fe-vendors` |
| RFQ CRUD + publish workflow (API) | BE Dev | `feature/be-rfqs` |
| RFQ creation multi-step form (FE) | FE Dev | `feature/fe-rfqs` |
| [x] Quotation submission API | BE Dev | `feature/be-quotations` |
| Quotation submission page (vendor view) | FE Dev | `feature/fe-quotations` |
| [x] Quotation comparison API | BE Dev | `feature/be-quotation-compare` |
| Quotation comparison page | FE Dev | `feature/fe-quotation-compare` |

### Phase 3: Workflow + AI (Days 5-6)
| Task | Owner | Branch |
|------|-------|--------|
| [x] Approval workflow API | BE Dev | `feature/be-approvals` |
| Approval workflow page | FE Dev | `feature/fe-approvals` |
| [x] PO auto-generation from approval (API) | BE Dev | `feature/be-purchase-orders` |
| PO & Invoice page | FE Dev | `feature/fe-po-invoice` |
| [x] Invoice PDF generation | BE Dev | `feature/be-invoice-pdf` |
| [x] Invoice email sending | BE Dev | `feature/be-invoice-email` |
| [x] LangGraph AI agent (quotation analyzer) | BE Dev | `feature/be-ai-agent` |
| AI insight panel on comparison page | FE Dev | `feature/fe-ai-insights` |

### Phase 4: Analytics + Polish (Days 7-8)
| Task | Owner | Branch |
|------|-------|--------|
| [x] Dashboard stats API | BE Dev | `feature/be-dashboard` |
| Dashboard page with charts | FE Dev | `feature/fe-dashboard` |
| [x] Activity logs API | BE Dev | `feature/be-activity-logs` |
| Activity & logs page | FE Dev | `feature/fe-activity` |
| [x] Reports & analytics API | BE Dev | `feature/be-reports` |
| Reports page with charts | FE Dev | `feature/fe-reports` |
| [x] Notifications system | BE Dev | `feature/be-notifications` |
| Final integration testing | Both | `develop` |
| Bug fixes + UI polish | Both | `bugfix/*` |

---

## 11. Key State Machines

### 11.1 RFQ Status Flow
```mermaid
stateDiagram-v2
    [*] --> Draft
    Draft --> Published: Officer publishes
    Published --> Closed: Deadline passed OR manually closed
    Draft --> Cancelled: Officer cancels
    Published --> Cancelled: Officer cancels
```

### 11.2 Quotation Status Flow
```mermaid
stateDiagram-v2
    [*] --> Draft
    Draft --> Submitted: Vendor submits
    Submitted --> UnderReview: Officer reviews
    UnderReview --> Accepted: Selected for approval
    UnderReview --> Rejected: Not selected
```

### 11.3 Approval Status Flow
```mermaid
stateDiagram-v2
    [*] --> Pending
    Pending --> Approved: Manager approves → AUTO-GENERATE PO
    Pending --> Rejected: Manager rejects
```

### 11.4 Purchase Order Status Flow
```mermaid
stateDiagram-v2
    [*] --> Created
    Created --> Sent: Sent to vendor
    Sent --> Acknowledged: Vendor acknowledges
    Acknowledged --> Fulfilled: Goods/services received
    Created --> Cancelled: Cancelled
```

### 11.5 Invoice Status Flow
```mermaid
stateDiagram-v2
    [*] --> Generated
    Generated --> Sent: Emailed or printed
    Sent --> Paid: Payment received
    Sent --> Overdue: Past due date
    Generated --> Cancelled: Cancelled
```

---

## 12. Key Implementation Notes

### 12.1 Supabase Auth Integration
```
Frontend → Supabase Auth (login/register) → JWT Token
Frontend → FastAPI (with JWT in Authorization header)
FastAPI → Validates JWT via Supabase JWT Secret → Extracts user_id, role
FastAPI → Applies role-based access control on each endpoint
```

### 12.2 File Storage
- Use **Supabase Storage** for:
  - RFQ attachments (specs, drawings)
  - Vendor profile images
  - Generated invoice PDFs
- Buckets: `rfq-attachments`, `vendor-avatars`, `invoices`

### 12.3 Invoice PDF Generation Flow
```
PO Approved → Officer clicks "Generate Invoice"
→ FastAPI creates invoice record in DB
→ ReportLab/WeasyPrint generates PDF
→ PDF uploaded to Supabase Storage
→ PDF URL stored in `invoices.pdf_url`
→ Available for download, print, or email
```

### 12.4 Email Flow
```
Officer clicks "Send Invoice via Email"
→ FastAPI fetches invoice + vendor email
→ Attaches PDF from Supabase Storage
→ Sends via SMTP (Gmail) or Resend API
→ Updates invoice status to 'sent'
→ Creates activity log entry
```

---

## 13. Verification Plan

### 13.1 Automated Tests
```bash
# Backend
cd backend
pytest tests/ -v

# Frontend
cd frontend
npm run test
npm run build            # Ensures no build errors
```

### 13.2 Manual Verification — Full Workflow Test
1. **Admin** creates vendor accounts
2. **Procurement Officer** creates an RFQ with items and assigns vendors
3. **Vendors** (multiple) log in and submit quotations
4. **Officer** opens comparison page, views AI analysis
5. **Officer** selects best quotation → triggers approval
6. **Manager** views approval → approves with remarks
7. System auto-generates Purchase Order
8. **Officer** generates invoice from PO
9. **Officer** downloads PDF, prints, and emails invoice
10. All activities visible in Activity Logs
11. Reports page shows updated analytics

> [!CAUTION]
> Every step in the workflow must work **sequentially**. Test the full chain end-to-end. A broken link in the chain means the ERP is not functional.

---

## Open Questions

> [!IMPORTANT]
> **Q1**: How many team members are collaborating? This affects the branch assignment strategy in Section 8.3.

> [!IMPORTANT]
> **Q2**: Do you have a Supabase project already created, or should I set one up during implementation?

> [!IMPORTANT]  
> **Q3**: For the AI Agent, do you prefer **Google Gemini** or **OpenAI GPT-4o** as the LLM? (Gemini has a generous free tier.)

> [!NOTE]
> **Q4**: Should we deploy during the hackathon (e.g., Vercel for frontend, Railway/Render for backend), or is local development sufficient?

> [!NOTE]
> **Q5**: For email sending, do you have a Gmail account with App Password ready, or should we use Resend (free tier: 100 emails/day)?
