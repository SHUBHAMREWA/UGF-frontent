import React, { useState, useEffect } from 'react';
import { Quote, Star, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import api from '../utils/api';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import ImageLoader from './ImageLoader';

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await api.get('/testimonials');
      const activeTestimonials = response.data.testimonials?.filter(t => t.isActive !== false) || [];
      if (activeTestimonials.length > 0) {
        setTestimonials(activeTestimonials);
      } else {
        setTestimonials([
          {
            _id: '1',
            name: 'Priya Sharma',
            designation: 'Community Leader',
            organization: 'Mumbai, Maharashtra',
            message: 'The impact United Global Federation India has made in our village is incredible. They\'ve not only provided education but also empowered our women with skills training.',
            rating: 5,
            avatar: null
          },
          {
            _id: '2',
            name: 'Rahul Kumar',
            designation: 'Volunteer',
            organization: 'Delhi',
            message: 'Being part of United Global Federation India has been life-changing. The work we do directly impacts communities and creates lasting positive change.',
            rating: 5,
            avatar: null
          },
          {
            _id: '3',
            name: 'Dr. Anjali Patel',
            designation: 'Healthcare Partner',
            organization: 'Bangalore, Karnataka',
            message: 'Their healthcare initiatives have reached the most remote areas. The dedication and professionalism of the team is outstanding.',
            rating: 5,
            avatar: null
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setTestimonials([
        {
          _id: '1',
          name: 'Priya Sharma',
          designation: 'Community Leader',
          organization: 'Mumbai, Maharashtra',
          message: 'The impact United Global Federation India has made in our village is incredible.',
          rating: 5,
          avatar: null
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  if (loading) {
    return (
      <section className="py-8 px-6 bg-background">
        <div className="max-w-[1280px] mx-auto flex items-center justify-center py-8">
          <ImageLoader size={80} text="Loading testimonials..." />
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[activeIndex];
  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';
  };

  return (
    <section className="py-16 md:py-24 px-6 bg-background">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Stories of Impact
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Real stories from the people whose lives have been transformed by your generosity.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={testimonial._id} className="p-6 h-full flex flex-col">
              <div className="mb-4">
                <Quote className="w-8 h-8 text-primary/20" />
              </div>
              
              <CardContent className="flex-1 p-0 mb-6">
                <p className="text-foreground leading-relaxed mb-4">{testimonial.message}</p>
                
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < (testimonial.rating || 5)
                          ? 'text-primary fill-primary'
                          : 'text-muted fill-muted'
                      }`}
                    />
                  ))}
                </div>
              </CardContent>

              <div className="flex items-center gap-4 pt-4 border-t border-border">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {testimonial.avatar ? (
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-primary font-semibold text-sm">
                      {getInitials(testimonial.name)}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground mb-1">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.designation}
                    {testimonial.organization && (
                      <span className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {testimonial.organization}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {testimonials.length > 3 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              disabled={testimonials.length <= 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === activeIndex ? 'bg-primary' : 'bg-muted'
                  }`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={testimonials.length <= 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
