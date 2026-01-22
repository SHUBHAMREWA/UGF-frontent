import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Save, Image as ImageIcon } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import ImageCropper from '../common/ImageCropper';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

const ProgramsEditor = () => {
  const [programs, setPrograms] = useState([]);
  const [editingProgram, setEditingProgram] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'health',
    description: '',
    impact: '',
    location: '',
    beneficiaries: '',
    yearsActive: '',
    successRate: ''
  });
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const fetchPrograms = async () => {
    try {
      const response = await api.get('/programs');
      setPrograms(response.data);
    } catch (error) {
      toast.error('Failed to fetch programs');
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'beneficiaries' || name === 'yearsActive' || name === 'successRate' 
        ? value === '' ? '' : parseInt(value) 
        : value
    }));
  };

  const handleImagesChange = (newImages) => {
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== '') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      images.forEach((image) => {
        formDataToSend.append('images', image.file);
      });

      if (editingProgram && existingImages.length > 0) {
        formDataToSend.append('existingImages', JSON.stringify(existingImages));
      }

      if (editingProgram) {
        await api.put(`/programs/${editingProgram._id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Program updated successfully');
      } else {
        await api.post('/programs', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Program created successfully');
      }

      resetForm();
      fetchPrograms();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (program) => {
    setEditingProgram(program);
    setFormData({
      title: program.title,
      category: program.category,
      description: program.description,
      impact: program.impact,
      location: program.location,
      beneficiaries: program.beneficiaries || '',
      yearsActive: program.yearsActive || '',
      successRate: program.successRate || ''
    });
    
    if (program.images && program.images.length > 0) {
      setExistingImages(program.images);
    } else {
      setExistingImages([]);
    }
    
    setImages([]);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      try {
        await api.delete(`/programs/${id}`);
        toast.success('Program deleted successfully');
        fetchPrograms();
      } catch (error) {
        toast.error('Failed to delete program');
      }
    }
  };

  const removeExistingImage = (imageIndex) => {
    setExistingImages(prev => prev.filter((_, index) => index !== imageIndex));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: 'health',
      description: '',
      impact: '',
      location: '',
      beneficiaries: '',
      yearsActive: '',
      successRate: ''
    });
    setEditingProgram(null);
    setImages([]);
    setExistingImages([]);
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Programs Management</h2>
          <p className="text-xs text-muted-foreground mt-1">Manage your programs and initiatives</p>
        </div>
        <Button size="sm" onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="w-3 h-3 mr-2" />
          Add Program
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">
                {editingProgram ? 'Edit Program' : 'Add New Program'}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Program Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Program Title"
                  required
                  className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring"
                >
                  <option value="health">Health</option>
                  <option value="education">Education</option>
                  <option value="food">Food Security</option>
                  <option value="social">Social Welfare</option>
                  <option value="environment">Environment</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                  required
                  rows="4"
                  className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Impact *</label>
                  <input
                    type="text"
                    name="impact"
                    value={formData.impact}
                    onChange={handleInputChange}
                    placeholder="Impact"
                    required
                    className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Location"
                    required
                    className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Beneficiaries</label>
                  <input
                    type="number"
                    name="beneficiaries"
                    value={formData.beneficiaries}
                    onChange={handleInputChange}
                    placeholder="Number of Beneficiaries"
                    min="0"
                    className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Years Active</label>
                  <input
                    type="number"
                    name="yearsActive"
                    value={formData.yearsActive}
                    onChange={handleInputChange}
                    placeholder="Years Active"
                    min="0"
                    className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Success Rate (%)</label>
                  <input
                    type="number"
                    name="successRate"
                    value={formData.successRate}
                    onChange={handleInputChange}
                    placeholder="Success Rate"
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Program Images</label>
                <ImageCropper
                  onImageCropped={(image) => {
                    const newImage = {
                      id: Date.now(),
                      file: image,
                      preview: URL.createObjectURL(image),
                      name: image.name,
                      size: image.size
                    };
                    handleImagesChange([...images, newImage]);
                  }}
                  aspectRatio={4 / 3}
                  maxWidth={1600}
                  maxHeight={1200}
                  buttonText="Add Program Image"
                />
                {images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {images.map((img) => (
                      <div key={img.id} className="relative rounded-md overflow-hidden border border-border">
                        <img src={img.preview} alt={img.name} className="w-full h-20 object-cover" />
                        <button
                          type="button"
                          onClick={() => handleImagesChange(images.filter(i => i.id !== img.id))}
                          className="absolute top-1 right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {existingImages.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Existing Images</label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {existingImages.map((image, index) => (
                      <div key={index} className="relative rounded-md overflow-hidden border border-border">
                        <img src={image} alt={`Existing ${index + 1}`} className="w-full h-20 object-cover" />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute top-1 right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <Button type="button" variant="outline" size="sm" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  <Save className="w-3 h-3 mr-2" />
                  {editingProgram ? 'Update Program' : 'Add Program'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Existing Programs ({programs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {programs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">No programs found. Add your first program above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {programs.map(program => (
                <Card key={program._id} className="border">
                  <CardContent className="p-4">
                    {program.images && program.images.length > 0 && (
                      <div className="mb-3 rounded-md overflow-hidden">
                        <img src={program.images[0]} alt={program.title} className="w-full h-32 object-cover" />
                      </div>
                    )}
                    <h4 className="text-sm font-semibold text-foreground mb-2">{program.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{program.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {program.beneficiaries && (
                        <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                          👥 {program.beneficiaries}+ Beneficiaries
                        </span>
                      )}
                      {program.yearsActive && (
                        <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                          📅 {program.yearsActive} Years
                        </span>
                      )}
                      {program.successRate && (
                        <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                          📊 {program.successRate}% Success
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(program)}
                        className="flex-1"
                      >
                        <Edit className="w-3 h-3 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(program._id)}
                        className="flex-1"
                      >
                        <Trash2 className="w-3 h-3 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgramsEditor;
