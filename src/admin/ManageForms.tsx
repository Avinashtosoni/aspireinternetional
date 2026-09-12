import React, { useEffect, useState } from 'react';
import { 
  Plus, Edit2, Trash2, Eye, Globe, Copy, Check, 
  Layers, Download, X, ArrowUp, ArrowDown, 
  CheckCircle2, Clock, FileText, ExternalLink, Filter, 
  Settings, CreditCard, Mail, Printer, ShieldCheck, Sparkles
} from 'lucide-react';
import { useFormsStore } from '../store/formsStore';
import { CustomForm, FormField, FormFieldType, FieldWidth, FormSubmission, FormSettings } from '../types/form';
import FormReceiptModal from '../components/FormReceiptModal';

type BuilderTab = 'info' | 'fields' | 'settings';

export default function ManageForms() {
  const { 
    forms, 
    submissions, 
    fetchForms, 
    fetchSubmissions, 
    addForm, 
    updateForm, 
    deleteForm, 
    togglePublish,
    updateSubmissionStatus,
    deleteSubmission 
  } = useFormsStore();

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [modalTab, setModalTab] = useState<BuilderTab>('info');
  const [editingForm, setEditingForm] = useState<CustomForm | null>(null);
  const [activeSubmissionsForm, setActiveSubmissionsForm] = useState<CustomForm | null>(null);
  const [viewingSubmission, setViewingSubmission] = useState<FormSubmission | null>(null);
  const [receiptModalData, setReceiptModalData] = useState<{ submission: FormSubmission; form: CustomForm } | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [submissionSearch, setSubmissionSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Form Builder State
  const [formMeta, setFormMeta] = useState({
    title: '',
    slug: '',
    description: '',
    submit_button_text: 'Submit Application',
    success_message: 'Thank you! Your submission has been received successfully.',
    notify_email: '',
    is_published: true,
  });

  const [formSettings, setFormSettings] = useState<FormSettings>({
    enable_payment: false,
    fee_amount: 0,
    payment_mode: 'all',
    enable_pdf_receipt: true,
    receipt_title: '',
    enable_auto_reply: true,
    auto_reply_subject: '',
    auto_reply_body: '',
    close_date: '',
    max_submissions: 0,
  });

  const [formFields, setFormFields] = useState<FormField[]>([]);

  useEffect(() => {
    fetchForms();
    fetchSubmissions();
  }, []);

  const openCreateModal = () => {
    setEditingForm(null);
    setModalTab('info');
    setFormMeta({
      title: '',
      slug: '',
      description: '',
      submit_button_text: 'Submit Application',
      success_message: 'Thank you! Your response has been submitted successfully.',
      notify_email: 'info@aspireuniversalinternational.com',
      is_published: true,
    });
    setFormSettings({
      enable_payment: false,
      fee_amount: 0,
      payment_mode: 'all',
      enable_pdf_receipt: true,
      receipt_title: '',
      enable_auto_reply: true,
      auto_reply_subject: 'Application Received - Aspire Universal International School',
      auto_reply_body: 'Thank you for your submission. Your application details have been safely received.',
      close_date: '',
      max_submissions: 0,
    });
    setFormFields([
      { id: 'fld-sec', name: 'sec_1', label: '1. Basic Information', type: 'heading', required: false, width: 'full' },
      { id: 'fld-1', name: 'full_name', label: 'Full Name', type: 'text', required: true, placeholder: 'Enter full name', width: 'half' },
      { id: 'fld-2', name: 'phone', label: 'Phone Number', type: 'tel', required: true, placeholder: '10-digit mobile number', width: 'half' },
      { id: 'fld-3', name: 'email', label: 'Email Address', type: 'email', required: false, placeholder: 'name@example.com', width: 'half' },
      { id: 'fld-4', name: 'dob', label: 'Date of Birth', type: 'date', required: false, width: 'half' },
    ]);
    setIsCreateOpen(true);
  };

  const openEditModal = (form: CustomForm) => {
    setEditingForm(form);
    setModalTab('info');
    setFormMeta({
      title: form.title,
      slug: form.slug,
      description: form.description,
      submit_button_text: form.submit_button_text || 'Submit Application',
      success_message: form.success_message || 'Thank you! Your submission has been received.',
      notify_email: form.notify_email || '',
      is_published: form.is_published,
    });
    setFormSettings({
      enable_payment: form.settings?.enable_payment || false,
      fee_amount: form.settings?.fee_amount || 0,
      payment_mode: form.settings?.payment_mode || 'all',
      enable_pdf_receipt: form.settings?.enable_pdf_receipt !== false,
      receipt_title: form.settings?.receipt_title || '',
      enable_auto_reply: form.settings?.enable_auto_reply || false,
      auto_reply_subject: form.settings?.auto_reply_subject || '',
      auto_reply_body: form.settings?.auto_reply_body || '',
      close_date: form.settings?.close_date || '',
      max_submissions: form.settings?.max_submissions || 0,
    });
    setFormFields([...form.fields]);
    setIsCreateOpen(true);
  };

  const handleTitleChange = (val: string) => {
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormMeta(prev => ({
      ...prev,
      title: val,
      slug: editingForm ? prev.slug : autoSlug
    }));
  };

  const addField = () => {
    const newField: FormField = {
      id: 'fld_' + Math.random().toString(36).substr(2, 6),
      name: `field_${formFields.length + 1}`,
      label: `New Field ${formFields.length + 1}`,
      type: 'text',
      required: false,
      placeholder: '',
      width: 'full',
    };
    setFormFields([...formFields, newField]);
  };

  const updateField = (index: number, patch: Partial<FormField>) => {
    const updated = [...formFields];
    updated[index] = { ...updated[index], ...patch };
    setFormFields(updated);
  };

  const removeField = (index: number) => {
    setFormFields(formFields.filter((_, i) => i !== index));
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= formFields.length) return;
    const updated = [...formFields];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setFormFields(updated);
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMeta.title.trim() || !formMeta.slug.trim()) {
      alert('Please provide a valid Title and URL Slug');
      return;
    }
    if (formFields.length === 0) {
      alert('Please add at least one form field.');
      return;
    }

    const payload = {
      ...formMeta,
      fields: formFields,
      settings: formSettings,
    };

    if (editingForm) {
      await updateForm(editingForm.id, payload);
    } else {
      await addForm(payload);
    }

    setIsCreateOpen(false);
  };

  const handleDeleteForm = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete form "${title}"? This cannot be undone.`)) {
      await deleteForm(id);
    }
  };

  const copyShareLink = (slug: string) => {
    const url = `${window.location.origin}/forms/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  const openSubmissionsModal = (form: CustomForm) => {
    setActiveSubmissionsForm(form);
    fetchSubmissions(form.id);
  };

  // Submissions CSV Export
  const exportSubmissionsToCSV = (form: CustomForm) => {
    const formSubmissions = submissions.filter(s => s.form_id === form.id);
    if (formSubmissions.length === 0) {
      alert('No submissions found for this form.');
      return;
    }

    const headers = ['Submission ID', 'Submitted Date', 'Status', 'Payment Status', 'Fee Paid', ...form.fields.map(f => `"${f.label.replace(/"/g, '""')}"`)];
    const rows = formSubmissions.map(sub => {
      const fieldValues = form.fields.map(f => {
        const val = sub.data[f.name];
        if (val === undefined || val === null) return '""';
        return `"${String(val).replace(/"/g, '""')}"`;
      });
      return [
        `"${sub.id}"`,
        `"${new Date(sub.created_at).toLocaleString()}"`,
        `"${sub.status}"`,
        `"${sub.payment_status || 'exempted'}"`,
        `"${sub.amount || 0}"`,
        ...fieldValues
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${form.slug}-submissions.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFilteredSubmissions = (formId: string) => {
    return submissions.filter(s => {
      if (s.form_id !== formId) return false;
      const matchesStatus = statusFilter === 'all' ? true : s.status === statusFilter;
      const searchStr = JSON.stringify(s.data).toLowerCase();
      const matchesSearch = submissionSearch === '' ? true : searchStr.includes(submissionSearch.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="text-indigo-600" size={26} /> Forms Builder & Automation
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Build custom application forms, configure dynamic fields & layouts, collect admission fees, and issue official PDF receipts.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow transition"
        >
          <Plus size={18} /> Create New Form
        </button>
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {forms.map((form) => {
          const formSubmissionsCount = submissions.filter(s => s.form_id === form.id).length;
          return (
            <div 
              key={form.id} 
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1.5 ${
                      form.is_published 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${form.is_published ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      {form.is_published ? 'Published / Online' : 'Draft / Offline'}
                    </span>

                    {form.settings?.enable_payment && (
                      <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                        <CreditCard size={12} /> Fee: ₹{form.settings.fee_amount}
                      </span>
                    )}

                    {form.settings?.enable_pdf_receipt !== false && (
                      <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                        <Printer size={12} /> PDF Receipt
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(form)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Edit Form, Fields & Settings"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteForm(form.id, form.title)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete Form"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{form.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">{form.description}</p>

                {/* Form Meta details */}
                <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-4 bg-gray-50 p-3 rounded-xl">
                  <div className="flex items-center gap-1">
                    <Layers size={14} className="text-indigo-500" />
                    <strong>{form.fields.length}</strong> Fields Configured
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <strong>{formSubmissionsCount}</strong> Submissions Received
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} className="text-gray-400" />
                    Updated {new Date(form.updated_at).toLocaleDateString()}
                  </div>
                </div>

                {/* Shareable Link Box */}
                <div className="flex items-center justify-between gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl mb-4 text-xs font-mono text-slate-700">
                  <span className="truncate">/forms/{form.slug}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => copyShareLink(form.slug)}
                      className="p-1.5 hover:bg-slate-200 rounded text-slate-600 hover:text-slate-900 transition flex items-center gap-1"
                      title="Copy Public Link"
                    >
                      {copiedSlug === form.slug ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                      <span>{copiedSlug === form.slug ? 'Copied' : 'Copy'}</span>
                    </button>
                    <a
                      href={`/forms/${form.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 hover:bg-slate-200 rounded text-slate-600 hover:text-indigo-600 transition"
                      title="Preview Form"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Bottom Action Row */}
              <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                <button
                  onClick={() => togglePublish(form.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                    form.is_published 
                      ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' 
                      : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  }`}
                >
                  <Globe size={13} />
                  {form.is_published ? 'Unpublish Form' : 'Publish Online'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openSubmissionsModal(form)}
                    className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Eye size={14} />
                    Submissions ({formSubmissionsCount})
                  </button>
                  <button
                    onClick={() => exportSubmissionsToCSV(form)}
                    className="p-1.5 text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                    title="Export Submissions to CSV"
                  >
                    <Download size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* Form Builder & Editor Modal (3 TABS) */}
      {/* ========================================================================= */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="text-indigo-600" size={20} />
                {editingForm ? `Edit: ${editingForm.title}` : 'Create New Custom Form'}
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Tabs Header */}
            <div className="flex border-b border-gray-100 bg-gray-50/70 px-6 gap-2">
              <button
                type="button"
                onClick={() => setModalTab('info')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition ${
                  modalTab === 'info' ? 'border-indigo-600 text-indigo-600 bg-white' : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                1. Form Info
              </button>
              <button
                type="button"
                onClick={() => setModalTab('fields')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                  modalTab === 'fields' ? 'border-indigo-600 text-indigo-600 bg-white' : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                2. Field Builder ({formFields.length})
              </button>
              <button
                type="button"
                onClick={() => setModalTab('settings')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                  modalTab === 'settings' ? 'border-indigo-600 text-indigo-600 bg-white' : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <Settings size={14} /> 3. Form Settings & Fee
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSaveForm} className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* =================================================================== */}
              {/* TAB 1: Form Info */}
              {/* =================================================================== */}
              {modalTab === 'info' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Form Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Admission Registration 2026-27"
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={formMeta.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">URL Slug *</label>
                      <div className="flex items-center bg-white border border-gray-300 rounded-xl px-2.5 text-sm focus-within:ring-2 focus-within:ring-indigo-500">
                        <span className="text-gray-400 text-xs shrink-0">/forms/</span>
                        <input
                          type="text"
                          required
                          placeholder="admission-registration"
                          className="w-full p-2 outline-none text-sm"
                          value={formMeta.slug}
                          onChange={(e) => setFormMeta({ ...formMeta, slug: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Description / Guidelines for Parents</label>
                    <textarea
                      rows={3}
                      placeholder="Enter instructions, eligibility criteria, or guidelines..."
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={formMeta.description}
                      onChange={(e) => setFormMeta({ ...formMeta, description: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Submit Button Label</label>
                      <input
                        type="text"
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={formMeta.submit_button_text}
                        onChange={(e) => setFormMeta({ ...formMeta, submit_button_text: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Publish Status</label>
                      <select
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={formMeta.is_published ? 'published' : 'draft'}
                        onChange={(e) => setFormMeta({ ...formMeta, is_published: e.target.value === 'published' })}
                      >
                        <option value="published">Published (Publicly Accessible)</option>
                        <option value="draft">Draft (Hidden from Public)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Success Message on Submission</label>
                    <input
                      type="text"
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={formMeta.success_message}
                      onChange={(e) => setFormMeta({ ...formMeta, success_message: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* =================================================================== */}
              {/* TAB 2: Dynamic Form Fields & Layout */}
              {/* =================================================================== */}
              {modalTab === 'fields' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                    <span className="text-xs text-gray-500 font-medium">
                      Configure input types, placeholders, validation, and multi-column widths.
                    </span>
                    <button
                      type="button"
                      onClick={addField}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition shadow"
                    >
                      <Plus size={14} /> Add Field
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formFields.map((field, idx) => (
                      <div 
                        key={field.id} 
                        className={`p-4 rounded-2xl border transition ${
                          field.type === 'heading' 
                            ? 'bg-indigo-50/50 border-indigo-200' 
                            : field.type === 'note'
                            ? 'bg-amber-50/50 border-amber-200'
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        {/* Row Header */}
                        <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                              #{idx + 1}
                            </span>
                            <span className="text-xs font-semibold text-gray-400 uppercase">
                              {field.type}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => moveField(idx, 'up')}
                              className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                              title="Move Up"
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button
                              type="button"
                              disabled={idx === formFields.length - 1}
                              onClick={() => moveField(idx, 'down')}
                              className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                              title="Move Down"
                            >
                              <ArrowDown size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeField(idx)}
                              className="p-1 text-gray-400 hover:text-red-600 ml-2"
                              title="Remove Field"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Field Configuration Inputs */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2">
                            <label className="block text-[11px] font-bold text-gray-600 mb-1">
                              {field.type === 'heading' ? 'Section Header Title *' : field.type === 'note' ? 'Note Text / Disclaimer *' : 'Field Label *'}
                            </label>
                            <input
                              type="text"
                              required
                              placeholder={field.type === 'heading' ? 'e.g. 1. Student Personal Details' : 'e.g. Student Full Name'}
                              className="w-full p-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                              value={field.label}
                              onChange={(e) => {
                                const autoName = e.target.value.toLowerCase().replace(/[^\w]/g, '_');
                                updateField(idx, { label: e.target.value, name: field.type === 'heading' ? `sec_${idx}` : autoName });
                              }}
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-gray-600 mb-1">Field Type</label>
                            <select
                              className="w-full p-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-medium"
                              value={field.type}
                              onChange={(e) => updateField(idx, { type: e.target.value as FormFieldType })}
                            >
                              <option value="text">Single Line Text</option>
                              <option value="email">Email Address</option>
                              <option value="tel">Phone / Mobile (10-digit)</option>
                              <option value="number">Number</option>
                              <option value="date">Date Picker</option>
                              <option value="time">Time Slot Picker</option>
                              <option value="select">Dropdown Select</option>
                              <option value="radio">Radio Buttons (Single Choice)</option>
                              <option value="checkbox_group">Multi-Select Checkboxes</option>
                              <option value="textarea">Multi-line Paragraph</option>
                              <option value="checkbox">Single Checkbox (Agree)</option>
                              <option value="file">File / Photo Upload</option>
                              <option value="heading">Section Divider / Heading</option>
                              <option value="note">Instructions Note Banner</option>
                            </select>
                          </div>
                        </div>

                        {/* Extra Properties based on field type */}
                        {field.type !== 'heading' && field.type !== 'note' && (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center mt-3 pt-3 border-t border-gray-100">
                            {/* Options for Select, Radio, Checkbox Group */}
                            {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox_group') ? (
                              <div className="sm:col-span-2">
                                <label className="block text-[11px] font-bold text-gray-600 mb-1">
                                  Choices / Options (comma-separated) *
                                </label>
                                <input
                                  type="text"
                                  required
                                  placeholder="Option 1, Option 2, Option 3"
                                  className="w-full p-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                  value={(field.options || []).join(', ')}
                                  onChange={(e) => updateField(idx, { 
                                    options: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                                  })}
                                />
                              </div>
                            ) : field.type === 'file' ? (
                              <div className="sm:col-span-2">
                                <label className="block text-[11px] font-bold text-gray-600 mb-1">
                                  Allowed File Extensions
                                </label>
                                <input
                                  type="text"
                                  placeholder="image/*,.pdf,.doc"
                                  className="w-full p-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-xs"
                                  value={field.accept || ''}
                                  onChange={(e) => updateField(idx, { accept: e.target.value })}
                                />
                              </div>
                            ) : (
                              <div className="sm:col-span-2">
                                <label className="block text-[11px] font-bold text-gray-600 mb-1">Placeholder Hint</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Enter your value here..."
                                  className="w-full p-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                  value={field.placeholder || ''}
                                  onChange={(e) => updateField(idx, { placeholder: e.target.value })}
                                />
                              </div>
                            )}

                            {/* Width Selector & Required Toggle */}
                            <div className="flex items-center gap-3">
                              <div className="flex-1">
                                <label className="block text-[10px] font-bold text-gray-500 mb-0.5">Layout Width</label>
                                <select
                                  value={field.width || 'full'}
                                  onChange={(e) => updateField(idx, { width: e.target.value as FieldWidth })}
                                  className="w-full p-1.5 border border-gray-200 rounded-lg text-xs font-semibold bg-white"
                                >
                                  <option value="full">Full (100%)</option>
                                  <option value="half">Half (50%)</option>
                                  <option value="third">1/3rd (33%)</option>
                                </select>
                              </div>

                              <div className="flex items-center gap-1.5 pt-3">
                                <input
                                  type="checkbox"
                                  id={`req_${field.id}`}
                                  checked={field.required}
                                  onChange={(e) => updateField(idx, { required: e.target.checked })}
                                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                                />
                                <label htmlFor={`req_${field.id}`} className="text-xs font-semibold text-gray-700 cursor-pointer whitespace-nowrap">
                                  Required
                                </label>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* =================================================================== */}
              {/* TAB 3: Form Settings, Fees, Receipts & Deadlines */}
              {/* =================================================================== */}
              {modalTab === 'settings' && (
                <div className="space-y-6">
                  {/* Fee Collection */}
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <CreditCard className="text-indigo-600" size={18} />
                        <span className="font-bold text-sm text-gray-800">Application Fee & Payment</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formSettings.enable_payment || false}
                          onChange={(e) => setFormSettings({ ...formSettings, enable_payment: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    {formSettings.enable_payment && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-200">
                        <div>
                          <label className="block text-xs font-bold text-gray-600 mb-1">Fee Amount (INR ₹) *</label>
                          <input
                            type="number"
                            min="1"
                            required
                            placeholder="500"
                            value={formSettings.fee_amount || ''}
                            onChange={(e) => setFormSettings({ ...formSettings, fee_amount: parseFloat(e.target.value) || 0 })}
                            className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-600 mb-1">Payment Mode Allowed</label>
                          <select
                            value={formSettings.payment_mode || 'all'}
                            onChange={(e) => setFormSettings({ ...formSettings, payment_mode: e.target.value as any })}
                            className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                          >
                            <option value="all">All Modes (Razorpay, UPI QR & Counter)</option>
                            <option value="razorpay">Razorpay Online Gateway Only</option>
                            <option value="upi_qr">School UPI QR Code Transfer</option>
                            <option value="counter">Pay at School Counter (Offline)</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Official PDF Receipt */}
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Printer className="text-emerald-600" size={18} />
                        <span className="font-bold text-sm text-gray-800">Official PDF Acknowledgement Receipt</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formSettings.enable_pdf_receipt !== false}
                          onChange={(e) => setFormSettings({ ...formSettings, enable_pdf_receipt: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>

                    {formSettings.enable_pdf_receipt !== false && (
                      <div className="pt-2 border-t border-gray-200">
                        <label className="block text-xs font-bold text-gray-600 mb-1">Custom Receipt Header Title</label>
                        <input
                          type="text"
                          placeholder="e.g. Official Admission Registration & Fee Slip"
                          value={formSettings.receipt_title || ''}
                          onChange={(e) => setFormSettings({ ...formSettings, receipt_title: e.target.value })}
                          className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                    )}
                  </div>

                  {/* Email & Auto-Reply */}
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Mail className="text-blue-600" size={18} />
                        <span className="font-bold text-sm text-gray-800">Email Alerts & Auto-Reply</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formSettings.enable_auto_reply || false}
                          onChange={(e) => setFormSettings({ ...formSettings, enable_auto_reply: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-gray-200">
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Admin Notification Email</label>
                        <input
                          type="email"
                          placeholder="admissions@aspireuniversalinternational.com"
                          value={formSettings.notify_admin_email || formMeta.notify_email || ''}
                          onChange={(e) => setFormSettings({ ...formSettings, notify_admin_email: e.target.value })}
                          className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>

                      {formSettings.enable_auto_reply && (
                        <>
                          <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Parent Confirmation Email Subject</label>
                            <input
                              type="text"
                              placeholder="Application Received - Aspire Universal International School"
                              value={formSettings.auto_reply_subject || ''}
                              onChange={(e) => setFormSettings({ ...formSettings, auto_reply_subject: e.target.value })}
                              className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Parent Confirmation Email Message Body</label>
                            <textarea
                              rows={2}
                              placeholder="Dear Parent, We have received your application..."
                              value={formSettings.auto_reply_body || ''}
                              onChange={(e) => setFormSettings({ ...formSettings, auto_reply_body: e.target.value })}
                              className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Submission Deadlines & Limits */}
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                    <span className="font-bold text-sm text-gray-800 block">Deadlines & Quota Limits</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Closing Date & Time (Optional)</label>
                        <input
                          type="datetime-local"
                          value={formSettings.close_date || ''}
                          onChange={(e) => setFormSettings({ ...formSettings, close_date: e.target.value })}
                          className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Maximum Submissions Allowed (0 for unlimited)</label>
                        <input
                          type="number"
                          min="0"
                          placeholder="0"
                          value={formSettings.max_submissions || ''}
                          onChange={(e) => setFormSettings({ ...formSettings, max_submissions: parseInt(e.target.value) || 0 })}
                          className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="flex gap-2">
                  {modalTab === 'fields' && (
                    <button
                      type="button"
                      onClick={() => setModalTab('info')}
                      className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-900"
                    >
                      ← Back to Info
                    </button>
                  )}
                  {modalTab === 'settings' && (
                    <button
                      type="button"
                      onClick={() => setModalTab('fields')}
                      className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-900"
                    >
                      ← Back to Fields
                    </button>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow text-xs"
                  >
                    {editingForm ? 'Update Form' : 'Save & Publish Form'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Submissions Viewer Modal with Receipt Generator */}
      {/* ========================================================================= */}
      {activeSubmissionsForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <CheckCircle2 className="text-emerald-600" size={20} />
                  Submissions: {activeSubmissionsForm.title}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Total {getFilteredSubmissions(activeSubmissionsForm.id).length} responses received
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => exportSubmissionsToCSV(activeSubmissionsForm)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl transition"
                >
                  <Download size={15} /> Export CSV
                </button>
                <button
                  onClick={() => setActiveSubmissionsForm(null)}
                  className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex flex-wrap gap-3 items-center justify-between">
              <input
                type="text"
                placeholder="Search within submissions..."
                className="p-2 bg-white border border-gray-200 rounded-xl text-xs w-full sm:w-64 outline-none focus:ring-2 focus:ring-indigo-500"
                value={submissionSearch}
                onChange={(e) => setSubmissionSearch(e.target.value)}
              />
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Status:</span>
                <select
                  className="p-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto p-6">
              {getFilteredSubmissions(activeSubmissionsForm.id).length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <FileText size={40} className="mx-auto mb-2 opacity-40" />
                  <p className="font-semibold text-gray-500">No submissions found.</p>
                  <p className="text-xs text-gray-400 mt-1">Share the public link to start receiving responses.</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-gray-100 rounded-2xl">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider font-semibold border-b border-gray-100">
                      <tr>
                        <th className="py-3.5 px-4">Date</th>
                        <th className="py-3.5 px-4">Summary</th>
                        <th className="py-3.5 px-4">Fee / Payment</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {getFilteredSubmissions(activeSubmissionsForm.id).map((sub) => {
                        const firstFewEntries = Object.entries(sub.data).slice(0, 3);
                        return (
                          <tr key={sub.id} className="hover:bg-gray-50/60 transition">
                            <td className="py-3.5 px-4 text-xs text-gray-500 whitespace-nowrap">
                              {new Date(sub.created_at).toLocaleDateString()} {new Date(sub.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex flex-wrap gap-2 text-xs">
                                {firstFewEntries.map(([k, v]) => (
                                  <span key={k} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                                    <strong>{k}:</strong> {String(v)}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                sub.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-700' :
                                sub.payment_status === 'offline' ? 'bg-blue-50 text-blue-700' :
                                sub.payment_status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-600'
                              }`}>
                                {sub.payment_status ? sub.payment_status.toUpperCase() : 'FREE'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <select
                                value={sub.status}
                                onChange={(e) => updateSubmissionStatus(sub.id, e.target.value as any)}
                                className={`text-xs font-bold px-2 py-1 rounded-lg border outline-none ${
                                  sub.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                  sub.status === 'reviewed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                  sub.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                                  'bg-amber-50 text-amber-700 border-amber-200'
                                }`}
                              >
                                <option value="new">New</option>
                                <option value="reviewed">Reviewed</option>
                                <option value="accepted">Accepted</option>
                                <option value="rejected">Rejected</option>
                              </select>
                            </td>
                            <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                              <button
                                onClick={() => setReceiptModalData({ submission: sub, form: activeSubmissionsForm })}
                                className="text-emerald-700 hover:text-emerald-800 text-xs font-semibold px-2.5 py-1 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition inline-flex items-center gap-1"
                                title="Print PDF Receipt"
                              >
                                <Printer size={13} /> Slip
                              </button>
                              <button
                                onClick={() => setViewingSubmission(sub)}
                                className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold px-2.5 py-1 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition"
                              >
                                View
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm('Delete this submission?')) {
                                    deleteSubmission(sub.id);
                                  }
                                }}
                                className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition"
                              >
                                <Trash2 size={15} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Application Detail Drawer */}
      {/* ========================================================================= */}
      {viewingSubmission && activeSubmissionsForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <h4 className="font-bold text-gray-900 text-lg">Application Details</h4>
                <p className="text-xs text-gray-500">REF: {viewingSubmission.id}</p>
              </div>
              <button
                onClick={() => setViewingSubmission(null)}
                className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {activeSubmissionsForm.fields
                .filter(f => f.type !== 'heading' && f.type !== 'note')
                .map((f) => {
                  const val = viewingSubmission.data[f.name];
                  return (
                    <div key={f.id} className="p-3 bg-gray-50 rounded-xl">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                        {f.label}
                      </label>
                      <div className="text-sm font-semibold text-gray-900 break-words">
                        {val !== undefined && val !== null && val !== '' ? (
                          typeof val === 'boolean' ? (val ? 'Yes' : 'No') : 
                          Array.isArray(val) ? val.join(', ') :
                          String(val)
                        ) : (
                          <span className="text-gray-400 font-normal italic">Not provided</span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <button
                onClick={() => {
                  setReceiptModalData({ submission: viewingSubmission, form: activeSubmissionsForm });
                  setViewingSubmission(null);
                }}
                className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold rounded-xl text-xs flex items-center gap-1.5"
              >
                <Printer size={15} /> Official PDF Receipt
              </button>
              <button
                onClick={() => setViewingSubmission(null)}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official PDF Receipt Modal */}
      {receiptModalData && (
        <FormReceiptModal
          submission={receiptModalData.submission}
          form={receiptModalData.form}
          onClose={() => setReceiptModalData(null)}
        />
      )}
    </div>
  );
}
