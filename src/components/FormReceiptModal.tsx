import React from 'react';
import { Printer, Download, X, CheckCircle, ShieldCheck, Building, Calendar, Phone, Mail } from 'lucide-react';
import { CustomForm, FormSubmission } from '../types/form';
import { printElement } from '../utils/printUtils';

interface FormReceiptModalProps {
  submission: FormSubmission;
  form: CustomForm;
  onClose: () => void;
}

export default function FormReceiptModal({ submission, form, onClose }: FormReceiptModalProps) {
  const handlePrint = () => {
    printElement(
      'printable-receipt-content',
      `Receipt-${form.slug}-${submission.id.slice(0, 8)}`
    );
  };

  const paymentStatus = submission.payment_status || 'exempted';
  const feeAmount = submission.amount ?? (form.settings?.fee_amount || 0);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-70 flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:fixed print:inset-0 print:p-0 print:bg-white print:z-99999">
      {/* Container */}
      <div className="bg-white rounded-3xl max-w-2xl w-full my-6 flex flex-col shadow-2xl overflow-hidden print:shadow-none print:max-w-none print:w-full print:rounded-none">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="flex justify-between items-center px-6 py-4 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-emerald-400" size={20} />
            <span className="font-bold text-sm">Official Acknowledgment Receipt</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow"
            >
              <Printer size={15} /> Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
              title="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Official Receipt Body */}
        <div className="p-8 sm:p-10 space-y-6 print:p-6 text-gray-900 bg-white" id="printable-receipt-content">
          {/* Official Letterhead */}
          <div className="border-b-2 border-primary/20 pb-5 text-center space-y-1">
            <div className="inline-flex items-center gap-2 justify-center mb-1">
              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xl shadow">
                A
              </div>
              <h1 className="text-xl sm:text-2xl font-heading font-black tracking-tight text-primary uppercase">
                Aspire Universal International School
              </h1>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Affiliated & Dedicated to Holistic Excellence | English Medium Co-Educational
            </p>
            <p className="text-[11px] text-gray-400">
              Radha Krishna Colony Pakari, Patna, Bihar - 800002 • Phone: +91 9431867366 • Email: info@aspireuniversalinternational.com
            </p>
          </div>

          {/* Receipt Title Banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">
                APPLICATION SLIP
              </span>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mt-1">
                {form.settings?.receipt_title || `${form.title} - Receipt`}
              </h2>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-xs font-mono font-bold text-gray-800">
                REF: <span className="text-indigo-600">{submission.id}</span>
              </div>
              <div className="text-[11px] text-gray-500">
                Date: {new Date(submission.created_at).toLocaleDateString()} {new Date(submission.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>

          {/* Status & Payment Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Registration Status</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                <CheckCircle size={13} /> {submission.status.toUpperCase()}
              </span>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Application Fee</span>
              <span className="font-bold text-gray-900 block mt-0.5">
                {feeAmount > 0 ? `₹${feeAmount}` : 'FREE / NIL'}
              </span>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl col-span-2 sm:col-span-1">
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Payment Status</span>
              <span className={`font-bold block mt-0.5 ${
                paymentStatus === 'paid' ? 'text-emerald-600' :
                paymentStatus === 'offline' ? 'text-blue-600' :
                paymentStatus === 'pending' ? 'text-amber-600' : 'text-gray-600'
              }`}>
                {paymentStatus === 'paid' ? 'PAID / VERIFIED' :
                 paymentStatus === 'offline' ? 'PAY AT COUNTER' :
                 paymentStatus === 'pending' ? 'PENDING VERIFICATION' : 'EXEMPTED'}
              </span>
            </div>
          </div>

          {/* Form Responses Summary Table */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden">
            <div className="bg-gray-100 px-4 py-2.5 text-xs font-bold text-gray-700 uppercase tracking-wider">
              Submitted Candidate & Application Details
            </div>
            <div className="divide-y divide-gray-100 text-xs">
              {form.fields
                .filter(f => f.type !== 'heading' && f.type !== 'note')
                .map((field) => {
                  const val = submission.data[field.name];
                  if (val === undefined || val === null || val === '') return null;

                  return (
                    <div key={field.id} className="grid grid-cols-1 sm:grid-cols-3 p-3 gap-1 hover:bg-gray-50/50">
                      <div className="font-bold text-gray-500 sm:col-span-1">
                        {field.label}
                      </div>
                      <div className="font-semibold text-gray-900 sm:col-span-2 break-words">
                        {typeof val === 'boolean' ? (val ? 'Yes / Agreed' : 'No') : 
                         Array.isArray(val) ? val.join(', ') :
                         String(val)}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Official Footer & Verification */}
          <div className="pt-4 border-t border-dashed border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 text-[11px] text-gray-500">
            <div className="space-y-1 max-w-sm">
              <p className="font-semibold text-gray-700">Important Instructions:</p>
              <p>1. Please carry a printed copy of this receipt along with 2 passport photographs and birth certificate during school campus verification.</p>
              <p>2. This is a secure computer-generated receipt and requires no physical signature for initial verification.</p>
            </div>

            <div className="text-center sm:text-right shrink-0">
              <div className="w-28 h-12 border-b border-gray-400 mx-auto sm:ml-auto mb-1 flex items-end justify-center text-[10px] text-gray-400 italic">
                [Authorized Signatory]
              </div>
              <span className="font-bold text-gray-700">Admissions Office</span>
              <p className="text-[10px] text-gray-400">Aspire Universal Intl School</p>
            </div>
          </div>
        </div>

        {/* Bottom Actions for Mobile View (Hidden when printing) */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 print:hidden">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-gray-300 text-gray-600 font-semibold text-xs hover:bg-gray-100 transition"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow transition flex items-center gap-1.5"
          >
            <Printer size={15} /> Print / Save PDF
          </button>
        </div>
      </div>
    </div>
  );
}
