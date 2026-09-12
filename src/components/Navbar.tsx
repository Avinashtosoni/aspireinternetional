import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, MapPin, ChevronDown } from 'lucide-react';
import { useCMSStore } from '../store/cmsStore';
import NoticeTicker from './NoticeTicker';

export default function Navbar() {
  const { settings, fetchSettings } = useCMSStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeMobileSubmenu, setActiveMobileSubmenu] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    fetchSettings();
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navCategories = [
    { name: 'Home', href: '/' },
    { 
      name: 'About', 
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Principal Message', href: '/principal-message' },
        { name: 'Leadership Team', href: '/team' },
      ]
    },
    { 
      name: 'Academics', 
      links: [
        { name: 'Programs', href: '/academics' },
        { name: 'Facilities', href: '/facilities' },
      ]
    },
    { 
      name: 'Campus Life', 
      links: [
        { name: 'Events', href: '/events' },
        { name: 'News & Blogs', href: '/blogs' },
      ]
    },
    { name: 'Admissions', href: '/admissions' },
    { name: 'Online Admission', href: 'https://forms.gle/oXNPCNR6Zd2wTGZF8' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || location.pathname !== '/' ? 'bg-white shadow-xl' : 'bg-transparent'
      }`}
    >
      {/* 1. Top Contact Bar (Hidden on scroll) */}
      <div className={`hidden md:flex bg-gray-50/80 backdrop-blur-sm transition-all duration-500 origin-top overflow-hidden ${
        isScrolled || location.pathname !== '/' ? 'h-0 opacity-0' : 'h-10 opacity-100 border-b border-gray-200/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-between items-center text-[11px] font-bold text-gray-500 tracking-wider uppercase">
          <div className="flex items-center space-x-6">
            <div className="flex items-center gap-1.5 group">
              <Mail className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
              <a href={`mailto:${settings.school_email}`} className="hover:text-primary transition-colors">{settings.school_email}</a>
            </div>
            <div className="flex items-center gap-1.5 group">
              <Phone className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
              <a href={`tel:${settings.school_phone}`} className="hover:text-primary transition-colors">{settings.school_phone}</a>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span>{settings.school_address}</span>
          </div>
        </div>
      </div>

      {/* 2. Notice Ticker (Hidden on scroll) */}
      <div className={`transition-all duration-500 origin-top overflow-hidden ${
        isScrolled || location.pathname !== '/' ? 'h-0 opacity-0' : 'h-10 opacity-100'
      }`}>
        <NoticeTicker />
      </div>

      {/* 3. Main Navbar */}
      <div className={`transition-all duration-300 ${
        isScrolled || location.pathname !== '/' ? 'py-1' : 'py-3'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-3">
                <img src="/logo.png" alt="Aspire Logo" className="w-12 h-12 rounded-full shadow-lg object-contain bg-white p-0.5" />
                <div className="flex flex-col">
                  <span className={`font-heading font-extrabold text-xl leading-tight transition-colors ${
                    isScrolled || location.pathname !== '/' ? 'text-secondary' : 'text-secondary'
                  }`}>ASPIRE Universal</span>
                  <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase">International School</span>
                </div>
              </Link>
            </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-6 items-center">
            {navCategories.map((item) => (
              <div 
                key={item.name} 
                className="relative group py-2"
                onMouseEnter={() => item.links && setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.href ? (
                  <Link
                    to={item.href}
                    className={`font-bold transition-colors text-sm uppercase tracking-wide ${
                      location.pathname === item.href ? 'text-primary' : 'text-secondary hover:text-primary'
                    }`}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <button
                    className={`font-bold transition-colors text-sm uppercase tracking-wide flex items-center gap-1 ${
                      activeDropdown === item.name || item.links?.some(l => l.href === location.pathname) 
                      ? 'text-primary' 
                      : 'text-secondary hover:text-primary'
                    }`}
                  >
                    {item.name} 
                    <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === item.name ? 'rotate-180' : ''}`} />
                  </button>
                )}

                {/* Dropdown Menu */}
                {item.links && (
                  <div className={`absolute top-full left-0 w-52 bg-white rounded-xl shadow-2xl border border-gray-100 py-3 transition-all duration-200 origin-top ${
                    activeDropdown === item.name ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                  }`}>
                    {item.links.map((link) => (
                      <Link
                        key={link.name}
                        to={link.href}
                        className={`block px-6 py-2.5 text-sm font-semibold transition-colors ${
                          location.pathname === link.href ? 'text-primary bg-primary/5' : 'text-secondary hover:text-primary hover:bg-gray-50'
                        }`}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center">
            <Link
              to="/admissions"
              className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-full font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              Apply Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-primary focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-xl absolute top-full left-0 right-0 border-t border-gray-100 max-h-[80vh] overflow-y-auto">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navCategories.map((item) => (
              <div key={item.name} className="border-b border-gray-50 last:border-0">
                {item.href ? (
                  <Link
                    to={item.href}
                    className={`block px-3 py-4 text-base font-bold rounded-md ${
                      location.pathname === item.href ? 'text-primary bg-primary/5' : 'text-secondary hover:text-primary'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <div>
                    <button
                      onClick={() => setActiveMobileSubmenu(activeMobileSubmenu === item.name ? null : item.name)}
                      className={`w-full flex justify-between items-center px-3 py-4 text-base font-bold ${
                        activeMobileSubmenu === item.name || item.links?.some(l => l.href === location.pathname) 
                        ? 'text-primary' 
                        : 'text-secondary'
                      }`}
                    >
                      {item.name}
                      <ChevronDown size={18} className={`transition-transform duration-200 ${activeMobileSubmenu === item.name ? 'rotate-180' : ''}`} />
                    </button>
                    {activeMobileSubmenu === item.name && (
                      <div className="bg-gray-50/50 rounded-lg mb-2">
                        {item.links?.map((link) => (
                          <Link
                            key={link.name}
                            to={link.href}
                            className={`block px-8 py-3 text-sm font-semibold ${
                              location.pathname === link.href ? 'text-primary' : 'text-gray-600 hover:text-primary'
                            }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {link.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            <Link
              to="/admissions"
              className="block w-full text-center mt-6 bg-primary text-white px-6 py-4 rounded-full font-bold shadow-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Apply Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
