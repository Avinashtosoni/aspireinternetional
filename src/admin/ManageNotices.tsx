import React, { useEffect, useState } from 'react';
import { useCMSStore, Notice } from '../store/cmsStore';
import { Plus, Trash2, Megaphone } from 'lucide-react';

export default function ManageNotices() {
  const { notices, fetchNotices, addNotice, deleteNotice, isLoading } = useCMSStore();
  const [newNotice, setNewNotice] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.trim()) return;
    setIsAdding(true);
    const ok = await addNotice({
      content: newNotice,
      is_active: true,
      display_order: notices.length + 1
    });
    if (ok) {
      setNewNotice('');
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Megaphone className="text-indigo-600" /> Add New Notice
        </h2>
        <form onSubmit={handleAdd} className="flex gap-4">
          <input
            type="text"
            className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none"
            placeholder="Type notice message here..."
            value={newNotice}
            onChange={(e) => setNewNotice(e.target.value)}
          />
          <button
            type="submit"
            disabled={isAdding}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Plus size={20} /> {isAdding ? 'Adding...' : 'Add Notice'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Active Notices</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {isLoading && <div className="p-8 text-center text-gray-500">Loading notices...</div>}
          {!isLoading && notices.length === 0 && (
            <div className="p-8 text-center text-gray-500">No notices found. Add one above.</div>
          )}
          {notices.map((notice) => (
            <div key={notice.id} className="p-6 flex justify-between items-center hover:bg-gray-50 transition">
              <div className="flex items-start gap-4">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <Megaphone size={20} className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-gray-800 font-medium">{notice.content}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Added on {new Date(notice.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => deleteNotice(notice.id)}
                className="text-gray-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
