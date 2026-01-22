import React, { useState, useEffect, useRef } from 'react';
import { Heart, Search, Filter, ArrowRight, Users, Target, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import ImageLoader from './ImageLoader';

const PremiumCampaignsSection = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    statusFilter: 'all',
    goalTypeFilter: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [campaigns, filters, searchTerm]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await api.get('/donations');
      const campaignsData = response?.data?.success ? response?.data?.data : response?.data || [];
      setCampaigns(campaignsData);
      setFilteredCampaigns(campaignsData);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setCampaigns([]);
      setFilteredCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...campaigns];

    if (searchTerm) {
      filtered = filtered.filter(campaign =>
        campaign?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign?.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign?.tags?.some(tag => tag?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filters.statusFilter !== 'all') {
      filtered = filtered.filter(campaign => campaign?.status === filters.statusFilter);
    }

    if (filters.goalTypeFilter !== 'all') {
      filtered = filtered.filter(campaign => campaign?.goalType === filters.goalTypeFilter);
    }

    setFilteredCampaigns(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-primary/10 text-primary';
      case 'completed': return 'bg-secondary/10 text-secondary';
      case 'closed': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'ACTIVE';
      case 'completed': return 'COMPLETED';
      case 'closed': return 'CLOSED';
      default: return 'UNKNOWN';
    }
  };

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

  const displayCampaigns = filteredCampaigns.slice(0, 6);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 336; // 320px (w-80) + 16px (gap-6)
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-full relative">
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <ImageLoader size={80} text="Loading campaigns..." />
        </div>
      ) : displayCampaigns.length > 0 ? (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm shadow-lg"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide -mx-6 px-6 w-[calc(100%+3rem)]"
          >
            <div className="flex gap-6 pb-4 w-max" style={{ scrollSnapType: 'x mandatory', scrollPaddingLeft: '24px' }}>
              {displayCampaigns.map((campaign) => (
                <Card
                  key={campaign._id}
                  className="overflow-hidden cursor-pointer flex flex-col flex-shrink-0 w-80 h-[500px]"
                  onClick={() => navigate(`/donations/${campaign._id}`)}
                  style={{ scrollSnapAlign: 'start' }}
                >
              <div className="relative h-52 overflow-hidden">
                {campaign.images && campaign.images.length > 0 ? (
                  <img
                    src={campaign.images[0]}
                    alt={campaign.title || 'Campaign'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <Heart className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                {campaign.status && (
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(campaign.status)}`}>
                      {getStatusText(campaign.status)}
                    </span>
                  </div>
                )}
                {campaign.category && (
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-card/90 text-foreground">
                      {campaign.category}
                    </span>
                  </div>
                )}
              </div>

              <CardHeader className="flex-shrink-0">
                <CardTitle className="line-clamp-2 text-ellipsis overflow-hidden">{campaign.title || 'Campaign'}</CardTitle>
              </CardHeader>

              <CardContent className="flex-1 overflow-hidden">
                <p className="text-muted-foreground text-sm line-clamp-2 mb-4 text-ellipsis overflow-hidden">{campaign.description || 'No description available'}</p>

                {campaign.goal && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2 text-foreground">
                      <span className="font-semibold">Progress</span>
                      <span className="font-bold text-primary">{getProgressPercentage(campaign.collectedAmount || 0, campaign.goal)}%</span>
                    </div>
                    <div className="w-full rounded-full h-3 overflow-hidden bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-300"
                        style={{ width: `${getProgressPercentage(campaign.collectedAmount || 0, campaign.goal)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs mt-2 text-muted-foreground">
                      <span>Raised: {formatCurrency(campaign.collectedAmount || 0)}</span>
                      <span>Goal: {formatCurrency(campaign.goal)}</span>
                    </div>
                  </div>
                )}

                {(campaign.endDate) && (
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    {campaign.endDate && (
                      <span>
                        {Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24))} days left
                      </span>
                    )}
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex-shrink-0">
                <Button className="w-full">
                  <Heart className="mr-2 w-4 h-4" />
                  Donate Now
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardFooter>
              </Card>
            ))}
          </div>
        </div>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm shadow-lg"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <div className="text-center py-8">
          <Target className="w-12 h-12 text-muted-foreground mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No campaigns found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  );
};

export default PremiumCampaignsSection;
