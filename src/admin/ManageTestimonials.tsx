import React, { useEffect, useState } from 'react';
import { useCMSStore, Testimonial } from '../store/cmsStore';
import { Plus, Trash2, Edit2, X, Star, Quote } from 'lucide-react';

export default function ManageTestimonials() {
  const { testimonials, fetchTestimonials, addTestimonial, updateTestimonial, deleteTestimonial, isLoading } = useCMSStore();
  const [formData, setFormData] = useState({ name: '', role: 'Parent', content: '', rating: 5, image_url: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [editFormData, setEditFormData] = useState({ name: '', role: '', content: '', rating: 5, image_url: '' });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.content) return;
    setIsAdding(true);
    const ok = await addTestimonial({ ...formData, display_order: testimonials.length + 1 });
    if (ok) {
      setFormData({ name: '', role: 'Parent', content: '', rating: 5, image_url: '' });
      setIsAdding(false);
    }
  };

  const handleEditClick = (t: Testimonial) => {
    setEditingTestimonial(t);
    setEditFormData({
      name: t.name,
      role: t.role || '',
      content: t.content,
      rating: t.rating || 5,
      image_url: t.image_url || ''
    });
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial || !editFormData.name || !editFormData.content) return;
    setIsUpdating(true);
    const ok = await updateTestimonial(editingTestimonial.id, editFormData);
    if (ok) {
      setEditingTestimonial(null);
    }
    setIsUpdating(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete testimonial by "${name}"?`)) {
      await deleteTestimonial(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Quote className="text-yellow-500" /> Add Testimonial
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            className="p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Person Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="text"
            className="p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Role (e.g. Parent of Grade 2)"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600">Rating (1-5)</label>
            <input
              type="number"
              min="1"
              max="5"
              className="p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-yellow-500"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })}
            />
          </div>
          <input
            type="url"
            placeholder="Avatar Image URL (Optional)"
            className="mt-2 p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-yellow-500"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          />
          <textarea
            className="md:col-span-2 p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-yellow-500 h-24"
            placeholder="Testimonial message..."
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
          />
          <button
            type="submit"
            disabled={isAdding}
            className="md:col-span-2 bg-yellow-500 text-white py-3 rounded-lg font-bold hover:bg-yellow-600 transition disabled:opacity-50"
          >
            {isAdding ? 'Adding...' : 'Save Testimonial'}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-white p-6 rounded-xl shadow-sm relative group flex flex-col justify-between">
            <div>
              <div className="absolute top-4 right-4 flex items-center gap-1 opacity-90 group-hover:opacity-100 transition">
                <button
                  onClick={() => handleEditClick(t)}
                  className="text-gray-400 hover:text-blue-600 transition p-2 hover:bg-blue-50 rounded-lg"
                  title="Edit Testimonial"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(t.id, t.name)}
                  className="text-gray-400 hover:text-red-600 transition p-2 hover:bg-red-50 rounded-lg"
                  title="Delete Testimonial"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="flex gap-1 text-yellow-500 mb-3">
                {[...Array(t.rating || 5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <p className="text-gray-600 italic mb-4 leading-relaxed">"{t.content}"</p>
            </div>
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
              <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden shrink-0">
                <img src={t.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}`} alt={t.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm">{t.name}</h4>
                <p className="text-xs text-gray-500">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Testimonial Modal */}
      {editingTestimonial && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Edit2 className="text-yellow-600" size={20} /> Edit Testimonial
              </h3>
              <button
                onClick={() => setEditingTestimonial(null)}
                className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Person Name</label>
                <input
                  type="text"
                  required
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Role</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                  value={editFormData.role}
                  onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Rating (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                    value={editFormData.rating}
                    onChange={(e) => setEditFormData({ ...editFormData, rating: parseInt(e.target.value) || 5 })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Avatar Image URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                    value={editFormData.image_url}
                    onChange={(e) => setEditFormData({ ...editFormData, image_url: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">Feedback Content</label>
                <textarea
                  required
                  rows={4}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                  value={editFormData.content}
                  onChange={(e) => setEditFormData({ ...editFormData, content: e.target.value })}
                />
              </div>
              <div className="flex gap-3 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setEditingTestimonial(null)}
                  className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2.5 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-bold transition disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Update Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
