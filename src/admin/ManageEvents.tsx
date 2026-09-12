import React, { useEffect, useState } from 'react';
import { useCMSStore, SchoolEvent } from '../store/cmsStore';
import { Plus, Trash2, Calendar, MapPin, Pencil, X } from 'lucide-react';

export default function ManageEvents() {
  const { events, fetchEvents, addEvent, updateEvent, deleteEvent, isLoading } = useCMSStore();
  const [formData, setFormData] = useState({ title: '', description: '', event_date: '', location: '', image_url: '' });
  const [editingEvent, setEditingEvent] = useState<SchoolEvent | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent || !editingEvent.title || !editingEvent.event_date) return;
    setIsSavingEdit(true);
    const ok = await updateEvent(editingEvent.id, {
      title: editingEvent.title,
      description: editingEvent.description,
      event_date: editingEvent.event_date,
      location: editingEvent.location,
      image_url: editingEvent.image_url,
    });
    if (ok) {
      setEditingEvent(null);
    }
    setIsSavingEdit(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      await deleteEvent(id);
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
            className="md:col-span-2 bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-hover transition disabled:opacity-50 cursor-pointer"
          >
            {isAdding ? 'Adding Event...' : 'Add School Event'}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-xl shadow-sm overflow-hidden group border border-gray-100">
            <div className="h-40 relative">
              <img 
                src={event.image_url || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400'} 
                alt={event.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => setEditingEvent(event)}
                  className="p-2 bg-white/95 text-indigo-600 rounded-lg shadow-sm hover:bg-white transition cursor-pointer"
                  title="Edit Event"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="p-2 bg-white/95 text-red-600 rounded-lg shadow-sm hover:bg-white transition cursor-pointer"
                  title="Delete Event"
                >
                  <Trash2 size={16} />
                </button>
              </div>
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
        {events.length === 0 && (
          <div className="col-span-3 text-center py-12 text-gray-400 bg-white rounded-xl border border-gray-100">
            No events scheduled yet. Add one above.
          </div>
        )}
      </div>

      {/* Edit Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-4">
              <h3 className="text-lg font-bold text-gray-900">Edit School Event</h3>
              <button onClick={() => setEditingEvent(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Title</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary"
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Event Date</label>
                <input
                  type="date"
                  className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary"
                  value={editingEvent.event_date}
                  onChange={(e) => setEditingEvent({ ...editingEvent, event_date: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Location</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary"
                  value={editingEvent.location || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Image URL</label>
                <input
                  type="url"
                  className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary"
                  value={editingEvent.image_url || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, image_url: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                <textarea
                  className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary h-28"
                  value={editingEvent.description || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-5 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-100 font-medium text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-hover font-bold text-white transition disabled:opacity-50"
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
