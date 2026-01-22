import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Target, Heart, Calendar, DollarSign, ArrowLeft, Home, ExternalLink } from 'lucide-react';
import api from '../utils/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import ImageLoader from '../components/ImageLoader';

const UserCampaigns = () => {
  useAuth();
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedCampaignId, setExpandedCampaignId] = useState(null);

  useEffect(() => {
    const fetchUserCampaigns = async () => {
      try {
        setLoading(true);
        const response = await api.get('/donations/user-campaigns', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.data.success) {
          setCampaigns(response.data.data || []);
        } else {
          setError(response.data.message || 'Failed to load campaigns');
        }
      } catch (err) {
        console.error('Error loading campaigns:', err);
        setError('Failed to load campaigns. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserCampaigns();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const calculateProgress = (collected, goal) => {
    if (!goal || goal === 0) return 0;
    return Math.min((collected / goal) * 100, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <ImageLoader size={80} text="Fetching campaigns related to you..." />
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="p-12 bg-card rounded-2xl border border-border shadow-sm max-w-md w-full">
          <Target className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-20" />
          <h2 className="text-2xl font-bold text-foreground mb-3">No Campaigns Found</h2>
          <p className="text-muted-foreground mb-8">
            There are currently no fundraising campaigns associated with your email address.
          </p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => navigate('/dashboard')} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <Button onClick={() => navigate('/')} variant="outline" className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-16 md:py-24 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
              <Target className="w-8 h-8 text-primary" />
              Campaigns For You
            </h1>
            <p className="text-muted-foreground">List of fundraising campaigns specifically created for you or your interest.</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-10">
          {campaigns.map((campaign) => {
            const progress = calculateProgress(campaign.collectedAmount, campaign.goal);
            const isExpanded = expandedCampaignId === campaign._id;
            
            return (
              <div key={campaign._id} className="space-y-6">
                <Card 
                  className={`overflow-hidden border-2 transition-all duration-300 cursor-pointer ${isExpanded ? 'border-primary shadow-lg scale-[1.01]' : 'border-primary/10 hover:border-primary/30'}`}
                  onClick={() => setExpandedCampaignId(isExpanded ? null : campaign._id)}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12">
                    {/* Campaign Image */}
                    <div className="lg:col-span-4 h-64 lg:h-auto relative">
                      {campaign.images && campaign.images.length > 0 ? (
                        <img 
                          src={campaign.images[0]} 
                          alt={campaign.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Target className="w-12 h-12 text-muted-foreground opacity-20" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4 flex gap-2">
                        {campaign.popular && <Badge className="bg-orange-500">Popular</Badge>}
                        <Badge variant={campaign.active ? "default" : "secondary"}>
                          {campaign.active ? "Active" : "Completed"}
                        </Badge>
                      </div>
                    </div>

                    {/* Campaign Details */}
                    <CardContent className="lg:col-span-8 p-6 md:p-8">
                      <div className="flex flex-col h-full">
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-4">
                            <h2 className="text-2xl font-bold text-foreground hover:text-primary transition-colors cursor-pointer" onClick={() => navigate(`/donations/${campaign._id}`)}>
                              {campaign.title}
                            </h2>
                            <Button variant="ghost" size="icon" onClick={() => window.open(`/donations/${campaign._id}`, '_blank')}>
                              <ExternalLink className="w-5 h-5" />
                            </Button>
                          </div>
                          <p className="text-muted-foreground line-clamp-3 mb-6">
                            {campaign.description}
                          </p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                            <div className="space-y-1">
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Goal</p>
                              <p className="text-lg font-bold text-foreground">{formatCurrency(campaign.goal)}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Raised</p>
                              <p className="text-lg font-bold text-primary">{formatCurrency(campaign.collectedAmount)}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Min. Donation</p>
                              <p className="text-lg font-bold text-foreground">{formatCurrency(campaign.minDonationAmount)}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Location</p>
                              <p className="text-lg font-bold text-foreground">{campaign.location || 'N/A'}</p>
                            </div>
                          </div>

                          <div className="space-y-2 mb-8">
                            <div className="flex justify-between text-sm font-medium">
                              <span>Progress</span>
                              <span className="text-primary">{progress.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                              <div 
                                className="bg-primary h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 items-center justify-between pt-6 border-t border-border">
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5 font-medium">
                              <Heart className="w-4 h-4 text-red-500" />
                              {campaign.paymentHistory?.length || 0} Donations
                            </span>
                            <span className="flex items-center gap-1.5 font-medium">
                              <Calendar className="w-4 h-4" />
                              Ends: {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : 'No end date'}
                            </span>
                          </div>
                          <Button onClick={() => navigate(`/donations/${campaign._id}`)}>
                            Donate to this Campaign
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>

                {/* Payment History for this specific campaign - Conditionally shown */}
                {isExpanded && (
                  <div className="animate-in slide-in-from-top-4 duration-500">
                    <Card className="border shadow-lg">
                      <CardHeader className="bg-primary/5 pb-4 border-b">
                        <CardTitle className="text-sm font-semibold flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-primary" />
                            All Donations for this Campaign
                          </div>
                          <Badge variant="outline" className="bg-background">
                            {campaign.paymentHistory?.length || 0} Total Records
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-muted/50">
                                <th className="text-left py-3 px-6 text-xs font-bold text-muted-foreground uppercase">Donor</th>
                                <th className="text-left py-3 px-6 text-xs font-bold text-muted-foreground uppercase">Email</th>
                                <th className="text-left py-3 px-6 text-xs font-bold text-muted-foreground uppercase">Amount</th>
                                <th className="text-left py-3 px-6 text-xs font-bold text-muted-foreground uppercase">Date</th>
                                <th className="text-left py-3 px-6 text-xs font-bold text-muted-foreground uppercase">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {campaign.paymentHistory && campaign.paymentHistory.length > 0 ? (
                                campaign.paymentHistory.map((payment) => (
                                  <tr key={payment._id} className="hover:bg-muted/20 transition-colors">
                                    <td className="py-4 px-6 text-sm font-medium text-foreground">
                                      {payment.user?.name || payment.guestDonor?.name || 'Anonymous'}
                                    </td>
                                    <td className="py-4 px-6 text-sm text-muted-foreground">
                                      {payment.user?.email || payment.guestDonor?.email || '-'}
                                    </td>
                                    <td className="py-4 px-6 text-sm font-bold text-foreground">
                                      {formatCurrency(payment.amount)}
                                    </td>
                                    <td className="py-4 px-6 text-sm text-muted-foreground">
                                      {new Date(payment.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="py-4 px-6">
                                      <Badge variant={payment.status === 'paid' ? "default" : "secondary"} className={payment.status === 'paid' ? "bg-green-500" : ""}>
                                        {payment.status?.toUpperCase()}
                                      </Badge>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="5" className="py-12 text-center text-muted-foreground italic">
                                    No donations have been made yet for this campaign.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserCampaigns;
