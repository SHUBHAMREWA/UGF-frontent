import React from 'react';
import ContactUs from '../components/ContactUs';

const ContactUsPage = () => {
  return (
    <div className="page-container">
      <div className="contact-page-header">
        <div className="contact-header-content">
          <h1 className="text-gray-900">Contact Us</h1>
          <p>Get in touch with our team</p>
        </div>
      </div>
      <ContactUs />
    </div>
  );
};

export default ContactUsPage; 