import React, { useEffect, useState } from 'react';
import { useCMSStore, SchoolEvent } from '../store/cmsStore';
import { Plus, Trash2, Calendar, MapPin } from 'lucide-react';

export default function ManageEvents() {
  const { events, fetchEvents, addEvent, deleteEvent, isLoading } = useCMSStore();
  const [formData, setFormData] = useState({ title: '', description: '', event_date: '', location: '', image_url: '' });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.event_date) return;
    setIsAdding(true);
    const ok = await addEvent(formData);
    if (ok) {
      setFormData({ title: '', description: '', event_date: '', location: '', image_url: '' });
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Calendar className="text-primary" /> Add New Event
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            className="p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary"
            placeholder="Event Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <input
            type="date"
            className="p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary"
            value={formData.event_date}
            onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
            required
          />
          <input
            type="text"
            className="p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary"
            placeholder="Location (e.g. School Auditorium)"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
          <input
            type="url"
            className="p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary"
            placeholder="Image URL (Unsplash link)"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          />
          <textarea
            className="md:col-span-2 p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary h-24"
            placeholder="Description..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <button
            type="submit"
            disabled={isAdding}
            className="md:col-span-2 bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-hover transition disabled:opacity-50"
          >
            {isAdding ? 'Adding Event...' : 'Add School Event'}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-xl shadow-sm overflow-hidden group">
            <div className="h-40 relative">
              <img 
                src={event.image_url || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400'} 
                alt={event.title} 
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => deleteEvent(event.id)}
                className="absolute top-2 right-2 p-2 bg-white/90 text-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition shadow-sm"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-800 line-clamp-1">{event.title}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                <Calendar size={14} /> {new Date(event.event_date).toLocaleDateString()}
              </div>
              {event.location && (
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <MapPin size={14} /> {event.location}
                </div>
              )}
              <p className="text-sm text-gray-600 mt-3 line-clamp-2">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
