import React from 'react';
import { motion } from 'framer-motion';

/**
 * 🌌 Aurora & Glow Layers
 * Blue + green aurora gradients, golden radial glow
 */
const AuroraGlow = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Aurora Wave 1 - Blue */}
      <motion.div
        className="absolute w-full h-full opacity-30"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 20% 40%, #58C3FF 0%, transparent 50%)',
          filter: 'blur(60px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 50, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Aurora Wave 2 - Green */}
      <motion.div
        className="absolute w-full h-full opacity-30"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 80% 60%, #7BFFB3 0%, transparent 50%)',
          filter: 'blur(60px)',
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, -50, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      {/* Golden Center Glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-20"
        style={{
          background: 'radial-gradient(circle at center, #FFCF4D 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Subtle Moving Blobs */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-20"
        style={{
          background: 'linear-gradient(135deg, #58C3FF, #7BFFB3)',
          filter: 'blur(100px)',
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, 150, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-20"
        style={{
          background: 'linear-gradient(135deg, #FFCF4D, #0E7A4F)',
          filter: 'blur(100px)',
        }}
        animate={{
          x: [0, -100, 0],
          y: [0, -150, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      {/* Gradient Overlay for depth */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(10, 42, 67, 0.3) 100%)',
        }}
      />
    </div>
  );
};

export default AuroraGlow;

