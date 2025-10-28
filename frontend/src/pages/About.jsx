import React from "react";
import { Eye, Shield, Users } from "lucide-react";

export default function About() {
  return (
    <div className="about-page">
      <div className="container">
        {/* Mission Section */}
        <section className="mission-section">
          <h1 className="mission-title">Our Mission: Speak truth safely.</h1>
          <p className="mission-description">
            Sluglime is dedicated to empowering individuals to anonymously disclose critical information, 
            fostering a community-driven approach to investigations. We champion transparency, prioritize 
            your security, and believe in the collective power of truth.
          </p>
        </section>

        {/* Core Values Section */}
        <section className="values-section">
          <h2 className="values-title">Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <Eye size={32} />
              </div>
              <h3>Transparency</h3>
              <p>
                We believe in the power of open information to foster accountability 
                and drive positive change.
              </p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">
                <Shield size={32} />
              </div>
              <h3>Security</h3>
              <p>
                Your identity and data are protected with state-of-the-art encryption 
                and anonymization protocols.
              </p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">
                <Users size={32} />
              </div>
              <h3>Community</h3>
              <p>
                Join a network of engaged citizens and experts collaborating to uncover 
                the truth and ensure justice.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
