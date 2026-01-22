import React, { useState, useEffect } from 'react';
import { Heart, Users, Globe, HandHeart, DollarSign, Save, RefreshCw, Image as ImageIcon } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import ImageCropper from '../common/ImageCropper';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

const HeroStatsEditor = () => {
  const [stats, setStats] = useState({
    donations: 10,
    transactions: 1,
    ngos: 1200,
    volunteers: 50,
    raised: 10,
    heroImage: null
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setFetching(true);
      const response = await api.get('/hero-stats');
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching hero stats:', error);
      toast.error('Failed to fetch hero statistics');
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStats(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('donations', stats.donations);
      formData.append('transactions', stats.transactions);
      formData.append('ngos', stats.ngos);
      formData.append('volunteers', stats.volunteers);
      formData.append('raised', stats.raised);

      if (selectedImage) {
        formData.append('heroImage', selectedImage);
      }

      const token = localStorage.getItem('token');
      const response = await api.put('/hero-stats', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        toast.success('Hero statistics updated successfully!');
        setSelectedImage(null);
        fetchStats();
      }
    } catch (error) {
      console.error('Error updating hero stats:', error);
      toast.error(error.response?.data?.message || 'Failed to update hero statistics');
    } finally {
      setLoading(false);
    }
  };

  const statsConfig = [
    {
      name: 'donations',
      label: 'Worth Donations',
      description: 'Total donations worth',
      icon: Heart,
      color: '#ef4444'
    },
    {
      name: 'transactions',
      label: 'Global Donors',
      description: 'Total number of donors',
      icon: Users,
      color: '#3b82f6'
    },
    {
      name: 'ngos',
      label: 'Communities Served',
      description: 'Number of NGOs',
      icon: Globe,
      color: '#10b981'
    },
    {
      name: 'volunteers',
      label: 'Active Volunteers',
      description: 'Number of volunteers',
      icon: Users,
      color: '#f59e0b'
    },
    {
      name: 'raised',
      label: 'Impact Created',
      description: 'Total amount raised',
      icon: DollarSign,
      color: '#8b5cf6'
    }
  ];

  if (fetching) {
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
          <h2 className="text-lg font-semibold text-foreground">Hero Section Statistics</h2>
          <p className="text-xs text-muted-foreground mt-1">Update the statistics displayed on the homepage hero section</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchStats}
          disabled={loading}
        >
          <RefreshCw className={`w-3 h-3 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {statsConfig.map((config) => {
            const Icon = config.icon;
            return (
              <Card key={config.name}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${config.color}20`, color: config.color }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm font-semibold">{config.label}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">{config.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div>
                    <label htmlFor={config.name} className="block text-xs font-medium text-foreground mb-1.5">Value</label>
                    <input
                      type="text"
                      id={config.name}
                      name={config.name}
                      value={stats[config.name]}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter value"
                      className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-primary" />
              <CardTitle className="text-sm font-semibold">Hero Background Image</CardTitle>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Upload a background image for the hero section</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ImageCropper
                onImageCropped={(image) => {
                  setSelectedImage(image);
                }}
                aspectRatio={16 / 9}
                maxWidth={1920}
                maxHeight={1080}
                buttonText="Upload Hero Image"
                maxFileSize={5 * 1024 * 1024}
              />
              
              {selectedImage && (
                <div className="mt-4 p-3 rounded-lg bg-muted/30">
                  <img 
                    src={URL.createObjectURL(selectedImage)} 
                    alt="Hero preview" 
                    className="w-full h-32 object-cover rounded-md mb-2"
                  />
                  <p className="text-xs text-muted-foreground">✅ New image selected: {selectedImage.name}</p>
                </div>
              )}

              {stats.heroImage && !selectedImage && (
                <div className="mt-4 p-3 rounded-lg bg-muted/30">
                  <img 
                    src={stats.heroImage} 
                    alt="Current hero" 
                    className="w-full h-32 object-cover rounded-md mb-2"
                  />
                  <p className="text-xs text-muted-foreground">Current hero image</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            size="sm"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3 h-3 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-3 h-3 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>

      <Card className="bg-muted/30">
        <CardContent className="py-3">
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">Note:</strong> Changes will be reflected on the homepage hero section immediately after saving.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default HeroStatsEditor;
