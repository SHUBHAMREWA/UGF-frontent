import React from 'react';
import OurVision from '../components/OurVision';

const OurVisionPage = () => {
  return (
    <div className="page-container">
      <div className="vision-page-header">
        <div className="vision-header-content">
          <h1 className="text-gray-900">Our Vision</h1>
          <p>Discover our aspirations for a better world and how we're working to achieve them</p>
        </div>
      </div>
      <OurVision />
    </div>
  );
};

export default OurVisionPage; 