import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, MapPin } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Leadership', href: '/team' },
    { name: 'Academics', href: '/academics' },
    { name: 'Facilities', href: '/facilities' },
    { name: 'Admissions', href: '/admissions' },
    { name: 'Contact Us', href: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || location.pathname !== '/' ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
        }`}
    >
      {/* Top Bar (Hidden on mobile) */}
      <div className={`hidden md:flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-2 border-b border-gray-200/30 transition-all duration-300 ${isScrolled || location.pathname !== '/' ? 'h-0 overflow-hidden opacity-0 pb-0 border-none' : 'opacity-100'}`}>
        <div className="flex items-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center">
            <Mail className="w-4 h-4 mr-2 text-primary" />
            <a href="mailto:info@aspireuniversalinternational.com" className="hover:text-primary transition-colors">info@aspireuniversalinternational.com</a>
          </div>
          <div className="flex items-center">
            <Phone className="w-4 h-4 mr-2 text-primary" />
            <a href="tel:+919431867366" className="hover:text-primary transition-colors">+91 9431867366</a>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2 text-primary" />
          <span>Radha Krishana Colony Pakari, Patna, 800002</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Aspire Logo" className="w-12 h-12 rounded-full shadow-lg object-contain" />
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-xl leading-tight text-secondary">ASPIRE Universal</span>
                <span className="text-[10px] font-bold tracking-widest text-primary uppercase">International School</span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`font-semibold transition-colors ${location.pathname === link.href ? 'text-primary' : 'text-gray-700 hover:text-primary'
                  }`}
              >
                {link.name}
              </Link>
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-xl absolute top-full left-0 right-0 border-t border-gray-100">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`block px-3 py-3 text-base font-medium rounded-md ${location.pathname === link.href ? 'text-primary bg-primary/5' : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                  }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/admissions"
              className="block w-full text-center mt-4 bg-primary text-white px-6 py-3 rounded-full font-bold shadow-md"
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
