import React, { useEffect, useState } from 'react';
import { 
  Receipt, Plus, Search, Filter, Download, Trash2, Eye, 
  Edit2, X, Printer, CreditCard, CheckCircle2, Clock, 
  AlertTriangle, DollarSign, ArrowUpRight, Check, FileText
} from 'lucide-react';
import { useAccountsStore } from '../store/accountsStore';
import { Invoice, FeeItem, PaymentRecord, InvoiceStatus, PaymentMode, FeeCategory } from '../types/accounts';
import InvoicePrintModal from '../components/InvoicePrintModal';

export default function ManageAccounts() {
  const { 
    invoices, 
    fetchInvoices, 
    addInvoice, 
    updateInvoice, 
    deleteInvoice, 
    recordPayment 
  } = useAccountsStore();

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'fees' | 'forms'>('all');

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [paymentModalInvoice, setPaymentModalInvoice] = useState<Invoice | null>(null);
  const [printInvoice, setPrintInvoice] = useState<Invoice | null>(null);

  // Form State for Create / Edit Invoice
  const [formData, setFormData] = useState({
    invoice_number: '',
    student_name: '',
    student_id: '',
    grade: 'Grade 1',
    parent_name: '',
    parent_phone: '',
    parent_email: '',
    issue_date: new Date().toISOString().slice(0, 10),
    due_date: new Date(Date.now() + 20 * 86400000).toISOString().slice(0, 10),
    discount: 0,
  });
  const [lineItems, setLineItems] = useState<FeeItem[]>([
    { id: '1', description: 'Quarterly Tuition Fee', category: 'tuition', amount: 12000 }
  ]);

  // Payment Record Form State
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('upi');
  const [paymentRef, setPaymentRef] = useState<string>('');
  const [paymentNotes, setPaymentNotes] = useState<string>('');

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Financial Metrics
  const totalRevenue = invoices.reduce((acc, inv) => acc + inv.paid_amount, 0);
  const pendingDues = invoices.reduce((acc, inv) => acc + inv.balance_due, 0);
  const paidCount = invoices.filter(inv => inv.status === 'paid').length;
  const overdueCount = invoices.filter(inv => inv.status === 'overdue').length;

  // Filter Logic
  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus = statusFilter === 'all' ? true : inv.status === statusFilter;
    const matchesGrade = gradeFilter === 'all' ? true : inv.grade === gradeFilter;

    const isFormInvoice = inv.invoice_number.startsWith('INV-ADM-') || (inv.notes && inv.notes.includes('Online Form'));
    const matchesSource = sourceFilter === 'all' ? true : sourceFilter === 'forms' ? isFormInvoice : !isFormInvoice;

    if (!matchesStatus || !matchesGrade || !matchesSource) return false;
    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase();
    return (
      inv.student_name.toLowerCase().includes(term) ||
      inv.invoice_number.toLowerCase().includes(term) ||
      inv.student_id.toLowerCase().includes(term) ||
      inv.parent_phone.includes(term)
    );
  });

  // Unique grades for filter dropdown
  const allGrades = Array.from(new Set(invoices.map(i => i.grade))).sort();

  // Open Create Modal
  const openCreateModal = () => {
    setEditingInvoice(null);
    const nextInvNum = `INV-2026-${String(invoices.length + 1).padStart(3, '0')}`;
    setFormData({
      invoice_number: nextInvNum,
      student_name: '',
      student_id: `AUIS-2026-${Math.floor(100 + Math.random() * 900)}`,
      grade: 'Grade 1',
      parent_name: '',
      parent_phone: '',
      parent_email: '',
      issue_date: new Date().toISOString().slice(0, 10),
      due_date: new Date(Date.now() + 20 * 86400000).toISOString().slice(0, 10),
      discount: 0,
    });
    setLineItems([
      { id: 'fld_1', description: 'Quarter 1 Tuition Fee', category: 'tuition', amount: 12000 }
    ]);
    setIsCreateOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (inv: Invoice) => {
    setEditingInvoice(inv);
    setFormData({
      invoice_number: inv.invoice_number,
      student_name: inv.student_name,
      student_id: inv.student_id,
      grade: inv.grade,
      parent_name: inv.parent_name,
      parent_phone: inv.parent_phone,
      parent_email: inv.parent_email || '',
      issue_date: inv.issue_date,
      due_date: inv.due_date,
      discount: inv.discount,
    });
    setLineItems([...inv.items]);
    setIsCreateOpen(true);
  };

  // Line item helpers
  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { id: 'fld_' + Math.random().toString(36).substr(2, 6), description: '', category: 'tuition', amount: 0 }
    ]);
  };

  const updateLineItem = (index: number, patch: Partial<FeeItem>) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], ...patch };
    setLineItems(updated);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  // Calculation totals
  const currentSubtotal = lineItems.reduce((sum, item) => sum + (item.amount || 0), 0);
  const currentTotal = Math.max(0, currentSubtotal - (formData.discount || 0));

  // Save Invoice
  const handleSaveInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.student_name.trim() || !formData.invoice_number.trim()) {
      alert('Please fill in required student name and invoice number.');
      return;
    }
    if (lineItems.length === 0) {
      alert('Please add at least one fee item.');
      return;
    }

    if (editingInvoice) {
      const balanceDue = Math.max(0, currentTotal - editingInvoice.paid_amount);
      const newStatus: InvoiceStatus = 
        balanceDue === 0 ? 'paid' :
        editingInvoice.paid_amount > 0 ? 'partial' :
        new Date() > new Date(formData.due_date) ? 'overdue' : 'unpaid';

      await updateInvoice(editingInvoice.id, {
        ...formData,
        items: lineItems,
        subtotal: currentSubtotal,
        discount: formData.discount || 0,
        total_amount: currentTotal,
        balance_due: balanceDue,
        status: newStatus
      });
    } else {
      const isOverdue = new Date() > new Date(formData.due_date);
      await addInvoice({
        ...formData,
        items: lineItems,
        subtotal: currentSubtotal,
        discount: formData.discount || 0,
        total_amount: currentTotal,
        paid_amount: 0,
        balance_due: currentTotal,
        status: isOverdue ? 'overdue' : 'unpaid',
        payment_records: []
      });
    }

    setIsCreateOpen(false);
  };

  // Open Payment Modal
  const openPaymentModal = (inv: Invoice) => {
    setPaymentModalInvoice(inv);
    setPaymentAmount(inv.balance_due);
    setPaymentMode('upi');
    setPaymentRef('');
    setPaymentNotes('');
  };

  // Handle Record Payment
  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalInvoice || paymentAmount <= 0) return;

    await recordPayment(paymentModalInvoice.id, {
      amount: paymentAmount,
      payment_date: new Date().toISOString().slice(0, 10),
      payment_mode: paymentMode,
      reference_no: paymentRef,
      notes: paymentNotes
    });

    setPaymentModalInvoice(null);
  };

  // CSV Export of Accounts Register
  const exportToCSV = () => {
    if (filteredInvoices.length === 0) {
      alert('No invoices to export.');
      return;
    }

    const headers = [
      'Invoice No', 'Student Name', 'Admission ID', 'Grade', 
      'Parent Name', 'Parent Phone', 'Total Amount', 'Paid Amount', 
      'Balance Due', 'Status', 'Issue Date', 'Due Date'
    ];

    const rows = filteredInvoices.map(inv => [
      `"${inv.invoice_number}"`,
      `"${inv.student_name.replace(/"/g, '""')}"`,
      `"${inv.student_id}"`,
      `"${inv.grade}"`,
      `"${inv.parent_name.replace(/"/g, '""')}"`,
      `"${inv.parent_phone}"`,
      inv.total_amount,
      inv.paid_amount,
      inv.balance_due,
      `"${inv.status.toUpperCase()}"`,
      `"${inv.issue_date}"`,
      `"${inv.due_date}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `school-fee-ledger-${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className={printInvoice ? "space-y-6 print:hidden" : "space-y-6"}>
        {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Receipt className="text-indigo-600" size={26} /> Accounts & Invoices
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Manage student fee billing, track collections, record payments, and issue official printable tax invoices.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-4 py-2.5 rounded-xl transition text-sm"
          >
            <Download size={16} /> Export Register (CSV)
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl shadow transition text-sm"
          >
            <Plus size={18} /> Create Fee Invoice
          </button>
        </div>
      </div>

      {/* Financial KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
            <ArrowUpRight size={14} /> Total Fee Collected
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2 tabular-nums">
            ₹{totalRevenue.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1">
            <Clock size={14} /> Outstanding Dues
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-2 tabular-nums">
            ₹{pendingDues.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 size={14} className="text-emerald-500" /> Invoices Cleared
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
            {paidCount} <span className="text-xs font-normal text-gray-400">/ {invoices.length}</span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1">
            <AlertTriangle size={14} /> Overdue Invoices
          </span>
          <p className="text-2xl sm:text-3xl font-extrabold text-rose-600 mt-2">
            {overdueCount}
          </p>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by student name, invoice no, admission ID, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
          />
        </div>

        {/* Filter by Status */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
            <option value="unpaid">Unpaid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        {/* Filter by Grade */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">Class:</span>
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="all">All Classes</option>
            {allGrades.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Filter by Source */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">Source:</span>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value as any)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="all">All Revenues</option>
            <option value="fees">School Term Fees</option>
            <option value="forms">Online Form Admissions</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredInvoices.length === 0 ? (
          <div className="text-center py-20 px-4">
            <Receipt size={48} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-bold text-gray-700">No Invoices Found</h3>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search criteria or create a new invoice.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-4 px-6">Invoice #</th>
                  <th className="py-4 px-6">Student & Class</th>
                  <th className="py-4 px-6">Total Amount</th>
                  <th className="py-4 px-6">Paid / Balance</th>
                  <th className="py-4 px-6">Due Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50/70 transition">
                    {/* Invoice No */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-extrabold tracking-tight text-indigo-600 block">{inv.invoice_number}</span>
                        {(inv.invoice_number.startsWith('INV-ADM-') || (inv.notes && inv.notes.includes('Online Form'))) && (
                          <span className="text-[10px] font-bold text-violet-700 bg-violet-50 px-1.5 py-0.5 rounded border border-violet-200">
                            Online Form
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-gray-400">{new Date(inv.issue_date).toLocaleDateString()}</span>
                    </td>

                    {/* Student */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-gray-900">{inv.student_name}</div>
                      <div className="text-xs text-gray-500">
                        <span className="text-indigo-600 font-semibold">{inv.grade}</span> • ID: {inv.student_id}
                      </div>
                    </td>

                    {/* Total Amount */}
                    <td className="py-4 px-6 tabular-nums font-bold text-gray-900">
                      ₹{inv.total_amount.toLocaleString()}
                    </td>

                    {/* Paid vs Balance */}
                    <td className="py-4 px-6 text-xs">
                      <div className="text-emerald-600 font-bold tabular-nums">Paid: ₹{inv.paid_amount.toLocaleString()}</div>
                      <div className={`${inv.balance_due > 0 ? 'text-red-600 font-bold' : 'text-gray-400'} tabular-nums`}>
                        Due: ₹{inv.balance_due.toLocaleString()}
                      </div>
                    </td>

                    {/* Due Date */}
                    <td className="py-4 px-6 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(inv.due_date).toLocaleDateString()}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        inv.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        inv.status === 'partial' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        inv.status === 'overdue' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {inv.status === 'paid' && <Check size={12} />}
                        {inv.status}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="py-4 px-6 text-right whitespace-nowrap space-x-1.5">
                      {/* Print Invoice */}
                      <button
                        onClick={() => setPrintInvoice(inv)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold transition"
                        title="Print Official A4 Invoice / Receipt"
                      >
                        <Printer size={13} /> Print
                      </button>

                      {/* Record Payment */}
                      {inv.balance_due > 0 && (
                        <button
                          onClick={() => openPaymentModal(inv)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition"
                          title="Record Payment"
                        >
                          <CreditCard size={13} /> Pay
                        </button>
                      )}

                      {/* Edit */}
                      <button
                        onClick={() => openEditModal(inv)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit Invoice"
                      >
                        <Edit2 size={15} />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete invoice ${inv.invoice_number} for ${inv.student_name}?`)) {
                            deleteInvoice(inv.id);
                          }
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete Invoice"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 1. Create / Edit Invoice Modal */}
      {/* ========================================================================= */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Receipt className="text-indigo-600" size={20} />
                {editingInvoice ? `Edit Invoice: ${editingInvoice.invoice_number}` : 'Create New Fee Invoice'}
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSaveInvoice} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Student & Parent Info */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Student & Billing Information</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Invoice Number *</label>
                    <input
                      type="text"
                      required
                      value={formData.invoice_number}
                      onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
                      className="w-full p-2.5 font-mono bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Student Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aarav Sharma"
                      value={formData.student_name}
                      onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Admission / Roll No *</label>
                    <input
                      type="text"
                      required
                      placeholder="AUIS-2026-101"
                      value={formData.student_id}
                      onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Grade / Class *</label>
                    <select
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      {['Playgroup', 'Nursery', 'LKG', 'UKG', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Parent / Guardian Name</label>
                    <input
                      type="text"
                      placeholder="Rajesh Sharma"
                      value={formData.parent_name}
                      onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      placeholder="9876543210"
                      value={formData.parent_phone}
                      onChange={(e) => setFormData({ ...formData, parent_phone: e.target.value })}
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Parent Email</label>
                    <input
                      type="email"
                      placeholder="parent@example.com"
                      value={formData.parent_email}
                      onChange={(e) => setFormData({ ...formData, parent_email: e.target.value })}
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Issue Date</label>
                    <input
                      type="date"
                      required
                      value={formData.issue_date}
                      onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Payment Due Date</label>
                    <input
                      type="date"
                      required
                      value={formData.due_date}
                      onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Line Items Builder */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Fee Line Items ({lineItems.length})
                  </h4>
                  <button
                    type="button"
                    onClick={addLineItem}
                    className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold transition"
                  >
                    <Plus size={14} /> Add Particular
                  </button>
                </div>

                <div className="space-y-2">
                  {lineItems.map((item, idx) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-gray-50 p-3 rounded-xl border border-gray-200">
                      <div className="col-span-6">
                        <label className="block text-[10px] font-bold text-gray-500 mb-0.5">Description *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Tuition Fee Q1, Bus Transport"
                          value={item.description}
                          onChange={(e) => updateLineItem(idx, { description: e.target.value })}
                          className="w-full p-2 bg-white border border-gray-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>

                      <div className="col-span-3">
                        <label className="block text-[10px] font-bold text-gray-500 mb-0.5">Category</label>
                        <select
                          value={item.category}
                          onChange={(e) => updateLineItem(idx, { category: e.target.value as FeeCategory })}
                          className="w-full p-2 bg-white border border-gray-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                          <option value="tuition">Tuition</option>
                          <option value="admission">Admission</option>
                          <option value="transport">Transport</option>
                          <option value="lab">Lab & Computer</option>
                          <option value="exam">Examination</option>
                          <option value="annual">Annual / Dev</option>
                          <option value="uniform">Uniform / Books</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div className="col-span-2">
                        <label className="block text-[10px] font-bold text-gray-500 mb-0.5">Amount (₹) *</label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={item.amount || ''}
                          onChange={(e) => updateLineItem(idx, { amount: parseFloat(e.target.value) || 0 })}
                          className="w-full p-2 font-mono bg-white border border-gray-300 rounded-lg text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>

                      <div className="col-span-1 text-center pt-3">
                        <button
                          type="button"
                          disabled={lineItems.length === 1}
                          onClick={() => removeLineItem(idx)}
                          className="text-gray-400 hover:text-red-600 disabled:opacity-20 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Calculation */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Subtotal:</span>
                  <span className="tabular-nums font-bold">₹{currentSubtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-emerald-700">Scholarship / Concession Discount:</span>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">-₹</span>
                    <input
                      type="number"
                      min="0"
                      value={formData.discount || ''}
                      onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                      className="w-24 p-1.5 tabular-nums text-xs font-bold bg-white border border-gray-300 rounded-lg text-right outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-2 border-t border-slate-200">
                  <span>Total Amount Payable:</span>
                  <span className="tabular-nums text-indigo-700 text-base font-extrabold">₹{currentTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
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
                  {editingInvoice ? 'Update Invoice' : 'Generate Fee Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. Record Payment Modal */}
      {/* ========================================================================= */}
      {paymentModalInvoice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <h4 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <CreditCard className="text-emerald-600" size={20} /> Record Fee Payment
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  {paymentModalInvoice.invoice_number} • {paymentModalInvoice.student_name}
                </p>
              </div>
              <button
                onClick={() => setPaymentModalInvoice(null)}
                className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex justify-between items-center">
                <span className="text-xs font-bold text-amber-800">Remaining Balance:</span>
                <span className="tabular-nums text-base font-extrabold text-amber-900">
                  ₹{paymentModalInvoice.balance_due.toLocaleString()}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Amount to Record (₹) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  max={paymentModalInvoice.balance_due}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 tabular-nums text-base font-bold border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Payment Mode</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-semibold"
                >
                  <option value="upi">Online UPI / QR Transfer</option>
                  <option value="cash">Cash at School Counter</option>
                  <option value="cheque">Bank Cheque / DD</option>
                  <option value="netbanking">Netbanking / NEFT / IMPS</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Transaction / Cheque Ref No.</label>
                <input
                  type="text"
                  placeholder="e.g. UPI/2026/8912 or Cheque #00129"
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  className="w-full p-2.5 font-mono border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Paid by father via Google Pay"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setPaymentModalInvoice(null)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-semibold text-xs hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow transition"
                >
                  Confirm & Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>

      {/* Official A4 Fee Invoice / Receipt Modal */}
      {printInvoice && (
        <InvoicePrintModal
          invoice={printInvoice}
          onClose={() => setPrintInvoice(null)}
        />
      )}
    </div>
  );
}
