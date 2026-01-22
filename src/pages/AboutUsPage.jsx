import React from 'react';
import AboutUs from '../components/AboutUs';
import PageLoader from '../components/PageLoader';
import usePageLoader from '../hooks/usePageLoader';

const AboutUsPage = () => {
  const isLoading = usePageLoader();

  if (isLoading) {
    return <PageLoader subtitle="Loading about information..." />;
  }

  return (
    <div className="page-container">
      <AboutUs />
    </div>
  );
};

export default AboutUsPage; 