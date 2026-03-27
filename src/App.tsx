/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import AcademicsPage from './pages/AcademicsPage';
import FacilitiesPage from './pages/FacilitiesPage';
import AdmissionsPage from './pages/AdmissionsPage';
import TeamPage from './pages/TeamPage';
import ContactUsPage from './pages/ContactUsPage';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen font-sans text-gray-900 bg-white selection:bg-primary selection:text-white flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/academics" element={<AcademicsPage />} />
            <Route path="/facilities" element={<FacilitiesPage />} />
            <Route path="/admissions" element={<AdmissionsPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/contact" element={<ContactUsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
