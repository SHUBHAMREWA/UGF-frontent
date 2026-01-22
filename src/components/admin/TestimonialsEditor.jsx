import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Star, X, Save } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import ImageCropper from '../common/ImageCropper';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

const TestimonialsEditor = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    organization: '',
    message: '',
    rating: 5,
    image: null,
    isActive: true,
    displayOrder: 0
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await api.get('/testimonials/admin/all');
      setTestimonials(response.data.testimonials || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error('Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageCropped = (image) => {
    setSelectedImage(image);
    setImagePreview(URL.createObjectURL(image));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('designation', formData.designation);
      submitData.append('organization', formData.organization);
      submitData.append('message', formData.message);
      submitData.append('rating', formData.rating);
      submitData.append('isActive', formData.isActive);
      submitData.append('displayOrder', formData.displayOrder);

      if (selectedImage) {
        submitData.append('image', selectedImage);
      }

      if (editingTestimonial) {
        await api.put(`/testimonials/${editingTestimonial._id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Testimonial updated successfully');
      } else {
        await api.post('/testimonials', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Testimonial created successfully');
      }

      resetForm();
      fetchTestimonials();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast.error(error.response?.data?.message || 'Failed to save testimonial');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      designation: testimonial.designation || '',
      organization: testimonial.organization || '',
      message: testimonial.message,
      rating: testimonial.rating,
      isActive: testimonial.isActive !== false,
      displayOrder: testimonial.displayOrder || 0
    });
    if (testimonial.image) {
      setImagePreview(testimonial.image);
    }
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      await api.delete(`/testimonials/${id}`);
      toast.success('Testimonial deleted successfully');
      fetchTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast.error('Failed to delete testimonial');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      designation: '',
      organization: '',
      message: '',
      rating: 5,
      image: null,
      isActive: true,
      displayOrder: 0
    });
    setEditingTestimonial(null);
    setSelectedImage(null);
    setImagePreview(null);
    setShowForm(false);
  };

  if (loading && testimonials.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Testimonials Management</h2>
          <p className="text-xs text-muted-foreground mt-1">Manage customer testimonials and reviews</p>
        </div>
        <Button
          size="sm"
          onClick={() => setShowForm(true)}
        >
          <Plus className="w-3 h-3 mr-2" />
          Add Testimonial
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">
                {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter person's name"
                    required
                    className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Designation *</label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    placeholder="e.g., Community Leader"
                    required
                    className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Organization</label>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleInputChange}
                    placeholder="e.g., ABC Foundation"
                    className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Rating *</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                        className={`p-1 ${star <= formData.rating ? 'text-primary' : 'text-muted'}`}
                      >
                        <Star className={`w-4 h-4 ${star <= formData.rating ? 'fill-primary' : ''}`} />
                      </button>
                    ))}
                    <span className="text-xs text-muted-foreground ml-2">{formData.rating} / 5</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Testimonial Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Write the testimonial message..."
                  rows="4"
                  required
                  className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">{formData.message.length} / 500 characters</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Avatar/Photo</label>
                <ImageCropper
                  onImageCropped={handleImageCropped}
                  aspectRatio={1}
                  circular={true}
                  maxWidth={400}
                  maxHeight={400}
                  buttonText="Upload Avatar"
                  maxFileSize={2 * 1024 * 1024}
                />
                {imagePreview && (
                  <div className="mt-3 flex items-center gap-3">
                    <img src={imagePreview} alt="Avatar preview" className="w-16 h-16 rounded-full object-cover border border-border" />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                      }}
                    >
                      <Trash2 className="w-3 h-3 mr-2" />
                      Remove
                    </Button>
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">Square image recommended. Will be displayed in a circle.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Display Order</label>
                  <input
                    type="number"
                    name="displayOrder"
                    value={formData.displayOrder}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Lower numbers appear first</p>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded border-input"
                    />
                    <span className="text-xs text-foreground">Active (Show on website)</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <Button type="button" variant="outline" size="sm" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={loading}>
                  <Save className="w-3 h-3 mr-2" />
                  {loading ? 'Saving...' : editingTestimonial ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">All Testimonials ({testimonials.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {testimonials.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">No testimonials found. Add your first testimonial above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {testimonials.map((testimonial) => (
                <Card key={testimonial._id} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {testimonial.image ? (
                          <img src={testimonial.image} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-semibold text-primary">{testimonial.name.charAt(0)}</span>
                          </div>
                        )}
                        <div>
                          <h4 className="text-sm font-semibold text-foreground">{testimonial.name}</h4>
                          <p className="text-xs text-muted-foreground">{testimonial.designation}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(testimonial)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(testimonial._id)}
                        >
                          <Trash2 className="w-3 h-3 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-3 mb-2">{testimonial.message}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < testimonial.rating ? 'text-primary fill-primary' : 'text-muted'}`}
                          />
                        ))}
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        testimonial.isActive ? 'bg-secondary/10 text-secondary' : 'bg-muted text-muted-foreground'
                      }`}>
                        {testimonial.isActive ? 'Active' : 'Inactive'}
                      </span>
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

export default TestimonialsEditor;
