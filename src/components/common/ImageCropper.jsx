import React, { useState, useRef, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { FiUpload, FiX, FiCheck, FiRotateCw, FiZoomIn, FiZoomOut } from 'react-icons/fi';
import './ImageCropper.css';

/**
 * Professional Image Cropper Component with Crop, Rotate, and Zoom features
 * 
 * @param {Object} props
 * @param {Function} props.onImageCropped - Callback with cropped image (File or base64)
 * @param {string} props.aspectRatio - Aspect ratio (e.g., 16/9, 1, 4/3) or null for free crop
 * @param {number} props.maxWidth - Maximum width for output image (default: 1920)
 * @param {number} props.maxHeight - Maximum height for output image (default: 1080)
 * @param {string} props.outputFormat - Output format: 'file' or 'base64' (default: 'file')
 * @param {string} props.quality - Image quality 0-1 (default: 0.9)
 * @param {boolean} props.circular - Show circular crop preview (default: false)
 * @param {string} props.acceptedFormats - Accepted file formats (default: 'image/*')
 */
const ImageCropper = ({
  onImageCropped,
  aspectRatio = null,
  maxWidth = 1920,
  maxHeight = 1080,
  outputFormat = 'file',
  quality = 0.9,
  circular = false,
  acceptedFormats = 'image/*',
  buttonText = 'Upload Image',
  maxFileSize = 5 * 1024 * 1024 // 5MB default
}) => {
  const [src, setSrc] = useState(null);
  const [crop, setCrop] = useState({
    unit: '%',
    width: 90,
    aspect: aspectRatio
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);
  const previewCanvasRef = useRef(null);

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    
    // Validate file size
    if (file.size > maxFileSize) {
      setError(`File size must be less than ${(maxFileSize / 1024 / 1024).toFixed(0)}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    setFileName(file.name);
    
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setSrc(reader.result?.toString() || '');
      setShowModal(true);
      setRotation(0);
      setZoom(1);
    });
    reader.readAsDataURL(file);
  };

  // Generate cropped image
  const getCroppedImg = async () => {
    if (!completedCrop || !imgRef.current || !previewCanvasRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');

    // Calculate dimensions
    const pixelRatio = window.devicePixelRatio;
    const outputWidth = Math.min(crop.width * scaleX, maxWidth);
    const outputHeight = Math.min(crop.height * scaleY, maxHeight);

    canvas.width = outputWidth * pixelRatio;
    canvas.height = outputHeight * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    // Apply rotation and zoom
    const centerX = outputWidth / 2;
    const centerY = outputHeight / 2;
    
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);
    ctx.translate(-centerX, -centerY);

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      outputWidth,
      outputHeight
    );

    ctx.restore();

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(null);
            return;
          }
          
          if (outputFormat === 'base64') {
            canvas.toBlob((blob) => {
              const reader = new FileReader();
              reader.readAsDataURL(blob);
              reader.onloadend = () => {
                resolve(reader.result);
              };
            }, 'image/jpeg', quality);
          } else {
            const file = new File([blob], fileName || 'cropped-image.jpg', {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(file);
          }
        },
        'image/jpeg',
        quality
      );
    });
  };

  // Handle crop completion
  const handleCropComplete = async () => {
    try {
      const croppedImage = await getCroppedImg();
      if (croppedImage) {
        onImageCropped(croppedImage);
        handleClose();
      }
    } catch (e) {
      console.error('Error cropping image:', e);
      setError('Failed to crop image. Please try again.');
    }
  };

  // Handle close modal
  const handleClose = () => {
    setShowModal(false);
    setSrc(null);
    setCompletedCrop(null);
    setRotation(0);
    setZoom(1);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Rotate image
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Handle zoom
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  };

  return (
    <div className="image-cropper">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept={acceptedFormats}
        style={{ display: 'none' }}
      />
      
      <button
        type="button"
        className="upload-button"
        onClick={() => fileInputRef.current?.click()}
      >
        <FiUpload /> {buttonText}
      </button>

      {error && <div className="error-message">{error}</div>}

      {showModal && (
        <div className="image-cropper-modal" onClick={handleClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Crop Image</h3>
              <button className="close-btn" onClick={handleClose}>
                <FiX />
              </button>
            </div>

            <div className="modal-body">
              <div className="crop-container">
                {src && (
                  <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={aspectRatio}
                    circularCrop={circular}
                  >
                    <img
                      ref={imgRef}
                      alt="Crop preview"
                      src={src}
                      style={{
                        transform: `rotate(${rotation}deg) scale(${zoom})`,
                        maxHeight: '60vh',
                        maxWidth: '100%'
                      }}
                      onLoad={() => {
                        if (aspectRatio) {
                          const width = imgRef.current.width;
                          const height = imgRef.current.height;
                          const cropWidth = Math.min(width, height * aspectRatio);
                          const cropHeight = cropWidth / aspectRatio;
                          
                          setCrop({
                            unit: 'px',
                            width: cropWidth,
                            height: cropHeight,
                            x: (width - cropWidth) / 2,
                            y: (height - cropHeight) / 2,
                            aspect: aspectRatio
                          });
                        }
                      }}
                    />
                  </ReactCrop>
                )}
              </div>

              <div className="controls">
                <div className="control-group">
                  <button className="control-btn" onClick={handleRotate} title="Rotate">
                    <FiRotateCw /> Rotate
                  </button>
                  <button className="control-btn" onClick={handleZoomOut} title="Zoom Out">
                    <FiZoomOut /> Zoom Out
                  </button>
                  <button className="control-btn" onClick={handleZoomIn} title="Zoom In">
                    <FiZoomIn /> Zoom In
                  </button>
                </div>
                <div className="zoom-display">Zoom: {(zoom * 100).toFixed(0)}%</div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-cancel" onClick={handleClose}>
                Cancel
              </button>
              <button
                type="button"
                className="btn-confirm"
                onClick={handleCropComplete}
                disabled={!completedCrop}
              >
                <FiCheck /> Crop & Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden canvas for generating cropped image */}
      <canvas
        ref={previewCanvasRef}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ImageCropper;
