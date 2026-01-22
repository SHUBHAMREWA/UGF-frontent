import React from 'react';
import { motion } from 'framer-motion';
import './PageHeader.css';

const PageHeader = ({ title, description, backgroundImage }) => {
  return (
    <div 
      className="page-header"
      style={{ 
        backgroundImage: backgroundImage ? `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${backgroundImage})` : 'none'
      }}
    >
      <motion.div 
        className="page-header-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>{title}</h1>
        {description && <p>{description}</p>} 
      </motion.div>
    </div>
  );
};

export default PageHeader; 