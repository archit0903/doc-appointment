import React from 'react';
import Header from '../Header/Header.js';
import HeroSection from './HeroSection.js';
import FeatureSection from './FeatureSection.js';
import CallToAction from './CallToAction.js';

const LandingPage = () => {
  return (
    <div>
      <Header />
      
      {/* Hero Section */}
      <div className="container my-5">
        <HeroSection />
      </div>
      
      {/* Feature Section */}
      <div className="bg-light">
        <div className="container my-5 py-5">
          <FeatureSection />
        </div>
      </div>
      
      {/* Call to Action Section */}
      <div className="container my-5">
        <CallToAction />
      </div>
    </div>
  );
};

export default LandingPage;
