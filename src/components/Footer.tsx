import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
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
          <h3 className="text-xl font-bold mb-4">Aspire Universal International School</h3>
          <p className="text-gray-400 mb-6">Nurturing young minds for a brighter tomorrow.</p>
          <div className="flex items-center gap-3">
            {settings.facebook_url && settings.facebook_url !== '#' && (
              <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center text-white transition-colors" title="Facebook">
                <Facebook size={18} />
              </a>
            )}
            {settings.instagram_url && settings.instagram_url !== '#' && (
              <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center text-white transition-colors" title="Instagram">
                <Instagram size={18} />
              </a>
            )}
            {settings.twitter_url && settings.twitter_url !== '#' && (
              <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center text-white transition-colors" title="Twitter/X">
                <Twitter size={18} />
              </a>
            )}
          </div>
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
            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link to="/principal-message" className="hover:text-white transition-colors">Principal's Message</Link></li>
            <li><Link to="/team" className="hover:text-white transition-colors">Leadership Team</Link></li>
            <li><Link to="/academics" className="hover:text-white transition-colors">Academics</Link></li>
            <li><Link to="/events" className="hover:text-white transition-colors">School Events</Link></li>
            <li><Link to="/blogs" className="hover:text-white transition-colors">News & Blogs</Link></li>
            <li><Link to="/admissions" className="hover:text-white transition-colors">Admissions</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
        <p>Developed and Designed by <a href="https://digitalcomrade.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Digital Comrade</a> &copy; {new Date().getFullYear()} Aspire Universal International School. All rights reserved.</p>
      </div>
    </footer>
  );
}
