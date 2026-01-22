import React, { useState, useEffect } from 'react';
import { FaFilePdf, FaImage, FaPlus, FaTrash, FaDownload, FaEye } from 'react-icons/fa';
import api from '../utils/api';
import './ImportantUpdates.css';

const ImportantUpdates = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'image', // 'image' only
    imageUrl: '',
    link: '',
    isActive: true
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      const response = await api.get('/important-updates');
      if (response.data.success) {
        setUpdates(response.data.updates);
      }
    } catch (error) {
      console.error('Error fetching updates:', error);
      setError('Failed to fetch updates');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (key === 'file' && formData[key]) {
          formDataToSend.append(key, formData[key]);
        } else if (key !== 'file') {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await api.post('/important-updates', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setSuccess('Update added successfully!');
        setFormData({
          title: '',
          description: '',
          type: 'image',
          imageUrl: '',
          link: '',
          isActive: true
        });
        setShowAddForm(false);
        fetchUpdates();
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add update');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this update?')) {
      return;
    }

    try {
      const response = await api.delete(`/important-updates/${id}`);
      if (response.data.success) {
        setSuccess('Update deleted successfully!');
        fetchUpdates();
      }
    } catch (error) {
      setError('Failed to delete update');
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      const response = await api.put(`/important-updates/${id}/toggle`, {
        isActive: !currentStatus
      });
      if (response.data.success) {
        fetchUpdates();
      }
    } catch (error) {
      setError('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="important-updates-container">
        <div className="loading">Loading important updates...</div>
      </div>
    );
  }

  return (
    <div className="important-updates-container">
      <div className="updates-header">
        <h2>Important Updates & Links</h2>
        <button 
          className="add-update-btn"
          onClick={() => setShowAddForm(true)}
        >
          <FaPlus /> Add Update
        </button>
      </div>

      {success && (
        <div className="success-message">
          <p>{success}</p>
          <button onClick={() => setSuccess('')}>Close</button>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError('')}>Close</button>
        </div>
      )}

      <div className="updates-grid">
        {updates.length > 0 ? (
          updates.map((update) => (
            <div key={update._id} className={`update-card ${!update.isActive ? 'inactive' : ''}`}>
              <div className="update-header">
                <div className="update-type-icon">
                  {update.type === 'pdf' ? <FaFilePdf /> : <FaImage />}
                </div>
                <div className="update-status">
                  <span className={`status-badge ${update.isActive ? 'active' : 'inactive'}`}>
                    {update.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="update-content">
                <h3>
                  {update.link ? (
                    <a 
                      href={update.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="clickable-title"
                    >
                      {update.title}
                    </a>
                  ) : (
                    update.title
                  )}
                </h3>
                <p>{update.description}</p>
                
                <div className="update-actions">
                  {update.imageUrl && update.imageUrl.trim() !== '' && (
                    <a 
                      href={update.imageUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="action-btn view-btn"
                    >
                      <FaEye /> View Image
                    </a>
                  )}
                </div>
              </div>

              <div className="update-footer">
                <button 
                  className="toggle-btn"
                  onClick={() => handleToggleActive(update._id, update.isActive)}
                >
                  {update.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(update._id)}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-updates">
            <p>No important updates found.</p>
          </div>
        )}
      </div>

      {showAddForm && (
        <div className="add-update-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add Important Update</h3>
              <button 
                className="close-btn"
                onClick={() => setShowAddForm(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="add-update-form">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter update title"
                />
              </div>
              
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter update description"
                  rows="3"
                />
              </div>
              
              <div className="form-group">
                <label>Image URL (Optional)</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="Enter image URL (optional)"
                />
                <small>Enter a direct link to an image (JPEG, PNG, GIF) - optional</small>
              </div>
              
              <div className="form-group">
                <label>Link (Optional)</label>
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  placeholder="Enter link URL (optional)"
                />
                <small>If provided, the title will be clickable and open this link</small>
              </div>
              
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  Active (visible to users)
                </label>
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="submit-btn"
                >
                  Add Update
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportantUpdates; 