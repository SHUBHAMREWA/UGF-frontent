import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SuccessStories = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const stories = [
    {
      id: 1,
      name: "Sarah's Education Journey",
      location: "Kenya",
      quote: "Thanks to the scholarship funded by donors, I was able to complete my education and become the first doctor in my village.",
      image: "/success-story-1.jpg",
    },
    {
      id: 2,
      name: "Clean Water for Maweni Village",
      location: "Tanzania",
      quote: "Our community now has access to clean water. Children are healthier and can attend school regularly instead of walking miles to fetch water.",
      image: "/success-story-2.jpg",
    },
    {
      id: 3,
      name: "Rebuilding After the Storm",
      location: "Philippines",
      quote: "When the typhoon destroyed our homes, we thought all was lost. The emergency relief and rebuilding support gave us hope again.",
      image: "/success-story-3.jpg",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % stories.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [stories.length]);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + stories.length) % stories.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % stories.length);
  };

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 rounded-full bg-secondary bg-opacity-10 text-secondary font-medium text-sm mb-4">
            Real Impact
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-richBlack mb-4">
            Stories of Transformation
          </h2>
          <p className="text-subtext max-w-2xl mx-auto">
            See how your generosity creates lasting change in the lives of real people around the world.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-background rounded-2xl shadow-medium overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 relative">
                  <img
                    src={stories[currentIndex].image}
                    alt={stories[currentIndex].name}
                    className="w-full h-full object-cover"
                    style={{ minHeight: "300px" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:bg-gradient-to-r" />
                  <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 text-white">
                    <h3 className="text-xl font-bold">{stories[currentIndex].name}</h3>
                    <p className="text-sm opacity-80">{stories[currentIndex].location}</p>
                  </div>
                </div>
                <div className="md:w-1/2 p-6 md:p-12 flex flex-col justify-center">
                  <svg className="text-primary h-12 w-12 mb-6 opacity-80" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories; 