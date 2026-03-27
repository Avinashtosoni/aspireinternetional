import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

export default function WhyChooseUs() {
  const reasons = [
    "World-class infrastructure with smart classrooms & AC campus",
    "Highly qualified & experienced faculty (many from top CBSE schools)",
    "Focus on 21st century skills: Critical Thinking, Communication, Collaboration, Creativity",
    "Safe & secure environment with 24×7 CCTV & GPS-enabled transport",
    "Excellent student-teacher ratio (1:15)",
    "Holistic development through sports, arts, music, dance & theatre",
    "Regular parent-teacher interaction & progress tracking app"
  ];

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Image Composition */}
            <div className="relative z-10 rounded-[2rem] overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Teacher and students" 
                className="w-full h-auto object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute top-10 -left-10 w-full h-full border-4 border-primary rounded-[2rem] -z-10"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent rounded-full -z-20 opacity-50"></div>
            
            <div className="absolute top-1/2 -right-12 transform -translate-y-1/2 bg-white p-6 rounded-2xl shadow-xl z-20 hidden md:block">
              <div className="text-center">
                <p className="text-4xl font-heading font-extrabold text-secondary">1:15</p>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mt-1">Student-Teacher<br/>Ratio</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Why Us</span>
            <h2 className="text-4xl font-heading font-bold text-gray-900 mb-8">
              Why Parents Trust Aspire Universal
            </h2>
            
            <div className="space-y-5">
              {reasons.map((reason, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-gray-700 text-lg">{reason}</p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
