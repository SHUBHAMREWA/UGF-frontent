import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaArrowsAlt } from 'react-icons/fa';
import axios from 'axios';
import ImageCropper from '../common/ImageCropper';
import './CarouselEditor.css';
import api from '../../utils/api';

const CarouselEditor = () => {
  const [carouselImages, setCarouselImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order: 0
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchCarouselImages();
  }, []);

  const fetchCarouselImages = async () => {
    try {
      setLoading(true);
      const response = await api.get('/carousel/admin', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCarouselImages(response.data.carouselImages || []);
    } catch (error) {
      setError('Failed to fetch carousel images');
      console.error('Error fetching carousel images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size too large. Maximum size is 5MB.');
        return;
      }

      setSelectedFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile && !editingImage) {
      setError('Please select an image file');
      return;
    }

    if (!formData.title || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setUploading(true);
      setError('');

      const data = new FormData();
      if (selectedFile) {
        data.append('image', selectedFile);
      }
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('order', formData.order);

      if (editingImage) {
        // Update existing image
        await api.put(`/carousel/${editingImage._id}`, {
          title: formData.title,
          description: formData.description,
          order: parseInt(formData.order)
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      } else {
        // Create new image
        await api.post('/carousel', data, {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      // Reset form and refresh data
      resetForm();
      fetchCarouselImages();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save carousel image');
      console.error('Error saving carousel image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (image) => {
    setEditingImage(image);
    setFormData({
      title: image.title,
      description: image.description,
      order: image.order
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this carousel image?')) {
      return;
    }

    try {
      await api.delete(`/carousel/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchCarouselImages();
    } catch (error) {
      setError('Failed to delete carousel image');
      console.error('Error deleting carousel image:', error);
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await api.patch(`/carousel/${id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchCarouselImages();
    } catch (error) {
      setError('Failed to toggle carousel image status');
      console.error('Error toggling carousel image status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      order: 0
    });
    setSelectedFile(null);
    setEditingImage(null);
    setShowForm(false);
    setError('');
  };

  const handleReorder = async (dragIndex, dropIndex) => {
    const newOrder = [...carouselImages];
    const [draggedItem] = newOrder.splice(dragIndex, 1);
    newOrder.splice(dropIndex, 0, draggedItem);

    setCarouselImages(newOrder);

    try {
      const carouselIds = newOrder.map(item => item._id);
      await api.patch('/carousel/reorder', {
        carouselIds
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
    } catch (error) {
      setError('Failed to reorder carousel images');
      console.error('Error reordering carousel images:', error);
      fetchCarouselImages(); // Revert to original order
    }
  };

  if (loading) {
    return <div className="carousel-editor-loading">Loading carousel images...</div>;
  }

  return (
    <div className="carousel-editor">
      <div className="carousel-editor-header">
        <h3>Carousel Management</h3>
        <button 
          className="carousel-add-btn"
          onClick={() => setShowForm(true)}
        >
          <FaPlus /> Add New Image
        </button>
      </div>

      {error && (
        <div className="carousel-error">
          {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      {showForm && (
        <div className="carousel-form-overlay">
          <div className="carousel-form">
            <div className="carousel-form-header">
              <h4>{editingImage ? 'Edit Carousel Image' : 'Add New Carousel Image'}</h4>
              <button onClick={resetForm} className="carousel-form-close">×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter image title"
                  maxLength={100}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter image description"
                  maxLength={300}
                  rows={3}
                  required
                />
              </div>

              <div className="form-group">
                <label>Display Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                  placeholder="0"
                  min="0"
                />
              </div>

              {!editingImage && (
                <div className="form-group">
                  <label>Image File *</label>
                  <ImageCropper
                    onImageCropped={(image) => {
                      setSelectedFile(image);
                    }}
                    aspectRatio={16 / 9}
                    maxWidth={1920}
                    maxHeight={1080}
                    buttonText="Upload Carousel Image"
                    maxFileSize={5 * 1024 * 1024}
                  />
                  {selectedFile && (
                    <div style={{ marginTop: '10px', padding: '10px', background: '#f0f0f0', borderRadius: '8px' }}>
                      <p>✅ Image selected: {selectedFile.name}</p>
                    </div>
                  )}
                  <small>Max size: 5MB. Recommended: 1920x1080px</small>
                </div>
              )}

              <div className="carousel-form-actions">
                <button 
                  type="button" 
                  onClick={resetForm}
                  className="carousel-form-cancel"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="carousel-form-save"
                  disabled={uploading}
                >
                  {uploading ? 'Saving...' : (editingImage ? 'Update' : 'Save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="carousel-grid">
        {carouselImages.length === 0 ? (
          <div className="carousel-empty">
            <p>No carousel images found. Add your first image to get started.</p>
          </div>
        ) : (
          carouselImages.map((image, index) => (
            <div key={image._id} className="carousel-item">
              <div className="carousel-item-image">
                <img src={image.imageUrl} alt={image.title} />
                <div className="carousel-item-overlay">
                  <div className="carousel-item-actions">
                    <button
                      onClick={() => handleToggleActive(image._id)}
                      className={`carousel-action-btn ${image.isActive ? 'active' : 'inactive'}`}
                      title={image.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {image.isActive ? <FaEye /> : <FaEyeSlash />}
                    </button>
                    <button
                      onClick={() => handleEdit(image)}
                      className="carousel-action-btn edit"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(image._id)}
                      className="carousel-action-btn delete"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
              <div className="carousel-item-info">
                <h4>{image.title}</h4>
                <p>{image.description}</p>
                <div className="carousel-item-meta">
                  <span className="carousel-order">Order: {image.order}</span>
                  <span className={`carousel-status ${image.isActive ? 'active' : 'inactive'}`}>
                    {image.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {carouselImages.length > 1 && (
        <div className="carousel-reorder-info">
          <p>
            <FaArrowsAlt /> Drag and drop images to reorder them. The order determines the display sequence.
          </p>
        </div>
      )}
    </div>
  );
};

export default CarouselEditor; 