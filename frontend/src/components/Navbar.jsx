import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home, FileText, Search, Info, MessageSquare, LogIn, User } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

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

        {/* Action Buttons */}
        <div className="navbar-actions">
          {user ? (
            <Link 
              to="/main" 
              className="action-btn"
            >
              <User size={16} />
              Dashboard
            </Link>
          ) : (
            <Link 
              to="/login" 
              className="action-btn"
            >
              <LogIn size={16} />
              Sign In
            </Link>
          )}
          <Link 
            to="/submit" 
            className={`action-btn submit-btn ${isActive('/submit') ? 'active' : ''}`}
          >
            Submit Anonymously
          </Link>
        </div>

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
              {user ? (
                <Link 
                  className={`mobile-nav-item ${isActive('/main') ? 'active' : ''}`} 
                  to="/main"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              ) : (
                <Link 
                  className={`mobile-nav-item ${isActive('/login') ? 'active' : ''}`} 
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}