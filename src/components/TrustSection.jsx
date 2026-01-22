import React from 'react';
import './TrustSection.css';
import { FaChartLine, FaRegClock, FaFileAlt, FaUserCheck } from 'react-icons/fa';

const TrustSection = () => {
  const trustPillars = [
    {
      icon: <FaChartLine />,
      title: "100% Transparency",
      description: "Every donation tracked with complete financial clarity"
    },
    {
      icon: <FaRegClock />,
      title: "Real-time Tracking",
      description: "Monitor your impact as it happens, anywhere in the world"
    },
    {
      icon: <FaFileAlt />,
      title: "Impact Reports",
      description: "Detailed quarterly reports on every project's progress"
    },
    {
      icon: <FaUserCheck />,
      title: "Verified Humans",
      description: "Advanced verification ensures genuine beneficiaries"
    }
  ];

  const trustBadges = [
    { name: 'Forbes', image: '/images/forbes-white.png' },
    { name: 'TechCrunch', image: '/images/techcrunch-white.png' },
    { name: 'NDTV', image: '/images/ndtv-white.png' },
    { name: 'Times', image: '/images/times-white.png' }
  ];

  return (
    <section className="trust-section">
      <div className="trust-container">
        <h2 className="trust-heading">
          Trust & Transparency
          <span className="heading-accent"></span>
        </h2>
        
        <div className="pillars-grid">
          {trustPillars.map((pillar, index) => (
            <div className="pillar-card" key={index}>
              <div className="pillar-icon">{pillar.icon}</div>
              <h3 className="pillar-title">
                {pillar.title}
                <span className="title-underline"></span>
              </h3>
              <p className="pillar-description">{pillar.description}</p>
            </div>
          ))}
        </div>

        <div className="trust-badges">
          <p className="featured-text">As featured in</p>
          <div className="badges-container">
            {trustBadges.map((badge, index) => (
              <div className="badge-item" key={index}>
                <img 
                  src={badge.image} 
                  alt={`${badge.name} logo`} 
                  className="badge-image"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection; 