import React from "react";
import { Link } from "react-router-dom";
import { Shield, Lock, Brain, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">Speak Truth, Stay Anonymous.</h1>
              <p className="hero-description">
                Sluglime provides a secure and untraceable platform for whistleblowers 
                to expose misconduct and for communities to investigate collaboratively.
              </p>
              <div className="hero-actions">
                <Link to="/submit" className="btn btn-primary btn-large">
                  Submit Anonymously
                </Link>
                <Link to="/about" className="btn btn-secondary btn-large">
                  Learn More
                </Link>
              </div>
            </div>
            <div className="hero-visual">
              <div className="network-graphic">
                <div className="network-nodes">
                  <div className="node node-1"></div>
                  <div className="node node-2"></div>
                  <div className="node node-3"></div>
                  <div className="node node-4"></div>
                  <div className="node node-5"></div>
                  <div className="node node-6"></div>
                </div>
                <div className="center-shield">
                  <Shield size={48} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="features-title">Why Sluglime is Different</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Shield size={40} />
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Lock size={40} />
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Brain size={40} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
