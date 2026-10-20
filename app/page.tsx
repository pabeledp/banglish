import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Translator from '@/components/Translator';
import InstallationGuide from '@/components/InstallationGuide';
import Cheatsheet from '@/components/Cheatsheet';
import Tribute from '@/components/Tribute';
import ContactSection from '@/components/ContactSection';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
      {/* 1. Sticky Navigation Header */}
      <Navbar />

      <main className="flex-grow w-full max-w-full overflow-x-hidden">
        {/* 2. Hero Section with Live Phonetic Simulator */}
        <Hero />

        {/* 3. Native Architecture & macOS/Windows Features */}
        <Features />

        {/* 4. Live Multi-language Translator with Audio & Liquid Dropdown */}
        <Translator />

        {/* 5. 3-Step OS Installation Guide (macOS & Windows + Security Guides) */}
        <InstallationGuide />

        {/* 6. Complete Phonetic Typing Guide & Key Chart (Cheatsheet) */}
        <Cheatsheet />

        {/* 7. Dedicated Avro Tribute & Gratitude Box */}
        <Tribute />

        {/* 8. Developer & Agency Credits Section */}
        <ContactSection />

        {/* 9. Final Download Callout Banner */}
        <FinalCTA />
      </main>

      {/* 10. Footer */}
      <Footer />
    </div>
  );
}
