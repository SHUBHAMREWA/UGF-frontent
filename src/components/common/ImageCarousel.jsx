import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ImageCarousel.css';

const ImageCarousel = ({ images, className = '', autoPlay = true, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || !isPlaying || images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, isPlaying, images.length, interval]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying);
  };

  if (!images || images.length === 0) {
    return (
      <div className={`image-carousel no-images ${className}`}>
        <div className="no-image-placeholder">
          <span>No Images</span>
        </div>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className={`image-carousel single-image ${className}`}>
        <img src={images[0]} alt="Single image" />
      </div>
    );
  }

  return (
    <div className={`image-carousel ${className}`}>
      <div className="carousel-container">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            className="carousel-image"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button 
          className="carousel-nav carousel-prev" 
          onClick={goToPrevious}
          aria-label="Previous image"
        >
          {/* Bold left chevron */}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="15 18 9 12 15 6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        
        <button 
          className="carousel-nav carousel-next" 
          onClick={goToNext}
          aria-label="Next image"
        >
          {/* Bold right chevron */}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="9 6 15 12 9 18" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Auto-play toggle */}
        <button 
          className="carousel-autoplay" 
          onClick={toggleAutoPlay}
          aria-label={isPlaying ? 'Pause auto-play' : 'Start auto-play'}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            {isPlaying ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            )}
          </svg>
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="carousel-dots">
        {images.map((_, index) => (
          <button
            key={index}
            className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>

      {/* Image Counter */}
      <div className="carousel-counter">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
};

export default ImageCarousel; 