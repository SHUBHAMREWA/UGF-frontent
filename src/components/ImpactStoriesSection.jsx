import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHeartbeat, FaGraduationCap, FaHome, FaTree, FaHandHoldingHeart, FaClock } from 'react-icons/fa';
import api from '../utils/api';

const ImpactStoriesSection = () => {
  const [stories, setStories] = useState({
    healthcareAccess: { value: '1.5K+', label: 'Healthcare Access', description: 'People received medical care', icon: 'FaHeartbeat' },
    educationSupport: { value: '10K+', label: 'Education Support', description: 'Students supported', icon: 'FaGraduationCap' },
    communityDevelopment: { value: '100+', label: 'Community Development', description: 'Villages transformed', icon: 'FaHome' },
    environmentalImpact: { value: '1Cr+', label: 'Environmental Impact', description: 'Trees planted', icon: 'FaTree' },
    disasterRelief: { value: '1.7K+', label: 'Disaster Relief', description: 'Families helped', icon: 'FaHandHoldingHeart' },
    volunteerHours: { value: '50K+', label: 'Volunteer Hours', description: 'Hours of service', icon: 'FaClock' }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        console.log('🔄 Fetching impact stories from API...');
        // Try to fetch from API first - use stats endpoint since impact-stories doesn't exist
        const response = await api.get('/content/stats');
        console.log('✅ API Response received:', response.data);
        
        if (response.data.success) {
          // Handle API response structure: response.data.data.data (same as statistics)
          const apiData = response.data.data.data;
          console.log('📊 Extracted Stories Data:', apiData);
          
          if (apiData && apiData.healthcareAccess) {
            console.log('✅ API data is valid, using API data');
            // Only keep the 6 main impact stories we want
            const cleanData = {
              healthcareAccess: apiData.healthcareAccess || { value: '1.5K+', label: 'Healthcare Access', description: 'People received medical care', icon: 'FaHeartbeat' },
              educationSupport: apiData.educationSupport || { value: '10K+', label: 'Education Support', description: 'Students supported', icon: 'FaGraduationCap' },
              communityDevelopment: apiData.communityDevelopment || { value: '100+', label: 'Community Development', description: 'Villages transformed', icon: 'FaHome' },
              environmentalImpact: apiData.environmentalImpact || { value: '1Cr+', label: 'Environmental Impact', description: 'Trees planted', icon: 'FaTree' },
              disasterRelief: apiData.disasterRelief || { value: '1.7K+', label: 'Disaster Relief', description: 'Families helped', icon: 'FaHandHoldingHeart' },
              volunteerHours: apiData.volunteerHours || { value: '50K+', label: 'Volunteer Hours', description: 'Hours of service', icon: 'FaClock' }
            };
            setStories(cleanData);
          } else {
            console.log('⚠️ API data is malformed, checking localStorage...');
            // Fallback to localStorage if API data is malformed
            const savedStories = localStorage.getItem('admin-impact-stories');
            if (savedStories) {
              console.log('📱 Using localStorage data:', JSON.parse(savedStories));
              setStories(JSON.parse(savedStories));
            } else {
              console.log('🔄 Using default values');
            }
          }
        } else {
          console.log('❌ API returned unsuccessful response');
          const savedStories = localStorage.getItem('admin-impact-stories');
          if (savedStories) {
            console.log('📱 Using localStorage data:', JSON.parse(savedStories));
            setStories(JSON.parse(savedStories));
          }
        }
      } catch (error) {
        console.error('❌ Error fetching impact stories:', error);
        console.log('📱 Falling back to localStorage...');
        // Fallback to localStorage if API fails
        const savedStories = localStorage.getItem('admin-impact-stories');
        if (savedStories) {
          console.log('📱 Using localStorage data:', JSON.parse(savedStories));
          setStories(JSON.parse(savedStories));
        } else {
          console.log('🔄 Using default values');
        }
        // Otherwise keep default values
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const getIconComponent = (iconName) => {
    const icons = { FaHeartbeat, FaGraduationCap, FaHome, FaTree, FaHandHoldingHeart, FaClock };
    return icons[iconName] || FaHeartbeat;
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-96 mx-auto mb-12"></div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-300 rounded-2xl mx-auto mb-4"></div>
                    <div className="h-8 bg-gray-300 rounded w-16 mx-auto mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-20 mx-auto mb-1"></div>
                    <div className="h-3 bg-gray-300 rounded w-24 mx-auto"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const storiesArray = Object.values(stories);

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Our <span style={{ color: 'rgb(209, 67, 67)' }}>Impact Stories</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Real stories of transformation and positive change from communities across India
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8">
          {storiesArray.map((story, index) => {
            const IconComponent = getIconComponent(story.icon);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft hover:shadow-medium transition-all duration-300 group-hover:-translate-y-2 border border-gray-100">
                  <motion.div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg"
                    style={{ backgroundColor: 'rgb(209, 67, 67)' }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <IconComponent className="text-white text-xl sm:text-2xl" />
                  </motion.div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
                    {story.value}
                  </div>
                  <div className="text-gray-600 font-medium text-sm sm:text-base mb-2">
                    {story.label}
                  </div>
                  <div className="text-gray-500 text-xs sm:text-sm">
                    {story.description}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ImpactStoriesSection;
