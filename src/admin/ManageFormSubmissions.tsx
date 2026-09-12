import React, { useEffect, useState } from 'react';
import { 
  ClipboardCheck, Search, Filter, Download, Trash2, Eye, 
  X, CheckCircle2, Clock, AlertCircle, Check, ArrowRight,
  FileText, Calendar, Phone, Mail, User, Printer, CreditCard
} from 'lucide-react';
import { useFormsStore } from '../store/formsStore';
import { CustomForm, FormSubmission } from '../types/form';
import FormReceiptModal from '../components/FormReceiptModal';

export default function ManageFormSubmissions() {
  const { 
    forms, 
    submissions, 
    fetchForms, 
    fetchSubmissions, 
    updateSubmissionStatus, 
    deleteSubmission 
  } = useFormsStore();

  const [selectedFormId, setSelectedFormId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewingSubmission, setViewingSubmission] = useState<FormSubmission | null>(null);
  const [receiptModalData, setReceiptModalData] = useState<{ submission: FormSubmission; form: CustomForm } | null>(null);

  useEffect(() => {
    fetchForms();
    fetchSubmissions();
  }, []);

  // Filter Submissions
  const filteredSubmissions = submissions.filter((sub) => {
    const matchesForm = selectedFormId === 'all' ? true : sub.form_id === selectedFormId;
    const matchesStatus = selectedStatus === 'all' ? true : sub.status === selectedStatus;
    
    if (!matchesForm || !matchesStatus) return false;

    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase();
    const dataString = JSON.stringify(sub.data).toLowerCase();
    const formTitle = (forms.find(f => f.id === sub.form_id)?.title || '').toLowerCase();

    return dataString.includes(term) || formTitle.includes(term) || sub.status.includes(term);
  });

  // Calculate Metrics
  const totalCount = submissions.length;
  const newCount = submissions.filter(s => s.status === 'new').length;
  const reviewedCount = submissions.filter(s => s.status === 'reviewed').length;
  const acceptedCount = submissions.filter(s => s.status === 'accepted').length;

  const getFormTitle = (formId: string) => {
    const f = forms.find(x => x.id === formId);
    return f ? f.title : 'Custom Form';
  };

  const getFormObj = (formId: string) => {
    return forms.find(x => x.id === formId);
  };

  // 1-Click CSV Export for Submissions
  const exportToCSV = () => {
    if (filteredSubmissions.length === 0) {
      alert('No submissions match the current filter.');
      return;
    }

    // Determine relevant fields
    let fieldHeaders: string[] = [];
    if (selectedFormId !== 'all') {
      const form = forms.find(f => f.id === selectedFormId);
      if (form) {
        fieldHeaders = form.fields.map(f => f.label);
      }
    }

    const baseHeaders = ['Submission ID', 'Form Name', 'Submitted Date', 'Status'];
    const allHeaders = fieldHeaders.length > 0 ? [...baseHeaders, ...fieldHeaders] : [...baseHeaders, 'Details JSON'];

    const rows = filteredSubmissions.map(sub => {
      const form = forms.find(f => f.id === sub.form_id);
      const rowBase = [
        `"${sub.id}"`,
        `"${(form?.title || 'Form').replace(/"/g, '""')}"`,
        `"${new Date(sub.created_at).toLocaleString()}"`,
        `"${sub.status}"`,
      ];

      if (form && fieldHeaders.length > 0) {
        const dynamicValues = form.fields.map(f => {
          const val = sub.data[f.name];
          if (val === undefined || val === null) return '""';
          return `"${String(val).replace(/"/g, '""')}"`;
        });
        return [...rowBase, ...dynamicValues].join(',');
      } else {
        return [...rowBase, `"${JSON.stringify(sub.data).replace(/"/g, '""')}"`].join(',');
      }
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [allHeaders.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `form-submissions-${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this submission?')) {
      await deleteSubmission(id);
      if (viewingSubmission?.id === id) {
        setViewingSubmission(null);
      }
    }
  };

  return (
    <div>
      <div className={receiptModalData ? "space-y-6 print:hidden" : "space-y-6"}>
        {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ClipboardCheck className="text-indigo-600" size={26} /> Form Submissions
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Review, filter, update statuses, and export all responses received from online forms.
          </p>
        </div>
        <button
          onClick={exportToCSV}
          disabled={filteredSubmissions.length === 0}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow transition disabled:opacity-50"
        >
          <Download size={17} /> Export to CSV
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Submissions</span>
          <p className="text-3xl font-extrabold text-gray-900 mt-2">{totalCount}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">New / Pending</span>
          <p className="text-3xl font-extrabold text-amber-600 mt-2">{newCount}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Reviewed</span>
          <p className="text-3xl font-extrabold text-blue-600 mt-2">{reviewedCount}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Accepted</span>
          <p className="text-3xl font-extrabold text-emerald-600 mt-2">{acceptedCount}</p>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by student, parent, phone, or answer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
          />
        </div>

        {/* Filter by Form */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">Form:</span>
          <select
            value={selectedFormId}
            onChange={(e) => setSelectedFormId(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none max-w-[200px] truncate"
          >
            <option value="all">All Forms ({forms.length})</option>
            {forms.map((f) => (
              <option key={f.id} value={f.id}>{f.title}</option>
            ))}
          </select>
        </div>

        {/* Filter by Status */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="reviewed">Reviewed</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-20 px-4">
            <ClipboardCheck size={48} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-bold text-gray-700">No Submissions Found</h3>
            <p className="text-gray-400 text-sm mt-1 max-w-sm mx-auto">
              {searchTerm || selectedFormId !== 'all' || selectedStatus !== 'all' 
                ? 'Try adjusting your filters or search terms.' 
                : 'Responses submitted via public form links will automatically appear here.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Form Name</th>
                  <th className="py-4 px-6">Submission Preview</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSubmissions.map((sub) => {
                  const form = getFormObj(sub.form_id);
                  const firstEntries = Object.entries(sub.data).slice(0, 3);

                  return (
                    <tr key={sub.id} className="hover:bg-gray-50/70 transition">
                      {/* Date */}
                      <td className="py-4 px-6 text-xs text-gray-500 whitespace-nowrap">
                        <div className="font-semibold text-gray-800">
                          {new Date(sub.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-[11px] text-gray-400">
                          {new Date(sub.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      {/* Form Name */}
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-xs font-bold">
                          <FileText size={12} />
                          {getFormTitle(sub.form_id)}
                        </span>
                      </td>

                      {/* Preview of submitted data */}
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-2 text-xs">
                          {firstEntries.map(([k, v]) => (
                            <span key={k} className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md max-w-[220px] truncate">
                              <span className="font-semibold text-slate-900 capitalize">{k.replace(/_/g, ' ')}:</span> {String(v)}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <select
                          value={sub.status}
                          onChange={(e) => updateSubmissionStatus(sub.id, e.target.value as any)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg border outline-none cursor-pointer ${
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

                      {/* Actions */}
                      <td className="py-4 px-6 text-right whitespace-nowrap space-x-2">
                        <button
                          onClick={() => {
                            const form = getFormObj(sub.form_id);
                            if (form) setReceiptModalData({ submission: sub, form });
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold transition"
                          title="Print / Save Official PDF Receipt"
                        >
                          <Printer size={13} /> Slip
                        </button>
                        <button
                          onClick={() => setViewingSubmission(sub)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition"
                        >
                          <Eye size={14} /> View
                        </button>
                        <button
                          onClick={() => handleDelete(sub.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete Submission"
                        >
                          <Trash2 size={16} />
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

      {/* ========================================================================= */}
      {/* Application Detail Modal Drawer */}
      {/* ========================================================================= */}
      {viewingSubmission && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  {getFormTitle(viewingSubmission.form_id)}
                </span>
                <h3 className="text-xl font-bold text-gray-900">Application Response</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  ID: <span className="font-mono">{viewingSubmission.id}</span> • {new Date(viewingSubmission.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setViewingSubmission(null)}
                className="text-gray-400 hover:text-gray-700 p-2 rounded-xl hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Questions & Answers */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {getFormObj(viewingSubmission.form_id)?.fields.map((field) => {
                const val = viewingSubmission.data[field.name];
                return (
                  <div key={field.id} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      {field.label}
                    </label>
                    <div className="text-sm font-semibold text-gray-900 break-words">
                      {val !== undefined && val !== null && val !== '' ? (
                        typeof val === 'boolean' ? (val ? 'Yes / Agreed' : 'No') : String(val)
                      ) : (
                        <span className="text-gray-400 font-normal italic">Not provided</span>
                      )}
                    </div>
                  </div>
                );
              }) || (
                // Fallback if form schema not found
                Object.entries(viewingSubmission.data).map(([key, val]) => (
                  <div key={key} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 capitalize">
                      {key.replace(/_/g, ' ')}
                    </label>
                    <div className="text-sm font-semibold text-gray-900 break-words">
                      {String(val)}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer with Status Quick Update */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 rounded-b-3xl flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-600">Status:</span>
                <select
                  value={viewingSubmission.status}
                  onChange={async (e) => {
                    const newStatus = e.target.value as any;
                    await updateSubmissionStatus(viewingSubmission.id, newStatus);
                    setViewingSubmission(prev => prev ? { ...prev, status: newStatus } : null);
                  }}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-300 bg-white outline-none"
                >
                  <option value="new">New</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="flex gap-2 items-center">
                <button
                  type="button"
                  onClick={() => {
                    const form = getFormObj(viewingSubmission.form_id);
                    if (form) {
                      setReceiptModalData({ submission: viewingSubmission, form });
                      setViewingSubmission(null);
                    }
                  }}
                  className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold rounded-xl text-xs flex items-center gap-1.5 transition"
                >
                  <Printer size={15} /> Print Receipt
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(viewingSubmission.id)}
                  className="px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setViewingSubmission(null)}
                  className="px-5 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition shadow"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>

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
