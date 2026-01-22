import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Heart, Download, Calendar, DollarSign, FileText, Target, Plus } from 'lucide-react';
import api from '../utils/api';
import DonationReceipt from '../components/common/DonationReceipt';
import * as htmlToImage from 'html-to-image';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import ImageLoader from '../components/ImageLoader';

const UserDashboard = () => {
    

  const { currentUser } = useAuth();
  console.log('Current User in Dashboard: -sh ✅', currentUser);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [payments, setPayments] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const receiptRef = useRef();
  const [receiptData, setReceiptData] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadPaymentId, setDownloadPaymentId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await api.get('/users/me', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setProfile(profileRes.data);
        
        const paymentsRes = await api.get('/payments/my', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setPayments(paymentsRes.data.payments || []);

        const requestsRes = await api.get('/campaign-requests/my', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setRequests(requestsRes.data.data || []);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalDonated = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);

  const handleDownloadReceipt = (payment) => {
    setReceiptData({
      receiptNo: payment._id.slice(-6).toUpperCase(),
      date: new Date(payment.createdAt).toLocaleDateString(),
      donorName: profile?.name || currentUser?.name || 'User',
      address: profile?.address || '-',
      contact: profile?.phone || '-',
      email: profile?.email || currentUser?.email || '-',
      amount: payment.amount,
      paymentMode: payment.paymentId ? 'Online' : 'Other',
      transactionId: payment.paymentId || payment.orderId || '-',
      pan: profile?.pan || '-',
      representative: '',
    });
    setDownloadPaymentId(payment._id);
    setDownloading(true);
  };

  const handleDeleteRequest = async (id) => {
    if (!window.confirm('Are you sure you want to delete this support request?')) return;
    try {
        await api.delete(`/campaign-requests/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setRequests(requests.filter(r => r._id !== id));
    } catch (err) {
        alert('Failed to delete request');
    }
  };

  useEffect(() => {
    if (downloading && receiptData && receiptRef.current) {
      setTimeout(async () => {
        try {
          const dataUrl = await htmlToImage.toPng(receiptRef.current);
          const link = document.createElement('a');
          link.download = `DonationReceipt_${downloadPaymentId?.slice(-6)}.png`;
          link.href = dataUrl;
          link.click();
        } catch (err) {
          alert('Failed to generate receipt image.');
        }
        setDownloading(false);
        setReceiptData(null);
        setDownloadPaymentId(null);
      }, 100);
    }
  }, [downloading, receiptData, downloadPaymentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8 px-6">
        <div className="max-w-[1280px] mx-auto text-center">
          <ImageLoader size={80} />
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  return (
    <div className="min-h-screen bg-background py-16 md:py-24 px-6">
      <div className="max-w-[1280px] mx-auto">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {profile?.name || currentUser?.name || 'User'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Total Donated</CardTitle>
                <Heart className="w-5 h-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-2">
                {formatCurrency(totalDonated)}
              </div>
              <p className="text-sm text-muted-foreground">
                {payments.filter(p => p.status === 'paid').length} donation{payments.filter(p => p.status === 'paid').length !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Total Transactions</CardTitle>
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-2">
                {payments.length}
              </div>
              <p className="text-sm text-muted-foreground">All time transactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Recent Activity</CardTitle>
                <Calendar className="w-5 h-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-2">
                {payments.filter(p => {
                  const paymentDate = new Date(p.createdAt);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return paymentDate >= weekAgo;
                }).length}
              </div>
              <p className="text-sm text-muted-foreground">This week</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="border-2 border-primary/10 bg-primary/[0.02] hover:bg-primary/[0.05] transition-all duration-300 cursor-pointer overflow-hidden group shadow-sm hover:shadow-md" onClick={() => navigate('/my-campaigns')}>
            <CardContent className=" flex flex-col items-center justify-around h-full min-h-[220px]">
              <div className="flex items-center gap-6 ">
                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                  <Target className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-foreground mb-1">Check campaigns related to you</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">View special fundraising campaigns and track their progress from one place.</p>
                </div>
              </div>
              <Button size="lg" className="w-full shadow-md text-base font-semibold">
                View My Campaigns
                <Target className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/10 bg-primary/[0.02] hover:bg-primary/[0.05] transition-all duration-300 cursor-pointer overflow-hidden group shadow-sm hover:shadow-md" onClick={() => navigate('/campaign-request')}>
            <CardContent className=" flex flex-col justify-around h-full min-h-[220px]">
              <div className="flex items-center gap-6 ">
                <div className="w-16 h-16 rounded-2xl bg-primary/90 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                  <FileText className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-foreground mb-1">Request for campaign</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">Apply for a new fundraising campaign for medical or social support needs.</p>
                </div>
              </div>
              <Button size="lg" variant="outline" className="w-full shadow-sm  text-base font-semibold border-primary text-primary hover:bg-primary hover:text-white transition-all">
                Start New Request
                <Plus className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Donation History Section */}
            <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-xl md:text-lg">Donation History</CardTitle>
            </CardHeader>
            <CardContent>
                {payments.length === 0 ? (
                <div className="text-center py-12">
                    <Heart className="w-16 h-16 md:w-12 md:h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg md:text-base text-muted-foreground mb-4">No donations yet</p>
                    <Button onClick={() => navigate('/donate')} className="w-full md:w-auto text-lg md:text-sm py-6 md:py-2">
                    Make Your First Donation
                    </Button>
                </div>
                ) : (
                <div className="space-y-6">
                    {payments.map((payment) => (
                    <Card key={payment._id} className="border">
                        <CardContent className="p-4 md:p-6">
                        <div className="flex flex-col gap-4">
                            {/* Top Row: Icon + Title + Date */}
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Heart className="w-6 h-6 md:w-5 md:h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg md:text-base font-semibold text-foreground">
                                        {payment.campaignTitle || 'General Donation'}
                                    </h3>
                                    <p className="text-base md:text-sm text-muted-foreground">
                                        {new Date(payment.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* Bottom Row: Amount + Status + Action */}
                            <div className="flex items-center justify-between border-t pt-4 mt-2">
                                <div className="flex flex-col">
                                    <span className="text-2xl md:text-xl font-bold text-foreground">
                                        {formatCurrency(payment.amount)}
                                    </span>
                                    <span className={`text-sm md:text-xs px-2 py-1 rounded-full w-fit mt-1 ${
                                        payment.status === 'paid' 
                                        ? 'bg-secondary/10 text-secondary' 
                                        : payment.status === 'pending'
                                        ? 'bg-muted text-muted-foreground'
                                        : 'bg-destructive/10 text-destructive'
                                    }`}>
                                        {payment.status?.toUpperCase() || 'PENDING'}
                                    </span>
                                </div>
                                {payment.status === 'paid' && (
                                    <Button
                                        variant="outline"
                                        className="h-10 md:h-8" // Larger touch target
                                        onClick={() => handleDownloadReceipt(payment)}
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Receipt
                                    </Button>
                                )}
                            </div>
                        </div>
                        </CardContent>
                    </Card>
                    ))}
                </div>
                )}
            </CardContent>
            </Card>

            {/* Campaign Requests Section */}
            <Card className="h-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl md:text-lg">My Campaign Requests</CardTitle>
                    <Button variant="outline" onClick={() => navigate(`/campaign-request`)} className="md:text-sm">
                        New Request
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {requests.length === 0 ? (
                <div className="text-center py-12">
                    <FileText className="w-16 h-16 md:w-12 md:h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg md:text-base text-muted-foreground mb-4">No campaign requests yet</p>
                    <Button onClick={() => navigate(`/campaign-request`)} className="w-full md:w-auto text-lg md:text-sm py-6 md:py-2">
                    Raise a Request
                    </Button>
                </div>
                ) : (
                <div className="space-y-6">
                    {requests.map((request) => (
                    <Card key={request._id} className="border">
                        <CardContent className="p-4 md:p-6">
                        <div className="flex flex-col gap-4">
                            {/* Header Info */}
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 md:w-10 md:h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                                    <FileText className="w-6 h-6 md:w-5 md:h-5 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg md:text-base font-semibold text-foreground">
                                        {request.disease}
                                    </h3>
                                    <p className="text-base md:text-sm text-muted-foreground">
                                        Patient: {request.patientName}
                                    </p>
                                    <p className="text-sm md:text-xs text-muted-foreground">
                                        Requested: {new Date(request.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Footer Info: Amount + Actions */}
                            <div className="flex flex-col gap-3 border-t pt-4">
                                <div className="flex justify-between items-center">
                                    <div className="text-2xl md:text-xl font-bold text-foreground">
                                        {formatCurrency(request.amount)}
                                    </div>
                                    <span className={`text-sm md:text-xs px-3 py-1 rounded-full ${
                                        request.status === 'approved' 
                                            ? 'bg-green-100 text-green-700' 
                                            : request.status === 'rejected'
                                            ? 'bg-red-100 text-red-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {request.status?.toUpperCase() || 'PENDING'}
                                    </span>
                                </div>
                                
                                {/* Action Buttons */}
                                {(request.status === 'pending' || request.status === 'rejected') && (
                                    <div className="flex gap-3 mt-2">
                                        <Button 
                                            variant="outline" 
                                            className="flex-1 h-10 md:h-8 text-base md:text-sm" // Full width buttons on mobile
                                            onClick={() => navigate(`/campaign-request/${request._id}`)}
                                        >
                                            Edit
                                        </Button>
                                        <Button 
                                            variant="destructive" 
                                            className="flex-1 h-10 md:h-8 text-base md:text-sm" // Full width buttons on mobile
                                            onClick={() => handleDeleteRequest(request._id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                        </CardContent>
                    </Card>
                    ))}
                </div>
                )}
            </CardContent>
            </Card>
        </div>

        {downloading && receiptData && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-background p-6 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div ref={receiptRef}>
                <DonationReceipt {...receiptData} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
