import React from 'react';
import Hero from '../components/Hero';
import WelcomeMessage from '../components/WelcomeMessage';
import Stats from '../components/Stats';
import WhyChooseUs from '../components/WhyChooseUs';
import GrandOpening from '../components/GrandOpening';
import CallToAction from '../components/CallToAction';

export default function Home() {
  return (
    <>
      <Hero />
      <WelcomeMessage />
      <Stats />
      <WhyChooseUs />
      <GrandOpening />
      <CallToAction />
    </>
  );
}
