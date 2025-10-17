import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home, FileText, Search, Info, MessageSquare } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link className="navbar-brand" to="/">
          <div className="brand-logo">*</div>
          <span>logo</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="navbar-nav">
          <Link 
            className={`nav-item ${isActive('/') ? 'active' : ''}`} 
            to="/"
          >
            Home
          </Link>
          <Link 
            className={`nav-item ${isActive('/submit') ? 'active' : ''}`} 
            to="/submit"
          >
            Whistleblow
          </Link>
          <Link 
            className={`nav-item ${isActive('/status') ? 'active' : ''}`} 
            to="/status"
          >
            Investigations
          </Link>
          <Link 
            className={`nav-item ${isActive('/about') ? 'active' : ''}`} 
            to="/about"
          >
            About
          </Link>
          <Link 
            className={`nav-item ${isActive('/contact') ? 'active' : ''}`} 
            to="/contact"
          >
            Contact
          </Link>
        </nav>

        {/* Action Button */}
        <Link 
          to="/submit" 
          className={`action-btn ${isActive('/submit') ? 'active' : ''}`}
        >
          Submit Anonymously
        </Link>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="navbar-mobile">
          <div className="container">
            <nav className="mobile-nav-links">
              <Link 
                className={`mobile-nav-item ${isActive('/') ? 'active' : ''}`} 
                to="/"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                className={`mobile-nav-item ${isActive('/submit') ? 'active' : ''}`} 
                to="/submit"
                onClick={() => setIsMenuOpen(false)}
              >
                Whistleblow
              </Link>
              <Link 
                className={`mobile-nav-item ${isActive('/status') ? 'active' : ''}`} 
                to="/status"
                onClick={() => setIsMenuOpen(false)}
              >
                Investigations
              </Link>
              <Link 
                className={`mobile-nav-item ${isActive('/about') ? 'active' : ''}`} 
                to="/about"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                className={`mobile-nav-item ${isActive('/contact') ? 'active' : ''}`} 
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}