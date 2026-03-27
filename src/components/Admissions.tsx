import React from 'react';
import { motion } from 'motion/react';
import { FileText, Users, PenTool, CheckCircle } from 'lucide-react';

export default function Admissions() {
  const steps = [
    { icon: <FileText className="w-6 h-6" />, title: "Fill Online Enquiry Form", desc: "Start by submitting your basic details online." },
    { icon: <Users className="w-6 h-6" />, title: "Campus Visit & Interaction", desc: "Meet our counselors and tour the campus." },
    { icon: <PenTool className="w-6 h-6" />, title: "Written Assessment", desc: "For Class I onwards to understand the child's level." },
    { icon: <CheckCircle className="w-6 h-6" />, title: "Final Admission Offer", desc: "Complete documentation and fee payment." }
  ];

  return (
    <section id="admissions" className="py-20 bg-accent/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-5">
            
            {/* Left Side - Info */}
            <div className="lg:col-span-2 bg-primary p-12 text-white flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-black opacity-10 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
              
              <div className="relative z-10">
                <h2 className="text-4xl font-heading font-bold mb-4">Admissions Open</h2>
                <p className="text-xl font-semibold text-primary-100 mb-8">For Session 2026-27</p>
                
                <div className="mb-8">
                  <h3 className="text-lg font-bold uppercase tracking-wider mb-3 text-white/80">Classes Offered</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Nursery', 'LKG', 'UKG', 'I to IX', 'XI'].map(cls => (
                      <span key={cls} className="bg-white/20 px-4 py-2 rounded-lg font-semibold backdrop-blur-sm">
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pt-8 border-t border-white/20">
                  <p className="text-sm text-white/80 mb-2">Need help?</p>
                  <p className="text-2xl font-bold">+91 9431867366</p>
                </div>
              </div>
            </div>

            {/* Right Side - Process */}
            <div className="lg:col-span-3 p-12 lg:p-16">
              <h3 className="text-3xl font-heading font-bold text-gray-900 mb-10">Admission Process</h3>
              
              <div className="space-y-8">
                {steps.map((step, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-6"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-accent/20 text-accent flex items-center justify-center flex-shrink-0 z-10">
                        {step.icon}
                      </div>
                      {index !== steps.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 my-2"></div>
                      )}
                    </div>
                    <div className="pb-8">
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h4>
                      <p className="text-gray-600">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8">
                <button className="bg-secondary hover:bg-secondary-hover text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all w-full sm:w-auto">
                  Enquire Now
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
