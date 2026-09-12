export type FormFieldType = 
  | 'text'
  | 'email'
  | 'tel'
  | 'number'
  | 'date'
  | 'time'
  | 'select'
  | 'radio'
  | 'checkbox_group'
  | 'textarea'
  | 'checkbox'
  | 'file'
  | 'heading'
  | 'note';

export type FieldWidth = 'full' | 'half' | 'third';

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FormFieldType;
  required: boolean;
  placeholder?: string;
  options?: string[]; // Used for select dropdowns, radio groups, checkbox groups
  helperText?: string;
  width?: FieldWidth; // 'full' (100%), 'half' (50%), 'third' (33%)
  accept?: string; // e.g. "image/*,.pdf" for file uploads
}

export interface FormSettings {
  // Payment / Admission Fee
  enable_payment?: boolean;
  fee_amount?: number;
  payment_mode?: 'razorpay' | 'upi_qr' | 'counter' | 'all';
  
  // Email Notifications & Auto-Reply
  notify_admin_email?: string;
  enable_auto_reply?: boolean;
  auto_reply_subject?: string;
  auto_reply_body?: string;

  // PDF Acknowledgement / Receipt
  enable_pdf_receipt?: boolean;
  receipt_title?: string;
  receipt_instructions?: string;

  // Deadlines & Limits
  close_date?: string; // ISO date string
  max_submissions?: number;
  redirect_url?: string;
}

export interface CustomForm {
  id: string;
  title: string;
  slug: string;
  description: string;
  fields: FormField[];
  is_published: boolean;
  submit_button_text: string;
  success_message: string;
  notify_email?: string;
  settings?: FormSettings;
  created_at: string;
  updated_at: string;
}

export interface FormSubmission {
  id: string;
  form_id: string;
  form_title?: string;
  data: Record<string, any>;
  status: 'new' | 'reviewed' | 'accepted' | 'rejected';
  payment_status?: 'paid' | 'pending' | 'offline' | 'exempted';
  payment_id?: string;
  amount?: number;
  created_at: string;
}
