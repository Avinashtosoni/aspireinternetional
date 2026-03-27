import React from 'react';
import { motion } from 'motion/react';
import { Heart, BookOpen, Globe2 } from 'lucide-react';

export default function About() {
  const highlights = [
    {
      icon: <Heart className="w-8 h-8 text-white" />,
      title: "Holistic Development",
      desc: "Academic excellence with equal focus on sports, arts & life skills.",
      color: "bg-primary"
    },
    {
      icon: <BookOpen className="w-8 h-8 text-white" />,
      title: "CBSE Affiliated",
      desc: "From Nursery to Class XII (Affiliation process in progress).",
      color: "bg-secondary"
    },
    {
      icon: <Globe2 className="w-8 h-8 text-white" />,
      title: "International Outlook",
      desc: "Global exposure through exchange programs, technology & modern pedagogy.",
      color: "bg-accent"
    }
  ];

  return (
    <section id="about" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">About Us</span>
            <h2 className="text-4xl font-heading font-bold text-gray-900 mb-6">
              Welcome to Aspire Universal International School
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              Aspire Universal International School, Patna is a forward-thinking CBSE-affiliated institution dedicated to redefining education in Bihar. Established with a vision to blend Indian values with international standards, we provide a world-class learning environment that inspires every child to dream big and achieve more.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              Located in the heart of Patna, our state-of-the-art campus offers a perfect balance of academic rigor, creativity, and character building. We follow the latest CBSE curriculum while incorporating global best practices to prepare students for success in the 21st century.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {highlights.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden group"
            >
              <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg transform group-hover:rotate-6 transition-transform`}>
                {item.icon}
              </div>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              
              {/* Decorative corner shape */}
              <div className={`absolute -bottom-10 -right-10 w-32 h-32 ${item.color} opacity-5 rounded-full group-hover:scale-150 transition-transform duration-500`}></div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
