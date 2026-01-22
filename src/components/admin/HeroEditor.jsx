import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import ImageCropper from '../common/ImageCropper';
import './HeroEditor.css';

const HeroEditor = () => {
  const [heroData, setHeroData] = useState({
    title: '',
    subtitle: '',
    primaryButtonText: '',
    primaryButtonLink: '',
    secondaryButtonText: '',
    secondaryButtonLink: '',
    backgroundImages: []
  });
  
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      const response = await api.get('/hero');
      setHeroData(response.data);
    } catch (error) {
      toast.error('Failed to fetch hero data');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHeroData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      
      // Append text fields
      Object.keys(heroData).forEach(key => {
        if (key !== 'backgroundImages') {
          formData.append(key, heroData[key]);
        }
      });

      // Append images
      imageFiles.forEach(file => {
        formData.append('backgroundImages', file);
      });

      await api.put('/hero', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Hero section updated successfully');
      fetchHeroData();
    } catch (error) {
      toast.error('Failed to update hero section');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero-editor">
      <h2>Edit Hero Section</h2>
      
      <form onSubmit={handleSubmit} className="hero-editor-form">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={heroData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Subtitle</label>
          <textarea
            name="subtitle"
            value={heroData.subtitle}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Primary Button Text</label>
          <input
            type="text"
            name="primaryButtonText"
            value={heroData.primaryButtonText}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Primary Button Link</label>
          <input
            type="text"
            name="primaryButtonLink"
            value={heroData.primaryButtonLink}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Secondary Button Text</label>
          <input
            type="text"
            name="secondaryButtonText"
            value={heroData.secondaryButtonText}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Secondary Button Link</label>
          <input
            type="text"
            name="secondaryButtonLink"
            value={heroData.secondaryButtonLink}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Background Images</label>
          <ImageCropper
            onImageCropped={(image) => {
              setImageFiles([...imageFiles, image]);
            }}
            aspectRatio={21 / 9}
            maxWidth={2560}
            maxHeight={1080}
            buttonText="Add Hero Background Image"
          />
          <small>Select multiple images for the background slideshow</small>
        </div>

        <button 
          type="submit" 
          className="submit-button" 
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Hero Section'}
        </button>
      </form>
    </div>
  );
};

export default HeroEditor; 