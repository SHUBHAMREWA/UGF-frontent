import React from 'react';
import Navbar from './common/Navbar';
import Footer from './common/Footer';

const Layout = ({ children, title = 'Donation Platform' }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar should appear only once */}
      {/* <Navbar /> */}
      
      <main className="flex-grow">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout; 