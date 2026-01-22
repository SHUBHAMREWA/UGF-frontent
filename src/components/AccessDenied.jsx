import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './AccessDenied.css';

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="access-denied-container">
      <motion.div
        className="access-denied-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="access-denied-icon">
          <svg
            width="120"
            height="120"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="#e74c3c"
              strokeWidth="2"
            />
            <path
              d="M15 9L9 15M9 9L15 15"
              stroke="#e74c3c"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        
        <h1 className="access-denied-title">Access Denied</h1>
        <p className="access-denied-message">
          You don't have access to this page. This area is restricted to administrators only.
        </p>
        
        <div className="access-denied-actions">
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary"
          >
            Go to Homepage
          </button>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-secondary"
          >
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AccessDenied;
