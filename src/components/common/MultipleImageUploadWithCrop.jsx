import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaTimes, FaImage } from 'react-icons/fa';
import ImageCropper from './ImageCropper';
import './MultipleImageUpload.css';

/**
 * Enhanced Multiple Image Upload with Crop functionality
 * Drop-in replacement for MultipleImageUpload.jsx
 */
const MultipleImageUploadWithCrop = ({ 
  images = [], 
  onImagesChange, 
  maxImages = 10, 
  aspectRatio = null, // Aspect ratio for cropping (null = free crop)
  circular = false, // Circular crop for profile pictures
  maxFileSize = 5 * 1024 * 1024, // 5MB
  className = ''
}) => {
  const [currentImages, setCurrentImages] = useState(images);

  const handleImageCropped = (croppedImage) => {
    if (currentImages.length >= maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Create preview URL
    const imageData = {
      id: Date.now() + Math.random(),
      file: croppedImage,
      preview: URL.createObjectURL(croppedImage),
      name: croppedImage.name,
      size: croppedImage.size
    };

    const updatedImages = [...currentImages, imageData];
    setCurrentImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const handleRemoveImage = (imageId) => {
    const updatedImages = currentImages.filter(img => img.id !== imageId);
    setCurrentImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const handleClearAll = () => {
    // Revoke all preview URLs to free memory
    currentImages.forEach(img => {
      if (img.preview.startsWith('blob:')) {
        URL.revokeObjectURL(img.preview);
      }
    });
    setCurrentImages([]);
    onImagesChange([]);
  };

  return (
    <div className={`multiple-image-upload ${className}`}>
      <div className="upload-area">
        <ImageCropper
          onImageCropped={handleImageCropped}
          aspectRatio={aspectRatio}
          circular={circular}
          maxFileSize={maxFileSize}
          buttonText={`Upload Image ${currentImages.length > 0 ? `(${currentImages.length}/${maxImages})` : ''}`}
        />
        
        {currentImages.length > 0 && (
          <button 
            type="button"
            onClick={handleClearAll} 
            className="clear-all-btn"
          >
            <FaTimes /> Clear All
          </button>
        )}
      </div>

      <AnimatePresence>
        {currentImages.length > 0 && (
          <motion.div 
            className="images-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {currentImages.map((image) => (
              <motion.div
                key={image.id}
                className="image-item"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                layout
              >
                <img 
                  src={image.preview} 
                  alt={image.name}
                  className={circular ? 'circular-preview' : ''}
                />
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => handleRemoveImage(image.id)}
                  title="Remove image"
                >
                  <FaTrash />
                </button>
                <div className="image-info">
                  <span className="image-name">{image.name}</span>
                  <span className="image-size">
                    {(image.size / 1024).toFixed(2)} KB
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {currentImages.length === 0 && (
        <div className="empty-state">
          <FaImage className="empty-icon" />
          <p>No images uploaded yet</p>
          <p className="empty-hint">Click the button above to add images</p>
        </div>
      )}

      <div className="upload-info">
        <span className="info-text">
          {maxImages - currentImages.length} / {maxImages} remaining
        </span>
        <span className="info-text">
          Max file size: {(maxFileSize / (1024 * 1024)).toFixed(0)}MB
        </span>
      </div>
    </div>
  );
};

export default MultipleImageUploadWithCrop;
