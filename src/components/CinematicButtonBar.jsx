import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

/**
 * 🎬 CINEMATIC BUTTON BAR
 * Minimal strip: [ Global Mission ] ○ [ Impact Stories ] ○ [ Nature First ]
 */
const CinematicButtonBar = () => {
  const buttons = [
    { label: 'Global Mission', path: '/mission' },
    { label: 'Impact Stories', path: '/blog' },
    { label: 'Nature First', path: '/programs' },
  ];

  return (
    <motion.div
      className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8 sm:mt-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.0 }}
    >
      {buttons.map((button, i) => (
        <React.Fragment key={i}>
          <motion.div
            whileHover={{
              scale: 1.05,
              opacity: 1,
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to={button.path}
              className="relative px-6 py-3 sm:px-8 sm:py-4 text-white/70 hover:text-white font-light text-sm sm:text-base tracking-wide uppercase transition-all duration-300"
              style={{
                letterSpacing: '0.1em',
              }}
            >
              {button.label}
              {/* Subtle underline on hover */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-px bg-white/30"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </Link>
          </motion.div>
          
          {/* Separator dot */}
          {i < buttons.length - 1 && (
            <div className="hidden sm:block w-1 h-1 rounded-full bg-white/20" />
          )}
        </React.Fragment>
      ))}
    </motion.div>
  );
};

export default CinematicButtonBar;

