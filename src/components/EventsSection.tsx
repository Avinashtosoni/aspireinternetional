import React, { useEffect } from 'react';
import { useCMSStore } from '../store/cmsStore';
import { Calendar, ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EventsSection() {
  const { events, fetchEvents } = useCMSStore();

  useEffect(() => {
    fetchEvents();
  }, []);

  const latestEvents = events.slice(0, 3);

  if (latestEvents.length === 0) return null;

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-3">Calendar</h2>
            <h3 className="text-4xl font-heading font-extrabold text-secondary">Upcoming Events</h3>
          </div>
          <Link to="/events" className="hidden md:flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
            View All Events <ArrowRight size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-lg hover:shadow-xl transition-shadow group">
              <div className="h-48 overflow-hidden relative">
                <img src={event.image_url || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400'} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-primary font-bold text-xs flex items-center gap-1 shadow-sm">
                  <Calendar size={14} /> {new Date(event.event_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-bold text-slate-800 mb-2 line-clamp-1">{event.title}</h4>
                <p className="text-slate-500 text-sm line-clamp-2 mb-4">{event.description}</p>
                <Link to="/events" className="text-primary text-xs font-bold uppercase tracking-wider hover:underline flex items-center gap-1">
                  Learn More <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
