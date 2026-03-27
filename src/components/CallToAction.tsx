import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CallToAction() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-blue-900 rounded-3xl overflow-hidden shadow-2xl relative"
        >
          <div className="absolute inset-0 opacity-20">
            <img 
              src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
              alt="Students background" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="relative px-8 py-16 md:py-20 lg:px-16 flex flex-col items-center text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Be Part of Our Founding Batch!
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl">
              Admissions are now open for our inaugural academic year 2026-2027. Join the Aspire Universal community and give your child the best start in life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/admissions" 
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-full text-blue-900 bg-yellow-400 hover:bg-yellow-300 transition-colors"
              >
                Apply Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link 
                to="/about" 
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-full text-white border-2 border-white hover:bg-white hover:text-blue-900 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
