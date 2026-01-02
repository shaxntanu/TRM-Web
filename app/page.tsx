'use client';

import { useRef } from 'react';
import Hero from './components/Hero';
import Simulator from './components/Simulator';
import EducationalSection from './components/EducationalSection';
import Footer from './components/Footer';

export default function Home() {
  const simulatorRef = useRef<HTMLDivElement>(null);

  const scrollToSimulator = () => {
    simulatorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <Hero onStart={scrollToSimulator} />

      {/* Simulator Section */}
      <div ref={simulatorRef}>
        <Simulator />
      </div>

      {/* Educational Section */}
      <EducationalSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
