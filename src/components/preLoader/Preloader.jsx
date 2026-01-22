import React from "react";
import { delay, motion } from "framer-motion";
import "./Preloader.css";

const childVariants = {
  start: {
    x: "0%",
  },
  end: {
    x: "100%",
    transition: {
      duration: 0.7 ,
      delay: 0.1 ,
       ease: "easeOut" ,
    },
  },
};

const Preloader = ({ onFinish }) => {
  return (
    <div className="preloader">
      {[0, 1, 2].map((i) => (
        <div key={i} className="section">
          <motion.div
            className="wipe"
            variants={childVariants}
            initial="start"
            animate="end"
            transition={{ delay: i * 0.12 }}
            onAnimationComplete={i === 2 ? onFinish : undefined}
          />
        </div>
      ))}
    </div>
  );
};

export default Preloader;
