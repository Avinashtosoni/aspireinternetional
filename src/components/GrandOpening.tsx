import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Sparkles } from 'lucide-react';

export default function GrandOpening() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-900 to-blue-800 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center p-3 bg-yellow-400 rounded-full mb-6"
          >
            <Sparkles className="w-8 h-8 text-blue-900" />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-white mb-6"
          >
            You're Invited to Our <span className="text-yellow-400">Grand Opening</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-blue-100 max-w-2xl mx-auto"
          >
            Join us as we open the doors to a new era of excellence in education. Experience our state-of-the-art campus and meet our visionary educators.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20"
          >
            <Calendar className="w-10 h-10 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Date</h3>
            <p className="text-blue-100">Wednesday<br/>1st April 2026</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20"
          >
            <Clock className="w-10 h-10 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Time</h3>
            <p className="text-blue-100">10:00 AM onwards<br/>Campus Tour & Ceremony</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20"
          >
            <MapPin className="w-10 h-10 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Location</h3>
            <p className="text-blue-100">Aspire Universal Campus<br/>Bihar, India</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
