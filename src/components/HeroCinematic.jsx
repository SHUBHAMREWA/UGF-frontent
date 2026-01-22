import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import CinematicBackground from './CinematicBackground';
import RealEarthGlobe from './RealEarthGlobe';
import GlassStats from './GlassStats';
import CinematicButtonBar from './CinematicButtonBar';
import BottomSilhouette from './BottomSilhouette';

/**
 * 🎬 CINEMATIC HERO SECTION
 * Apple + NASA + UN style - Hyper-premium, world-class
 */
const HeroCinematic = () => {
  const [counts, setCounts] = useState({
    donations: "0",
    transactions: "0",
    ngos: "0",
    volunteers: "0",
    raised: "0"
  });

  const [targets, setTargets] = useState({
    donations: "10",
    transactions: "1",
    ngos: "1200",
    volunteers: "50",
    raised: "10"
  });

  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  // Fetch stats from API (BACKEND DRIVEN)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/hero-stats');
        if (response.data.success) {
          setTargets(response.data.stats);
        }
      } catch (error) {
        console.error('Error fetching hero stats:', error);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    setCounts(targets);
  }, [targets]);

  // Mouse tracking for parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.section 
      className="relative min-h-screen flex items-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      {/* 1. Cinematic Background Layers */}
      <CinematicBackground />

      {/* 2. Main Content Container */}
      <div className="relative z-20 w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Mobile: Earth behind text with blur */}
        <div className="lg:hidden absolute inset-0 z-0 opacity-30 blur-2xl">
          <div className="h-full flex items-center justify-center">
            <RealEarthGlobe />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[85vh] relative z-10">
          
          {/* LEFT: Text Block */}
          <motion.div 
            className="space-y-6 sm:space-y-8 z-30 lg:pr-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            {/* Heading - Gold/Cream Typography */}
            <motion.h1 
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-serif leading-[1.1] tracking-tight"
              style={{ 
                color: '#F5E6D3',
                fontFamily: 'Georgia, "Times New Roman", serif'
              }}
            >
              <motion.span
                className="block mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                style={{ color: '#F5E6D3' }}
              >
                Humanity United.
              </motion.span>
              
              <motion.span
                className="block mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                style={{ color: '#F5E6D3' }}
              >
                Nature Protected.
              </motion.span>
              
              <motion.span
                className="block font-semibold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                style={{ color: '#F2C94C' }}
              >
                A Future Reimagined.
              </motion.span>
            </motion.h1>

            {/* Subheading - White */}
            <motion.p
              className="text-base sm:text-lg lg:text-xl font-light text-white/90 leading-relaxed max-w-2xl mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
            >
              A global movement restoring balance between people and planet.
            </motion.p>

            {/* Cinematic Button Bar - Hidden on mobile, subtle on desktop */}
            <div className="hidden lg:block">
              <CinematicButtonBar />
            </div>
          </motion.div>

          {/* RIGHT: Real 3D Earth Globe (Desktop only) - Larger and more prominent */}
          <motion.div
            className="hidden lg:flex relative h-[500px] lg:h-[700px] xl:h-[800px] items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.3 }}
          >
            <RealEarthGlobe />
          </motion.div>
        </div>

        {/* Floating Glass Stats */}
        <GlassStats counts={counts} mousePos={mousePos} />
      </div>

      {/* Bottom Silhouette (Very Subtle) */}
      <BottomSilhouette />

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-5 h-8 border border-white/20 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-2 bg-white/40 rounded-full mt-2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </motion.section>
  );
};

export default HeroCinematic;

