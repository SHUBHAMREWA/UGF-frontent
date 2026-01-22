import React, { useState } from 'react';
import ImageCropper from './ImageCropper';

/**
 * Example usage of ImageCropper component
 * Copy and paste this into your forms where you need image upload
 */
const ImageCropperExample = () => {
  const [croppedImage, setCroppedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageCropped = (image) => {
    console.log('Cropped image:', image);
    
    // For file upload to server
    if (image instanceof File) {
      setCroppedImage(image);
      // Create preview URL
      const previewUrl = URL.createObjectURL(image);
      setImagePreview(previewUrl);
    }
    
    // For base64 (e.g., saving to state or database)
    if (typeof image === 'string') {
      setImagePreview(image);
    }
  };

  const handleUploadToServer = async () => {
    if (!croppedImage) return;

    const formData = new FormData();
    formData.append('image', croppedImage);

    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      console.log('Upload response:', data);
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Image Cropper Examples</h2>

      {/* Example 1: Square crop (1:1) for profile pictures */}
      <div style={{ marginBottom: '30px' }}>
        <h3>1. Profile Picture (Square Crop)</h3>
        <ImageCropper
          onImageCropped={handleImageCropped}
          aspectRatio={1}
          circular={true}
          maxWidth={500}
          maxHeight={500}
          buttonText="Upload Profile Picture"
        />
      </div>

      {/* Example 2: Landscape crop (16:9) for banners */}
      <div style={{ marginBottom: '30px' }}>
        <h3>2. Banner Image (16:9)</h3>
        <ImageCropper
          onImageCropped={handleImageCropped}
          aspectRatio={16 / 9}
          maxWidth={1920}
          maxHeight={1080}
          buttonText="Upload Banner"
        />
      </div>

      {/* Example 3: Free crop (no aspect ratio) */}
      <div style={{ marginBottom: '30px' }}>
        <h3>3. Free Crop</h3>
        <ImageCropper
          onImageCropped={handleImageCropped}
          aspectRatio={null}
          buttonText="Upload Image"
        />
      </div>

      {/* Example 4: Get base64 instead of File */}
      <div style={{ marginBottom: '30px' }}>
        <h3>4. Get Base64 Output</h3>
        <ImageCropper
          onImageCropped={handleImageCropped}
          aspectRatio={4 / 3}
          outputFormat="base64"
          buttonText="Upload & Get Base64"
        />
      </div>

      {/* Preview */}
      {imagePreview && (
        <div style={{ marginTop: '30px' }}>
          <h3>Preview:</h3>
          <img
            src={imagePreview}
            alt="Cropped preview"
            style={{
              maxWidth: '400px',
              border: '2px solid #ddd',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          />
          <br />
          <button
            onClick={handleUploadToServer}
            style={{
              marginTop: '16px',
              padding: '10px 20px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Upload to Server
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageCropperExample;
