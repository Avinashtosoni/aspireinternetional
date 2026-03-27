import React from 'react';
import ContactForm from '../components/ContactForm';

export default function ContactUsPage() {
  return (
    <div className="pt-24 md:pt-32">
      <div className="bg-primary/5 py-12 md:py-20 text-center border-b border-primary/10">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900">Contact Us</h1>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto px-4">We'd love to hear from you. Send us a message or provide feedback.</p>
      </div>
      <ContactForm />
    </div>
  );
}
