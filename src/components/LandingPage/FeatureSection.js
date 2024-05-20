import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const FeaturesSection = () => {
  return (
    <section className="features-section text-center py-5">
      <div className="container">
        <h2>Key Features</h2>
        <div className="row">
          <div className="col-md-4">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Find the Right Doctor</h5>
                <p className="card-text">
                  Discover doctors based on expertise and location to meet your healthcare needs.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Effortless Appointments</h5>
                <p className="card-text">
                  Easily request and manage appointments with your chosen doctors.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Real-time Notifications</h5>
                <p className="card-text">
                  Stay informed with instant notifications about appointment updates and changes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
