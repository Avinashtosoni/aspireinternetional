import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, PlayCircle } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-[#FDF8F5]">
      {/* Decorative Background Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-accent rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-40 right-10 w-32 h-32 bg-secondary rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-40 w-24 h-24 bg-primary rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-gray-100 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-sm font-semibold text-gray-600">Grand Opening: 1st April 2026</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-heading font-extrabold text-gray-900 leading-tight mb-6">
              A New Era of <br/>
              <span className="text-primary">Learning</span> <br/>
              Begins <span className="text-secondary">Here</span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Welcome to Aspire Universal International School, a brand new, forward-thinking CBSE-affiliated institution dedicated to redefining education in Bihar. Be part of our founding batch!
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <Link 
                to="/admissions" 
                className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-primary/30 transition-all transform hover:-translate-y-1 flex items-center gap-2"
              >
                Admission Open <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/about" 
                className="bg-white hover:bg-gray-50 text-gray-800 px-8 py-4 rounded-full font-bold text-lg shadow-md border border-gray-100 transition-all flex items-center gap-2"
              >
                <PlayCircle className="w-6 h-6 text-secondary" /> Discover More
              </Link>
            </div>
          </motion.div>

          {/* Image/Visual Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Happy students learning" 
                className="w-full h-auto object-cover aspect-[4/3]"
                referrerPolicy="no-referrer"
              />
              
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-bold text-xl">
                  A+
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase">CBSE Pattern</p>
                  <p className="font-heading font-bold text-gray-900">Excellence</p>
                </div>
              </div>
            </div>
            
            {/* Decorative SVG */}
            <svg className="absolute -top-10 -right-10 w-32 h-32 text-accent opacity-50" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 0L54.5 35.5L90 40L54.5 44.5L50 80L45.5 44.5L10 40L45.5 35.5L50 0Z" />
            </svg>
          </motion.div>
          
        </div>
      </div>
      
      {/* Bottom Wavy Divider */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none">
        <svg className="relative block w-full h-[50px] md:h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,112.2,198.71,96.54,240.76,86.8,281.73,71.5,321.39,56.44Z" fill="#ffffff"></path>
        </svg>
      </div>
    </section>
  );
}
