import React from 'react';
import ImageLoader from './ImageLoader';

const PageLoader = ({ 
  title = "United Global Federation India", 
  subtitle = "Loading...",
}) => {
  return (
    <div 
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif'
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <ImageLoader size={140} />
        
        {/* Title */}
        {title && (
          <h2
            style={{
              fontSize: '24px',
              fontWeight: 600,
              color: '#0f172a',
              marginBottom: '8px',
              marginTop: '24px'
            }}
          >
            {title}
          </h2>
        )}

        {/* Subtitle */}
        {subtitle && (
          <p
            style={{
              fontSize: '14px',
              color: '#475569',
              margin: 0
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default PageLoader;
