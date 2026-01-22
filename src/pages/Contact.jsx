import React from 'react';
import PageLoader from '../components/PageLoader';
import usePageLoader from '../hooks/usePageLoader';

const Contact = () => {
  const isLoading = usePageLoader();

  if (isLoading) {
    return <PageLoader subtitle="Loading contact information..." />;
  }

  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      <div className="contact-content">
        <p>Get in touch with us:</p>
        <ul>
          <li>Email: contact@example.com</li>
          <li>Phone: (123) 456-7890</li>
          <li>Address: 123 Main Street, City, Country</li>
        </ul>
      </div>
    </div>
  );
};

export default Contact; 