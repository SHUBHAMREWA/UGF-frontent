import React from 'react';
import { motion } from 'framer-motion';
import { FaHandHoldingHeart, FaUsers, FaBalanceScale, FaHandsHelping, 
         FaChartLine, FaHandshake, FaHeart, FaLightbulb } from 'react-icons/fa';
import './WhyChooseUs.css';
import { useNavigate } from 'react-router-dom';
const WhyChooseUs = () => {
  const navigate = useNavigate();
  const reasons = [
    {
      id: 1,
      title: "Mission-Driven Approach",
      description: "We are dedicated to making a positive impact in our community. Our mission is to empower individuals and create sustainable change through various initiatives.",
      icon: <FaHandHoldingHeart />
    },
    {
      id: 2,
      title: "Experienced Team",
      description: "Our team consists of passionate and skilled professionals who bring years of experience in social work, community development, and advocacy. We are committed to delivering effective solutions.",
      icon: <FaUsers />
    },
    {
      id: 3,
      title: "Transparency and Accountability",
      description: "We believe in maintaining transparency in our operations and financial dealings. Regular reports and updates ensure our stakeholders are informed about our activities and impact.",
      icon: <FaBalanceScale />
    },
    {
      id: 4,
      title: "Community Engagement",
      description: "We actively involve the community in our projects, ensuring that their voices are heard. Our programs are designed based on the needs and feedback of those we serve.",
      icon: <FaHandsHelping />
    },
    {
      id: 5,
      title: "Proven Track Record",
      description: "Over the years, we have successfully implemented various projects that have positively affected countless lives. Our results speak for themselves, showcasing our dedication and effectiveness.",
      icon: <FaChartLine />
    },
    {
      id: 6,
      title: "Collaborative Partnerships",
      description: "We collaborate with other organizations, government bodies, and local communities to maximize our reach and impact. Together, we can achieve more.",
      icon: <FaHandshake />
    },
    {
      id: 7,
      title: "Volunteer Opportunities",
      description: "We offer numerous opportunities for individuals to get involved and make a difference. Whether through volunteering or donations, everyone can contribute to our cause.",
      icon: <FaHeart />
    },
    {
      id: 8,
      title: "Innovative Solutions",
      description: "We are committed to finding creative and sustainable solutions to the challenges faced by our community. Our approach is adaptable and forward-thinking.",
      icon: <FaLightbulb />
    }
  ];

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 1 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="why-choose-us-container">
      <div className="why-choose-us-header">
        <motion.h1 
        
          className="why-choose-us-title"
        >
          Why Choose Us
        </motion.h1>
        <motion.div 
         
          className="title-underline"
        />
        <motion.p 
        
          className="why-choose-us-subtitle"
        >
          Discover the values and principles that set us apart
        </motion.p>
      </div>

      <motion.div 
        className="reasons-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {reasons.map((reason) => (
          <motion.div 
            key={reason.id} 
            className="reason-card"
            variants={itemVariants}
            whileHover={{ 
              y: -10, 
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              transition: { duration: 0.3 }
            }}
          >
            <div className="reason-icon">
              {reason.icon}
            </div>
            <h3 className="reason-title">{reason.title}</h3>
            <p className="reason-description">{reason.description}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        className="cta-section"
        initial={{ opacity: 1, y: 30 }} 
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2>Ready to make a difference?</h2>
        <p>Join us in our mission to create positive change in our community.</p>
        <button className="cta-button" onClick={() => navigate('/volunteer-join')}>Get Involved Today</button>
      </motion.div>
    </div>
  );
};

export default WhyChooseUs; 