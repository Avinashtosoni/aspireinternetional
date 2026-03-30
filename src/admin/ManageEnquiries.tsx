import React, { useEffect, useState } from 'react';
import { useCMSStore, Enquiry } from '../store/cmsStore';
import { CheckCircle, XCircle, Trash2, Eye, MessageSquare, User, Phone, Mail, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function ManageEnquiries() {
  const { enquiries, fetchEnquiries } = useCMSStore();
  const [selectedEnq, setSelectedEnq] = useState<Enquiry | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const filteredEnquiries = enquiries.filter(enq => {
    const matchesFilter = filter === 'all' ? true : enq.status === filter;
    const matchesSearch = enq.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          enq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          enq.phone.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('enquiries').update({ status }).eq('id', id);
    fetchEnquiries();
    if (selectedEnq && selectedEnq.id === id) {
      setSelectedEnq(prev => prev ? { ...prev, status } : null);
    }
  };

  const deleteEnquiry = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this enquiry?')) {
      await supabase.from('enquiries').delete().eq('id', id);
      fetchEnquiries();
      setSelectedEnq(null);
    }
  };

  const getSource = (msg: string) => {
    if (msg.includes('[Subject:')) return 'Contact Form';
    return 'Admissions';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <MessageSquare className="text-indigo-600" /> All Enquiries & Messages
            </h2>
            <p className="text-sm text-gray-500 mt-1">Manage and track student inquiries</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
             <input 
                type="text" 
                placeholder="Search name, email..."
                className="p-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-600 w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
             <select 
                className="p-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-600"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
             >
                <option value="all">All Status</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
                <option value="resolved">Resolved</option>
             </select>
             <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                {filteredEnquiries.length}
              </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Source</th>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Contact Info</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-gray-400">No matching enquiries found.</td>
                </tr>
              ) : (
                filteredEnquiries.map((enq) => (
                  <tr key={enq.id} className={`hover:bg-gray-50 transition-colors ${enq.status === 'unread' ? 'bg-blue-50/30 font-medium' : ''}`}>
                    <td className="p-4 text-sm text-gray-600">
                      {new Date(enq.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        getSource(enq.message) === 'Contact Form' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {getSource(enq.message)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-bold text-gray-900">{enq.name}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      <div>{enq.email}</div>
                      <div className="text-xs text-gray-400">{enq.phone}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        enq.status === 'unread' ? 'bg-red-100 text-red-700' :
                        enq.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {enq.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-1">
                        <button 
                          onClick={() => { setSelectedEnq(enq); if (enq.status === 'unread') updateStatus(enq.id, 'read'); }} 
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => deleteEnquiry(enq.id)} 
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedEnq && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900">Enquiry Details</h3>
              <button onClick={() => setSelectedEnq(null)} className="text-gray-400 hover:text-gray-600">
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <User size={12} /> Full Name
                  </label>
                  <p className="text-gray-900 font-semibold">{selectedEnq.name}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <Calendar size={12} /> Received On
                  </label>
                  <p className="text-gray-900 font-semibold">{new Date(selectedEnq.created_at).toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <Mail size={12} /> Email
                  </label>
                  <a href={`mailto:${selectedEnq.email}`} className="text-indigo-600 font-semibold hover:underline">{selectedEnq.email}</a>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <Phone size={12} /> Phone
                  </label>
                  <a href={`tel:${selectedEnq.phone}`} className="text-indigo-600 font-semibold hover:underline">{selectedEnq.phone}</a>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Message Content</label>
                <div className="bg-gray-50 p-6 rounded-xl text-gray-700 leading-relaxed whitespace-pre-wrap border border-gray-100">
                  {selectedEnq.message}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-gray-100">
                <div className="flex gap-3">
                  {selectedEnq.status !== 'resolved' ? (
                    <button 
                      onClick={() => updateStatus(selectedEnq.id, 'resolved')}
                      className="bg-green-600 text-white px-5 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-green-700 transition"
                    >
                      <CheckCircle size={18} /> Mark as Resolved
                    </button>
                  ) : (
                    <button 
                      onClick={() => updateStatus(selectedEnq.id, 'unread')}
                      className="bg-yellow-500 text-white px-5 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-yellow-600 transition"
                    >
                      <XCircle size={18} /> Re-open / Mark Unread
                    </button>
                  )}
                </div>
                <button 
                  onClick={() => deleteEnquiry(selectedEnq.id)}
                  className="text-red-500 hover:text-red-700 font-bold text-sm"
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
