import React from 'react';
import Hero from '../components/Hero';
import WelcomeMessage from '../components/WelcomeMessage';
import Stats from '../components/Stats';
import WhyChooseUs from '../components/WhyChooseUs';
import GrandOpening from '../components/GrandOpening';
import CallToAction from '../components/CallToAction';
import NoticeTicker from '../components/NoticeTicker';
import EventsSection from '../components/EventsSection';
import NewsSection from '../components/NewsSection';
import TestimonialCarousel from '../components/TestimonialCarousel';

export default function Home() {
  return (
    <>
      <Hero />
      <WelcomeMessage />
      <Stats />
      <WhyChooseUs />
      <EventsSection />
      <GrandOpening />
      <NewsSection />
      <TestimonialCarousel />
      <CallToAction />
    </>
  );
}
