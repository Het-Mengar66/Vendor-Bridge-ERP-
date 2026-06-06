-- Users Table
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

-- Vendors Table
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
    category      VARCHAR(100),
    status        VARCHAR(30) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending', 'blocked')),
    rating        NUMERIC(3,2) DEFAULT 0,
    user_id       UUID REFERENCES users(id),
    created_by    UUID REFERENCES users(id),
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- RFQs Table
CREATE TABLE rfqs (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rfq_number    VARCHAR(50) UNIQUE NOT NULL,
    title         VARCHAR(300) NOT NULL,
    description   TEXT,
    category      VARCHAR(100),
    deadline      TIMESTAMPTZ NOT NULL,
    status        VARCHAR(30) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed', 'cancelled')),
    created_by    UUID REFERENCES users(id) NOT NULL,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- RFQ Items
CREATE TABLE rfq_items (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rfq_id        UUID REFERENCES rfqs(id) ON DELETE CASCADE,
    item_name     VARCHAR(255) NOT NULL,
    description   TEXT,
    quantity      INTEGER NOT NULL,
    unit          VARCHAR(50) DEFAULT 'pcs',
    specifications TEXT,
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- RFQ Vendors (Invitations)
CREATE TABLE rfq_vendors (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rfq_id        UUID REFERENCES rfqs(id) ON DELETE CASCADE,
    vendor_id     UUID REFERENCES vendors(id),
    invited_at    TIMESTAMPTZ DEFAULT NOW(),
    status        VARCHAR(30) DEFAULT 'invited' CHECK (status IN ('invited', 'responded', 'declined')),
    UNIQUE(rfq_id, vendor_id)
);

-- RFQ Attachments
CREATE TABLE rfq_attachments (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rfq_id        UUID REFERENCES rfqs(id) ON DELETE CASCADE,
    file_name     VARCHAR(255) NOT NULL,
    file_url      TEXT NOT NULL,
    file_size     BIGINT,
    uploaded_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Quotations
CREATE TABLE quotations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quotation_number VARCHAR(50) UNIQUE NOT NULL,
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

-- Quotation Items
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

-- Approvals
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

-- Purchase Orders
CREATE TABLE purchase_orders (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    po_number       VARCHAR(50) UNIQUE NOT NULL,
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

-- PO Items
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

-- Invoices
CREATE TABLE invoices (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number  VARCHAR(50) UNIQUE NOT NULL,
    po_id           UUID REFERENCES purchase_orders(id) NOT NULL,
    vendor_id       UUID REFERENCES vendors(id) NOT NULL,
    bill_to         TEXT,
    subtotal        NUMERIC(15,2) NOT NULL,
    tax_percentage  NUMERIC(5,2) DEFAULT 18.00,
    tax_amount      NUMERIC(15,2) NOT NULL,
    grand_total     NUMERIC(15,2) NOT NULL,
    invoice_date    DATE DEFAULT CURRENT_DATE,
    due_date        DATE,
    status          VARCHAR(30) DEFAULT 'generated' CHECK (status IN ('generated', 'sent', 'paid', 'overdue', 'cancelled')),
    pdf_url         TEXT,
    created_by      UUID REFERENCES users(id) NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Invoice Items
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

-- Activity Logs
CREATE TABLE activity_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id),
    action_type     VARCHAR(50) NOT NULL,
    entity_type     VARCHAR(50) NOT NULL,
    entity_id       UUID NOT NULL,
    description     TEXT NOT NULL,
    metadata        JSONB,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id) NOT NULL,
    title           VARCHAR(300) NOT NULL,
    message         TEXT,
    type            VARCHAR(50),
    entity_type     VARCHAR(50),
    entity_id       UUID,
    is_read         BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
