import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { FaBookOpen, FaGlobeAmericas, FaHandHoldingHeart, FaUsers, FaGraduationCap, FaHeartbeat, FaLeaf, FaFemale, FaPaw } from 'react-icons/fa';
import './OurVision.css';
import { useNavigate } from 'react-router-dom';
const OurVision = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const navigate = useNavigate();
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  const visionStatements = [
    {
      id: 1,
      text: "Equipping the next generation with knowledge and skills to not only survive but also thrive in a dynamic world, ensuring their long-term success and well-being.",
      icon: <FaBookOpen />,
      color: "#D14343"
    },
    {
      id: 2,
      text: "Enable the civil society across the world to engage proactively in the change process through the philosophy of civic driven change.",
      icon: <FaGlobeAmericas />,
      color: "#D14343"
    },
    {
      id: 3,
      text: "To create a world where every individual has access to the resources, education, and opportunities needed to thrive.",
      icon: <FaHandHoldingHeart />,
      color: "#D14343"
    },
    {
      id: 4,
      text: "Our mission is to empower underserved populations, protect the planet, and create lasting positive change.",
      icon: <FaUsers />,
      color: "#D14343"
    }
  ];

  const focusAreas = [
    { id: 1, name: "Education", icon: <FaGraduationCap />, color: "#D14343" },
    { id: 2, name: "Healthcare", icon: <FaHeartbeat />, color: "#D14343" },
    { id: 3, name: "Environmental", icon: <FaLeaf />, color: "#D14343" },
    { id: 4, name: "Women's Empowerment", icon: <FaFemale />, color: "#D14343" },
    { id: 5, name: "Animal Welfare", icon: <FaPaw />, color: "#D14343" }
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
    <div className="our-vision-container">
      <motion.div 
        className="vision-header"
        initial={{ opacity: 1, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1>Our <span className='text-primary-500'>Vision</span></h1>
        <div className="vision-underline"></div>
        <p className="vision-intro">
          We envision a world where compassion, equality, and sustainability drive positive change for all beings.
        </p>
      </motion.div>

      <div className="vision-content">
        <motion.div 
          className="vision-statements"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          ref={ref}
        >
          {visionStatements.map((statement, index) => (
            <motion.div 
              key={statement.id} 
              className="vision-statement-card"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
              }}
              style={{
                borderTop: `4px solid ${statement.color}`
              }}
            >
              <div className="statement-icon" style={{ color: statement.color }}>
                {statement.icon}
              </div>
              <p>{statement.text}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="vision-focus-areas"
          initial={{ opacity: 1, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <h2>We work in these Fields</h2>
          <div className="focus-areas-grid">
            {focusAreas.map((area) => (
              <motion.div 
                key={area.id} 
                className="focus-area"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="focus-area-icon" style={{ backgroundColor: `${area.color}20`, color: area.color }}>
                  {area.icon}
                </div>
                <h3>{area.name}</h3>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div 
        className="vision-impact"
        initial={{ opacity: 1 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="impact-content">
          <h2>Our Impact</h2>
          <p>
            Through our dedicated efforts and your support, we've been able to make significant strides in creating a better world. 
            Our vision drives us to continuously expand our reach and deepen our impact in communities around the globe.
          </p>
          <div className="impact-stats">
            <div className="stat">
              <span className="stat-number text-primary-500">10K+</span>
              <span className="stat-label text-gray-900">Lives Impacted</span>
            </div>
            <div className="stat">
              <span className="stat-number ">50+</span>
              <span className="stat-label">Communities Served</span>
            </div>
            <div className="stat">
              <span className="stat-number">100+</span>
              <span className="stat-label">Projects Completed</span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="vision-cta"
        initial={{ opacity: 1, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2>Help Us Realize Our Vision</h2>
        <p>Join us in our journey to create a better world for all. Your support can make a significant difference.</p>
        <div className="cta-buttons">
          <button className="cta-button primary" onClick={() => navigate('/campaigns')}>Donate Now</button>
          <button className="cta-button secondary" onClick={() => navigate('/volunteer-join')}>Volunteer</button>
        </div>
      </motion.div>
    </div>
  );
};

export default OurVision; 