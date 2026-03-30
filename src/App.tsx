import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';

// Static Imports for components that appear on every page
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy loaded public pages
const Home = lazy(() => import('./pages/Home'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const AcademicsPage = lazy(() => import('./pages/AcademicsPage'));
const AdmissionsPage = lazy(() => import('./pages/AdmissionsPage'));
const FacilitiesPage = lazy(() => import('./pages/FacilitiesPage'));
const TeamPage = lazy(() => import('./pages/TeamPage'));
const ContactUsPage = lazy(() => import('./pages/ContactUsPage'));

// Lazy loaded Admin Pages
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const AdminLogin = lazy(() => import('./admin/AdminLogin'));
const Dashboard = lazy(() => import('./admin/Dashboard'));
const ManageTeam = lazy(() => import('./admin/ManageTeam'));
const ManageFacilities = lazy(() => import('./admin/ManageFacilities'));
const ManageEnquiries = lazy(() => import('./admin/ManageEnquiries'));
const ManageSettings = lazy(() => import('./admin/ManageSettings'));
const ManageNotices = lazy(() => import('./admin/ManageNotices'));
const ManageEvents = lazy(() => import('./admin/ManageEvents'));
const ManageBlogs = lazy(() => import('./admin/ManageBlogs'));
const ManageTestimonials = lazy(() => import('./admin/ManageTestimonials'));

// Lazy loaded public pages
const PrincipalMessage = lazy(() => import('./pages/PrincipalMessage'));
const BlogsPage = lazy(() => import('./pages/BlogsPage'));
const EventsPage = lazy(() => import('./pages/EventsPage'));

function Fallback() {
  return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-28 md:pt-40 transition-spacing duration-300">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Suspense fallback={<Fallback />}>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="login" element={<AdminLogin />} />
              <Route path="team" element={<ManageTeam />} />
              <Route path="facilities" element={<ManageFacilities />} />
              <Route path="notices" element={<ManageNotices />} />
              <Route path="events" element={<ManageEvents />} />
              <Route path="blogs" element={<ManageBlogs />} />
              <Route path="testimonials" element={<ManageTestimonials />} />
              <Route path="enquiries" element={<ManageEnquiries />} />
              <Route path="settings" element={<ManageSettings />} />
            </Route>

            {/* Public Routes */}
            <Route path="/*" element={
              <PublicLayout>
                <Routes>
                  <Route path="/" element={<><Helmet><title>Home | Aspire Universal International School</title></Helmet><Home /></>} />
                  <Route path="/about" element={<><Helmet><title>About Us | Aspire School</title></Helmet><AboutUs /></>} />
                  <Route path="/academics" element={<><Helmet><title>Academics | Learning at Aspire</title></Helmet><AcademicsPage /></>} />
                  <Route path="/admissions" element={<><Helmet><title>Admissions | Join Aspire School</title></Helmet><AdmissionsPage /></>} />
                  <Route path="/facilities" element={<><Helmet><title>Facilities | World Class Infrastructure</title></Helmet><FacilitiesPage /></>} />
                  <Route path="/team" element={<><Helmet><title>Our Team | Expert Educators</title></Helmet><TeamPage /></>} />
                  <Route path="/contact" element={<><Helmet><title>Contact Us | Get in Touch</title></Helmet><ContactUsPage /></>} />
                  <Route path="/principal-message" element={<><Helmet><title>Principal's Message | Aspire School</title></Helmet><PrincipalMessage /></>} />
                  <Route path="/blogs" element={<><Helmet><title>Latest News & Blogs | Aspire School</title></Helmet><BlogsPage /></>} />
                  <Route path="/events" element={<><Helmet><title>Upcoming Events | School Calendar</title></Helmet><EventsPage /></>} />
                </Routes>
              </PublicLayout>
            } />
          </Routes>
        </Suspense>
      </Router>
    </HelmetProvider>
  );
}

export default App;
