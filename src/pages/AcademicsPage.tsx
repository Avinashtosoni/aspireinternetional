import React from 'react';
import Academics from '../components/Academics';

export default function AcademicsPage() {
  return (
    <div>
      <div className="bg-secondary/5 py-12 md:py-20 text-center border-b border-secondary/10">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900">Academics</h1>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto px-4">Explore our CBSE-affiliated curriculum designed for holistic development and 21st-century skills.</p>
      </div>
      <Academics />
    </div>
  );
}
