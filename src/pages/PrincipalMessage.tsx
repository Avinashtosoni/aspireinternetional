import React from 'react';
import { useCMSStore } from '../store/cmsStore';
import { Quote } from 'lucide-react';

export default function PrincipalMessage() {
  const { settings } = useCMSStore();

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-primary text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-6">Principal's Message</h1>
          <p className="text-lg opacity-90 leading-relaxed max-w-2xl mx-auto italic">
            "Education is not the learning of facts, but the training of the mind to think."
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 mb-20">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 overflow-hidden flex flex-col md:flex-row gap-12 items-start">
          <div className="w-full md:w-1/3 flex-shrink-0">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=800&fit=crop" 
                alt={settings.principal_name} 
                className="relative rounded-xl w-full h-[500px] object-cover shadow-lg"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-gray-800">{settings.principal_name}</h3>
                <p className="text-sm text-primary font-bold tracking-wider">Educationist & Visionary</p>
              </div>
            </div>
          </div>

          <div className="w-full md:w-2/3 space-y-8">
            <div className="relative">
              <Quote className="absolute -top-6 -left-6 w-16 h-16 text-primary/10" />
              <div className="relative z-10">
                <h2 className="text-3xl font-heading font-bold text-secondary mb-6 flex items-center gap-4">
                  Warm Welcome to Aspire
                  <div className="h-1 flex-1 bg-primary/20 rounded-full"></div>
                </h2>
                <div className="prose prose-lg text-gray-600 space-y-6 max-w-none leading-relaxed">
                  <p className="font-medium text-gray-800 text-xl italic border-l-4 border-primary pl-6 py-2">
                    {settings.principal_message}
                  </p>
                  <p>
                    At Aspire Universal International School, we believe that every child is unique and has the potential to achieve great things. Our goal is to provide a platform where they can discover their talents, explore their interests, and develop their personality.
                  </p>
                  <p>
                    We focus on holistic education that combines academic excellence with character building, sports, and creative arts. Our dedicated faculty works tirelessly to ensure that our students receive the best possible guidance and support.
                  </p>
                  <p>
                    In today's rapidly changing world, we aim to equip our students with critical thinking skills, a global mindset, and strong values that will serve them throughout their lives. We invite you to join us on this journey of learning and discovery.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100 italic font-semibold text-gray-500">
              — {settings.principal_name}, Principal
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
