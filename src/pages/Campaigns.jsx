import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Target, Users, ArrowRight, FileText } from 'lucide-react';
import api from '../utils/api';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import ImageLoader from '../components/ImageLoader';
import { useAuth } from '../context/AuthContext';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { currentUser, loading: authLoading } = useAuth();

  const handleRequestCampaign = () => {
    // Determine if we have a user from context or as a fallback from localStorage
    const storedUser = localStorage.getItem('user');
    const hasAuth = currentUser || (storedUser && storedUser !== 'undefined');
    
    console.log('Campaign Request Clicked:', { 
      contextUser: !!currentUser, 
      storedUser: !!storedUser, 
      hasAuth,
      authLoading 
    });

    if (authLoading && !hasAuth) return; // Wait only if we have NO cached info
    
    if (hasAuth) {
        console.log('Navigating to campaign-request');
        navigate('/campaign-request');
    } else {
        console.log('Navigating to login');
        navigate('/login', { state: { from: '/campaign-request' } });
    }
  };

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await api.get('/donations');
        setCampaigns(res.data.data || []);
      } catch (err) {
        setError('Failed to load campaigns');
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const getProgressPercentage = (raised, goal) => {
    return Math.min(Math.round(((raised || 0) / (goal || 1)) * 100), 100);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8 px-6 flex items-center justify-center">
        <div className="max-w-[1280px] mx-auto text-center">
          <ImageLoader size={120} text="Loading campaigns..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-8 px-6">
        <div className="max-w-[1280px] mx-auto text-center">
          <p className="text-destructive mb-4">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="py-12 px-6 bg-muted/30">
        <div className="max-w-[1280px] mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Active Campaigns
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Support our ongoing initiatives and help us reach our goals to create meaningful change.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
                onClick={handleRequestCampaign}
                size="lg"
                className="w-full sm:w-auto px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
            >
                <FileText className="mr-2 w-5 h-5" />
                Raise a Campaign Request
            </Button>
            <Button 
                variant="outline"
                size="lg"
                onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
                className="w-full sm:w-auto px-8 py-6 text-lg rounded-full"
            >
                Explore Campaigns
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-[1280px] mx-auto">
          {campaigns.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl text-muted-foreground">No campaigns found at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {campaigns.map((campaign) => (
                <Card
                  key={campaign._id}
                  className="overflow-hidden cursor-pointer h-full flex flex-col"
                  onClick={() => navigate(`/donations/${campaign._id}`)}
                >
                  {campaign.images && campaign.images.length > 0 ? (
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={campaign.images[0]}
                        alt={campaign.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                  ) : (
                    <div className="h-52 bg-muted flex items-center justify-center">
                      <Heart className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}

                  <CardHeader>
                    <CardTitle className="line-clamp-2 leading-6">{campaign.title}</CardTitle>
                  </CardHeader>

                  <CardContent className="flex-1">
                    <p className="text-muted-foreground text-sm  line-clamp-3 mb-4">
                      {campaign.description}
                    </p>

                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2 text-foreground">
                        <span className="font-semibold">Progress</span>
                        <span className="font-bold text-primary">
                          {getProgressPercentage(campaign.collectedAmount, campaign.goal)}%
                        </span>
                      </div>
                      <div className="w-full rounded-full h-2 overflow-hidden bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-300"
                          style={{ width: `${getProgressPercentage(campaign.collectedAmount, campaign.goal)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs mt-2 text-muted-foreground">
                        <span>Achieved: {formatCurrency(campaign.collectedAmount)}</span>
                        <span>Goal: {formatCurrency(campaign.goal)}</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button className="w-full">
                      <Heart className="mr-2 w-4 h-4" />
                      Donate to Campaign
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Campaigns;
