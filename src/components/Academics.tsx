import React from 'react';
import { motion } from 'motion/react';
import { Palette, Calculator, Microscope, Code, Globe, Lightbulb, Trophy } from 'lucide-react';

export default function Academics() {
  const levels = [
    {
      title: "Pre-Primary",
      subtitle: "(Nursery to KG)",
      desc: "Play-way method, phonics, motor skills & joyful learning.",
      color: "bg-pink-100 text-pink-600 border-pink-200",
      icon: <Palette className="w-6 h-6" />
    },
    {
      title: "Primary",
      subtitle: "(Class I–V)",
      desc: "Strong foundation in English, Math, Science & EVS.",
      color: "bg-blue-100 text-blue-600 border-blue-200",
      icon: <Calculator className="w-6 h-6" />
    },
    {
      title: "Middle",
      subtitle: "(Class VI–VIII)",
      desc: "Project-based learning & skill development.",
      color: "bg-green-100 text-green-600 border-green-200",
      icon: <Microscope className="w-6 h-6" />
    },
    {
      title: "Secondary & Senior",
      subtitle: "(IX–XII)",
      desc: "Science, Commerce & Humanities streams with NEP 2020 integration.",
      color: "bg-purple-100 text-purple-600 border-purple-200",
      icon: <Trophy className="w-6 h-6" />
    }
  ];

  const specialPrograms = [
    { name: "STEM Lab | Robotics | AI & Coding", icon: <Code className="w-5 h-5" /> },
    { name: "Foreign Language (French/Spanish)", icon: <Globe className="w-5 h-5" /> },
    { name: "Life Skills & Value Education", icon: <Lightbulb className="w-5 h-5" /> },
    { name: "Career Counselling & Olympiad", icon: <Trophy className="w-5 h-5" /> }
  ];

  return (
    <section id="academics" className="py-20 bg-[#F8FAFC] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-secondary font-bold tracking-wider uppercase text-sm mb-2 block">CBSE Pattern</span>
          <h2 className="text-4xl font-heading font-bold text-gray-900 mb-6">
            Academic Excellence at Aspire
          </h2>
          <p className="text-gray-600 text-lg">
            We follow the Central Board of Secondary Education (CBSE) curriculum with a modern, experiential learning approach.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {levels.map((level, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`bg-white rounded-3xl p-6 border-2 ${level.color.split(' ')[2]} shadow-sm hover:shadow-xl transition-all`}
            >
              <div className={`w-12 h-12 rounded-full ${level.color.split(' ')[0]} ${level.color.split(' ')[1]} flex items-center justify-center mb-4`}>
                {level.icon}
              </div>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-1">{level.title}</h3>
              <p className="text-sm font-semibold text-gray-500 mb-3">{level.subtitle}</p>
              <p className="text-gray-600">{level.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-gray-100">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-heading font-bold text-gray-900 mb-6">Special Programs</h3>
              <p className="text-gray-600 mb-8">
                Beyond traditional academics, we equip our students with future-ready skills to thrive in a rapidly evolving world.
              </p>
              <div className="space-y-4">
                {specialPrograms.map((prog, i) => (
                  <div key={i} className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-primary">
                      {prog.icon}
                    </div>
                    <span className="font-semibold text-gray-800">{prog.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Students in lab" 
                className="rounded-3xl shadow-lg object-cover aspect-square"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-accent rounded-full -z-10"></div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-secondary opacity-20 rounded-full -z-10"></div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
