import React from 'react';
import WhyChooseUs from '../components/WhyChooseUs';
import PageHeader from '../components/PageHeader';

const WhyChooseUsPage = () => {
  return (
    <div className="page-container">
      <PageHeader 
        title="Why Choose Us" 
        backgroundImage="/images/why-choose-us-bg.jpg"
        description="Learn about what makes our organization unique and impactful"
      />
      <WhyChooseUs />
    </div>
  );
};

export default WhyChooseUsPage; 