import React, { useEffect, useState } from 'react';
import { useCMSStore, Facility } from '../store/cmsStore';
import { Trash2, Plus, Pencil, X } from 'lucide-react';

export default function ManageFacilities() {
  const { facilities, fetchFacilities, addFacility, updateFacility, deleteFacility } = useCMSStore();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', icon: '', display_order: 0 });
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  useEffect(() => {
    fetchFacilities();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await addFacility(formData);
    if (success) {
      setIsAdding(false);
      setFormData({ title: '', description: '', icon: '', display_order: 0 });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFacility || !editingFacility.title) return;
    setIsSavingEdit(true);
    const ok = await updateFacility(editingFacility.id, {
      title: editingFacility.title,
      description: editingFacility.description,
      icon: editingFacility.icon,
      display_order: editingFacility.display_order,
    });
    if (ok) {
      setEditingFacility(null);
    }
    setIsSavingEdit(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this facility?')) {
      await deleteFacility(id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Manage Facilities</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition cursor-pointer"
        >
          <Plus size={18} /> Add Facility
        </button>
      </div>

      {isAdding && (
        <div className="p-6 bg-gray-50 border-b border-gray-100">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required placeholder="Title" className="p-2 border rounded" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
            <input required placeholder="Icon Name (e.g. Library, FlaskConical, Trophy)" className="p-2 border rounded" value={formData.icon} onChange={(e) => setFormData({...formData, icon: e.target.value})} />
            <textarea required placeholder="Description" className="p-2 border rounded md:col-span-2" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            <input type="number" placeholder="Display Order" className="p-2 border rounded" value={formData.display_order} onChange={(e) => setFormData({...formData, display_order: Number(e.target.value)})} />
            <div className="md:col-span-2 flex justify-end gap-2">
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Save</button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm">
              <th className="p-4">Title</th>
              <th className="p-4">Description</th>
              <th className="p-4">Icon Name</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {facilities.map((fac) => (
              <tr key={fac.id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-gray-900">{fac.title}</td>
                <td className="p-4 text-gray-600 max-w-sm truncate">{fac.description}</td>
                <td className="p-4 text-gray-600">{fac.icon}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => setEditingFacility(fac)} 
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                      title="Edit Facility"
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(fac.id)} 
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                      title="Delete Facility"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {facilities.length === 0 && (
              <tr>
                <td colSpan={4} className="p-10 text-center text-gray-400">
                  No facilities added yet. Add one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Facility Modal */}
      {editingFacility && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-4">
              <h3 className="text-lg font-bold text-gray-900">Edit Facility</h3>
              <button onClick={() => setEditingFacility(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Title</label>
                <input
                  type="text"
                  required
                  className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-600"
                  value={editingFacility.title}
                  onChange={(e) => setEditingFacility({ ...editingFacility, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Icon Name (e.g. Library, FlaskConical, Trophy)</label>
                <input
                  type="text"
                  required
                  className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-600"
                  value={editingFacility.icon}
                  onChange={(e) => setEditingFacility({ ...editingFacility, icon: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                <textarea
                  rows={3}
                  className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-600"
                  value={editingFacility.description || ''}
                  onChange={(e) => setEditingFacility({ ...editingFacility, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Display Order</label>
                <input
                  type="number"
                  className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-600"
                  value={editingFacility.display_order || 0}
                  onChange={(e) => setEditingFacility({ ...editingFacility, display_order: Number(e.target.value) })}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingFacility(null)}
                  className="px-5 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 font-medium text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 font-bold text-white transition disabled:opacity-50"
                >
                  {isSavingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
