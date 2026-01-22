import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <div className="notfound-illustration">
          <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="90" cy="90" r="80" fill="#f3f4f6" />
            <ellipse cx="90" cy="140" rx="50" ry="10" fill="#e5e7eb" />
            <path d="M60 110 Q90 80 120 110" stroke="#3b82f6" strokeWidth="6" fill="none" strokeLinecap="round"/>
            <circle cx="70" cy="95" r="7" fill="#3b82f6" />
            <circle cx="110" cy="95" r="7" fill="#3b82f6" />
          </svg>
        </div>
        <h1 className="notfound-title">404</h1>
        <h2 className="notfound-message">Page Not Found</h2>
        <p className="notfound-description">
          Oops! The page you are looking for does not exist or has been moved.<br />
          Let's get you back to safety.
        </p>
        <Link to="/" className="notfound-home-btn">Go to Homepage</Link>
      </div>
    </div>
  );
};

export default NotFound; 