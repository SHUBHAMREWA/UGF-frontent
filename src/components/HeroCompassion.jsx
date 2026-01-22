import React, { useState, useEffect } from 'react';
import { Heart, Users, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Card } from './ui/card';
import { Button } from './ui/button';

const HeroCompassion = () => {
  const [counts, setCounts] = useState({
    donations: "0",
    transactions: "0",
    ngos: "1200",
    volunteers: "50",
    raised: "0"
  });

  const [targets, setTargets] = useState({
    donations: "10",
    transactions: "1",
    ngos: "1200",
    volunteers: "50",
    raised: "10"
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/hero-stats');
        if (response.data.success) {
          setTargets(response.data.stats);
        }
      } catch (error) {
        console.error('Error fetching hero stats:', error);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    setCounts(targets);
  }, [targets]);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-[1280px] mx-auto px-6 py-16 w-full">
        <div className="text-center space-y-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-foreground">
            <span className="block">Empowering Communities,</span>
            <span className="block">Changing Lives Together</span>
          </h1>

          <p className="text-lg sm:text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed text-muted-foreground">
            Join our mission to create lasting impact through education, healthcare, and sustainable development programs across the globe.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
            <Button 
              asChild 
              size="lg" 
              className="rounded-lg shadow-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <Link to="/donate">
                <Heart className="mr-2 h-5 w-5 fill-current" />
                Donate Now
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg"
              className="rounded-lg bg-card border-primary text-primary hover:bg-primary/10 transition-colors"
              >
              <Link to="/volunteer-join">
                <Users className="mr-2 h-5 w-5 text-primary" />
                Join as Volunteer
              </Link>
            </Button>
            </div>
        </div>

        <div className="relative z-30 mt-16 sm:mt-20">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <Card className="p-6 sm:p-8">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full mb-4 flex items-center justify-center bg-primary/10">
                <Heart className="text-2xl sm:text-3xl text-primary" />
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-foreground">
                {counts.raised || counts.donations}
              </div>
              <div className="text-sm sm:text-base font-medium text-muted-foreground">
                Lives Touched
              </div>
            </Card>

            <Card className="p-6 sm:p-8">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full mb-4 flex items-center justify-center bg-primary/10">
                <Users className="text-2xl sm:text-3xl text-primary" />
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-foreground">
                {counts.transactions}
              </div>
              <div className="text-sm sm:text-base font-medium text-muted-foreground">
                Donors With Heart
              </div>
            </Card>

            <Card className="p-6 sm:p-8">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full mb-4 flex items-center justify-center bg-primary/10">
                <Leaf className="text-2xl sm:text-3xl text-primary" />
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-foreground">
                {counts.ngos}
              </div>
              <div className="text-sm sm:text-base font-medium text-muted-foreground">
                Communities Helped
              </div>
            </Card>

            <Card className="p-6 sm:p-8">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full mb-4 flex items-center justify-center bg-primary/10">
                <Users className="text-2xl sm:text-3xl text-primary" />
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-foreground">
                {counts.volunteers}
              </div>
              <div className="text-sm sm:text-base font-medium text-muted-foreground">
                Kind Volunteers
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroCompassion;
