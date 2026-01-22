import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, Clock, MapPin, Share2, Image as ImageIcon } from 'lucide-react';
import ImageCarousel from '../components/common/ImageCarousel';
import ShareButton from '../components/common/ShareButton';
import api from '../utils/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import PageLoader from '../components/PageLoader';
import usePageLoader from '../hooks/usePageLoader';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isPageLoading = usePageLoader();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/events/${id}`);
        if (response.data.success) {
          setEvent(response.data.data);
        } else if (response.data._id) {
          setEvent(response.data);
        } else {
          throw new Error('Failed to fetch event');
        }
      } catch (err) {
        setError(err.message || 'Failed to load event details');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (isPageLoading || loading) {
    return <PageLoader subtitle="Loading event details..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-8 px-6 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <CardTitle className="text-destructive mb-4">Error Loading Event</CardTitle>
          <p className="text-sm text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => navigate('/events')}>Back to Events</Button>
        </Card>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background py-8 px-6 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <CardTitle className="text-foreground mb-4">Event Not Found</CardTitle>
          <p className="text-sm text-muted-foreground mb-6">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/events')}>Back to Events</Button>
        </Card>
      </div>
    );
  }

  const getImages = () => {
    if (event.images && event.images.length > 0) {
      return event.images;
    } else if (event.image) {
      return [event.image];
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
          onClick={() => navigate('/events')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Events
        </Button>
      </div>

      {images.length > 0 && (
        <div className="max-w-[1280px] mx-auto px-6 mb-8">
          <Card className="overflow-hidden">
            <div className="h-64 md:h-96">
              <ImageCarousel
                images={images}
                className="w-full h-full object-cover"
                autoPlay={true}
                interval={5000}
              />
            </div>
          </Card>
        </div>
      )}

      <div className="max-w-[1280px] mx-auto px-6 pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold text-foreground">{event.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pb-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{format(new Date(event.date), 'MMMM d, yyyy')}</span>
                  </div>
                  {event.startTime && event.endTime && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>{event.startTime} - {event.endTime}</span>
                    </div>
                  )}
                  {event.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">About This Event</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {event.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-foreground">Share This Event</CardTitle>
              </CardHeader>
              <CardContent>
                <ShareButton
                  url={window.location.href}
                  title={event.title}
                  description={`Join us for ${event.title} on ${format(new Date(event.date), 'MMMM d, yyyy')} at ${event.location || 'our venue'}. ${event.description}`}
                >
                  <Button variant="outline" size="sm" className="w-full">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Event
                  </Button>
                </ShareButton>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-foreground">Event Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium text-foreground">
                    {format(new Date(event.date), 'MMM dd, yyyy')}
                  </span>
                </div>
                {event.startTime && event.endTime && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-medium text-foreground">
                      {event.startTime} - {event.endTime}
                    </span>
                  </div>
                )}
                {event.location && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-medium text-foreground">{event.location}</span>
                  </div>
                )}
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
                  onClick={() => navigate('/events')}
                >
                  View All Events
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => navigate('/programs')}
                >
                  View Programs
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => navigate('/campaigns')}
                >
                  Support Campaigns
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
