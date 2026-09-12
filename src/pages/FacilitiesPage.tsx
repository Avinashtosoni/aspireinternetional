import React from 'react';
import Infrastructure from '../components/Infrastructure';

export default function FacilitiesPage() {
  return (
    <div>
      <div className="bg-gray-900 py-12 md:py-20 text-center border-b border-gray-800">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-white">Facilities</h1>
        <p className="text-gray-400 mt-4 max-w-2xl mx-auto px-4">Take a look at our state-of-the-art campus and world-class infrastructure.</p>
      </div>
      <Infrastructure />
    </div>
  );
}
