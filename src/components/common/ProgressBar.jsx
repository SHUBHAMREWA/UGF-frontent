import React from "react";
import { motion } from "framer-motion";

const ProgressBar = ({ percentage, height = 8, color = "primary" }) => {
  const colors = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    accent: "bg-accent",
  };

  return (
    <div
      className="w-full bg-gray-200 rounded-full overflow-hidden"
      style={{ height: `${height}px` }}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-full ${colors[color] || colors.primary}`}
      />
    </div>
  );
};

export default ProgressBar; 