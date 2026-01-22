import React, { useEffect, useRef, useState } from 'react';
import './FeaturedCauses.css';

const causeData = [
  {
    id: 1,
    image: 'https://source.unsplash.com/1600x900/?children',
    title: 'Feed 1,000 Children',
    subtitle: 'A small donation feeds a dream.',
    progress: 65,
    goal: 50000,
    raised: 32500,
  },
  {
    id: 2,
    image: 'https://source.unsplash.com/1600x900/?schools',
    title: 'Rebuild Schools in Kashmir',
    subtitle: 'Education is the foundation of hope.',
    progress: 42,
    goal: 120000,
    raised: 50400,
  },
  {
    id: 3,
    image: 'https://source.unsplash.com/1600x900/?water',
    title: 'Clean Water Initiative',
    subtitle: 'Every drop makes a difference.',
    progress: 78,
    goal: 30000,
    raised: 23400,
  },
  {
    id: 4,
    image: 'https://source.unsplash.com/1600x900/?medical',
    title: 'Emergency Medical Relief',
    subtitle: 'Your support saves lives every day.',
    progress: 25,
    goal: 75000,
    raised: 18750,
  },
];

const FeaturedCauses = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleDonateClick = (id) => {
    // This would be connected to your donation system
    console.log(`Donate clicked for cause ID: ${id}`);
  };

  return (
    <section className="featured-causes" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <h2 className={`section-title ${isVisible ? 'animate' : ''}`}>
            Your Help Changes Lives
            <span className="title-underline"></span>
          </h2>
          <p className={`section-subtitle ${isVisible ? 'animate' : ''}`}>
            Join us in making a difference through these impactful initiatives
          </p>
        </div>
        
        <div className="causes-grid">
          {causeData.map((cause, index) => (
            <div 
              className={`cause-card ${isVisible ? 'animate' : ''}`} 
              key={cause.id}
              ref={el => cardsRef.current[index] = el}
              style={{ 
                animationDelay: `${index * 0.15}s`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: `opacity 0.8s ease ${index * 0.15}s, transform 0.8s ease ${index * 0.15}s`
              }}
              onMouseEnter={() => setActiveCard(cause.id)}
              onMouseLeave={() => setActiveCard(null)}
            >
              <div className="cause-image-container">
                <img src={cause.image} alt={cause.title} className="cause-image" />
                <div className="cause-overlay">
                  <div className="cause-quick-stats">
                    <div className="quick-stat">
                      <span className="stat-value">{cause.progress}%</span>
                      <span className="stat-label">Funded</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="cause-content">
                <h3 className="cause-title">{cause.title}</h3>
                <p className="cause-subtitle">{cause.subtitle}</p>
                
                <div className="cause-progress-container">
                  <div className="cause-progress-stats">
                    <span className="cause-raised">
                      Raised: {formatCurrency(cause.raised)}
                    </span>
                    <span className="cause-goal">
                      Goal: {formatCurrency(cause.goal)}
                    </span>
                  </div>
                  <div className="cause-progress-bar">
                    <div 
                      className="cause-progress-fill" 
                      style={{ 
                        width: `${isVisible ? cause.progress : 0}%`,
                        transition: isVisible ? 'width 1.5s ease-in-out' : 'none'
                      }}
                    ></div>
                  </div>
                  <div className="cause-progress-percentage">{cause.progress}%</div>
                </div>
                
                <button 
                  className="donate-button"
                  onClick={() => handleDonateClick(cause.id)}
                >
                  <span className="button-text">Donate Now</span>
                  <span className="button-icon">❤</span>
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className={`view-all-${isVisible ? 'animate' : ''}`}>
          <button className="view-all-button">
            View All Causes
            <span className="arrow-icon">→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCauses; 