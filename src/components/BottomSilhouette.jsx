import React from 'react';
import { motion } from 'framer-motion';

/**
 * 🌲 BOTTOM SILHOUETTE
 * Very subtle forest, mountains, birds, human helping human
 * Opacity < 0.08 - barely visible, emotional depth
 */
const BottomSilhouette = () => {
  return (
    <div 
      className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none"
      style={{ opacity: 0.12 }}
    >
      {/* Mountains */}
      <svg 
        className="absolute bottom-0 w-full h-32"
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none"
        style={{ fill: '#0A2A43' }}
      >
        <path d="M0,120 L0,80 L200,50 L400,90 L600,40 L800,70 L1000,60 L1200,85 L1200,120 Z" />
        <path d="M0,120 L0,100 L300,70 L500,100 L700,80 L900,95 L1200,100 L1200,120 Z" />
      </svg>

      {/* Forest Outline - Trees on left */}
      <div className="absolute bottom-0 left-0 flex items-end h-32" style={{ left: '5%' }}>
        {[...Array(4)].map((_, i) => (
          <svg
            key={i}
            className="h-20 w-8"
            viewBox="0 0 30 60"
            style={{ fill: '#0A2A43', marginRight: '8px' }}
          >
            {/* Tree trunk */}
            <rect x="12" y="40" width="6" height="20" />
            {/* Tree foliage */}
            <path d="M15,5 L8,30 L22,30 Z M15,15 L10,35 L20,35 Z M15,25 L12,45 L18,45 Z" />
          </svg>
        ))}
      </div>

      {/* Birds (3 subtle birds) */}
      <div className="absolute top-1/3 left-0 right-0 h-full">
        {[...Array(3)].map((_, i) => (
          <motion.svg
            key={i}
            className="absolute w-5 h-5"
            viewBox="0 0 20 20"
            style={{
              left: `${25 + i * 25}%`,
              top: `${20 + i * 15}%`,
            }}
            animate={{
              x: [0, 80, 160],
              y: [0, -15, 0],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: "linear",
              delay: i * 3
            }}
          >
            <path
              d="M5,10 Q8,6 11,10 M15,10 Q18,6 21,10"
              fill="none"
              stroke="#0A2A43"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </motion.svg>
        ))}
      </div>

      {/* Human Helping Human Shape (center) */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <svg
          className="w-32 h-32"
          viewBox="0 0 120 120"
          style={{ fill: '#0A2A43' }}
        >
          {/* Person 1 (left - helping) */}
          <circle cx="40" cy="35" r="10" />
          <path d="M40,45 L40,75 M40,55 L28,68 M40,55 L52,68" strokeWidth="2" strokeLinecap="round" />
          
          {/* Person 2 (right - being helped, slightly lower) */}
          <circle cx="80" cy="40" r="10" />
          <path d="M80,50 L80,80 M80,60 L68,73 M80,60 L92,73" strokeWidth="2" strokeLinecap="round" />
          
          {/* Helping hands connection */}
          <path d="M50,55 L70,60" stroke="#0E7A4F" strokeWidth="3" strokeLinecap="round" />
          
          {/* Ground/platform */}
          <path d="M20,85 L100,85" stroke="#0A2A43" strokeWidth="2" />
        </svg>
      </div>

      {/* Single Tree on Right */}
      <div className="absolute bottom-0 right-0 flex items-end h-32" style={{ right: '5%' }}>
        <svg
          className="h-24 w-10"
          viewBox="0 0 30 60"
          style={{ fill: '#0A2A43' }}
        >
          {/* Tree trunk */}
          <rect x="12" y="40" width="6" height="20" />
          {/* Tree foliage */}
          <path d="M15,5 L8,30 L22,30 Z M15,15 L10,35 L20,35 Z M15,25 L12,45 L18,45 Z" />
        </svg>
      </div>
    </div>
  );
};

export default BottomSilhouette;

