import React from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaGlobe, FaUserFriends, FaUsers } from 'react-icons/fa';

/**
 * 💎 FLOATING GLASS STATS
 * Glassmorphism, transparent, white border, parallax
 * Matching the exact design from reference image
 */
const GlassStats = ({ counts, mousePos }) => {
  const stats = [
    {
      icon: FaStar,
      value: counts.donations || counts.raised,
      label: 'Lives Impacted',
      color: 'rgba(255, 255, 255, 0.1)'
    },
    {
      icon: FaGlobe,
      value: counts.transactions,
      label: 'Global Donors',
      color: 'rgba(255, 255, 255, 0.1)'
    },
    {
      icon: FaUserFriends,
      value: counts.volunteers,
      label: 'Volunteers',
      color: 'rgba(255, 255, 255, 0.1)'
    },
    {
      icon: FaUsers,
      value: counts.ngos,
      label: 'Impact',
      color: 'rgba(255, 255, 255, 0.1)'
    },
  ];

  // Ensure mousePos has default values
  const safeMousePos = mousePos || { x: 0.5, y: 0.5 };

  return (
    <div className="relative z-30 mt-16 sm:mt-20">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          // Parallax offset based on mouse (desktop only)
          const offsetX = typeof window !== 'undefined' && window.innerWidth >= 1024 
            ? (safeMousePos.x - 0.5) * (10 + i * 2) 
            : 0;
          const offsetY = typeof window !== 'undefined' && window.innerWidth >= 1024
            ? (safeMousePos.y - 0.5) * (10 + i * 2)
            : 0;

          return (
            <motion.div
              key={i}
              className="relative"
              style={{
                transform: `translate(${offsetX}px, ${offsetY}px)`,
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ 
                opacity: 1, 
                y: 0,
              }}
              transition={{ 
                duration: 0.8, 
                delay: 1.2 + i * 0.1,
                ease: "easeOut"
              }}
            >
              <motion.div
                className="relative bg-white/8 backdrop-blur-2xl rounded-2xl p-6 sm:p-8 border border-white/15 shadow-2xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(20px)',
                }}
                whileHover={{
                  scale: 1.03,
                  borderColor: 'rgba(255, 255, 255, 0.25)',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
                }}
                animate={{
                  y: [0, -3, 0],
                }}
                transition={{
                  y: {
                    duration: 4 + i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              >
                {/* White icon */}
                <div 
                  className="w-10 h-10 sm:w-12 sm:h-12 mb-4 flex items-center justify-center"
                >
                  <Icon className="text-white text-xl sm:text-2xl" />
                </div>
                
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-white/70 font-light">
                  {stat.label}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default GlassStats;

