import React, { useEffect, useState } from 'react';
import { useCMSStore, Testimonial } from '../store/cmsStore';
import { Plus, Trash2, Star, Quote } from 'lucide-react';

export default function ManageTestimonials() {
  const { testimonials, fetchTestimonials, addTestimonial, deleteTestimonial, isLoading } = useCMSStore();
  const [formData, setFormData] = useState({ name: '', role: 'Parent', content: '', rating: 5, image_url: '' });
  const [isAdding, setIsAdding] = useState(false);

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
              onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
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
          <div key={t.id} className="bg-white p-6 rounded-xl shadow-sm relative group">
            <button
              onClick={() => deleteTestimonial(t.id)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition p-2 hover:bg-red-50 rounded-lg"
            >
              <Trash2 size={18} />
            </button>
            <div className="flex gap-1 text-yellow-500 mb-3">
              {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
            </div>
            <p className="text-gray-600 italic mb-4 leading-relaxed">"{t.content}"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                <img src={t.image_url || `https://ui-avatars.com/api/?name=${t.name}`} alt={t.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm">{t.name}</h4>
                <p className="text-xs text-gray-500">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
