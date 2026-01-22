import React from 'react';
import './ImageLoader.css';

const ImageLoader = ({ size = 120, text = 'Loading...' }) => {
  return (
    <div className="image-loader-container">
      <div className="image-loader-wrapper" style={{ '--loader-size': `${size}px` }}>
        <img 
          src="/images/loader.png" 
          alt="Loading" 
          className="image-loader-bounce"
        />
        <div className="image-loader-shadow"></div>
      </div>
      {text && (
        <p className="image-loader-text">{text}</p>
      )}
    </div>
  );
};

export default ImageLoader;

