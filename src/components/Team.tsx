import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Mail, Twitter } from 'lucide-react';

const team = [
  {
    name: 'Reema Raj',
    role: ' HEAD OF DEPARTMENT',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    bio: 'A visionary leader with over 20 years of experience in educational excellence, dedicated to transforming the educational landscape in Bihar.'
  },
  {
    name: 'Deepak Kumar Vidyarthi',
    role: 'Co-Founder & Director',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    bio: 'Passionate about holistic child development and integrating modern technology with traditional values.'
  },
  {
    name: 'Uday Kumar',
    role: 'Managing Director',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    bio: 'Committed to providing a safe, stimulating, and inclusive environment where students can discover their passions.'
  },
  {
    name: 'RK Raman',
    role: 'CHAIRMAN',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    bio: 'An experienced educator with a track record of leading top schools and fostering academic excellence.'
  },
  {
    name: 'PK Pradhan',
    role: 'PRINCIPAL',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    bio: 'Specializes in school operations, ensuring a seamless and enriching experience for students and parents alike.'
  },
  {
    name: 'RAKESH KUMAR RANJAN',
    role: 'ADMINISTRATIVE',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    bio: 'An experienced educator with a track record of leading top schools and fostering academic excellence.'
  },
  {
    name: 'CHANDAN KUMAR',
    role: 'CULTURAL COORDINATOR',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    bio: 'An experienced educator with a track record of leading top schools and fostering academic excellence.'
  },
];

export default function Team() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Meet Our Leaders</h2>
          <p className="mt-4 text-lg text-gray-600">The visionaries shaping the future of education.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-2xl mb-6 aspect-[3/4] shadow-lg">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 space-x-4">
                  <a href="#" className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-yellow-400 hover:text-blue-900 transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-yellow-400 hover:text-blue-900 transition-colors">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-yellow-400 hover:text-blue-900 transition-colors">
                    <Mail className="w-5 h-5" />
                  </a>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
