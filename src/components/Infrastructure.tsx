import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCMSStore, Facility } from '../store/cmsStore';
import { getSchoolIcon } from '../lib/icons';
import { Building } from 'lucide-react';

export default function Infrastructure() {
  const { facilities, fetchFacilities } = useCMSStore();

  useEffect(() => {
    fetchFacilities();
  }, []);

  return (
    <section id="infrastructure" className="py-20 bg-gray-900 text-white relative overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-500 mix-blend-screen filter blur-[100px]"></div>
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-indigo-500 mix-blend-screen filter blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-yellow-400 font-bold tracking-wider uppercase text-sm mb-2 block">Infrastructure & Facilities</span>
          <h2 className="text-4xl font-heading font-bold mb-6">
            A Campus That Inspires
          </h2>
          <p className="text-gray-300 text-lg">
            Our state-of-the-art facilities provide the perfect environment for holistic development, ensuring every child has the resources they need to excel.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {facilities.map((facility: Facility, index: number) => {
            const IconComponent = getSchoolIcon(facility.icon, Building);
            return (
              <motion.div
                key={facility.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center hover:bg-white/20 transition-colors group"
              >
                <div className="w-14 h-14 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-4 text-yellow-400 group-hover:scale-110 transition-transform">
                  <IconComponent className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-gray-100 mb-2">{facility.title}</h3>
                {facility.description && <p className="text-xs text-gray-400">{facility.description}</p>}
              </motion.div>
            );
          })}
          {facilities.length === 0 && (
            <div className="col-span-4 text-center text-gray-400 py-12">
              <Building className="w-12 h-12 mx-auto text-gray-500 mb-3" />
              <p className="text-lg font-medium text-gray-300">Modern Facilities & Labs</p>
              <p className="text-sm text-gray-400 mt-1">Our comprehensive campus facilities will be updated shortly.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
