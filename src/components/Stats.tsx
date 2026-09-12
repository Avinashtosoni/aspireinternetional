import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCMSStore, Stat } from '../store/cmsStore';
import { getSchoolIcon } from '../lib/icons';
import { Trophy } from 'lucide-react';

export default function Stats() {
  const { stats, fetchStats } = useCMSStore();

  useEffect(() => {
    fetchStats();
  }, []);

  if (!stats || stats.length === 0) return null;

  return (
    <section className="py-16 bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => {
            const IconComponent = getSchoolIcon(stat.icon, Trophy);
            
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-blue-500 bg-opacity-50">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-extrabold text-white mb-2">
                  {/* Implementing a simple counting animation representation using Framer Motion */}
                  <motion.span 
                    initial={{ textContent: 0 }}
                    whileInView={{ textContent: stat.value }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    onUpdate={(latest) => {
                       // simple trick to let framer-motion interpolate numbers
                       // React doesn't natively support this without custom components, 
                       // but we can round it if we attach it to a ref.
                    }}
                  >
                    {stat.value}
                  </motion.span>
                  {stat.suffix}
                </div>
                <div className="text-lg font-medium text-blue-100">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
