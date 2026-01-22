import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, X, Save, Image as ImageIcon } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import ImageCropper from '../common/ImageCropper';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

const GalleryEditor = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'events',
    image: null
  });
  const [showForm, setShowForm] = useState(false);

  const fetchGalleryItems = async () => {
    try {
      const response = await api.get('/gallery');
      setGalleryItems(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch gallery items');
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImagesChange = (newImages) => {
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitFormData = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (key !== 'image') {
          submitFormData.append(key, formData[key]);
        }
      });

      if (images.length > 0) {
        submitFormData.append('image', images[0].file);
      }

      images.forEach((image) => {
        submitFormData.append('images', image.file);
      });

      if (selectedItem && existingImages.length > 0) {
        submitFormData.append('existingImages', JSON.stringify(existingImages));
      }

      if (selectedItem) {
        await api.put(`/gallery/${selectedItem._id}`, submitFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Gallery item updated successfully');
      } else {
        if (images.length === 0 && existingImages.length === 0) {
          toast.error('At least one image is required for gallery items');
          setLoading(false);
          return;
        }
        await api.post('/gallery', submitFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Gallery item added successfully');
      }

      fetchGalleryItems();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      image: ''
    });
    
    if (item.images && item.images.length > 0) {
      setExistingImages(item.images);
    } else {
      setExistingImages([]);
    }
    
    setImages([]);
    setShowForm(true);
  };

  const resetForm = () => {
    setSelectedItem(null);
    setImages([]);
    setExistingImages([]);
    setFormData({
      title: '',
      description: '',
      category: 'events',
      image: null
    });
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await api.delete(`/gallery/${id}`);
      toast.success('Gallery item deleted successfully');
      fetchGalleryItems();
    } catch (error) {
      toast.error('Failed to delete gallery item');
    }
  };

  const removeExistingImage = (imageIndex) => {
    setExistingImages(prev => prev.filter((_, index) => index !== imageIndex));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Gallery Management</h2>
          <p className="text-xs text-muted-foreground mt-1">Manage your gallery images and photos</p>
        </div>
        <Button size="sm" onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="w-3 h-3 mr-2" />
          Add Gallery Item
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">
                {selectedItem ? 'Edit Gallery Item' : 'Add Gallery Item'}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring resize-none"
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
                  <option value="events">Events</option>
                  <option value="programs">Programs</option>
                  <option value="people">People</option>
                  <option value="nature">Nature</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Gallery Images</label>
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
                  aspectRatio={null}
                  maxWidth={2400}
                  maxHeight={2400}
                  buttonText="Add Gallery Image"
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
                <Button type="submit" size="sm" disabled={loading}>
                  <Save className="w-3 h-3 mr-2" />
                  {loading ? 'Saving...' : selectedItem ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Gallery Items ({galleryItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {galleryItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">No gallery items found. Add your first item above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryItems.map(item => (
                <Card key={item._id} className="border overflow-hidden">
                  <div className="relative">
                    <img src={item.image} alt={item.title} className="w-full h-32 object-cover" />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(item)}
                        className="h-6 w-6 p-0 bg-background/80"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item._id)}
                        className="h-6 w-6 p-0 bg-background/80"
                      >
                        <Trash2 className="w-3 h-3 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <h4 className="text-xs font-semibold text-foreground mb-1 line-clamp-1">{item.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{item.description}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary capitalize">
                      {item.category}
                    </span>
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

export default GalleryEditor;
