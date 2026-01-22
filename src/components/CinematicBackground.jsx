import React from 'react';
import { motion } from 'framer-motion';

/**
 * 🎬 CINEMATIC BACKGROUND LAYERS
 * Deep navy space, soft aurora, golden glow, star field
 */
const CinematicBackground = () => {
  // Generate 15 subtle stars
  const stars = Array.from({ length: 15 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 1.5 + 0.5,
    opacity: Math.random() * 0.4 + 0.2,
    delay: Math.random() * 2
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Dark Teal to Deep Green Gradient Background */}
      <div 
        className="absolute inset-0"
        style={{ 
          background: 'linear-gradient(180deg, #0A2A43 0%, #0E3A2F 50%, #0A1A2E 100%)'
        }}
      />

      {/* Soft Emerald Aurora Haze (corners) */}
      <motion.div
        className="absolute top-0 left-0 w-1/2 h-1/2 opacity-20"
        style={{
          background: 'radial-gradient(ellipse at top left, rgba(14, 122, 79, 0.3) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute bottom-0 right-0 w-1/2 h-1/2 opacity-20"
        style={{
          background: 'radial-gradient(ellipse at bottom right, rgba(14, 122, 79, 0.2) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3
        }}
      />

      {/* Faint Golden Radial Glow Behind Heading */}
      <motion.div
        className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-[500px] h-[500px] opacity-15"
        style={{
          background: 'radial-gradient(circle at center, #F2C94C 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Light Star Field (10-20 stars max) */}
      {stars.map((star, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: 'rgba(255, 255, 255, 0.6)',
            boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.8)`,
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, star.opacity, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export default CinematicBackground;

