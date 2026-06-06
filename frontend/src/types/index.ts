export type UserRole = 'admin' | 'procurement_officer' | 'vendor' | 'manager';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: UserRole;
  country?: string;
  avatar_url?: string;
  is_active: boolean;
  supabase_uid?: string;
  additional_info?: string;
  created_at: string;
  updated_at: string;
}

export interface Vendor {
  id: string;
  company_name: string;
  contact_name?: string;
  email: string;
  phone?: string;
  gst_number?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  category?: string;
  status: 'active' | 'inactive' | 'pending' | 'blocked';
  rating: number;
  user_id?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface RFQ {
  id: string;
  rfq_number: string;
  title: string;
  description?: string;
  category?: string;
  deadline: string;
  status: 'draft' | 'published' | 'closed' | 'cancelled';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface RFQItem {
  id: string;
  rfq_id: string;
  item_name: string;
  description?: string;
  quantity: number;
  unit: string;
  specifications?: string;
  created_at: string;
}

export interface Quotation {
  id: string;
  quotation_number: string;
  rfq_id: string;
  vendor_id: string;
  total_amount: number;
  tax_amount: number;
  grand_total: number;
  delivery_days?: number;
  delivery_terms?: string;
  notes?: string;
  status: 'draft' | 'submitted' | 'under_review' | 'accepted' | 'rejected';
  submitted_at?: string;
  created_at: string;
  updated_at: string;
}

export interface QuotationItem {
  id: string;
  quotation_id: string;
  rfq_item_id?: string;
  unit_price: number;
  quantity: number;
  total_price: number;
  delivery_days?: number;
  remarks?: string;
  created_at: string;
}

export interface Approval {
  id: string;
  rfq_id: string;
  quotation_id: string;
  vendor_id: string;
  requested_by: string;
  approved_by?: string;
  status: 'pending' | 'approved' | 'rejected';
  remarks?: string;
  approval_date?: string;
  created_at: string;
  updated_at: string;
}

export interface PurchaseOrder {
  id: string;
  po_number: string;
  approval_id: string;
  rfq_id: string;
  vendor_id: string;
  quotation_id: string;
  bill_to?: string;
  ship_to?: string;
  subtotal: number;
  tax_amount: number;
  grand_total: number;
  order_date: string;
  delivery_date?: string;
  status: 'created' | 'sent' | 'acknowledged' | 'fulfilled' | 'cancelled';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  po_id: string;
  vendor_id: string;
  bill_to?: string;
  subtotal: number;
  tax_percentage: number;
  tax_amount: number;
  grand_total: number;
  invoice_date: string;
  due_date?: string;
  status: 'generated' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  pdf_url?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  user_id?: string;
  action_type: string;
  entity_type: string;
  entity_id: string;
  description: string;
  metadata?: any;
  created_at: string;
}
