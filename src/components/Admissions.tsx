import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Users, PenTool, CheckCircle } from 'lucide-react';
import { useCMSStore } from '../store/cmsStore';

export default function Admissions() {
  const { addEnquiry } = useCMSStore();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const steps = [
    { icon: <FileText className="w-6 h-6" />, title: "Fill Online Enquiry Form", desc: "Start by submitting your basic details online." },
    { icon: <Users className="w-6 h-6" />, title: "Campus Visit & Interaction", desc: "Meet our counselors and tour the campus." },
    { icon: <PenTool className="w-6 h-6" />, title: "Written Assessment", desc: "For Class I onwards to understand the child's level." },
    { icon: <CheckCircle className="w-6 h-6" />, title: "Final Admission Offer", desc: "Complete documentation and fee payment." }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Save to Supabase
    const success = await addEnquiry(formData);

    // 2. Send Email via Web3Forms
    try {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: "51c5040d-d42f-4137-969c-0c33a9486c91",
          ...formData,
          subject: "New Admissions Enquiry",
          from_name: "Aspire School Admissions"
        })
      });
    } catch (err) {
      console.error("Web3Forms Error:", err);
    }

    if (success) {
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }
    setLoading(false);
  };

  return (
    <section id="admissions" className="py-20 bg-accent/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-5">
            
            {/* Left Side - Info */}
            <div className="lg:col-span-2 bg-blue-900 p-12 text-white flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-black opacity-10 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
              
              <div className="relative z-10">
                <h2 className="text-4xl font-heading font-bold mb-4">Admissions Open</h2>
                <p className="text-xl font-semibold text-blue-100 mb-8">For Session 2026-27</p>
                
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

            {/* Right Side - Process and Form */}
            <div className="lg:col-span-3 p-12 lg:p-16">
              <h3 className="text-3xl font-heading font-bold text-gray-900 mb-10">Admission Process & Enquiry</h3>
              
              <div className="space-y-8 mb-12">
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
                      <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 z-10">
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

              <div className="bg-gray-50 p-8 rounded-2xl">
                <h4 className="text-xl font-bold text-gray-900 mb-4">Submit an Enquiry</h4>
                {submitted ? (
                  <div className="bg-green-100 text-green-700 p-4 rounded-lg font-medium">
                    Thank you! Your enquiry has been submitted successfully to the administration.
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input required type="text" placeholder="Parent/Student Name" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                      <input required type="tel" placeholder="Phone Number" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                    </div>
                    <input type="email" placeholder="Email Address (Optional)" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    <textarea required placeholder="Your Message or Query" rows={3} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
                    <button type="submit" disabled={loading} className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all disabled:opacity-50">
                      {loading ? 'Submitting...' : 'Enquire Now'}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
