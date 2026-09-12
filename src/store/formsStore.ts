import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { CustomForm, FormField, FormSubmission, FormSettings } from '../types/form';

const STORAGE_FORMS_KEY = 'aspire_custom_forms_v2';
const STORAGE_SUBMISSIONS_KEY = 'aspire_form_submissions_v2';

const DEFAULT_FORMS: CustomForm[] = [
  {
    id: 'f1-admission-2026',
    title: 'Admission Registration 2026-27',
    slug: 'admission-registration-2026',
    description: 'Official online application form for new student admissions across Nursery to Grade 12.',
    is_published: true,
    submit_button_text: 'Submit Admission Form',
    success_message: 'Thank you! Your admission application has been received. Our admissions committee will reach out within 2 business days.',
    notify_email: 'info@aspireuniversalinternational.com',
    settings: {
      enable_payment: true,
      fee_amount: 500,
      payment_mode: 'all',
      enable_pdf_receipt: true,
      receipt_title: 'Official Admission Application & Fee Receipt',
      enable_auto_reply: true,
      auto_reply_subject: 'Application Received - Aspire Universal International School',
      auto_reply_body: 'Dear Parent, We have received your admission application for Aspire Universal International School. Your application details are being reviewed by the admissions committee.'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    fields: [
      { id: 'fld-sec-1', name: 'sec_student', label: '1. Student Personal Information', type: 'heading', required: false, width: 'full' },
      { id: 'fld-1', name: 'student_name', label: 'Student Full Name', type: 'text', required: true, placeholder: 'e.g. Aarav Sharma', width: 'half' },
      { id: 'fld-2', name: 'dob', label: 'Date of Birth', type: 'date', required: true, width: 'half' },
      { id: 'fld-3', name: 'gender', label: 'Gender', type: 'radio', required: true, options: ['Male', 'Female', 'Other'], width: 'half' },
      { id: 'fld-4', name: 'grade_applying', label: 'Grade Applying For', type: 'select', required: true, options: ['Playgroup', 'Nursery', 'LKG', 'UKG', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11 (Science)', 'Grade 11 (Commerce)', 'Grade 11 (Arts)'], width: 'half' },
      { id: 'fld-photo', name: 'passport_photo', label: 'Student Passport Photo', type: 'file', required: false, accept: 'image/*', helperText: 'Upload recent passport size photograph (JPG, PNG)', width: 'full' },
      { id: 'fld-sec-2', name: 'sec_parent', label: '2. Parent & Contact Details', type: 'heading', required: false, width: 'full' },
      { id: 'fld-5', name: 'parent_name', label: 'Parent / Guardian Name', type: 'text', required: true, placeholder: 'e.g. Rajesh Sharma', width: 'half' },
      { id: 'fld-6', name: 'phone', label: 'Contact Phone Number', type: 'tel', required: true, placeholder: '10-digit mobile number', width: 'half' },
      { id: 'fld-7', name: 'email', label: 'Parent Email Address', type: 'email', required: false, placeholder: 'parent@example.com', width: 'half' },
      { id: 'fld-visit', name: 'preferred_visit_time', label: 'Preferred Campus Visit Time', type: 'time', required: false, width: 'half' },
      { id: 'fld-8', name: 'address', label: 'Residential Address', type: 'textarea', required: true, placeholder: 'Full home address in Patna or vicinity', width: 'full' },
      { id: 'fld-sec-3', name: 'sec_extra', label: '3. Extracurricular & Documents', type: 'heading', required: false, width: 'full' },
      { id: 'fld-activities', name: 'interests', label: 'Extracurricular Interests', type: 'checkbox_group', required: false, options: ['Cricket & Football', 'Robotics & Coding', 'Music & Drama', 'Debate & Public Speaking', 'Art & Craft'], width: 'full' },
      { id: 'fld-tc', name: 'transfer_certificate', label: 'Transfer Certificate / Marksheet', type: 'file', required: false, accept: '.pdf,image/*', helperText: 'Optional for Nursery/KG, recommended for Grades 1+', width: 'full' },
    ]
  },
  {
    id: 'f2-scholarship-test',
    title: 'Aspire Talent Search & Scholarship Test 2026',
    slug: 'scholarship-test-2026',
    description: 'Apply for the annual merit-based scholarship exam. Eligible students may receive up to 100% tuition fee waiver.',
    is_published: true,
    submit_button_text: 'Register for Scholarship Exam',
    success_message: 'Registration successful! Your admit card and exam schedule details will be sent to your registered contact number.',
    notify_email: 'info@aspireuniversalinternational.com',
    settings: {
      enable_payment: false,
      fee_amount: 0,
      enable_pdf_receipt: true,
      receipt_title: 'Scholarship Exam Registration Slip',
      enable_auto_reply: true,
      auto_reply_subject: 'Scholarship Exam Admit Card Details - Aspire Universal International School',
      auto_reply_body: 'Congratulations! You have been registered for the Aspire Talent Search Exam. Please carry your registration receipt to the exam center.'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    fields: [
      { id: 's-1', name: 'student_name', label: 'Candidate Full Name', type: 'text', required: true, placeholder: 'Full Name', width: 'half' },
      { id: 's-2', name: 'current_class', label: 'Current Class', type: 'select', required: true, options: ['Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'], width: 'half' },
      { id: 's-3', name: 'contact_number', label: 'WhatsApp / Mobile Number', type: 'tel', required: true, placeholder: '9876543210', width: 'half' },
      { id: 's-4', name: 'parent_email', label: 'Email Address', type: 'email', required: true, placeholder: 'email@example.com', width: 'half' },
      { id: 's-5', name: 'preferred_stream', label: 'Academic Interest / Stream', type: 'radio', required: true, options: ['STEM & Robotics', 'Medical & Biology', 'Commerce & Finance', 'Humanities & Arts'], width: 'full' },
      { id: 's-6', name: 'statement', label: 'Why do you want to join Aspire?', type: 'textarea', required: false, placeholder: 'Tell us about your goals and aspirations', width: 'full' },
    ]
  }
];

function loadLocalForms(): CustomForm[] {
  try {
    const raw = localStorage.getItem(STORAGE_FORMS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Could not read forms from local storage', e);
  }
  return DEFAULT_FORMS;
}

function saveLocalForms(forms: CustomForm[]) {
  try {
    localStorage.setItem(STORAGE_FORMS_KEY, JSON.stringify(forms));
  } catch (e) {
    console.warn('Could not save forms to local storage', e);
  }
}

const DEFAULT_SUBMISSIONS: FormSubmission[] = [
  {
    id: 'AUIS-2026-SUB-891',
    form_id: 'f1-admission-2026',
    form_title: 'Admission Registration 2026-27',
    data: {
      student_name: 'Vihaan Verma',
      dob: '2019-05-12',
      gender: 'Male',
      grade_applying: 'Grade 2',
      parent_name: 'Manish Verma',
      phone: '9876501234',
      email: 'manish.verma@gmail.com',
      address: 'Boring Road, Patna',
      _payment_mode_chosen: 'upi_qr',
      _payment_utr: '982173928172'
    },
    status: 'reviewed',
    payment_status: 'paid',
    payment_id: 'UTR-982173928172',
    amount: 500,
    created_at: '2026-03-08T11:20:00Z'
  },
  {
    id: 'AUIS-2026-SUB-892',
    form_id: 'f1-admission-2026',
    form_title: 'Admission Registration 2026-27',
    data: {
      student_name: 'Kavya Singh',
      dob: '2020-08-20',
      gender: 'Female',
      grade_applying: 'Grade 1',
      parent_name: 'Sanjay Kumar Singh',
      phone: '9431899221',
      email: 'sanjay.singh@outlook.com',
      address: 'Kankarbagh, Patna',
      _payment_mode_chosen: 'counter'
    },
    status: 'new',
    payment_status: 'offline',
    payment_id: 'COUNTER-OFFLINE-892',
    amount: 500,
    created_at: '2026-03-11T14:45:00Z'
  }
];

function loadLocalSubmissions(): FormSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_SUBMISSIONS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Could not read submissions from local storage', e);
  }
  return DEFAULT_SUBMISSIONS;
}

function saveLocalSubmissions(submissions: FormSubmission[]) {
  try {
    localStorage.setItem(STORAGE_SUBMISSIONS_KEY, JSON.stringify(submissions));
  } catch (e) {
    console.warn('Could not save submissions to local storage', e);
  }
}

interface FormsStore {
  forms: CustomForm[];
  submissions: FormSubmission[];
  isLoading: boolean;
  error: string | null;

  fetchForms: () => Promise<void>;
  getFormBySlug: (slug: string) => Promise<CustomForm | null>;
  addForm: (form: Omit<CustomForm, 'id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  updateForm: (id: string, form: Partial<CustomForm>) => Promise<boolean>;
  deleteForm: (id: string) => Promise<boolean>;
  togglePublish: (id: string) => Promise<boolean>;

  fetchSubmissions: (formId?: string) => Promise<void>;
  submitForm: (
    formId: string, 
    data: Record<string, any>, 
    paymentInfo?: { status?: FormSubmission['payment_status']; id?: string; amount?: number }
  ) => Promise<FormSubmission | null>;
  updateSubmissionStatus: (submissionId: string, status: FormSubmission['status']) => Promise<boolean>;
  deleteSubmission: (submissionId: string) => Promise<boolean>;
}

export const useFormsStore = create<FormsStore>((set, get) => ({
  forms: loadLocalForms(),
  submissions: loadLocalSubmissions(),
  isLoading: false,
  error: null,

  fetchForms: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('custom_forms')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) {
        const local = loadLocalForms();
        set({ forms: local, isLoading: false });
      } else {
        const mapped = data.map((item: any) => ({
          ...item,
          fields: typeof item.fields === 'string' ? JSON.parse(item.fields) : (item.fields || []),
          settings: typeof item.settings === 'string' ? JSON.parse(item.settings) : (item.settings || {})
        }));
        set({ forms: mapped, isLoading: false });
        saveLocalForms(mapped);
      }
    } catch (err: any) {
      set({ forms: loadLocalForms(), isLoading: false });
    }
  },

  getFormBySlug: async (slug: string) => {
    const existing = get().forms.find(f => f.slug === slug);
    if (existing) return existing;

    try {
      const { data, error } = await supabase
        .from('custom_forms')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!error && data) {
        return {
          ...data,
          fields: typeof data.fields === 'string' ? JSON.parse(data.fields) : (data.fields || []),
          settings: typeof data.settings === 'string' ? JSON.parse(data.settings) : (data.settings || {})
        };
      }
    } catch (e) {
      // ignore
    }

    return null;
  },

  addForm: async (formData) => {
    const newId = 'form_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const now = new Date().toISOString();
    const newForm: CustomForm = {
      ...formData,
      id: newId,
      created_at: now,
      updated_at: now,
    };

    const updated = [newForm, ...get().forms];
    set({ forms: updated });
    saveLocalForms(updated);

    try {
      await supabase.from('custom_forms').insert([{
        id: newForm.id,
        title: newForm.title,
        slug: newForm.slug,
        description: newForm.description,
        fields: newForm.fields,
        is_published: newForm.is_published,
        submit_button_text: newForm.submit_button_text,
        success_message: newForm.success_message,
        notify_email: newForm.notify_email,
        settings: newForm.settings || {},
        created_at: newForm.created_at,
        updated_at: newForm.updated_at
      }]);
    } catch (e) {
      // Ignored
    }

    return true;
  },

  updateForm: async (id, patch) => {
    const now = new Date().toISOString();
    const updated = get().forms.map(f => {
      if (f.id === id) {
        return { ...f, ...patch, updated_at: now };
      }
      return f;
    });

    set({ forms: updated });
    saveLocalForms(updated);

    try {
      await supabase.from('custom_forms').update({
        ...patch,
        updated_at: now
      }).eq('id', id);
    } catch (e) {
      // Ignored
    }

    return true;
  },

  deleteForm: async (id) => {
    const updated = get().forms.filter(f => f.id !== id);
    set({ forms: updated });
    saveLocalForms(updated);

    try {
      await supabase.from('custom_forms').delete().eq('id', id);
    } catch (e) {
      // Ignored
    }

    return true;
  },

  togglePublish: async (id) => {
    const target = get().forms.find(f => f.id === id);
    if (!target) return false;
    return get().updateForm(id, { is_published: !target.is_published });
  },

  fetchSubmissions: async (formId?: string) => {
    set({ isLoading: true });
    try {
      let query = supabase.from('form_submissions').select('*').order('created_at', { ascending: false });
      if (formId) query = query.eq('form_id', formId);

      const { data, error } = await query;
      if (error || !data) {
        const local = loadLocalSubmissions();
        const filtered = formId ? local.filter(s => s.form_id === formId) : local;
        set({ submissions: filtered, isLoading: false });
      } else {
        const mapped = data.map((item: any) => ({
          ...item,
          data: typeof item.data === 'string' ? JSON.parse(item.data) : (item.data || {})
        }));
        set({ submissions: mapped, isLoading: false });
        saveLocalSubmissions(mapped);
      }
    } catch (e) {
      const local = loadLocalSubmissions();
      const filtered = formId ? local.filter(s => s.form_id === formId) : local;
      set({ submissions: filtered, isLoading: false });
    }
  },

  submitForm: async (formId, data, paymentInfo) => {
    const targetForm = get().forms.find(f => f.id === formId);
    const newSubmission: FormSubmission = {
      id: 'AUIS-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000),
      form_id: formId,
      form_title: targetForm?.title || 'Custom Form',
      data,
      status: 'new',
      payment_status: paymentInfo?.status || (targetForm?.settings?.enable_payment ? 'pending' : 'exempted'),
      payment_id: paymentInfo?.id || '',
      amount: paymentInfo?.amount !== undefined ? paymentInfo.amount : (targetForm?.settings?.fee_amount || 0),
      created_at: new Date().toISOString()
    };

    // Save locally
    const current = loadLocalSubmissions();
    const updated = [newSubmission, ...current];
    set({ submissions: updated });
    saveLocalSubmissions(updated);

    // Save in Supabase
    try {
      await supabase.from('form_submissions').insert([{
        id: newSubmission.id,
        form_id: formId,
        data: data,
        status: 'new',
        payment_status: newSubmission.payment_status,
        payment_id: newSubmission.payment_id,
        amount: newSubmission.amount,
        created_at: newSubmission.created_at
      }]);
    } catch (e) {
      // Ignored
    }

    // Auto-sync into Accounts & Invoices ledger if fee amount > 0
    if (newSubmission.amount && newSubmission.amount > 0) {
      try {
        const { useAccountsStore } = await import('./accountsStore');
        useAccountsStore.getState().recordFormSubmissionInvoice(newSubmission, targetForm?.title);
      } catch (e) {
        console.warn('Could not sync invoice to accounts store', e);
      }
    }

    return newSubmission;
  },

  updateSubmissionStatus: async (submissionId, status) => {
    const updated = get().submissions.map(s => {
      if (s.id === submissionId) return { ...s, status };
      return s;
    });
    set({ submissions: updated });
    saveLocalSubmissions(updated);

    try {
      await supabase.from('form_submissions').update({ status }).eq('id', submissionId);
    } catch (e) {
      // Ignored
    }

    try {
      const targetSub = updated.find(s => s.id === submissionId);
      if (targetSub && targetSub.amount > 0) {
        const { useAccountsStore } = await import('./accountsStore');
        useAccountsStore.getState().recordFormSubmissionInvoice(targetSub);
      }
    } catch (e) {
      // Ignored
    }

    return true;
  },

  deleteSubmission: async (submissionId) => {
    const updated = get().submissions.filter(s => s.id !== submissionId);
    set({ submissions: updated });
    saveLocalSubmissions(updated);

    try {
      await supabase.from('form_submissions').delete().eq('id', submissionId);
    } catch (e) {
      // Ignored
    }

    return true;
  }
}));
