import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { FaHeart, FaHandHoldingHeart, FaUsers, FaGlobe, FaArrowRight, FaUserFriends, FaStar } from 'react-icons/fa';
import api from '../utils/api';
import ParticleWave from './ParticleWave';
import AuroraGlow from './AuroraGlow';
import Globe3D from './Globe3D';
import NatureSilhouettes from './NatureSilhouettes';

/**
 * 🎬 ULTIMATE HERO SECTION
 * Cinematic, futuristic, global design with ALL creative elements
 */
const HeroUltimate = () => {
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

  const [heroImage, setHeroImage] = useState(null);

  // Fetch stats from API (BACKEND DRIVEN)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/hero-stats');
        if (response.data.success) {
          setTargets(response.data.stats);
          setHeroImage(response.data.stats.heroImage);
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const statVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <motion.section 
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0A2A43 0%, #0E7A4F 100%)'
      }}
    >
      {/* 1. Particle Wave Background (Behind everything) */}
      <ParticleWave />

      {/* 2. Aurora & Glow Layers */}
      <AuroraGlow />

      {/* 3. World Map Pattern */}
      <div className="absolute inset-0 world-map-bg opacity-10" />

      {/* Main Content Container */}
      <div className="relative z-20 w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <motion.div
          className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* LEFT: Text Block */}
          <motion.div 
            className="space-y-6 sm:space-y-8 z-30"
            variants={itemVariants}
          >
            {/* Badges */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <motion.div
                className="inline-flex items-center px-4 py-2 sm:px-5 sm:py-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 shadow-xl"
                whileHover={{ scale: 1.05, borderColor: '#58C3FF', boxShadow: '0 0 30px rgba(88, 195, 255, 0.4)' }}
              >
                <span className="w-2 h-2 rounded-full mr-2 animate-pulse" style={{ background: '#7BFFB3' }} />
                <span className="text-xs sm:text-sm font-bold text-white">🌍 People • Planet • Progress</span>
              </motion.div>
            </div>

            {/* Heading with Multi-color Animation */}
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
              variants={itemVariants}
            >
              <motion.span
                className="block mb-3"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <span className="text-white">Empowering </span>
                <span 
                  className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#58C3FF] to-[#7BFFB3]"
                  style={{
                    filter: 'drop-shadow(0 0 20px rgba(88, 195, 255, 0.5))',
                    animation: 'breathe 3s ease-in-out infinite'
                  }}
                >
                  Humanity
                </span>
              </motion.span>
              
              <motion.span
                className="block mb-3"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <span 
                  className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#7BFFB3] to-[#0E7A4F]"
                  style={{
                    filter: 'drop-shadow(0 0 20px rgba(123, 255, 179, 0.5))',
                  }}
                >
                  Protecting
                </span>
                <span className="text-white"> Nature</span>
              </motion.span>
              
              <motion.span
                className="block"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                <span 
                  className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#FFCF4D] to-[#58C3FF]"
                  style={{
                    filter: 'drop-shadow(0 0 20px rgba(255, 207, 77, 0.5))',
                  }}
                >
                  Inspiring Global Change
                </span>
              </motion.span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              className="text-base sm:text-lg lg:text-xl text-white/90 leading-relaxed font-medium max-w-2xl"
              variants={itemVariants}
            >
              United Global Federation brings together communities worldwide to create sustainable
              impact. Together, we build a better tomorrow for humanity and our planet.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              variants={itemVariants}
            >
              <motion.button
                className="group relative px-8 py-4 sm:px-10 sm:py-5 font-bold rounded-2xl shadow-2xl overflow-hidden text-base sm:text-lg flex items-center justify-center space-x-3"
                style={{
                  background: 'linear-gradient(135deg, #58C3FF, #7BFFB3)',
                }}
                whileHover={{
                  scale: 1.08,
                  boxShadow: '0 25px 50px rgba(88, 195, 255, 0.6)',
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center space-x-3 text-[#0A2A43]">
                  <FaHandHoldingHeart className="text-2xl" />
                  <span>Support Global Causes</span>
                </span>
                <motion.div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(135deg, #FFCF4D, #7BFFB3)' }}
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>

              <motion.button
                className="group px-8 py-4 sm:px-10 sm:py-5 bg-white/10 backdrop-blur-xl text-white font-bold rounded-2xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 shadow-xl flex items-center justify-center space-x-3 text-base sm:text-lg"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Explore Impact</span>
                <FaArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-8 text-sm sm:text-base text-white/90 font-semibold"
              variants={itemVariants}
            >
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: '#7BFFB3' }} />
                <span>✓ 100% Transparent Impact</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: '#FFCF4D' }} />
                <span>✓ Global Reach • Local Impact</span>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT: 3D Globe */}
          <motion.div
            className="relative h-[400px] sm:h-[500px] lg:h-[600px] flex items-center justify-center"
            variants={itemVariants}
          >
            <Globe3D />
          </motion.div>
        </motion.div>

        {/* FLOATING STATS - BOTTOM (All 5 Backend Numbers) */}
        <motion.div
          className="relative z-30 mt-12 sm:mt-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {/* Worth Donations */}
            <motion.div
              className="group relative bg-white/10 backdrop-blur-2xl rounded-2xl p-4 sm:p-6 border-2 border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300"
              variants={statVariants}
              whileHover={{
                scale: 1.08,
                y: -10,
                borderColor: '#58C3FF',
                boxShadow: '0 20px 60px rgba(88, 195, 255, 0.4)',
                rotateY: 5
              }}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl mb-3 flex items-center justify-center shadow-lg"
                style={{ background: 'linear-gradient(135deg, #58C3FF, #7BFFB3)' }}
              >
                <FaHeart className="text-white text-lg sm:text-xl animate-pulse" />
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">
                {counts.donations}
              </div>
              <div className="text-xs sm:text-sm text-white/80 font-semibold">Worth Donations</div>
            </motion.div>

            {/* Global Donors */}
            <motion.div
              className="group relative bg-white/10 backdrop-blur-2xl rounded-2xl p-4 sm:p-6 border-2 border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300"
              variants={statVariants}
              whileHover={{
                scale: 1.08,
                y: -10,
                borderColor: '#7BFFB3',
                boxShadow: '0 20px 60px rgba(123, 255, 179, 0.4)',
                rotateY: 5
              }}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl mb-3 flex items-center justify-center shadow-lg"
                style={{ background: 'linear-gradient(135deg, #7BFFB3, #0E7A4F)' }}
              >
                <FaUsers className="text-white text-lg sm:text-xl animate-pulse" />
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">
                {counts.transactions}
              </div>
              <div className="text-xs sm:text-sm text-white/80 font-semibold">Global Donors</div>
            </motion.div>

            {/* Communities Served */}
            <motion.div
              className="group relative bg-white/10 backdrop-blur-2xl rounded-2xl p-4 sm:p-6 border-2 border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300"
              variants={statVariants}
              whileHover={{
                scale: 1.08,
                y: -10,
                borderColor: '#FFCF4D',
                boxShadow: '0 20px 60px rgba(255, 207, 77, 0.4)',
                rotateY: 5
              }}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl mb-3 flex items-center justify-center shadow-lg"
                style={{ background: 'linear-gradient(135deg, #FFCF4D, #58C3FF)' }}
              >
                <FaGlobe className="text-white text-lg sm:text-xl animate-pulse" />
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">
                {counts.ngos}
              </div>
              <div className="text-xs sm:text-sm text-white/80 font-semibold">Communities Served</div>
            </motion.div>

            {/* Active Volunteers */}
            <motion.div
              className="group relative bg-white/10 backdrop-blur-2xl rounded-2xl p-4 sm:p-6 border-2 border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300"
              variants={statVariants}
              whileHover={{
                scale: 1.08,
                y: -10,
                borderColor: '#58C3FF',
                boxShadow: '0 20px 60px rgba(88, 195, 255, 0.4)',
                rotateY: 5
              }}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl mb-3 flex items-center justify-center shadow-lg"
                style={{ background: 'linear-gradient(135deg, #0A2A43, #58C3FF)' }}
              >
                <FaUserFriends className="text-white text-lg sm:text-xl animate-pulse" />
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">
                {counts.volunteers}
              </div>
              <div className="text-xs sm:text-sm text-white/80 font-semibold">Active Volunteers</div>
            </motion.div>

            {/* Impact Created */}
            <motion.div
              className="group relative bg-white/10 backdrop-blur-2xl rounded-2xl p-4 sm:p-6 border-2 border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 col-span-2 sm:col-span-3 lg:col-span-1"
              variants={statVariants}
              whileHover={{
                scale: 1.08,
                y: -10,
                borderColor: '#7BFFB3',
                boxShadow: '0 20px 60px rgba(123, 255, 179, 0.4)',
                rotateY: 5
              }}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl mb-3 flex items-center justify-center shadow-lg"
                style={{ background: 'linear-gradient(135deg, #FFCF4D, #7BFFB3)' }}
              >
                <FaStar className="text-white text-lg sm:text-xl animate-pulse" />
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">
                {counts.raised}
              </div>
              <div className="text-xs sm:text-sm text-white/80 font-semibold">Impact Created</div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* 4. Animated Nature Silhouettes (Bottom) */}
      <NatureSilhouettes />

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
          <motion.div
            className="w-1.5 h-3 bg-white rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </motion.section>
  );
};

export default HeroUltimate;

