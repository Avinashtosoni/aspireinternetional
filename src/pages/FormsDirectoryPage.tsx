import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FileText, ArrowRight, CheckCircle2, Sparkles, Building, Calendar } from 'lucide-react';
import { useFormsStore } from '../store/formsStore';

export default function FormsDirectoryPage() {
  const { forms, fetchForms } = useFormsStore();

  useEffect(() => {
    fetchForms();
  }, []);

  const publishedForms = forms.filter((f) => f.is_published);

  return (
    <div className="bg-slate-50 min-h-screen">
      <Helmet>
        <title>Online Application Forms & Registrations | Aspire School</title>
      </Helmet>

      {/* Hero Banner */}
      <div className="bg-primary text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} /> Aspire Digital Admissions & Portals
          </span>
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold">
            Online Applications & Forms
          </h1>
          <p className="text-base md:text-lg opacity-90 max-w-2xl mx-auto leading-relaxed">
            Apply online for admissions, scholarship entrance tests, sports academies, and school programs from the comfort of your home.
          </p>
        </div>
      </div>

      {/* Forms List Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {publishedForms.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 max-w-xl mx-auto">
            <FileText size={48} className="text-gray-300 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-gray-800 mb-1">No Active Applications</h3>
            <p className="text-gray-500 text-sm mb-6">There are currently no public registration forms open.</p>
            <Link
              to="/contact"
              className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl shadow hover:bg-primary-hover transition text-sm inline-block"
            >
              Contact School Office
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {publishedForms.map((form) => (
              <div
                key={form.id}
                className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Applications Open
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      {form.fields.length} Questions
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors mb-3">
                    {form.title}
                  </h2>

                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {form.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    <Building size={14} /> Aspire Campus
                  </div>

                  <Link
                    to={`/forms/${form.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary group-hover:bg-primary-hover text-white text-sm font-bold rounded-xl shadow transition transform group-hover:translate-x-1"
                  >
                    <span>Fill & Apply</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
