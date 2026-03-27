import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export default function WelcomeMessage() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Welcome to the Future of Education</h2>
            <p className="text-lg text-gray-600 mb-6">
              We are thrilled to announce the launch of Aspire Universal International School. Our brand new campus is designed to provide a safe, stimulating, and inclusive environment where students can discover their passions and reach their full potential.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              Opening our doors on April 1st, 2026, we blend traditional values with modern educational practices to prepare our students for the challenges of tomorrow. Join us in shaping the leaders, innovators, and compassionate citizens of the future.
            </p>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <Quote className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Mr. Deepak Kumar Vidyarthi</h4>
                <p className="text-gray-500">Director</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Principal with students"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-blue-600 rounded-2xl -z-10"></div>
            <div className="absolute -top-6 -right-6 w-48 h-48 bg-yellow-400 rounded-2xl -z-10"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
