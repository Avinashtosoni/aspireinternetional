import React from 'react';
import Admissions from '../components/Admissions';

export default function AdmissionsPage() {
  return (
    <div className="pt-24 md:pt-32">
      <div className="bg-accent/10 py-12 md:py-20 text-center border-b border-accent/20">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900">Admissions</h1>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto px-4">Join the Aspire family. Learn about our admission process for the 2026-27 session.</p>
      </div>
      <Admissions />
    </div>
  );
}
