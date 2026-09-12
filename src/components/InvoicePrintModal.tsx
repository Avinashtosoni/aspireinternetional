import React from 'react';
import { Printer, X, ShieldCheck, Building, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { Invoice } from '../types/accounts';
import { printElement } from '../utils/printUtils';

interface InvoicePrintModalProps {
  invoice: Invoice;
  onClose: () => void;
}

export default function InvoicePrintModal({ invoice, onClose }: InvoicePrintModalProps) {
  const handlePrint = () => {
    printElement(
      'printable-invoice-content',
      `Fee-Invoice-${invoice.invoice_number}-${invoice.student_name.replace(/\s+/g, '_')}`
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-70 flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:fixed print:inset-0 print:p-0 print:bg-white print:z-99999">
      <div className="bg-white rounded-3xl max-w-2xl w-full my-6 flex flex-col shadow-2xl overflow-hidden print:shadow-none print:max-w-none print:w-full print:rounded-none">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="flex justify-between items-center px-6 py-4 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-emerald-400" size={20} />
            <span className="font-bold text-sm">Official School Fee Invoice & Receipt</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow"
            >
              <Printer size={15} /> Print / Save PDF
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

        {/* Printable Official Invoice Body */}
        <div className="p-8 sm:p-10 space-y-6 print:p-6 text-gray-900 bg-white" id="printable-invoice-content">
          {/* Header */}
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
              Affiliated to CBSE Pattern | Senior Secondary Co-Educational Institution
            </p>
            <p className="text-[11px] text-gray-400">
              Radha Krishna Colony Pakari, Patna, Bihar - 800002 • Phone: +91 9431867366 • Email: accounts@aspireuniversalinternational.com
            </p>
          </div>

          {/* Invoice Meta Banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">
                TAX / FEE INVOICE
              </span>
              <h2 className="text-xl font-extrabold tracking-tight text-gray-900 mt-1">
                {invoice.invoice_number}
              </h2>
            </div>
            <div className="text-left sm:text-right space-y-0.5">
              <div className="text-xs text-gray-500">
                Issue Date: <strong className="text-gray-800">{new Date(invoice.issue_date).toLocaleDateString()}</strong>
              </div>
              <div className="text-xs text-gray-500">
                Due Date: <strong className="text-gray-800">{new Date(invoice.due_date).toLocaleDateString()}</strong>
              </div>
              <div className="pt-1">
                <span className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                  invoice.status === 'paid' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                  invoice.status === 'partial' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                  invoice.status === 'overdue' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                  'bg-red-100 text-red-800 border border-red-300'
                }`}>
                  {invoice.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Student & Parent Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50/70 border border-gray-100 rounded-2xl text-xs">
            <div className="space-y-1">
              <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Student Details</span>
              <p className="text-sm font-bold text-gray-900">{invoice.student_name}</p>
              <p className="text-gray-600">Admission / Roll No: <strong>{invoice.student_id}</strong></p>
              <p className="text-gray-600">Class / Grade: <strong className="text-indigo-600">{invoice.grade}</strong></p>
            </div>

            <div className="space-y-1 sm:text-right">
              <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Parent / Billing Contact</span>
              <p className="text-sm font-bold text-gray-900">{invoice.parent_name}</p>
              <p className="text-gray-600">Contact: <strong>{invoice.parent_phone}</strong></p>
              {invoice.parent_email && <p className="text-gray-600 truncate">{invoice.parent_email}</p>}
            </div>
          </div>

          {/* Itemized Fee Breakdown Table */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-100 text-gray-700 font-bold uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="py-2.5 px-4 w-12 text-center">#</th>
                  <th className="py-2.5 px-4">Fee Particulars</th>
                  <th className="py-2.5 px-4 w-28">Category</th>
                  <th className="py-2.5 px-4 text-right w-28">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoice.items.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="py-2.5 px-4 text-center text-gray-600 font-semibold">{idx + 1}</td>
                    <td className="py-2.5 px-4 font-semibold text-gray-800">{item.description}</td>
                    <td className="py-2.5 px-4 capitalize text-gray-500">{item.category}</td>
                    <td className="py-2.5 px-4 text-right tabular-nums font-bold text-gray-900">
                      ₹{item.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Calculation Summary */}
          <div className="flex justify-end">
            <div className="w-full sm:w-72 space-y-1.5 text-xs bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="tabular-nums font-semibold text-gray-800">₹{invoice.subtotal.toLocaleString()}</span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Scholarship / Concession:</span>
                  <span className="tabular-nums font-semibold">-₹{invoice.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-1 border-t border-gray-200">
                <span>Total Fee Payable:</span>
                <span className="tabular-nums font-bold text-indigo-700">₹{invoice.total_amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-700 font-bold">
                <span>Total Paid:</span>
                <span className="tabular-nums font-bold text-emerald-600">₹{invoice.paid_amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-gray-900 pt-1 border-t border-gray-200">
                <span>Balance Due:</span>
                <span className={`tabular-nums font-bold ${invoice.balance_due > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                  ₹{invoice.balance_due.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Transactions Record (if any) */}
          {invoice.payment_records.length > 0 && (
            <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-2xl space-y-1 text-xs">
              <span className="font-bold text-emerald-800 block text-[11px] uppercase tracking-wider">
                Recorded Payments ({invoice.payment_records.length})
              </span>
              {invoice.payment_records.map((p) => (
                <div key={p.id} className="flex justify-between text-[11px] text-emerald-900 pt-1 border-t border-emerald-100/50">
                  <span>
                    {new Date(p.payment_date).toLocaleDateString()} • {p.payment_mode.toUpperCase()} 
                    {p.reference_no && ` (Ref: ${p.reference_no})`}
                  </span>
                  <strong className="tabular-nums font-bold">₹{p.amount.toLocaleString()}</strong>
                </div>
              ))}
            </div>
          )}

          {/* Footer & Signatory */}
          <div className="pt-4 border-t border-dashed border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 text-[11px] text-gray-500">
            <div className="space-y-1 max-w-sm">
              <p className="font-semibold text-gray-700">Payment Guidelines:</p>
              <p>• Late fee of ₹50 per day applies after due date.</p>
              <p>• Payments can be made via UPI QR, Netbanking, or at the school cash counter.</p>
              <p className="text-[10px] text-gray-400">This is a system generated fee document for Aspire Universal International School.</p>
            </div>

            <div className="text-center sm:text-right shrink-0">
              <div className="w-28 h-12 border-b border-gray-400 mx-auto sm:ml-auto mb-1 flex items-end justify-center text-[10px] text-gray-400 italic">
                [Accounts Officer]
              </div>
              <span className="font-bold text-gray-800">Accounts & Billing Section</span>
              <p className="text-[10px] text-gray-400">Aspire Universal Intl School</p>
            </div>
          </div>
        </div>

        {/* Bottom Actions (Hidden when printing) */}
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
