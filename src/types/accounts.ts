export type FeeCategory = 
  | 'tuition'
  | 'admission'
  | 'transport'
  | 'lab'
  | 'exam'
  | 'annual'
  | 'uniform'
  | 'other';

export type PaymentMode = 'upi' | 'cash' | 'cheque' | 'netbanking' | 'other';

export type InvoiceStatus = 'paid' | 'partial' | 'unpaid' | 'overdue';

export interface FeeItem {
  id: string;
  description: string;
  category: FeeCategory;
  amount: number;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  payment_date: string;
  payment_mode: PaymentMode;
  reference_no?: string;
  notes?: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  student_name: string;
  student_id: string; // e.g. "AUIS-2026-089"
  grade: string;
  parent_name: string;
  parent_phone: string;
  parent_email?: string;
  items: FeeItem[];
  subtotal: number;
  discount: number; // Scholarship / Concession
  total_amount: number;
  paid_amount: number;
  balance_due: number;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string;
  notes?: string;
  payment_records: PaymentRecord[];
  created_at: string;
  updated_at: string;
}
