import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="container">
        <div className="not-found-content">
          <div className="not-found-visual">
            <div className="error-code">404</div>
            <div className="error-message">Page Not Found</div>
          </div>
          
          <div className="not-found-text">
            <h1>Oops! Page not found</h1>
            <p>
              The page you're looking for doesn't exist or has been moved. 
              Don't worry, we'll help you find what you need.
            </p>
            
            <div className="not-found-actions">
              <Link to="/" className="btn btn-primary">
                <Home size={20} />
                Go Home
              </Link>
              <Link to="/submit" className="btn btn-ghost">
                <Search size={20} />
                Submit Report
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
