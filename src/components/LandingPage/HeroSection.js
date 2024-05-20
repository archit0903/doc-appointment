import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import doctorImage from './image.jpg';

const HeroSection = () => {
  return (
    <section className="hero-section text-center py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <h1>Find Your Ideal Doctor</h1>
            <p>
              Simplify your healthcare journey by connecting with the right
              doctors for your needs. Book appointments seamlessly.
            </p>
          </div>
          <div className="col-lg-6">
            <img
              src={doctorImage}
              alt="Doctor Appointment App"
              className="img-fluid"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
