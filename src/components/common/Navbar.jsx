import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

const Navbar = () => {
  return (
    <header className="bg-gray-900 text-white">
      <div className="mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">YourLogo</Link>
        
        <nav>
          <ul className="flex space-x-8">
            <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar; 