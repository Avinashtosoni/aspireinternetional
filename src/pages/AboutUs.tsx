import React from 'react';
import About from '../components/About';
import VisionMission from '../components/VisionMission';

export default function AboutUs() {
  return (
    <div className="pt-24 md:pt-32">
      <div className="bg-primary/5 py-12 md:py-20 text-center border-b border-primary/10">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900">About Us</h1>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto px-4">Discover our vision, mission, and the core values that drive Aspire Universal International School.</p>
      </div>
      <About />
      <VisionMission />
    </div>
  );
}
