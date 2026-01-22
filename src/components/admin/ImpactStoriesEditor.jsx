import React, { useState, useEffect } from 'react';
import { Activity, GraduationCap, Home, Sprout, HandHeart, Clock } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import withAdminAccess from '../Auth/withAdminAccess';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

const ImpactStoriesEditor = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [storiesData, setStoriesData] = useState({
    healthcareAccess: { value: '1.5K+', label: 'Healthcare Access', description: 'People received medical care', icon: Activity },
    educationSupport: { value: '10K+', label: 'Education Support', description: 'Students supported', icon: GraduationCap },
    communityDevelopment: { value: '100+', label: 'Community Development', description: 'Villages transformed', icon: Home },
    environmentalImpact: { value: '1Cr+', label: 'Environmental Impact', description: 'Trees planted', icon: Sprout },
    disasterRelief: { value: '1.7K+', label: 'Disaster Relief', description: 'Families helped', icon: HandHeart },
    volunteerHours: { value: '50K+', label: 'Volunteer Hours', description: 'Hours of service', icon: Clock }
  });

  useEffect(() => {
    const fetchStoriesData = async () => {
      try {
        const response = await api.get('/content/stats');
        if (response.data.success) {
          const apiData = response.data.data.data;
          if (apiData && apiData.healthcareAccess) {
            const cleanData = {
              healthcareAccess: apiData.healthcareAccess || { value: '1.5K+', label: 'Healthcare Access', description: 'People received medical care', icon: Activity },
              educationSupport: apiData.educationSupport || { value: '10K+', label: 'Education Support', description: 'Students supported', icon: GraduationCap },
              communityDevelopment: apiData.communityDevelopment || { value: '100+', label: 'Community Development', description: 'Villages transformed', icon: Home },
              environmentalImpact: apiData.environmentalImpact || { value: '1Cr+', label: 'Environmental Impact', description: 'Trees planted', icon: Sprout },
              disasterRelief: apiData.disasterRelief || { value: '1.7K+', label: 'Disaster Relief', description: 'Families helped', icon: HandHeart },
              volunteerHours: apiData.volunteerHours || { value: '50K+', label: 'Volunteer Hours', description: 'Hours of service', icon: Clock }
            };
            setStoriesData(cleanData);
          } else {
            const savedStories = localStorage.getItem('admin-impact-stories');
            if (savedStories) {
              setStoriesData(JSON.parse(savedStories));
            }
          }
        }
      } catch (error) {
        console.error('Error fetching impact stories data:', error);
        const savedStories = localStorage.getItem('admin-impact-stories');
        if (savedStories) {
          setStoriesData(JSON.parse(savedStories));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStoriesData();
  }, []);

  const handleChange = (storyKey, field, value) => {
    setStoriesData(prev => ({
      ...prev,
      [storyKey]: {
        ...prev[storyKey],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const requiredFields = ['healthcareAccess', 'educationSupport', 'communityDevelopment', 'environmentalImpact', 'disasterRelief', 'volunteerHours'];
    for (const field of requiredFields) {
      if (!storiesData[field]?.value || !storiesData[field]?.label || !storiesData[field]?.description) {
        toast.error(`Please fill in all required fields for ${storiesData[field]?.label || field}`);
        return;
      }
    }
    
    try {
      setSaving(true);
      
      try {
        const response = await api.put('/content/stats', { data: storiesData });
        if (response.data.success) {
          toast.success('Impact stories updated successfully!');
          return;
        }
      } catch (apiError) {
        console.warn('API not available, using localStorage fallback:', apiError);
      }
      
      localStorage.setItem('admin-impact-stories', JSON.stringify(storiesData));
      toast.success('Impact stories updated successfully! (Saved locally)');
    } catch (error) {
      toast.error('Failed to save impact stories. Please try again.');
      console.error('Storage error:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground">Impact Stories</h2>
        <p className="text-xs text-muted-foreground mt-1">Manage the impact stories displayed on your homepage</p>
      </div>

      <Card className="bg-muted/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Live Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(storiesData).map(([key, story]) => {
              const Icon = story.icon;
              return (
                <div key={key} className="text-center p-3 rounded-lg bg-card border border-border">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-lg font-bold text-foreground">{story.value}</div>
                  <div className="text-xs font-medium text-foreground">{story.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{story.description}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(storiesData).map(([key, story]) => {
            const Icon = story.icon;
            return (
              <Card key={key}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-3 h-3 text-primary" />
                    </div>
                    <CardTitle className="text-sm font-semibold">{story.label}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">Value</label>
                    <input
                      type="text"
                      value={story.value}
                      onChange={(e) => handleChange(key, 'value', e.target.value)}
                      placeholder="e.g., 1.5K+, 10K+, 1Cr+"
                      required
                      className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">Label</label>
                    <input
                      type="text"
                      value={story.label}
                      onChange={(e) => handleChange(key, 'label', e.target.value)}
                      required
                      className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">Description</label>
                    <input
                      type="text"
                      value={story.description}
                      onChange={(e) => handleChange(key, 'description', e.target.value)}
                      placeholder="e.g., People received medical care"
                      required
                      className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={saving} size="sm">
            {saving ? 'Updating...' : 'Update Impact Stories'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default withAdminAccess(ImpactStoriesEditor);
