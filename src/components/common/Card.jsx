import React from "react";
import { motion } from "framer-motion";

const Card = ({ children, className = "", onClick, ...props }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`bg-white rounded-xl shadow-soft overflow-hidden ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card; 