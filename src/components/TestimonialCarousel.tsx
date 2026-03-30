import React, { useEffect, useState } from 'react';
import { useCMSStore } from '../store/cmsStore';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function TestimonialCarousel() {
  const { testimonials, fetchTestimonials } = useCMSStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (testimonials.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-3">Testimonials</h2>
          <h3 className="text-4xl md:text-5xl font-heading font-extrabold text-secondary">What Parents Say</h3>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-slate-50 rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 flex flex-col items-center text-center"
            >
              <div className="bg-primary/10 p-4 rounded-full mb-8">
                <Quote size={32} className="text-primary" />
              </div>
              
              <div className="flex gap-1 text-yellow-400 mb-6">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
              </div>

              <p className="text-xl md:text-2xl text-slate-700 leading-relaxed italic mb-10">
                "{testimonials[currentIndex].content}"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-md">
                  <img 
                    src={testimonials[currentIndex].image_url || `https://ui-avatars.com/api/?name=${testimonials[currentIndex].name}`} 
                    alt={testimonials[currentIndex].name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-slate-900 text-lg">{testimonials[currentIndex].name}</h4>
                  <p className="text-primary text-sm font-semibold uppercase tracking-wider">{testimonials[currentIndex].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex justify-center gap-4 mt-12">
            <button 
              onClick={prev}
              className="p-3 rounded-full bg-white shadow-md border border-slate-100 text-slate-400 hover:text-primary hover:border-primary transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 rounded-full transition-all ${i === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-slate-200'}`}
                />
              ))}
            </div>
            <button 
              onClick={next}
              className="p-3 rounded-full bg-white shadow-md border border-slate-100 text-slate-400 hover:text-primary hover:border-primary transition-all"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
