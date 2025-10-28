import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-links">
            <Link to="/" className="footer-link">Sluglime</Link>
            <Link to="/legal" className="footer-link">Legal</Link>
            <Link to="/community" className="footer-link">Community</Link>
          </div>
          
          <div className="footer-social">
            <a href="#" className="social-link" aria-label="Facebook">
              <Facebook size={20} />
            </a>
            <a href="#" className="social-link" aria-label="Twitter">
              <Twitter size={20} />
            </a>
            <a href="#" className="social-link" aria-label="LinkedIn">
              <Linkedin size={20} />
            </a>
            <a href="#" className="social-link" aria-label="GitHub">
              <Github size={20} />
            </a>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>contact us</p>
        </div>
      </div>
    </footer>
  );
}