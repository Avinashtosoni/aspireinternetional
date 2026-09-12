import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Invoice, PaymentRecord, InvoiceStatus } from '../types/accounts';

const STORAGE_INVOICES_KEY = 'aspire_school_invoices_v1';

const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv_1',
    invoice_number: 'INV-2026-001',
    student_name: 'Aarav Sharma',
    student_id: 'AUIS-2026-101',
    grade: 'Grade 1',
    parent_name: 'Rajesh Sharma',
    parent_phone: '9876543210',
    parent_email: 'rajesh.sharma@gmail.com',
    items: [
      { id: 'item_1', description: 'Admission & Registration Fee', category: 'admission', amount: 10000 },
      { id: 'item_2', description: 'Quarter 1 Tuition Fee (Apr - Jun 2026)', category: 'tuition', amount: 12000 },
      { id: 'item_3', description: 'Smart Class & Lab Maintenance', category: 'lab', amount: 2000 },
    ],
    subtotal: 24000,
    discount: 1500,
    total_amount: 22500,
    paid_amount: 22500,
    balance_due: 0,
    status: 'paid',
    issue_date: '2026-03-01',
    due_date: '2026-03-25',
    payment_records: [
      {
        id: 'pay_1',
        amount: 22500,
        payment_date: '2026-03-10',
        payment_mode: 'upi',
        reference_no: 'UPI/20260310/892182',
        notes: 'Paid online via PhonePe'
      }
    ],
    created_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-03-10T14:30:00Z'
  },
  {
    id: 'inv_2',
    invoice_number: 'INV-2026-002',
    student_name: 'Priya Verma',
    student_id: 'AUIS-2026-102',
    grade: 'Grade 5',
    parent_name: 'Sunil Verma',
    parent_phone: '9835012345',
    parent_email: 'sunil.verma@yahoo.com',
    items: [
      { id: 'item_4', description: 'Quarter 1 Tuition Fee (Apr - Jun 2026)', category: 'tuition', amount: 13500 },
      { id: 'item_5', description: 'School Bus Transportation (Zone 2)', category: 'transport', amount: 4500 },
    ],
    subtotal: 18000,
    discount: 0,
    total_amount: 18000,
    paid_amount: 10000,
    balance_due: 8000,
    status: 'partial',
    issue_date: '2026-03-05',
    due_date: '2026-04-10',
    payment_records: [
      {
        id: 'pay_2',
        amount: 10000,
        payment_date: '2026-03-15',
        payment_mode: 'cash',
        reference_no: 'RCP-COUNTER-891',
        notes: 'First installment paid at school cash counter'
      }
    ],
    created_at: '2026-03-05T11:00:00Z',
    updated_at: '2026-03-15T12:00:00Z'
  },
  {
    id: 'inv_3',
    invoice_number: 'INV-2026-003',
    student_name: 'Rohan Gupta',
    student_id: 'AUIS-2026-103',
    grade: 'Grade 8',
    parent_name: 'Amit Gupta',
    parent_phone: '9431809876',
    parent_email: 'amit.gupta@outlook.com',
    items: [
      { id: 'item_6', description: 'Quarter 1 Tuition Fee', category: 'tuition', amount: 14000 },
      { id: 'item_7', description: 'Composite Science & Robotics Lab Fee', category: 'lab', amount: 2500 },
    ],
    subtotal: 16500,
    discount: 0,
    total_amount: 16500,
    paid_amount: 0,
    balance_due: 16500,
    status: 'unpaid',
    issue_date: '2026-03-10',
    due_date: '2026-04-15',
    payment_records: [],
    created_at: '2026-03-10T09:30:00Z',
    updated_at: '2026-03-10T09:30:00Z'
  },
  {
    id: 'inv_4',
    invoice_number: 'INV-2026-004',
    student_name: 'Ananya Mishra',
    student_id: 'AUIS-2026-104',
    grade: 'Grade 10',
    parent_name: 'Dr. R. K. Mishra',
    parent_phone: '9123456789',
    parent_email: 'dr.rkmishra@gmail.com',
    items: [
      { id: 'item_8', description: 'Term Assessment & Board Exam Preps', category: 'exam', amount: 5000 },
      { id: 'item_9', description: 'Annual Development & Library Charges', category: 'annual', amount: 9000 },
    ],
    subtotal: 14000,
    discount: 0,
    total_amount: 14000,
    paid_amount: 0,
    balance_due: 14000,
    status: 'overdue',
    issue_date: '2026-01-15',
    due_date: '2026-02-15',
    payment_records: [],
    created_at: '2026-01-15T08:00:00Z',
    updated_at: '2026-01-15T08:00:00Z'
  }
];

function syncFormSubmissionsToInvoices(existingInvoices: Invoice[]): Invoice[] {
  try {
    const rawSubs = localStorage.getItem('aspire_form_submissions_v2');
    if (!rawSubs) return existingInvoices;
    const subs: any[] = JSON.parse(rawSubs);
    if (!Array.isArray(subs)) return existingInvoices;

    let updatedInvoices = [...existingInvoices];
    let changed = false;

    subs.forEach((sub) => {
      const amount = Number(sub.amount) || 0;
      if (amount <= 0 && sub.payment_status === 'exempted') return;

      const exists = updatedInvoices.some(
        (inv) => inv.student_id === sub.id || (inv.notes && inv.notes.includes(sub.id))
      );

      if (!exists) {
        const d = sub.data || {};
        const studentName = d.student_name || d.full_name || d.name || d.applicant_name || d.child_name || 'Admission Applicant';
        const parentName = d.parent_name || d.father_name || d.mother_name || d.guardian_name || 'Parent / Guardian';
        const parentPhone = d.phone || d.mobile || d.contact_number || d.parent_phone || 'N/A';
        const parentEmail = d.email || d.parent_email || '';
        const grade = d.grade_applying || d.class || d.grade || d.admission_grade || d.applying_for || 'Admission Candidate';

        const isPaid = sub.payment_status === 'paid';
        const issueDate = sub.created_at ? sub.created_at.slice(0, 10) : new Date().toISOString().slice(0, 10);
        const dueDateObj = new Date(issueDate);
        dueDateObj.setDate(dueDateObj.getDate() + 15);
        const dueDate = dueDateObj.toISOString().slice(0, 10);

        const paymentRecords: PaymentRecord[] = isPaid && amount > 0 ? [
          {
            id: 'pay_sub_' + sub.id,
            amount: amount,
            payment_date: issueDate,
            payment_mode: (d._payment_mode_chosen === 'upi_qr' || sub.payment_id?.startsWith('UTR-')) ? 'upi' : 'cash',
            reference_no: sub.payment_id || (d._payment_utr ? `UTR: ${d._payment_utr}` : 'ONLINE'),
            notes: `Online collection: ${sub.form_title || 'Admission Portal'}`
          }
        ] : [];

        const newInv: Invoice = {
          id: 'inv_sub_' + sub.id.replace(/[^A-Za-z0-9]/g, '').slice(-8),
          invoice_number: `INV-ADM-${sub.id.replace(/[^A-Za-z0-9]/g, '').slice(-5)}`,
          student_name: String(studentName),
          student_id: sub.id,
          grade: String(grade),
          parent_name: String(parentName),
          parent_phone: String(parentPhone),
          parent_email: String(parentEmail),
          items: [
            {
              id: 'item_sub_' + sub.id,
              description: `Application & Admission Fee - ${sub.form_title || 'Admission Portal'}`,
              category: 'admission',
              amount: amount
            }
          ],
          subtotal: amount,
          discount: 0,
          total_amount: amount,
          paid_amount: isPaid ? amount : 0,
          balance_due: isPaid ? 0 : amount,
          status: isPaid ? 'paid' : 'unpaid',
          issue_date: issueDate,
          due_date: dueDate,
          notes: `Online Form Submission: #${sub.id} (${sub.form_title || 'Admission Portal'})`,
          payment_records: paymentRecords,
          created_at: sub.created_at || new Date().toISOString(),
          updated_at: sub.created_at || new Date().toISOString()
        };

        updatedInvoices.unshift(newInv);
        changed = true;
      }
    });

    if (changed) {
      saveLocalInvoices(updatedInvoices);
    }
    return updatedInvoices;
  } catch (e) {
    return existingInvoices;
  }
}

function loadLocalInvoices(): Invoice[] {
  let base: Invoice[] = INITIAL_INVOICES;
  try {
    const raw = localStorage.getItem(STORAGE_INVOICES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) base = parsed;
    }
  } catch (e) {
    console.warn('Could not read invoices from local storage', e);
  }
  return syncFormSubmissionsToInvoices(base);
}

function saveLocalInvoices(invoices: Invoice[]) {
  try {
    localStorage.setItem(STORAGE_INVOICES_KEY, JSON.stringify(invoices));
  } catch (e) {
    console.warn('Could not save invoices to local storage', e);
  }
}

interface AccountsStore {
  invoices: Invoice[];
  isLoading: boolean;
  error: string | null;

  fetchInvoices: () => Promise<void>;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  updateInvoice: (id: string, patch: Partial<Invoice>) => Promise<boolean>;
  deleteInvoice: (id: string) => Promise<boolean>;
  recordPayment: (invoiceId: string, payment: Omit<PaymentRecord, 'id'>) => Promise<boolean>;
  recordFormSubmissionInvoice: (submission: any, formTitle?: string) => Promise<boolean>;
}

export const useAccountsStore = create<AccountsStore>((set, get) => ({
  invoices: loadLocalInvoices(),
  isLoading: false,
  error: null,

  fetchInvoices: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) {
        set({ invoices: loadLocalInvoices(), isLoading: false });
      } else {
        const mapped = data.map((item: any) => ({
          ...item,
          items: typeof item.items === 'string' ? JSON.parse(item.items) : (item.items || []),
          payment_records: typeof item.payment_records === 'string' ? JSON.parse(item.payment_records) : (item.payment_records || [])
        }));
        set({ invoices: mapped, isLoading: false });
        saveLocalInvoices(mapped);
      }
    } catch (e) {
      set({ invoices: loadLocalInvoices(), isLoading: false });
    }
  },

  addInvoice: async (data) => {
    const newId = 'inv_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const now = new Date().toISOString();
    const newInvoice: Invoice = {
      ...data,
      id: newId,
      created_at: now,
      updated_at: now,
    };

    const updated = [newInvoice, ...get().invoices];
    set({ invoices: updated });
    saveLocalInvoices(updated);

    try {
      await supabase.from('invoices').insert([{
        id: newInvoice.id,
        invoice_number: newInvoice.invoice_number,
        student_name: newInvoice.student_name,
        student_id: newInvoice.student_id,
        grade: newInvoice.grade,
        parent_name: newInvoice.parent_name,
        parent_phone: newInvoice.parent_phone,
        parent_email: newInvoice.parent_email,
        items: newInvoice.items,
        subtotal: newInvoice.subtotal,
        discount: newInvoice.discount,
        total_amount: newInvoice.total_amount,
        paid_amount: newInvoice.paid_amount,
        balance_due: newInvoice.balance_due,
        status: newInvoice.status,
        issue_date: newInvoice.issue_date,
        due_date: newInvoice.due_date,
        payment_records: newInvoice.payment_records,
        created_at: newInvoice.created_at,
        updated_at: newInvoice.updated_at
      }]);
    } catch (e) {
      // Local storage fallback active
    }

    return true;
  },

  updateInvoice: async (id, patch) => {
    const now = new Date().toISOString();
    const updated = get().invoices.map(inv => {
      if (inv.id === id) {
        return { ...inv, ...patch, updated_at: now };
      }
      return inv;
    });

    set({ invoices: updated });
    saveLocalInvoices(updated);

    try {
      await supabase.from('invoices').update({
        ...patch,
        updated_at: now
      }).eq('id', id);
    } catch (e) {
      // Ignored
    }

    return true;
  },

  deleteInvoice: async (id) => {
    const updated = get().invoices.filter(inv => inv.id !== id);
    set({ invoices: updated });
    saveLocalInvoices(updated);

    try {
      await supabase.from('invoices').delete().eq('id', id);
    } catch (e) {
      // Ignored
    }

    return true;
  },

  recordPayment: async (invoiceId, payment) => {
    const target = get().invoices.find(inv => inv.id === invoiceId);
    if (!target) return false;

    const newPaymentRecord: PaymentRecord = {
      ...payment,
      id: 'pay_' + Date.now().toString(36)
    };

    const newPaidAmount = target.paid_amount + payment.amount;
    const newBalanceDue = Math.max(0, target.total_amount - newPaidAmount);
    
    let newStatus: InvoiceStatus = 'paid';
    if (newBalanceDue === 0) {
      newStatus = 'paid';
    } else if (newPaidAmount > 0) {
      newStatus = 'partial';
    } else {
      newStatus = target.status;
    }

    return get().updateInvoice(invoiceId, {
      paid_amount: newPaidAmount,
      balance_due: newBalanceDue,
      status: newStatus,
      payment_records: [...target.payment_records, newPaymentRecord]
    });
  },

  recordFormSubmissionInvoice: async (submission: any, formTitle?: string) => {
    // Check if an invoice for this submission already exists
    const existing = get().invoices.find(
      (inv) => inv.student_id === submission.id || (inv.notes && inv.notes.includes(submission.id))
    );
    if (existing) {
      if (submission.payment_status === 'paid' && existing.status !== 'paid') {
        return get().updateInvoice(existing.id, {
          status: 'paid',
          paid_amount: existing.total_amount,
          balance_due: 0,
          payment_records: existing.payment_records.length > 0 ? existing.payment_records : [
            {
              id: 'pay_sub_' + submission.id,
              amount: existing.total_amount,
              payment_date: new Date().toISOString().slice(0, 10),
              payment_mode: (submission.data?._payment_mode_chosen === 'upi_qr' || submission.payment_id?.startsWith('UTR-')) ? 'upi' : 'cash',
              reference_no: submission.payment_id || 'ONLINE',
              notes: `Online Admission Fee: ${formTitle || submission.form_title || 'Application'}`
            }
          ]
        });
      }
      return true;
    }

    const d = submission.data || {};
    const studentName = d.student_name || d.full_name || d.name || d.applicant_name || d.child_name || 'Admission Applicant';
    const parentName = d.parent_name || d.father_name || d.mother_name || d.guardian_name || 'Parent / Guardian';
    const parentPhone = d.phone || d.mobile || d.contact_number || d.parent_phone || 'N/A';
    const parentEmail = d.email || d.parent_email || '';
    const grade = d.grade_applying || d.class || d.grade || d.admission_grade || d.applying_for || 'Admission Candidate';

    const isPaid = submission.payment_status === 'paid';
    const amount = Number(submission.amount) || 0;
    if (amount <= 0 && submission.payment_status === 'exempted') {
      return false;
    }

    const issueDate = submission.created_at ? submission.created_at.slice(0, 10) : new Date().toISOString().slice(0, 10);
    const dueDateObj = new Date(issueDate);
    dueDateObj.setDate(dueDateObj.getDate() + 15);
    const dueDate = dueDateObj.toISOString().slice(0, 10);

    const paymentRecords: PaymentRecord[] = isPaid && amount > 0 ? [
      {
        id: 'pay_sub_' + submission.id,
        amount: amount,
        payment_date: issueDate,
        payment_mode: (d._payment_mode_chosen === 'upi_qr' || submission.payment_id?.startsWith('UTR-')) ? 'upi' : 'cash',
        reference_no: submission.payment_id || (d._payment_utr ? `UTR: ${d._payment_utr}` : 'ONLINE'),
        notes: `Online collection via Form Portal: ${formTitle || submission.form_title || 'Application'}`
      }
    ] : [];

    const newInvoiceData: Omit<Invoice, 'id' | 'created_at' | 'updated_at'> = {
      invoice_number: `INV-ADM-${submission.id.replace(/[^A-Za-z0-9]/g, '').slice(-5)}`,
      student_name: String(studentName),
      student_id: submission.id,
      grade: String(grade),
      parent_name: String(parentName),
      parent_phone: String(parentPhone),
      parent_email: String(parentEmail),
      items: [
        {
          id: 'item_sub_' + submission.id,
          description: `Application & Admission Fee - ${formTitle || submission.form_title || 'Online Portal'}`,
          category: 'admission',
          amount: amount
        }
      ],
      subtotal: amount,
      discount: 0,
      total_amount: amount,
      paid_amount: isPaid ? amount : 0,
      balance_due: isPaid ? 0 : amount,
      status: isPaid ? 'paid' : 'unpaid',
      issue_date: issueDate,
      due_date: dueDate,
      notes: `Online Admission Form: #${submission.id} (${formTitle || submission.form_title || 'Application'})`,
      payment_records: paymentRecords
    };

    return get().addInvoice(newInvoiceData);
  }
}));
