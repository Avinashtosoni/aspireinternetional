import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { useCMSStore } from '../store/cmsStore';

export default function WelcomeMessage() {
  const { settings, fetchSettings } = useCMSStore();

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-heading">
              {settings.welcome_title || 'Welcome to Aspire School'}
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              {settings.welcome_message_1}
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {settings.welcome_message_2}
            </p>
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary transform rotate-6 border border-primary/20">
                <Quote className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-xl tracking-tight">
                  {settings.director_name || 'Mr. Deepak Kumar Vidyarthi'}
                </h4>
                <p className="text-primary font-semibold uppercase text-xs tracking-widest mt-1">
                  Director's Message
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-w-4 aspect-h-3 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-8 border-white">
              <img
                src={settings.director_image_url || "https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"}
                alt="Director Message"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Decorative Elements */}
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-primary/10 rounded-3xl -z-10 animate-pulse"></div>
            <div className="absolute -top-8 -right-8 w-40 h-40 bg-secondary/10 rounded-3xl -z-10 animate-transition-bounce"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
