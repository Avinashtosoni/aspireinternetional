import React, { useEffect } from 'react';
import { useCMSStore } from '../store/cmsStore';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';

export default function EventsPage() {
  const { events, fetchEvents } = useCMSStore();

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-primary text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-4">School Events</h1>
          <p className="text-lg opacity-90">Discover what's happening at Aspire International School.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="space-y-12">
          {events.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
                <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
                <h2 className="text-2xl font-bold text-slate-800">No Events Scheduled</h2>
                <p className="text-slate-500 mt-2">Check back later for upcoming functions and activities.</p>
            </div>
          )}
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-3xl overflow-hidden shadow-xl flex flex-col lg:flex-row hover:shadow-2xl transition-shadow group">
              <div className="lg:w-1/3 h-64 lg:h-auto overflow-hidden">
                <img 
                  src={event.image_url || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800'} 
                  alt={event.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-8 lg:p-12 flex-1 flex flex-col justify-center">
                <div className="flex flex-wrap gap-6 text-sm font-bold text-primary mb-6 uppercase tracking-widest">
                  <span className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                    <Calendar size={18} /> {new Date(event.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                  {event.location && (
                    <span className="flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full">
                      <MapPin size={18} /> {event.location}
                    </span>
                  )}
                </div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">{event.title}</h2>
                <p className="text-slate-600 text-lg leading-relaxed mb-8">{event.description}</p>
                <div className="flex gap-4">
                    <button className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-full font-bold shadow-lg transition-all transform hover:-translate-y-1">
                        Remind Me
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
