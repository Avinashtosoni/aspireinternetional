import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Mail, Twitter } from 'lucide-react';
import { useCMSStore, TeamMember, DEFAULT_TEAM_MEMBERS } from '../store/cmsStore';

export default function Team() {
  const { team, fetchTeam } = useCMSStore();

  useEffect(() => {
    fetchTeam();
  }, []);

  const displayMembers = team && team.length > 0 ? team : DEFAULT_TEAM_MEMBERS;

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Meet Our Leaders</h2>
          <p className="mt-4 text-lg text-gray-600">The visionaries shaping the future of education.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {displayMembers.map((member: TeamMember, index: number) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group bg-white rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
            >
              <div className="relative overflow-hidden rounded-2xl mb-6 aspect-[3/4] shadow-md bg-gray-100">
                <img
                  src={member.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=1e3a8a&color=fff&size=512`}
                  alt={member.name}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=1e3a8a&color=fff&size=512`;
                  }}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 space-x-4">
                  <a href="#" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-yellow-400 hover:text-blue-900 transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-yellow-400 hover:text-blue-900 transition-colors">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a href="#" aria-label="Mail" className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-yellow-400 hover:text-blue-900 transition-colors">
                    <Mail className="w-5 h-5" />
                  </a>
                </div>
              </div>
              <div className="text-center px-2 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
