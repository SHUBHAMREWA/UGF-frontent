import React from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaGraduationCap, FaHeartbeat, FaPeopleCarry, FaBullhorn } from 'react-icons/fa';
import './OurMission.css';
import { useNavigate } from 'react-router-dom';
const OurMission = () => {
  const navigate = useNavigate();
  const missionAreas = [
    {
      id: 1,
      title: "Environmental Conservation",
      description: "We strive to protect and preserve our planet by promoting awareness about environmental issues. Our initiatives include tree plantation drives, waste management programs, and campaigns to reduce plastic usage. We believe that a healthy environment is essential for the well-being of present and future generations.",
      icon: <FaLeaf />,
      color: "#D14343"
    },
    {
      id: 2,
      title: "Education",
      description: "We are committed to providing quality education to children and youth, particularly from marginalized communities. Our programs aim to enhance literacy rates, provide vocational training, and create learning opportunities that empower individuals to achieve their full potential. We believe that education is the key to breaking the cycle of poverty.",
      icon: <FaGraduationCap />,
      color: "#D14343"
    },
    {
      id: 3,
      title: "Healthcare",
      description: "Access to quality healthcare is a fundamental right. Our mission includes organizing medical camps, health awareness programs, and providing support for those in need of medical assistance. We aim to improve healthcare access and educate communities about preventive health measures to promote overall well-being.",
      icon: <FaHeartbeat />,
      color: "#D14343"
    },
    {
      id: 4,
      title: "Community Empowerment",
      description: "We believe in empowering communities through skill development and economic opportunities. Our initiatives focus on providing training programs that equip individuals with the skills needed to secure employment or start their own businesses. By fostering self-reliance, we aim to uplift entire communities.",
      icon: <FaPeopleCarry />,
      color: "#D14343"
    },
    {
      id: 5,
      title: "Advocacy and Awareness",
      description: "We actively engage in advocacy efforts to raise awareness about social issues affecting our communities. By collaborating with local stakeholders and policymakers, we aim to influence positive change and promote policies that support sustainable development.",
      icon: <FaBullhorn />,
      color: "#D14343"
    }
  ];

  return (
    <div className="our-mission-container">
      <motion.div 
        className="mission-header"
        initial={{ opacity: 1, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>Our <span className='text-primary-500'>Mission</span></h1>
        <div className="mission-underline bg-[#D14343]"></div>
        <p className="mission-intro">
          Through focused efforts, United Global Federation India is dedicated to creating a more just and
          sustainable world for everyone. Together, we can make a difference and build a brighter future for
          all.
        </p>
      </motion.div>

      <div className="mission-areas">
        {missionAreas.map((area, index) => (
          <motion.div
            key={area.id}
            className="mission-area-card"
            style={{ '--icon-color': area.color, '--bar-color': area.color }}
            initial={{ opacity: 1, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <div className="mission-area-content">
              <div className="mission-area-icon" style={{ color: "white", backgroundColor: "#D14343" }}>
                {area.icon}
              </div>
              <div className="mission-area-text">
                <h2>{area.title}</h2>
                <p>{area.description}</p>
              </div>
            </div>
            <div className="progress-bar">
              <motion.div
                className="progress-bar-inner"
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        className="mission-footer glassmorphism"
        initial={{ opacity: 1, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}
      >
        <h2>Join Our Mission</h2>
        <p>Be part of the change you want to see in the world. Together, we can create lasting impact.</p>
        <div className="mission-buttons">
          <button 
            className="join-mission-btn glassmorphism-btn donate-btn"
            style={{
              background: '#D14343',
              backdropFilter: 'blur(5px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
              color: '#fff',
              marginRight: '15px'
            }}
            onClick={() => navigate('/campaigns')}
          >
            Donate now
          </button>
          <button 
            className="join-mission-btn glassmorphism-btn volunteer-btn"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(5px)',
              border: '2px solid #D14343',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
              color: '#D14343'
            }}
            onClick={() => navigate('/volunteer-join')}
          >
             Volunteer
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OurMission; 