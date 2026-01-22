import React from 'react';
import { motion } from 'framer-motion';

/**
 * 🌲 Animated Nature Silhouettes
 * Trees, mountains, birds at bottom
 */
const NatureSilhouettes = () => {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none overflow-hidden">
      {/* Mountain Range */}
      <svg 
        className="absolute bottom-0 w-full h-48 opacity-20"
        viewBox="0 0 1200 200" 
        preserveAspectRatio="none"
        style={{ fill: '#0A2A43' }}
      >
        <motion.path
          d="M0,200 L0,100 L200,50 L400,120 L600,40 L800,90 L1000,60 L1200,100 L1200,200 Z"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 0.2 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
        <motion.path
          d="M0,200 L0,140 L300,80 L500,140 L700,100 L900,130 L1200,110 L1200,200 Z"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 0.15 }}
          transition={{ duration: 1.5, delay: 0.7 }}
        />
      </svg>

      {/* Tree Line */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-around items-end h-32 opacity-10">
        {[...Array(12)].map((_, i) => (
          <motion.svg
            key={i}
            className="h-20 w-8"
            viewBox="0 0 40 80"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 0.1 }}
            transition={{ 
              duration: 1, 
              delay: i * 0.1,
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: 3
            }}
          >
            {/* Tree trunk */}
            <rect x="16" y="50" width="8" height="30" fill="#0E7A4F" />
            {/* Tree foliage */}
            <path
              d="M20,10 L10,35 L30,35 Z M20,20 L12,40 L28,40 Z M20,30 L14,48 L26,48 Z"
              fill="#0E7A4F"
            />
          </motion.svg>
        ))}
      </div>

      {/* Flying Birds */}
      <div className="absolute top-0 left-0 right-0 h-full">
        {[...Array(5)].map((_, i) => (
          <motion.svg
            key={i}
            className="absolute w-6 h-6"
            viewBox="0 0 24 24"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
            animate={{
              x: [0, 100, 200],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 15 + i * 5,
              repeat: Infinity,
              ease: "linear",
              delay: i * 2
            }}
          >
            <path
              d="M3,12 Q6,8 9,12 M15,12 Q18,8 21,12"
              fill="none"
              stroke="#58C3FF"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.4"
            />
          </motion.svg>
        ))}
      </div>

      {/* Grass/Ground layer */}
      <svg 
        className="absolute bottom-0 w-full h-16 opacity-15"
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0,60 L0,30 Q300,10 600,30 T1200,30 L1200,60 Z"
          fill="#0E7A4F"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 0.15 }}
          transition={{ duration: 1.5, delay: 0.3 }}
        />
      </svg>
    </div>
  );
};

export default NatureSilhouettes;

