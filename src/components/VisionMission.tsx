import React from 'react';
import { motion } from 'motion/react';
import { Eye, Target, Star } from 'lucide-react';

export default function VisionMission() {
  return (
    <section className="py-20 bg-secondary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Vision */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-10 border border-white/20 text-white"
          >
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <Eye className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-3xl font-heading font-bold mb-4">Our Vision</h2>
            <p className="text-lg text-white/90 leading-relaxed">
              To become Patna's most respected international school by creating confident, compassionate and competent global citizens.
            </p>
          </motion.div>

          {/* Mission */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-10 shadow-2xl"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-6">Our Mission</h2>
            <ul className="space-y-4">
              {[
                "To provide child-centric, value-based education",
                "To foster curiosity, critical thinking and creativity",
                "To prepare students for leadership in a rapidly changing world"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-accent"></div>
                  </div>
                  <span className="text-gray-700 text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

        </div>

        {/* Core Values */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-heading font-bold text-white mb-8 flex items-center justify-center gap-2">
            <Star className="text-accent w-6 h-6" /> Core Values <Star className="text-accent w-6 h-6" />
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {['Aspiration', 'Integrity', 'Respect', 'Excellence', 'Universal Brotherhood'].map((value, i) => (
              <span 
                key={i}
                className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white font-semibold tracking-wide hover:bg-white hover:text-secondary transition-colors cursor-default"
              >
                {value}
              </span>
            ))}
          </div>
        </motion.div>

      </div>
      
      {/* Top/Bottom wavy dividers if needed, or keep it clean */}
    </section>
  );
}
