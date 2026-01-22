import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import ImageCropper from '../common/ImageCropper';
import Loader from '../Loader';

const DonationEditor = () => {
  const [donations, setDonations] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    description: '',
    benefits: [''],
    popular: false,
    active: true,
    goal: '',
    collectedAmount: 0,
    minDonationAmount: 100,
    category: 'other',
    location: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    status: 'active',
    images: []
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/donations');
      if (response.data.success) {
        setDonations(response.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching donations');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate each file
    for (const file of files) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size too large. Maximum size is 5MB');
        return;
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        toast.error('Invalid file type. Please upload JPEG, JPG or PNG images only');
        return;
      }
    }

    setImageFiles(prev => [...prev, ...files]);
    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formattedData = new FormData();
      formattedData.append('title', formData.title);
      formattedData.append('amount', formData.amount);
      formattedData.append('description', formData.description);
      formattedData.append('benefits', JSON.stringify(formData.benefits.filter(benefit => benefit.trim() !== '')));
      formattedData.append('popular', formData.popular);
      formattedData.append('active', formData.active);
      formattedData.append('goal', formData.goal);
      formattedData.append('collectedAmount', formData.collectedAmount);
      formattedData.append('minDonationAmount', formData.minDonationAmount);
      formattedData.append('category', formData.category);
      formattedData.append('location', formData.location);
      formattedData.append('startDate', formData.startDate);
      formattedData.append('endDate', formData.endDate);
      formattedData.append('status', formData.status);

      // Append all image files
      imageFiles.forEach(file => {
        formattedData.append('images', file);
      });

      if (selectedDonation) {
        await api.put(`/donations/${selectedDonation._id}`, formattedData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Donation card updated successfully');
      } else {
        await api.post('/donations', formattedData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Donation card created successfully');
      }

      fetchDonations();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving donation card');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this donation card?')) {
      try {
        setLoading(true);
        await api.delete(`/donations/${id}`);
        toast.success('Donation card deleted successfully');
        fetchDonations();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error deleting donation card');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (donation) => {
    setSelectedDonation(donation);
    setFormData({
      title: donation.title,
      amount: donation.amount,
      description: donation.description,
      benefits: [...donation.benefits],
      popular: donation.popular,
      active: donation.active,
      goal: donation.goal,
      collectedAmount: donation.collectedAmount,
      minDonationAmount: donation.minDonationAmount || 100,
      category: donation.category || 'other',
      location: donation.location || '',
      startDate: new Date(donation.startDate).toISOString().split('T')[0],
      endDate: new Date(donation.endDate).toISOString().split('T')[0],
      status: donation.status || 'active',
      images: donation.images || []
    });
    setImagePreviews(donation.images || []);
  };

  const addBenefit = () => {
    setFormData({
      ...formData,
      benefits: [...formData.benefits, '']
    });
  };

  const removeBenefit = (index) => {
    const newBenefits = formData.benefits.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      benefits: newBenefits
    });
  };

  const updateBenefit = (index, value) => {
    const newBenefits = [...formData.benefits];
    newBenefits[index] = value;
    setFormData({
      ...formData,
      benefits: newBenefits
    });
  };

  const resetForm = () => {
    setSelectedDonation(null);
    setFormData({
      title: '',
      amount: '',
      description: '',
      benefits: [''],
      popular: false,
      active: true,
      goal: '',
      collectedAmount: 0,
      minDonationAmount: 100,
      category: 'other',
      location: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      status: 'active',
      images: []
    });
    setImageFiles([]);
    setImagePreviews([]);
  };

  if (loading) return <Loader text="Loading donations..." />;

  return (
    <div className="donation-editor">
      <h2>{selectedDonation ? 'Edit Donation Card' : 'Create Donation Card'}</h2>

      <form onSubmit={handleSubmit} className="donation-form">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Benefits</label>
          {formData.benefits.map((benefit, index) => (
            <div key={index} className="benefit-input">
              <input
                type="text"
                value={benefit}
                onChange={(e) => updateBenefit(index, e.target.value)}
                placeholder="Enter benefit"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => removeBenefit(index)}
                className="remove-benefit"
                disabled={formData.benefits.length === 1 || loading}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addBenefit}
            className="add-benefit"
            disabled={loading}
          >
            Add Benefit
          </button>
        </div>

        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              checked={formData.popular}
              onChange={(e) => setFormData({...formData, popular: e.target.checked})}
              disabled={loading}
            />
            Popular Option
          </label>
        </div>

        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) => setFormData({...formData, active: e.target.checked})}
              disabled={loading}
            />
            Active
          </label>
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            required
            disabled={loading}
          >
            <option value="education">Education</option>
            <option value="health">Health</option>
            <option value="food">Food</option>
            <option value="social">Social</option>
            <option value="environment">Environment</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Start Date</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>End Date</label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({...formData, endDate: e.target.value})}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            required
            disabled={loading}
          >
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="form-group">
          <label>Minimum Donation Amount (₹)</label>
          <input
            type="number"
            value={formData.minDonationAmount}
            onChange={(e) => setFormData({...formData, minDonationAmount: e.target.value})}
            required
            min="100"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Donation Goal (₹)</label>
          <input
            type="number"
            value={formData.goal}
            onChange={(e) => setFormData({...formData, goal: e.target.value})}
            required
            min="1"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Collected Amount (₹)</label>
          <input
            type="number"
            value={formData.collectedAmount}
            onChange={(e) => setFormData({...formData, collectedAmount: e.target.value})}
            required
            min="0"
            max={formData.goal}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Images</label>
          <ImageCropper
            onImageCropped={(image) => {
              setImageFiles([...imageFiles, image]);
              const preview = URL.createObjectURL(image);
              setImagePreviews([...imagePreviews, preview]);
            }}
            aspectRatio={16 / 9}
            maxWidth={1920}
            maxHeight={1080}
            buttonText="Add Donation Campaign Image"
            maxFileSize={5 * 1024 * 1024}
          />
          <div className="image-previews">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="image-preview">
                <img src={preview} alt={`Preview ${index + 1}`} />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="remove-image"
                  disabled={loading}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {selectedDonation ? 'Update Card' : 'Create Card'}
          </button>
          {selectedDonation && (
            <button
              type="button"
              onClick={resetForm}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="donations-list">
        <h3>Existing Donation Cards</h3>
        {donations.map(donation => (
          <motion.div
            key={donation._id}
            className="donation-item"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="donation-info">
              <h4>{donation.title}</h4>
              <p>₹{donation.amount}/month</p>
              <div className="donation-meta">
                {donation.popular && <span className="popular-badge">Popular</span>}
                {!donation.active && <span className="inactive-badge">Inactive</span>}
                <span className={`status-badge ${donation.status}`}>{donation.status}</span>
              </div>
            </div>
            <div className="donation-actions">
              <button
                onClick={() => handleEdit(donation)}
                className="btn btn-edit"
                disabled={loading}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(donation._id)}
                className="btn btn-delete"
                disabled={loading}
              >
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DonationEditor; 