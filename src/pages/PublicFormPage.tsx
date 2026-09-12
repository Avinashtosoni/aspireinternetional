import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  CheckCircle, AlertCircle, ArrowLeft, Send, Sparkles, Building, 
  Printer, CreditCard, QrCode, Upload, FileText, Clock, HelpCircle
} from 'lucide-react';
import { useFormsStore } from '../store/formsStore';
import { useCMSStore } from '../store/cmsStore';
import { CustomForm, FormSubmission } from '../types/form';
import FormReceiptModal from '../components/FormReceiptModal';

export default function PublicFormPage() {
  const { slug } = useParams<{ slug: string }>();
  const { getFormBySlug, submitForm } = useFormsStore();
  const { settings: globalSettings, fetchSettings } = useCMSStore();

  const [form, setForm] = useState<CustomForm | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedResponse, setSubmittedResponse] = useState<FormSubmission | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Payment Options State
  const [paymentMode, setPaymentMode] = useState<'upi_qr' | 'counter' | 'razorpay'>('upi_qr');
  const [utrNumber, setUtrNumber] = useState('');

  useEffect(() => {
    fetchSettings();
    if (!slug) return;
    setIsLoading(true);
    getFormBySlug(slug).then((res) => {
      setForm(res);
      setIsLoading(false);
    });
  }, [slug]);

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxGroupChange = (name: string, option: string, isChecked: boolean) => {
    const current = (formData[name] as string[]) || [];
    if (isChecked) {
      setFormData(prev => ({ ...prev, [name]: [...current, option] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: current.filter(x => x !== option) }));
    }
  };

  const handleFileUpload = (name: string, file: File | null) => {
    if (!file) {
      handleInputChange(name, null);
      return;
    }
    // Store file metadata or preview
    handleInputChange(name, `[File Uploaded: ${file.name} (${Math.round(file.size / 1024)} KB)]`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setErrorMessage('');

    // Payment validation if fee enabled
    if (form.settings?.enable_payment && form.settings.fee_amount && form.settings.fee_amount > 0) {
      if (paymentMode === 'upi_qr' && !utrNumber.trim()) {
        setErrorMessage('Please enter the UPI Transaction Reference / UTR Number after payment.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const paymentInfo = form.settings?.enable_payment ? {
        status: paymentMode === 'counter' ? ('offline' as const) : ('paid' as const),
        id: paymentMode === 'upi_qr' ? `UTR-${utrNumber}` : `COUNTER-${Date.now().toString(36)}`,
        amount: form.settings.fee_amount
      } : {
        status: 'exempted' as const,
        id: 'NIL',
        amount: 0
      };

      const submissionPayload = {
        ...formData,
        ...(paymentMode === 'upi_qr' ? { _payment_utr: utrNumber } : {}),
        _payment_mode_chosen: paymentMode
      };

      const result = await submitForm(form.id, submissionPayload, paymentInfo);
      if (result) {
        setSubmittedResponse(result);
        setIsSubmitted(true);
      } else {
        setErrorMessage('Failed to submit application. Please check your connection and try again.');
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred while submitting.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({});
    setUtrNumber('');
    setIsSubmitted(false);
    setSubmittedResponse(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Form Not Found</h2>
        <p className="text-gray-600 mb-6">The application form link does not exist or has been removed.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow hover:bg-primary-hover transition"
        >
          <ArrowLeft size={18} /> Return to Home
        </Link>
      </div>
    );
  }

  // Check deadline
  const isPastDeadline = form.settings?.close_date ? new Date() > new Date(form.settings.close_date) : false;

  if (!form.is_published || isPastDeadline) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isPastDeadline ? 'Submissions Closed (Deadline Passed)' : 'Form Currently Offline'}
        </h2>
        <p className="text-gray-600 mb-6">
          <strong>{form.title}</strong> is not accepting new applications at this time. Please contact the admissions office for inquiries.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow hover:bg-primary-hover transition"
        >
          Contact Admissions
        </Link>
      </div>
    );
  }

  const feeAmount = form.settings?.fee_amount || 0;
  const isFeeRequired = form.settings?.enable_payment && feeAmount > 0;

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>{form.title} | Aspire Universal International School</title>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link to="/forms" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1.5">
            <ArrowLeft size={16} /> View All Active Portals
          </Link>
          <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
            <Building size={14} /> Aspire Digital Portal
          </span>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-primary via-indigo-700 to-secondary text-white p-8 sm:p-10 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-white">
                  <Sparkles size={13} /> Official Form
                </span>
                {isFeeRequired && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/80 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-white">
                    <CreditCard size={13} /> Application Fee: ₹{feeAmount}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold mb-2 leading-tight">
                {form.title}
              </h1>
              {form.description && (
                <p className="text-white/90 text-sm sm:text-base leading-relaxed max-w-3xl whitespace-pre-line">
                  {form.description}
                </p>
              )}
            </div>
          </div>

          {/* Form Content / Success View */}
          <div className="p-8 sm:p-10">
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium flex items-center gap-2">
                <AlertCircle size={18} /> {errorMessage}
              </div>
            )}

            {/* =============================================================== */}
            {/* SUCCESS VIEW */}
            {/* =============================================================== */}
            {isSubmitted && submittedResponse ? (
              <div className="py-10 text-center space-y-5 animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle size={46} />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
                    REF ID: {submittedResponse.id}
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900 mt-2">Application Submitted Successfully!</h3>
                  <p className="text-gray-600 max-w-lg mx-auto text-sm sm:text-base leading-relaxed mt-2">
                    {form.success_message}
                  </p>
                </div>

                {/* Printable Receipt Action */}
                {form.settings?.enable_pdf_receipt !== false && (
                  <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl max-w-md mx-auto space-y-3">
                    <div className="flex items-center justify-center gap-2 text-primary font-bold text-sm">
                      <Printer size={18} /> Official Acknowledgment Receipt
                    </div>
                    <p className="text-xs text-gray-500">
                      Download or print your official computer-generated receipt with verification ID.
                    </p>
                    <button
                      onClick={() => setShowReceiptModal(true)}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition shadow flex items-center justify-center gap-2"
                    >
                      <Printer size={16} /> Download / Print Official PDF Receipt
                    </button>
                  </div>
                )}

                <div className="pt-4 flex flex-wrap justify-center gap-4">
                  <button
                    onClick={resetForm}
                    className="px-6 py-2.5 rounded-xl border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 transition text-sm"
                  >
                    Submit Another Application
                  </button>
                  <Link
                    to="/"
                    className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold transition text-sm shadow"
                  >
                    Return to Homepage
                  </Link>
                </div>
              </div>
            ) : (
              /* =============================================================== */
              /* APPLICATION FORM FIELDS */
              /* =============================================================== */
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* 12-Column Responsive Grid */}
                <div className="grid grid-cols-12 gap-x-4 gap-y-5">
                  {form.fields.map((field) => {
                    const widthClass = 
                      field.width === 'half' ? 'col-span-12 sm:col-span-6' :
                      field.width === 'third' ? 'col-span-12 sm:col-span-4' :
                      'col-span-12';

                    // Section Heading
                    if (field.type === 'heading') {
                      return (
                        <div key={field.id} className="col-span-12 pt-4 pb-1 border-b-2 border-primary/20">
                          <h3 className="text-lg font-heading font-bold text-primary flex items-center gap-2">
                            <span className="w-2 h-4 bg-primary rounded-full" />
                            {field.label}
                          </h3>
                        </div>
                      );
                    }

                    // Instruction Note Banner
                    if (field.type === 'note') {
                      return (
                        <div key={field.id} className="col-span-12 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed flex items-start gap-2">
                          <HelpCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                          <span>{field.label}</span>
                        </div>
                      );
                    }

                    const val = formData[field.name];

                    return (
                      <div key={field.id} className={`${widthClass} space-y-1.5`}>
                        <label className="block text-xs font-bold text-gray-700">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>

                        {/* Dropdown Select */}
                        {field.type === 'select' ? (
                          <select
                            required={field.required}
                            value={val || ''}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition text-sm"
                          >
                            <option value="">Select an option...</option>
                            {(field.options || []).map((opt, i) => (
                              <option key={i} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : field.type === 'radio' ? (
                          /* Radio Buttons */
                          <div className="flex flex-wrap gap-3 pt-1">
                            {(field.options || []).map((opt, i) => (
                              <label key={i} className="flex items-center gap-2 text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 transition">
                                <input
                                  type="radio"
                                  name={field.name}
                                  required={field.required && !val}
                                  value={opt}
                                  checked={val === opt}
                                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                                  className="w-4 h-4 text-primary focus:ring-primary"
                                />
                                <span>{opt}</span>
                              </label>
                            ))}
                          </div>
                        ) : field.type === 'checkbox_group' ? (
                          /* Multi-Select Checkboxes */
                          <div className="flex flex-wrap gap-2.5 pt-1">
                            {(field.options || []).map((opt, i) => {
                              const isChecked = Array.isArray(val) && val.includes(opt);
                              return (
                                <label key={i} className="flex items-center gap-2 text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl cursor-pointer hover:bg-gray-100 transition">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => handleCheckboxGroupChange(field.name, opt, e.target.checked)}
                                    className="w-4 h-4 text-primary rounded focus:ring-primary"
                                  />
                                  <span>{opt}</span>
                                </label>
                              );
                            })}
                          </div>
                        ) : field.type === 'textarea' ? (
                          /* Text Area */
                          <textarea
                            rows={3}
                            required={field.required}
                            placeholder={field.placeholder || ''}
                            value={val || ''}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition text-sm resize-none"
                          />
                        ) : field.type === 'checkbox' ? (
                          /* Single Checkbox */
                          <div className="flex items-center gap-2.5 pt-2">
                            <input
                              type="checkbox"
                              id={`fld_${field.id}`}
                              required={field.required}
                              checked={!!val}
                              onChange={(e) => handleInputChange(field.name, e.target.checked)}
                              className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                            />
                            <label htmlFor={`fld_${field.id}`} className="text-xs font-semibold text-gray-700 cursor-pointer">
                              {field.placeholder || 'I confirm that the provided information is true.'}
                            </label>
                          </div>
                        ) : field.type === 'file' ? (
                          /* File Upload with Preview */
                          <div className="space-y-1">
                            <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:bg-gray-50 transition">
                              <Upload className="w-6 h-6 text-gray-400 mb-1" />
                              <span className="text-xs font-bold text-gray-700">Choose File to Upload</span>
                              <span className="text-[11px] text-gray-400">
                                {field.accept ? `Accepted: ${field.accept}` : 'JPG, PNG, PDF'}
                              </span>
                              <input
                                type="file"
                                accept={field.accept || undefined}
                                required={field.required && !val}
                                onChange={(e) => handleFileUpload(field.name, e.target.files?.[0] || null)}
                                className="hidden"
                              />
                            </label>
                            {val && (
                              <div className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 p-2 rounded-lg truncate">
                                ✓ {String(val)}
                              </div>
                            )}
                          </div>
                        ) : field.type === 'tel' ? (
                          /* 10-digit Phone */
                          <input
                            type="tel"
                            required={field.required}
                            pattern="[0-9]{10}"
                            title="Please enter a valid 10-digit phone number"
                            placeholder={field.placeholder || '10-digit mobile number'}
                            value={val || ''}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition text-sm"
                          />
                        ) : (
                          /* Default Text, Email, Date, Time, Number */
                          <input
                            type={field.type}
                            required={field.required}
                            placeholder={field.placeholder || ''}
                            value={val || ''}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition text-sm"
                          />
                        )}

                        {field.helperText && (
                          <p className="text-[11px] text-gray-400">{field.helperText}</p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* =============================================================== */}
                {/* APPLICATION FEE PAYMENT STEP (If Enabled) */}
                {/* =============================================================== */}
                {isFeeRequired && (
                  <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                      <div>
                        <h4 className="font-bold text-gray-900 text-base flex items-center gap-2">
                          <CreditCard className="text-primary" size={20} /> Application Processing Fee
                        </h4>
                        <p className="text-xs text-gray-500">Official fee required to complete application submission</p>
                      </div>
                      <div className="text-xl font-extrabold text-primary">
                        ₹{feeAmount}
                      </div>
                    </div>

                    {/* Mode Selector */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className={`p-3.5 rounded-2xl border-2 cursor-pointer transition flex items-center gap-3 ${
                        paymentMode === 'upi_qr' ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white'
                      }`}>
                        <input
                          type="radio"
                          name="payment_mode"
                          checked={paymentMode === 'upi_qr'}
                          onChange={() => setPaymentMode('upi_qr')}
                          className="w-4 h-4 text-primary"
                        />
                        <div>
                          <span className="font-bold text-xs text-gray-900 block">Instant UPI QR Transfer</span>
                          <span className="text-[11px] text-gray-500">GPay, PhonePe, Paytm, BHIM</span>
                        </div>
                      </label>

                      <label className={`p-3.5 rounded-2xl border-2 cursor-pointer transition flex items-center gap-3 ${
                        paymentMode === 'counter' ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white'
                      }`}>
                        <input
                          type="radio"
                          name="payment_mode"
                          checked={paymentMode === 'counter'}
                          onChange={() => setPaymentMode('counter')}
                          className="w-4 h-4 text-primary"
                        />
                        <div>
                          <span className="font-bold text-xs text-gray-900 block">Pay at School Office Counter</span>
                          <span className="text-[11px] text-gray-500">Cash / DD during document verification</span>
                        </div>
                      </label>
                    </div>

                    {/* UPI QR Code Container */}
                    {paymentMode === 'upi_qr' && (
                      <div className="p-4 bg-white border border-gray-200 rounded-2xl flex flex-col sm:flex-row items-center gap-5">
                        <img
                          src={globalSettings['school_upi_qr_url'] || 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=aspireuniversal@upi'}
                          alt="School UPI QR Code"
                          className="w-32 h-32 rounded-xl border p-1 bg-white object-contain shadow-xs shrink-0"
                        />
                        <div className="space-y-2 flex-1">
                          <div className="text-xs">
                            <span className="font-bold text-gray-700">Official UPI VPA: </span>
                            <code className="bg-gray-100 px-2 py-0.5 rounded text-primary font-bold">
                              {globalSettings['school_upi_id'] || 'aspireuniversal@upi'}
                            </code>
                          </div>
                          <p className="text-[11px] text-gray-500 leading-relaxed">
                            1. Scan the QR code with any UPI app to pay ₹{feeAmount}.<br />
                            2. Enter the 12-digit UTR / Transaction Reference Number below to link your receipt.
                          </p>
                          <div>
                            <input
                              type="text"
                              required
                              placeholder="Enter 12-digit UPI UTR / Transaction Number *"
                              value={utrNumber}
                              onChange={(e) => setUtrNumber(e.target.value)}
                              className="w-full p-2.5 border border-gray-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-primary outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Submit Action */}
                <div className="pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-base disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      'Processing Submission...'
                    ) : (
                      <>
                        {form.submit_button_text || 'Submit Application'}
                        <Send size={18} />
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-3">
                    Your details will be securely registered with Aspire Universal International School.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Official PDF Receipt Modal */}
      {showReceiptModal && submittedResponse && (
        <FormReceiptModal
          submission={submittedResponse}
          form={form}
          onClose={() => setShowReceiptModal(false)}
        />
      )}
    </div>
  );
}
