import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Save, Eye, DollarSign, Calendar, Target, TrendingUp, Image as ImageIcon, Package } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import ImageCropper from '../common/ImageCropper';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import CampaignAddOns from './CampaignAddOns';
import CampaignOrders from './CampaignOrders';
import ImageLoader from '../ImageLoader';

const CampaignsEditor = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [images, setImages] = useState([]); // Store uploaded image URLs
  const [existingImages, setExistingImages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(new Set()); // Track which images are uploading
  const [ordersCampaign, setOrdersCampaign] = useState(null); // Campaign for viewing orders
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal: '',
    collectedAmount: 0,
    minDonationAmount: 100,
    category: 'other',
    location: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    status: 'active',
    active: true,
    popular: false,
    benefits: [''],
    isForUser: false,
    CampaignForUser: ''
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await api.get('/donations');
      if (response.data.success) {
        setCampaigns(response.data.data || []);
      }
    } catch (error) {
      toast.error('Failed to fetch campaigns');
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

  const handleImagesChange = (newImages) => {
    setImages(newImages);
  };

  // Upload image to Firebase Storage immediately after cropping
  const uploadImageToFirebase = async (file, imageId) => {
    try {
      setUploadingImages(prev => new Set(prev).add(imageId));
      
      const { uploadImageToFirebase: uploadToFirebase } = await import('../../utils/firebaseStorage');
      const imageUrl = await uploadToFirebase(file, 'campaigns');

      setUploadingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(imageId);
        return newSet;
      });
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(imageId);
        return newSet;
      });
      toast.error(error.message || 'Failed to upload image');
      throw error;
    }
  };

  const addBenefit = () => {
    setFormData(prev => ({
      ...prev,
      benefits: [...prev.benefits, '']
    }));
  };

  const removeBenefit = (index) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  const updateBenefit = (index, value) => {
    const newBenefits = [...formData.benefits];
    newBenefits[index] = value;
    setFormData(prev => ({
      ...prev,
      benefits: newBenefits
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if any images are still uploading
    const hasUploadingImages = images.some(img => img.uploading || !img.url);
    if (hasUploadingImages) {
      toast.error('Please wait for all images to finish uploading before saving');
      return;
    }

    // Filter out images without URLs (shouldn't happen, but safety check)
    const validImages = images.filter(img => img.url).map(img => img.url);
    
    try {
      setLoading(true);
      
      // Prepare data - images are already uploaded URLs
      const submitData = {
        ...formData,
        benefits: formData.benefits.filter(b => b.trim() !== ''),
        images: validImages
      };

      // Merge with existing images if updating
      if (selectedCampaign && existingImages.length > 0) {
        submitData.images = [...existingImages, ...submitData.images];
      }

      if (!formData.isForUser) {
        submitData.CampaignForUser = null;
      }
      delete submitData.isForUser;

      // Convert to FormData for multipart/form-data
      const submitFormData = new FormData();
      Object.keys(submitData).forEach(key => {
        if (key === 'benefits' || key === 'images') {
          submitFormData.append(key, JSON.stringify(submitData[key]));
        } else {
          submitFormData.append(key, submitData[key]);
        }
      });

      if (selectedCampaign) {
        await api.put(`/donations/${selectedCampaign._id}`, submitFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Campaign updated successfully');
      } else {
        await api.post('/donations', submitFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Campaign created successfully');
      }
      fetchCampaigns();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (campaign) => {
    console.log('handleEdit called with campaign:', campaign);
    setSelectedCampaign(campaign);
    setFormData({
      title: campaign.title,
      description: campaign.description,
      goal: campaign.goal,
      collectedAmount: campaign.collectedAmount || 0,
      minDonationAmount: campaign.minDonationAmount || 100,
      category: campaign.category || 'other',
      location: campaign.location || '',
      startDate: campaign.startDate ? new Date(campaign.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      endDate: campaign.endDate ? new Date(campaign.endDate).toISOString().split('T')[0] : '',
      status: campaign.status || 'active',
      active: campaign.active !== false,
      popular: campaign.popular || false,
      benefits: campaign.benefits && campaign.benefits.length > 0 ? campaign.benefits : [''],
      isForUser: !!campaign.CampaignForUser,
      CampaignForUser: campaign.CampaignForUser || ''
    });
    
    if (campaign.images && campaign.images.length > 0) {
      setExistingImages(campaign.images);
    } else {
      setExistingImages([]);
    }
    
    setImages([]);
    setShowForm(true);
    console.log('showForm set to true');
    
    // Scroll to form after a brief delay to ensure DOM update
    setTimeout(() => {
      const formElement = document.querySelector('[data-campaign-form]');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        console.log('Scrolled to form');
      } else {
        console.log('Form element not found');
      }
    }, 100);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        await api.delete(`/donations/${id}`);
        toast.success('Campaign deleted successfully');
        fetchCampaigns();
      } catch (error) {
        toast.error('Failed to delete campaign');
      }
    }
  };

  const resetForm = () => {
    setSelectedCampaign(null);
    setImages([]);
    setExistingImages([]);
    setFormData({
      title: '',
      description: '',
      goal: '',
      collectedAmount: 0,
      minDonationAmount: 100,
      category: 'other',
      location: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      status: 'active',
      active: true,
      popular: false,
      benefits: [''],
      isForUser: false,
      CampaignForUser: ''
    });
    setShowForm(false);
  };

  const removeExistingImage = (imageIndex) => {
    setExistingImages(prev => prev.filter((_, index) => index !== imageIndex));
  };

  const calculateProgress = (collected, goal) => {
    if (!goal || goal === 0) return 0;
    return Math.min((collected / goal) * 100, 100);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Campaigns Management</h2>
          <p className="text-xs text-muted-foreground mt-1">Create and manage fundraising campaigns with Razorpay payments</p>
        </div>
        <Button size="sm" onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="w-3 h-3 mr-2" />
          Create Campaign
        </Button>
      </div>

      {showForm && (
        <Card data-campaign-form>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">
                {selectedCampaign ? 'Edit Campaign' : 'Create New Campaign'}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Campaign Title *</label>
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
                  rows="4"
                  className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Fundraising Goal (₹) *</label>
                  <input
                    type="number"
                    name="goal"
                    value={formData.goal}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Minimum Donation (₹)</label>
                  <input
                    type="number"
                    name="minDonationAmount"
                    value={formData.minDonationAmount}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring"
                  >
                    <option value="health">Health</option>
                    <option value="education">Education</option>
                    <option value="food">Food Security</option>
                    <option value="social">Social Welfare</option>
                    <option value="environment">Environment</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Start Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">End Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Campaign Images</label>
                <ImageCropper
                  onImageCropped={async (image) => {
                    const imageId = Date.now();
                    // Create temporary image object with loading state
                    const tempImage = {
                      id: imageId,
                      url: null,
                      preview: URL.createObjectURL(image),
                      name: image.name || 'campaign-image.jpg',
                      uploading: true
                    };
                    handleImagesChange([...images, tempImage]);
                    
                    try {
                      // Upload image immediately after cropping - wait for completion
                      const imageUrl = await uploadImageToFirebase(image, imageId);
                      // Update the image with the URL
                      setImages(prev => prev.map(img => 
                        img.id === imageId 
                          ? { ...img, url: imageUrl, preview: imageUrl, uploading: false }
                          : img
                      ));
                      toast.success('Image uploaded successfully');
                    } catch (error) {
                      // Remove failed image
                      setImages(prev => prev.filter(img => img.id !== imageId));
                      // Error already shown in uploadImageToFirebase
                    }
                  }}
                  aspectRatio={16 / 9}
                  maxWidth={1920}
                  maxHeight={1080}
                  buttonText={uploadingImages.size > 0 ? "Uploading..." : "Add Campaign Image"}
                />
                {uploadingImages.size > 0 && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Uploading {uploadingImages.size} image{uploadingImages.size > 1 ? 's' : ''}... Please wait
                  </div>
                )}
                {images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {images.map((img) => (
                      <div key={img.id} className="relative rounded-md overflow-hidden border border-border">
                        {img.uploading ? (
                          <div className="w-full h-20 bg-muted flex items-center justify-center">
                            <ImageLoader size={24} />
                          </div>
                        ) : (
                          <img src={img.preview} alt={img.name} className="w-full h-20 object-cover" />
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            if (!img.uploading) {
                              handleImagesChange(images.filter(i => i.id !== img.id));
                            }
                          }}
                          disabled={img.uploading}
                          className="absolute top-1 right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs disabled:opacity-50 disabled:cursor-not-allowed"
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

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Benefits</label>
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={benefit}
                      onChange={(e) => updateBenefit(index, e.target.value)}
                      placeholder="Enter benefit"
                      className="flex-1 px-3 py-2 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring"
                    />
                    {formData.benefits.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeBenefit(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addBenefit} className="mt-2">
                  <Plus className="w-3 h-3 mr-2" />
                  Add Benefit
                </Button>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  Active Campaign
                </label>
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    name="popular"
                    checked={formData.popular}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  Mark as Popular
                </label>
              </div>

              <div className="space-y-3 pt-3 border-t border-border">
                <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    name="isForUser"
                    checked={formData.isForUser}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded border-input"
                  />
                  Is this campaign for user?
                </label>
                
                {formData.isForUser && (
                  <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                    <label className="block text-xs font-medium text-foreground mb-1.5">User Email *</label>
                    <input
                      type="email"
                      name="CampaignForUser"
                      value={formData.CampaignForUser}
                      onChange={handleInputChange}
                      required={formData.isForUser}
                      placeholder="Enter user email address"
                      className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring"
                    />
                  </div>
                )}
              </div>

              {selectedCampaign && (
                <div 
                  className="pt-4 border-t border-border"
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <CampaignAddOns 
                    campaignId={selectedCampaign._id} 
                    onUpdate={fetchCampaigns}
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <Button type="button" variant="outline" size="sm" onClick={resetForm}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  size="sm" 
                  disabled={loading || uploadingImages.size > 0 || images.some(img => img.uploading || !img.url)}
                >
                  <Save className="w-3 h-3 mr-2" />
                  {loading 
                    ? 'Saving...' 
                    : uploadingImages.size > 0 || images.some(img => img.uploading || !img.url)
                    ? 'Uploading Images...'
                    : selectedCampaign 
                    ? 'Update Campaign' 
                    : 'Create Campaign'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">All Campaigns ({campaigns.length})</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOrdersCampaign({ _id: 'all', title: 'All Orders' })}
              className="flex items-center gap-2"
            >
              <Package className="w-4 h-4" />
              <span>View All Orders</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading && campaigns.length === 0 ? (
            <div className="flex items-center justify-center py-8 min-h-[200px]">
              <ImageLoader size={80} text="Loading campaigns..." />
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">No campaigns found. Create your first campaign above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {campaigns.map(campaign => {
                const progress = calculateProgress(campaign.collectedAmount, campaign.goal);
                return (
                  <Card key={campaign._id} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {campaign.images && campaign.images.length > 0 && (
                              <img src={campaign.images[0]} alt={campaign.title} className="w-16 h-16 rounded-md object-cover" />
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-sm font-semibold text-foreground">{campaign.title}</h4>
                                {campaign.popular && (
                                  <Badge variant="secondary" className="text-xs">Popular</Badge>
                                )}
                                {campaign.active ? (
                                  <Badge variant="default" className="text-xs">Active</Badge>
                                ) : (
                                  <Badge variant="outline" className="text-xs">Inactive</Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{campaign.description}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Target className="w-3 h-3" />
                                  Goal: {formatCurrency(campaign.goal)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <DollarSign className="w-3 h-3" />
                                  Raised: {formatCurrency(campaign.collectedAmount)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <TrendingUp className="w-3 h-3" />
                                  {progress.toFixed(1)}%
                                </span>
                              </div>
                              <div className="mt-2 w-full bg-muted rounded-full h-1.5">
                                <div
                                  className="bg-primary h-1.5 rounded-full transition-all"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log('Edit campaign clicked:', campaign.title);
                              handleEdit(campaign);
                            }}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDelete(campaign._id);
                            }}
                          >
                            <Trash2 className="w-3 h-3 text-destructive" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              window.open(`/donations/${campaign._id}`, '_blank');
                            }}
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          {campaign.hasAddOns && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setOrdersCampaign(campaign);
                              }}
                              title="View Orders"
                              className="flex items-center gap-1"
                            >
                              <Package className="w-3 h-3" />
                              <span className="text-xs">Orders</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Orders Modal */}
      {ordersCampaign && (
        <CampaignOrders
          campaignId={ordersCampaign._id}
          campaignTitle={ordersCampaign.title}
          onClose={() => setOrdersCampaign(null)}
        />
      )}
    </div>
  );
};

export default CampaignsEditor;

