import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, MapPin, Users, Calendar, TrendingUp, Share2, Heart, HandHeart } from 'lucide-react';
import ImageCarousel from '../components/common/ImageCarousel';
import ShareButton from '../components/common/ShareButton';
import api from '../utils/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import PageLoader from '../components/PageLoader';
import usePageLoader from '../hooks/usePageLoader';

const ProgramDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isPageLoading = usePageLoader();

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/programs/${id}`);
        if (response.data.success) {
          setProgram(response.data.data);
        } else if (response.data._id) {
          setProgram(response.data);
        } else {
          throw new Error('Failed to fetch program');
        }
      } catch (err) {
        setError(err.message || 'Failed to load program details');
      } finally {
        setLoading(false);
      }
    };
    fetchProgram();
  }, [id]);

  if (isPageLoading || loading) {
    return <PageLoader subtitle="Loading program details..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-8 px-6 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <CardTitle className="text-destructive mb-4">Error Loading Program</CardTitle>
          <p className="text-sm text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => navigate('/programs')}>Back to Programs</Button>
        </Card>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-background py-8 px-6 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <CardTitle className="text-foreground mb-4">Program Not Found</CardTitle>
          <p className="text-sm text-muted-foreground mb-6">
            The program you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/programs')}>Back to Programs</Button>
        </Card>
      </div>
    );
  }

  const getCategoryDisplayName = (category) => {
    const categoryMap = {
      'health': 'Health & Wellness',
      'education': 'Education',
      'food': 'Food Security',
      'social': 'Social Welfare',
      'environment': 'Environment'
    };
    return categoryMap[category] || category;
  };

  const getImages = () => {
    if (program.images && program.images.length > 0) {
      return program.images;
    } else if (program.image) {
      return [program.image];
    }
    return [];
  };

  const images = getImages();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1280px] mx-auto px-6 py-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/programs')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Programs
        </Button>
      </div>

      {images.length > 0 && (
        <div className="max-w-[1280px] mx-auto px-6 mb-8">
          <Card className="overflow-hidden">
            <div className="h-64 md:h-96 relative">
              <ImageCarousel
                images={images}
                className="w-full h-full object-cover"
                autoPlay={true}
                interval={5000}
              />
              <div className="absolute top-4 left-4">
                <Badge variant="secondary" className="text-xs">
                  {getCategoryDisplayName(program.category)}
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="max-w-[1280px] mx-auto px-6 pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold text-foreground">{program.title}</CardTitle>
                {program.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{program.location}</span>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">About This Program</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {program.description}
                  </p>
                </div>

                {program.impact && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2">Our Impact</h3>
                    <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="p-4">
                        <p className="text-sm text-foreground leading-relaxed">{program.impact}</p>
                      </CardContent>
                    </Card>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">Program Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="text-xs text-muted-foreground mb-1">Category</div>
                      <div className="text-sm font-medium text-foreground">
                        {getCategoryDisplayName(program.category)}
                      </div>
                    </div>
                    {program.location && (
                      <div className="p-3 rounded-lg bg-muted/50">
                        <div className="text-xs text-muted-foreground mb-1">Location</div>
                        <div className="text-sm font-medium text-foreground">{program.location}</div>
                      </div>
                    )}
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="text-xs text-muted-foreground mb-1">Status</div>
                      <div className="text-sm font-medium text-foreground">
                        {program.active ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                    {program.createdAt && (
                      <div className="p-3 rounded-lg bg-muted/50">
                        <div className="text-xs text-muted-foreground mb-1">Started</div>
                        <div className="text-sm font-medium text-foreground">
                          {format(new Date(program.createdAt), 'MMM dd, yyyy')}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-foreground">Get Involved</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full"
                  onClick={() => navigate('/campaigns')}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Donate to This Program
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/volunteer-join')}
                >
                  <HandHeart className="w-4 h-4 mr-2" />
                  Volunteer
                </Button>
                <ShareButton
                  url={window.location.href}
                  title={program.title}
                  description={`Check out this amazing program: ${program.title}. ${program.description}`}
                >
                  <Button variant="outline" size="sm" className="w-full">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Program
                  </Button>
                </ShareButton>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-foreground">Program Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Beneficiaries</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {program.beneficiaries ? `${program.beneficiaries}+` : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Years Active</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {program.yearsActive ? program.yearsActive : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">Success Rate</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {program.successRate ? `${program.successRate}%` : 'N/A'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-foreground">Explore More</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => navigate('/programs')}
                >
                  View All Programs
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => navigate('/events')}
                >
                  Upcoming Events
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => navigate('/gallery')}
                >
                  Program Gallery
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetails;
