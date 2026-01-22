import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaHeart, FaHandHoldingHeart, FaUsers, FaGlobe, FaArrowRight, FaUserFriends, FaStar } from 'react-icons/fa';
import api from '../utils/api';

const Hero = () => {
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

  // Fetch stats from API
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
        // Keep default values if API fails
      }
    };
    
    fetchStats();
  }, []);

  useEffect(() => {
    // Since we're now using text values, just set them directly
    setCounts(targets);
  }, [targets]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const statVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.section 
      className="relative min-h-screen overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0A2A43 0%, #0E7A4F 100%)'
      }}
    >
      {/* Hero Background Image - if provided by backend */}
      {heroImage && (
        <div className="absolute inset-0 opacity-20">
          <img 
            src={heroImage} 
            alt="Hero background" 
            className="w-full h-full object-cover"
            style={{ objectFit: 'cover' }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A2A43]/80 to-[#0E7A4F]/80"></div>
        </div>
      )}

      {/* 🌍 Subtle Animated Background Glows */}
      <div className="absolute inset-0 opacity-30">
        <motion.div 
          className="absolute top-20 left-10 w-64 h-64 sm:w-96 sm:h-96 rounded-full filter blur-3xl"
          style={{ background: '#58C3FF' }}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-40 right-10 w-64 h-64 sm:w-96 sm:h-96 rounded-full filter blur-3xl"
          style={{ background: '#7BFFB3' }}
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div 
          className="absolute bottom-20 left-1/3 w-64 h-64 sm:w-96 sm:h-96 rounded-full filter blur-3xl"
          style={{ background: '#FFCF4D' }}
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* 🌍 World Map Pattern Background */}
      <div className="absolute inset-0 world-map-bg opacity-10"></div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <motion.div 
          className="flex flex-col items-center justify-center text-center min-h-[80vh] space-y-8 sm:space-y-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Centered Content */}
          <motion.div className="text-white space-y-6 sm:space-y-8 max-w-5xl" variants={itemVariants}>
            {/* Badges */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center">
              <motion.div 
                className="inline-flex items-center px-4 py-2 sm:px-5 sm:py-3 bg-white/95 backdrop-blur-md rounded-full border-2 border-white/30 shadow-xl"
                variants={itemVariants}
                whileHover={{ scale: 1.05, borderColor: '#58C3FF' }}
              >
                <span className="w-2 h-2 rounded-full mr-2 animate-pulse" style={{ background: '#7BFFB3' }}></span>
                <span className="text-xs sm:text-sm font-bold text-gray-900">🌍 Global Impact • People • Planet • Progress</span>
              </motion.div>
              <motion.div 
                className="inline-flex items-center px-4 py-2 sm:px-5 sm:py-3 bg-white/95 backdrop-blur-md rounded-full border-2 border-white/30 shadow-xl"
                variants={itemVariants}
                whileHover={{ scale: 1.05, borderColor: '#FFCF4D' }}
              >
                <span className="w-2 h-2 rounded-full mr-2 animate-pulse" style={{ background: '#58C3FF' }}></span>
                <span className="text-xs sm:text-sm font-bold text-gray-900">Operated By: Manasparshi Aashas Sewa Sanstha</span>
              </motion.div>
            </div>

            {/* Main Title - Ultra Creative */}
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
              variants={itemVariants}
            >
              <motion.span 
                className="block mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <span className="text-white">Empowering </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#58C3FF] to-[#7BFFB3] animate-breathe">
                  Humanity
                </span>
              </motion.span>
              <motion.span 
                className="block mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7BFFB3] to-[#0E7A4F]">
                  Protecting
                </span>
                <span className="text-white"> Nature</span>
              </motion.span>
              <motion.span 
                className="block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFCF4D] to-[#58C3FF]">
                  Inspiring Change
                </span>
              </motion.span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              className="text-base sm:text-lg lg:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto font-medium"
              variants={itemVariants}
            >
              United Global Federation brings together communities worldwide to create sustainable 
              impact. Together, we build a better tomorrow for humanity and our planet.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={itemVariants}
            >
              <motion.button
                className="group relative px-8 py-4 sm:px-10 sm:py-5 font-bold rounded-2xl shadow-2xl transition-all duration-300 flex items-center justify-center space-x-3 overflow-hidden text-base sm:text-lg"
                style={{
                  background: 'linear-gradient(135deg, #58C3FF, #7BFFB3)',
                }}
                whileHover={{ 
                  scale: 1.08, 
                  boxShadow: "0 25px 50px rgba(88, 195, 255, 0.5)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center space-x-3 text-[#0A2A43]">
                  <FaHandHoldingHeart className="text-2xl" />
                  <span>Support Global Causes</span>
                </span>
                <motion.div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(135deg, #FFCF4D, #58C3FF)' }}
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>

              <motion.button
                className="group px-8 py-4 sm:px-10 sm:py-5 bg-white/20 backdrop-blur-md text-white font-bold rounded-2xl border-2 border-white/40 hover:bg-white/30 hover:border-white/60 shadow-xl transition-all duration-300 flex items-center justify-center space-x-3 text-base sm:text-lg"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Explore Impact Stories</span>
                <FaArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-8 text-sm sm:text-base text-white/90 font-semibold"
              variants={itemVariants}
            >
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: '#7BFFB3' }}></div>
                <span>✓ 100% Transparent Impact</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: '#FFCF4D' }}></div>
                <span>✓ Global Reach • Local Impact</span>
              </div>
            </motion.div>
          </motion.div>

          {/* 📊 NEW: Stats Grid - ALL 5 Stats (BACKEND DRIVEN) */}
          <motion.div 
            className="w-full max-w-6xl"
            variants={itemVariants}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Worth Donations */}
              <motion.div 
                className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border-2 border-white/40 shadow-2xl hover:shadow-3xl transition-all duration-300"
                variants={statVariants}
                whileHover={{ scale: 1.05, y: -8, borderColor: '#58C3FF' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #58C3FF, #7BFFB3)' }}
                  >
                    <FaHeart className="text-white text-xl sm:text-2xl animate-pulse" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2" style={{ color: '#0A2A43' }}>
                  {counts.donations}
                </div>
                <div className="text-sm sm:text-base text-gray-700 font-semibold">Worth Donations</div>
              </motion.div>

              {/* Global Donors */}
              <motion.div 
                className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border-2 border-white/40 shadow-2xl hover:shadow-3xl transition-all duration-300"
                variants={statVariants}
                whileHover={{ scale: 1.05, y: -8, borderColor: '#7BFFB3' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #7BFFB3, #0E7A4F)' }}
                  >
                    <FaUsers className="text-white text-xl sm:text-2xl animate-pulse" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2" style={{ color: '#0E7A4F' }}>
                  {counts.transactions}
                </div>
                <div className="text-sm sm:text-base text-gray-700 font-semibold">Global Donors</div>
              </motion.div>

              {/* Communities Served */}
              <motion.div 
                className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border-2 border-white/40 shadow-2xl hover:shadow-3xl transition-all duration-300"
                variants={statVariants}
                whileHover={{ scale: 1.05, y: -8, borderColor: '#FFCF4D' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #FFCF4D, #58C3FF)' }}
                  >
                    <FaGlobe className="text-white text-xl sm:text-2xl animate-pulse" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2" style={{ color: '#0A2A43' }}>
                  {counts.ngos}
                </div>
                <div className="text-sm sm:text-base text-gray-700 font-semibold">Communities Served</div>
              </motion.div>

              {/* Active Volunteers */}
              <motion.div 
                className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border-2 border-white/40 shadow-2xl hover:shadow-3xl transition-all duration-300"
                variants={statVariants}
                whileHover={{ scale: 1.05, y: -8, borderColor: '#58C3FF' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #0A2A43, #58C3FF)' }}
                  >
                    <FaUserFriends className="text-white text-xl sm:text-2xl animate-pulse" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2" style={{ color: '#0A2A43' }}>
                  {counts.volunteers}
                </div>
                <div className="text-sm sm:text-base text-gray-700 font-semibold">Active Volunteers</div>
              </motion.div>

              {/* Impact Created */}
              <motion.div 
                className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border-2 border-white/40 shadow-2xl hover:shadow-3xl transition-all duration-300 sm:col-span-2 lg:col-span-1"
                variants={statVariants}
                whileHover={{ scale: 1.05, y: -8, borderColor: '#7BFFB3' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #FFCF4D, #7BFFB3)' }}
                  >
                    <FaStar className="text-white text-xl sm:text-2xl animate-pulse" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2" style={{ color: '#0E7A4F' }}>
                  {counts.raised}
                </div>
                <div className="text-sm sm:text-base text-gray-700 font-semibold">Impact Created</div>
              </motion.div>
            </div>
          </motion.div>

        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-4 h-6 sm:w-6 sm:h-10 border-2 border-white/30 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-2 sm:h-3 bg-white rounded-full mt-1 sm:mt-2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </motion.section>
  );
};

export default Hero; 