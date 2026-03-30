import React, { useEffect } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useCMSStore } from '../store/cmsStore';

export default function Footer() {
  const { settings, fetchSettings } = useCMSStore();
  
  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">Aspire International School</h3>
          <p className="text-gray-400">Nurturing young minds for a brighter tomorrow.</p>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Contact</h3>
          <div className="space-y-4 text-gray-400">
            <p className="flex items-center gap-3"><Phone size={18} className="text-primary flex-shrink-0" /> {settings.school_phone}</p>
            <p className="flex items-center gap-3"><Mail size={18} className="text-primary flex-shrink-0" /> {settings.school_email}</p>
            <p className="flex items-start gap-3"><MapPin size={18} className="text-primary flex-shrink-0 mt-1" /> {settings.school_address}</p>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="/principal-message" className="hover:text-white transition-colors">Principal's Message</a></li>
            <li><a href="/team" className="hover:text-white transition-colors">Leadership Team</a></li>
            <li><a href="/academics" className="hover:text-white transition-colors">Academics</a></li>
            <li><a href="/events" className="hover:text-white transition-colors">School Events</a></li>
            <li><a href="/blogs" className="hover:text-white transition-colors">News & Blogs</a></li>
            <li><a href="/admissions" className="hover:text-white transition-colors">Admissions</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
        <p>Developed and Designed by <a href="https://digitalcomrade.in">Digital Comrade</a> &copy; {new Date().getFullYear()} Aspire International School. All rights reserved.</p>
      </div>
    </footer>
  );
}
