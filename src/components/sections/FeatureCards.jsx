import React from 'react';
import './FeatureCards.css';

const features = [
  {
    id: 1,
    title: 'Transparent Funding',
        description: "We believe in complete transparency. Track where your donations go and see the impact you're making.",
    icon: (
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
      />
    ),
    color: 'blue'
  },
  {
    id: 2,
    title: 'Measurable Impact',
    description: 'We measure and report on the outcomes of our work, ensuring your donation creates real change.',
    icon: (
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" 
      />
    ),
    color: 'green'
  },
  {
    id: 3,
    title: 'Community Focused',
    description: 'Our projects are developed with and for the communities we serve, ensuring sustainable solutions.',
    icon: (
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" 
      />
    ),
    color: 'purple'
  }
];

const FeatureCards = () => {
  return (
    <section className="features-section">
      <div style={{display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
      <h2 style={{fontSize: '2.5rem', color: '#333'}}>Our Features</h2>
      <div className="section-underline"></div>
      </div>
      <div className="features-container">
        {features.map((feature) => (
          <div key={feature.id} className={`feature-card feature-card-${feature.color}`}>
            <div className="feature-icon-container">
              <svg 
                className="feature-icon" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {feature.icon}
              </svg>
            </div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureCards; 