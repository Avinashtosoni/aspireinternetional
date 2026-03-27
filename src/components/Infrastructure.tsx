import React from 'react';
import { motion } from 'motion/react';
import { MonitorPlay, FlaskConical, Library, Dumbbell, Music, Utensils, HeartPulse, TreePine } from 'lucide-react';

export default function Infrastructure() {
  const facilities = [
    { icon: <TreePine />, name: "Spacious, green & eco-friendly campus" },
    { icon: <MonitorPlay />, name: "Smart Classrooms with digital boards" },
    { icon: <FlaskConical />, name: "Advanced Science, Math & Computer Labs" },
    { icon: <Library />, name: "Fully equipped Library & Reading Lounge" },
    { icon: <Dumbbell />, name: "Indoor & Outdoor Sports Arena" },
    { icon: <Music />, name: "Activity Rooms for Music, Dance, Art" },
    { icon: <Utensils />, name: "Cafeteria with hygienic food" },
    { icon: <HeartPulse />, name: "Medical Room with full-time nurse" }
  ];

  return (
    <section id="infrastructure" className="py-20 bg-gray-900 text-white relative overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary mix-blend-screen filter blur-[100px]"></div>
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-secondary mix-blend-screen filter blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-accent font-bold tracking-wider uppercase text-sm mb-2 block">Infrastructure & Facilities</span>
          <h2 className="text-4xl font-heading font-bold mb-6">
            A Campus That Inspires
          </h2>
          <p className="text-gray-300 text-lg">
            Our state-of-the-art facilities provide the perfect environment for holistic development, ensuring every child has the resources they need to excel.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {facilities.map((facility, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center hover:bg-white/20 transition-colors group"
            >
              <div className="w-14 h-14 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-4 text-accent group-hover:scale-110 transition-transform">
                {React.cloneElement(facility.icon as React.ReactElement, { className: 'w-7 h-7' })}
              </div>
              <h3 className="font-semibold text-gray-100">{facility.name}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
