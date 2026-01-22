import React from 'react';
import OurMission from '../components/OurMission';

const OurMissionPage = () => {
  return (
    <div className="page-container">
      <div className="mission-page-header">
        <div className="mission-header-content">
          <h1 className="text-gray-900">Our Mission</h1>
          <p>Discover how we're working to create positive change in our world</p>
        </div>
      </div>
      <OurMission />
    </div>
  );
};

export default OurMissionPage; 