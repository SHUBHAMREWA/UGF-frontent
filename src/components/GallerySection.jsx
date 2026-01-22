import React, { useState, useEffect } from 'react';
import { Heart, Users, Globe, Star, ArrowRight, GraduationCap, Activity, Home, Sprout, Clock } from 'lucide-react';
import api from '../utils/api';
import { Card } from './ui/card';

const GallerySection = () => {
  const [impactStories, setImpactStories] = useState([
    {
      id: 1,
      icon: Activity,
      title: 'Healthcare Access',
      value: '1.5K+',
      description: 'People received medical care',
    },
    {
      id: 2,
      icon: GraduationCap,
      title: 'Education Support',
      value: '10K+',
      description: 'Students supported',
    },
    {
      id: 3,
      icon: Home,
      title: 'Community Development',
      value: '100+',
      description: 'Villages transformed',
    },
    {
      id: 4,
      icon: Sprout,
      title: 'Environmental Impact',
      value: '1Cr+',
      description: 'Trees planted',
    },
              {
                id: 5,
                icon: Heart,
                title: 'Disaster Relief',
                value: '1.7K+',
                description: 'Families helped',
              },
    {
      id: 6,
      icon: Clock,
      title: 'Volunteer Hours',
      value: '50K+',
      description: 'Hours of service',
    }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImpactStories = async () => {
      try {
        let response;
        try {
          response = await api.get('/content/impact-stories');
        } catch (impactError) {
          response = await api.get('/content/stats');
        }
        
        if (response.data.success) {
          const apiData = response.data.data.data;
          
          if (apiData && (apiData.healthcareAccess || apiData.activeVolunteers)) {
            const cleanData = [
              {
                id: 1,
                icon: Activity,
                title: apiData.healthcareAccess?.label || 'Healthcare Access',
                value: apiData.healthcareAccess?.value || '1.5K+',
                description: apiData.healthcareAccess?.description || 'People received medical care',
              },
              {
                id: 2,
                icon: GraduationCap,
                title: apiData.educationSupport?.label || 'Education Support',
                value: apiData.educationSupport?.value || '10K+',
                description: apiData.educationSupport?.description || 'Students supported',
              },
              {
                id: 3,
                icon: Home,
                title: apiData.communityDevelopment?.label || 'Community Development',
                value: apiData.communityDevelopment?.value || '100+',
                description: apiData.communityDevelopment?.description || 'Villages transformed',
              },
              {
                id: 4,
                icon: Sprout,
                title: apiData.environmentalImpact?.label || 'Environmental Impact',
                value: apiData.environmentalImpact?.value || '1Cr+',
                description: apiData.environmentalImpact?.description || 'Trees planted',
              },
              {
                id: 5,
                icon: Heart,
                title: apiData.disasterRelief?.label || 'Disaster Relief',
                value: apiData.disasterRelief?.value || '1.7K+',
                description: apiData.disasterRelief?.description || 'Families helped',
              },
              {
                id: 6,
                icon: Clock,
                title: apiData.volunteerHours?.label || 'Volunteer Hours',
                value: apiData.volunteerHours?.value || '50K+',
                description: apiData.volunteerHours?.description || 'Hours of service',
              }
            ];
            setImpactStories(cleanData);
          }
        }
      } catch (error) {
        console.error('Error fetching impact stories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImpactStories();
  }, []);

  if (loading) {
    return (
      <section className="py-8 px-6 bg-background">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="p-6 text-center">
                <div className="w-16 h-16 bg-muted rounded-xl mx-auto mb-4"></div>
                <div className="h-8 bg-muted rounded w-20 mx-auto mb-2"></div>
                <div className="h-4 bg-muted rounded w-24 mx-auto"></div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 px-6 bg-background">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Our Impact Stories
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            See the real difference we're making in communities around the world
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {impactStories.map((story) => {
            const IconComponent = story.icon;
            return (
              <Card key={story.id} className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center bg-primary/10">
                  <IconComponent className="text-2xl text-primary" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  {story.value}
                </div>
                <div className="text-lg font-semibold text-foreground mb-2">
                  {story.title}
                </div>
                <div className="text-sm text-muted-foreground">
                  {story.description}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
