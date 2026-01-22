import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="graas-layout">
      {/* <Navbar className="graas-navbar" /> */}
      <main className="graas-main-content">
        {children}
      </main>

    </div>
  );
};

export default Layout; 