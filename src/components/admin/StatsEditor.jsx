import React, { useState, useEffect } from 'react';
import { Users, Globe, Star, HandHeart } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import withAdminAccess from '../Auth/withAdminAccess';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

const StatsEditor = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statsData, setStatsData] = useState({
    activeVolunteers: { value: '50K+', label: 'Active Volunteers', icon: Users },
    ngosImpacted: { value: '1200+', label: 'NGOs Impacted', icon: Globe },
    trustScore: { value: '4.9', label: 'Trust Score', icon: Star },
    totalImpact: { value: '₹300Cr+', label: 'Total Impact', icon: HandHeart }
  });

  useEffect(() => {
    const fetchStatsData = async () => {
      try {
        const response = await api.get('/content/stats');
        if (response.data.success) {
          const apiData = response.data.data.data;
          if (apiData && apiData.activeVolunteers) {
            const cleanData = {
              activeVolunteers: apiData.activeVolunteers || { value: '100+', label: 'Active Volunteers', icon: Users },
              ngosImpacted: apiData.ngosImpacted || { value: '1200+', label: 'NGOs Impacted', icon: Globe },
              trustScore: apiData.trustScore || { value: '4.9', label: 'Trust Score', icon: Star },
              totalImpact: apiData.totalImpact || { value: '₹300Cr+', label: 'Total Impact', icon: HandHeart }
            };
            setStatsData(cleanData);
          } else {
            const savedStats = localStorage.getItem('admin-stats');
            if (savedStats) {
              setStatsData(JSON.parse(savedStats));
            }
          }
        }
      } catch (error) {
        console.error('Error fetching stats data:', error);
        const savedStats = localStorage.getItem('admin-stats');
        if (savedStats) {
          setStatsData(JSON.parse(savedStats));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStatsData();
  }, []);

  const handleChange = (statKey, field, value) => {
    setStatsData(prev => ({
      ...prev,
      [statKey]: {
        ...prev[statKey],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const requiredFields = ['activeVolunteers', 'ngosImpacted', 'trustScore', 'totalImpact'];
    for (const field of requiredFields) {
      if (!statsData[field]?.value || !statsData[field]?.label) {
        toast.error(`Please fill in all required fields for ${statsData[field]?.label || field}`);
        return;
      }
    }
    
    try {
      setSaving(true);
      
      try {
        const response = await api.put('/content/stats', { data: statsData });
        if (response.data.success) {
          toast.success('Statistics updated successfully!');
          return;
        }
      } catch (apiError) {
        console.warn('API not available, using localStorage fallback:', apiError);
      }
      
      localStorage.setItem('admin-stats', JSON.stringify(statsData));
      toast.success('Statistics updated successfully! (Saved locally)');
    } catch (error) {
      toast.error('Failed to save statistics. Please try again.');
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
        <h2 className="text-lg font-semibold text-foreground">Our Impact in Numbers</h2>
        <p className="text-xs text-muted-foreground mt-1">Manage the statistics displayed on your homepage</p>
      </div>

      <Card className="bg-muted/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Live Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(statsData).map(([key, stat]) => {
              const Icon = stat.icon;
              return (
                <div key={key} className="text-center p-3 rounded-lg bg-card border border-border">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-lg font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(statsData).map(([key, stat]) => {
            const Icon = stat.icon;
            return (
              <Card key={key}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-3 h-3 text-primary" />
                    </div>
                    <CardTitle className="text-sm font-semibold">{stat.label}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">Value</label>
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => handleChange(key, 'value', e.target.value)}
                      placeholder="e.g., 50K+, 1200+, 4.9, ₹300Cr+"
                      required
                      className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">Label</label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => handleChange(key, 'label', e.target.value)}
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
            {saving ? 'Updating...' : 'Update Statistics'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default withAdminAccess(StatsEditor);
