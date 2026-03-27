import React from 'react';
import { motion } from 'framer-motion';
import { Map, Monitor, Trophy, Users } from 'lucide-react';

const stats = [
  { id: 1, name: 'Acres of Green Campus', value: '10+', icon: Map },
  { id: 2, name: 'Smart Classrooms', value: '50+', icon: Monitor },
  { id: 3, name: 'Sports Facilities', value: '20+', icon: Trophy },
  { id: 4, name: 'Student-Teacher Ratio', value: '15:1', icon: Users },
];

export default function Stats() {
  return (
    <section className="py-16 bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
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
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-extrabold text-white mb-2">{stat.value}</div>
                <div className="text-lg font-medium text-blue-100">{stat.name}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
