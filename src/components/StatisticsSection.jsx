import React, { useState, useEffect } from 'react';
import { Users, Globe, Star, Heart, Leaf, Sprout } from 'lucide-react';
import api from '../utils/api';
import { Card } from './ui/card';

const StatisticsSection = () => {
  const [stats, setStats] = useState({
    activeVolunteers: { value: '50K+', label: 'Active Volunteers', icon: 'Users' },
    ngosImpacted: { value: '1200+', label: 'NGOs Impacted', icon: 'Globe' },
    trustScore: { value: '4.9', label: 'Trust Score', icon: 'Star' },
    totalImpact: { value: '₹300Cr+', label: 'Total Impact', icon: 'Heart' }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/content/stats');
        if (response.data.success) {
          const apiData = response.data.data.data;
          
          if (apiData && apiData.activeVolunteers) {
            const cleanData = {
              activeVolunteers: apiData.activeVolunteers || { value: '100+', label: 'Active Volunteers', icon: 'Users' },
              ngosImpacted: apiData.ngosImpacted || { value: '1200+', label: 'NGOs Impacted', icon: 'Globe' },
              trustScore: apiData.trustScore || { value: '4.9', label: 'Trust Score', icon: 'Star' },
              totalImpact: apiData.totalImpact || { value: '₹300Cr+', label: 'Total Impact', icon: 'Heart' }
            };
            setStats(cleanData);
          } else {
            const savedStats = localStorage.getItem('admin-stats');
            if (savedStats) {
              setStats(JSON.parse(savedStats));
            }
          }
        }
      } catch (error) {
        console.error('Error fetching statistics:', error);
        const savedStats = localStorage.getItem('admin-stats');
        if (savedStats) {
          setStats(JSON.parse(savedStats));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getIconComponent = (iconName) => {
    const iconMap = {
      'Users': Sprout,
      'Globe': Sprout,
      'Star': Leaf,
      'Heart': Heart,
    };
    return iconMap[iconName] || Leaf;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="p-6 text-center">
            <div className="w-16 h-16 bg-muted rounded-xl mx-auto mb-4"></div>
            <div className="h-8 bg-muted rounded w-20 mx-auto mb-2"></div>
            <div className="h-4 bg-muted rounded w-24 mx-auto"></div>
          </Card>
        ))}
      </div>
    );
  }

  const statsArray = Object.values(stats);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {statsArray.map((stat, index) => {
        const IconComponent = getIconComponent(stat.icon);
        
        return (
          <Card key={index} className="text-center p-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mx-auto mb-6">
              <div className="w-full h-full rounded-xl flex items-center justify-center bg-primary/10">
                <IconComponent className="text-xl sm:text-2xl lg:text-3xl text-primary" />
              </div>
            </div>
            
            <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-3">
              {stat.value}
            </div>
            <div className="text-gray-700 font-medium text-sm sm:text-base lg:text-lg text-muted-foreground">
              {stat.label}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default StatisticsSection;
