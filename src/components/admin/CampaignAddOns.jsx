import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Save, ImageIcon } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import ImageCropper from '../common/ImageCropper';
import { Button } from '../ui/button';
import { uploadImageToFirebase } from '../../utils/firebaseStorage';

const CampaignAddOns = ({ campaignId, onUpdate }) => {
  const [addOns, setAddOns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingAddOn, setEditingAddOn] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    unitPrice: '',
    active: true
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (campaignId) {
      fetchAddOns();
    }
  }, [campaignId]);

  const fetchAddOns = async () => {
    try {
      const response = await api.get(`/donations/${campaignId}/add-ons`);
      if (response.data.success) {
        setAddOns(response.data.addOns || []);
      }
    } catch (error) {
      console.error('Error fetching add-ons:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageCropped = async (image) => {
    try {
      const url = await uploadImageToFirebase(image, 'campaigns/addons');
      setFormData(prev => ({ ...prev, image: url }));
      setImageFile(null);
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };

  const handleSubmit = async (e) => {
    if (e) {
      if (e.preventDefault) e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();
    }
    
    if (!formData.title || !formData.unitPrice) {
      toast.error('Title and price are required');
      return false;
    }

    try {
      setLoading(true);
      if (editingAddOn) {
        await api.put(`/donations/${campaignId}/add-ons/${editingAddOn._id}`, formData);
        toast.success('Add-on updated successfully');
      } else {
        await api.post(`/donations/${campaignId}/add-ons`, formData);
        toast.success('Add-on added successfully');
      }
      fetchAddOns();
      resetForm();
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
    return false;
  };

  const handleEdit = (addOn) => {
    setEditingAddOn(addOn);
    setFormData({
      title: addOn.title || '',
      description: addOn.description || '',
      image: addOn.image || '',
      unitPrice: addOn.unitPrice || '',
      active: addOn.active !== false
    });
    setShowAddForm(true);
  };

  const handleDelete = async (addOnId) => {
    if (!window.confirm('Are you sure you want to delete this add-on?')) return;
    
    try {
      await api.delete(`/donations/${campaignId}/add-ons/${addOnId}`);
      toast.success('Add-on deleted successfully');
      fetchAddOns();
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error('Failed to delete add-on');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      unitPrice: '',
      active: true
    });
    setEditingAddOn(null);
    setShowAddForm(false);
    setImageFile(null);
  };

  return (
    <div className="space-y-4" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Campaign Add-ons</h3>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowAddForm(!showAddForm);
          }}
        >
          <Plus className="w-3 h-3 mr-2" />
          {showAddForm ? 'Cancel' : 'Add Add-on'}
        </Button>
      </div>

      {showAddForm && (
        <div 
          className="p-4 border border-border rounded-lg bg-muted/30"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Price per Unit (₹) *</label>
                <input
                  type="number"
                  name="unitPrice"
                  value={formData.unitPrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Image</label>
              {formData.image && (
                <div className="mb-2 relative inline-block">
                  <img src={formData.image} alt="Preview" className="w-24 h-24 object-cover rounded-md" />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                    className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              <ImageCropper onImageCropped={handleImageCropped} />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleInputChange}
                className="w-4 h-4"
              />
              <label className="text-xs text-foreground">Active</label>
            </div>

            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                size="sm" 
                disabled={loading}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSubmit(e);
                  return false;
                }}
              >
                <Save className="w-3 h-3 mr-2" />
                {editingAddOn ? 'Update' : 'Add'} Add-on
              </Button>
            </div>
          </div>
        </div>
      )}

      {addOns.length > 0 && (
        <div className="space-y-2">
          {addOns.map((addOn) => (
            <div key={addOn._id} className="flex items-center gap-4 p-3 border border-border rounded-lg">
              {addOn.image && (
                <img src={addOn.image} alt={addOn.title} className="w-16 h-16 object-cover rounded-md" />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-foreground">{addOn.title}</h4>
                  {!addOn.active && (
                    <span className="text-xs text-muted-foreground">(Inactive)</span>
                  )}
                </div>
                {addOn.description && (
                  <p className="text-xs text-muted-foreground mb-1">{addOn.description}</p>
                )}
                <p className="text-sm font-medium text-primary">₹{addOn.unitPrice} per unit</p>
              </div>
              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Edit button clicked for:', addOn.title);
                    handleEdit(addOn);
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
                    handleDelete(addOn._id);
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {addOns.length === 0 && !showAddForm && (
        <p className="text-xs text-muted-foreground text-center py-4">
          No add-ons added yet. Click "Add Add-on" to start.
        </p>
      )}
    </div>
  );
};

export default CampaignAddOns;

