import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUpload, FaTrash, FaTimes } from 'react-icons/fa';
import './MultipleImageUpload.css';

const MultipleImageUpload = ({ 
  images = [], 
  onImagesChange, 
  maxImages = 10, 
  maxFileSize = 5 * 1024 * 1024, // 5MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/jpg'],
  className = ''
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    // Check file size
    if (file.size > maxFileSize) {
      throw new Error(`File size too large. Maximum size is ${maxFileSize / (1024 * 1024)}MB`);
    }

    // Check file type
    if (!acceptedTypes.includes(file.type.toLowerCase())) {
      throw new Error('Invalid file type. Please upload JPEG, JPG or PNG images only');
    }

    return true;
  };

  const processFiles = useCallback((files) => {
    const newImages = [];
    
    Array.from(files).forEach((file) => {
      try {
        validateFile(file);
        
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageData = {
            id: Date.now() + Math.random(),
            file: file,
            preview: reader.result,
            name: file.name,
            size: file.size
          };
          
          newImages.push(imageData);
          
          if (newImages.length === files.length) {
            const updatedImages = [...images, ...newImages];
            if (updatedImages.length <= maxImages) {
              onImagesChange(updatedImages);
            } else {
              alert(`Maximum ${maxImages} images allowed`);
            }
          }
        };
        reader.readAsDataURL(file);
      } catch (error) {
        alert(error.message);
      }
    });
  }, [images, maxImages, maxFileSize, acceptedTypes, onImagesChange]);

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      processFiles(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  };

  const removeImage = (imageId) => {
    const updatedImages = images.filter(img => img.id !== imageId);
    onImagesChange(updatedImages);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`multiple-image-upload ${className}`}>
      <div
        className={`upload-area ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        
        <div className="upload-content">
          <FaUpload className="upload-icon" />
          <h3>Upload Images</h3>
          <p>Drag and drop images here or click to browse</p>
          <p className="upload-hint">
            Maximum {maxImages} images, {maxFileSize / (1024 * 1024)}MB each
          </p>
        </div>
      </div>

      {images.length > 0 && (
        <div className="images-preview">
          <h4>Selected Images ({images.length}/{maxImages})</h4>
          <div className="images-grid">
            <AnimatePresence>
              {images.map((image, index) => (
                <motion.div
                  key={image.id}
                  className="image-preview-item"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <img src={image.preview} alt={`Preview ${index + 1}`} />
                  <div className="image-overlay">
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(image.id);
                      }}
                      title="Remove image"
                    >
                      <FaTimes />
                    </button>
                  </div>
                  <div className="image-info">
                    <span className="image-name">{image.name}</span>
                    <span className="image-size">
                      {(image.size / 1024).toFixed(1)}KB
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultipleImageUpload; 