import React from 'react';
import { motion } from 'framer-motion';
import Team from '../components/Team';

export default function TeamPage() {
  return (
    <div className="pt-24 md:pt-32">
      {/* Premium Hero Section for Team */}
      <section className="relative py-24 bg-blue-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1577415124269-b9140d4288f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Leadership background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 to-blue-900"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
              Our <span className="text-yellow-400">Leadership</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Meet the visionaries and dedicated professionals behind Aspire Universal International School. Our team is committed to shaping the future of education.
            </p>
          </motion.div>
        </div>
      </section>

      <Team />
    </div>
  );
}
