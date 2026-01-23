import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import PageLoader from '../components/PageLoader';
import GuestDonationForm from '../components/GuestDonationForm';
import ImageLoader from '../components/ImageLoader';
import AddOnsSelector from '../components/AddOnsSelector';
import useCountUp from '../hooks/useCountUp';
import { deepCleanText } from '../utils/textCleaner';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import {
  Heart,
  MapPin,
  Calendar,
  Target,
  TrendingUp,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Package ,
  ChevronLeft ,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MessageCircle
} from 'lucide-react';
import './DonationDetails.css';

const DonationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [donationAmount, setDonationAmount] = useState('');
  const [message, setMessage] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [recentDonors, setRecentDonors] = useState([]);
  const [donorsLoading, setDonorsLoading] = useState(true);
  const [calculatedTotal, setCalculatedTotal] = useState(0); // Total calculated from all payments
  const [totalDonorsCount, setTotalDonorsCount] = useState(0);
  const [donorsFetched, setDonorsFetched] = useState(false); // Track if donors API has been called
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [guestDonorData, setGuestDonorData] = useState(null);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [totalAddOnsAmount, setTotalAddOnsAmount] = useState(0);
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', whatsapp: '' });
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  
  // UX: Collapsible sections state (open by default)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(true);
  const [isBenefitsExpanded, setIsBenefitsExpanded] = useState(true);
  const [isAddOnsExpanded, setIsAddOnsExpanded] = useState(true);

  useEffect(() => {
    fetchDonationDetails();
  }, [id]);

  useEffect(() => {
    if (donation?._id) {
      fetchRecentDonors();
    }
  }, [donation?._id]);

  const fetchDonationDetails = async () => {
    try {
      const response = await api.get(`/donations/${id}`); 
      setDonation(response.data.data);
      console.log("this is donation details ", response.data.data)
      setLoading(false);
    } catch (error) {
      setError('Error fetching donation details');
      setLoading(false);
    }
  };

  const fetchRecentDonors = async () => {
    if (!donation?._id) return;
    
    setDonorsLoading(true);
    try {
      const response = await api.get(`/payments/recent?campaignId=${donation._id}`);
      console.log('📊 Payments API Response:', response.data);
      
      if (response.data.success) {
        const totalAmount = Number(response.data.totalAmount) || 0;
        const totalDonors = response.data.totalDonors || 0;
        
        setRecentDonors(response.data.donors || []);
        setCalculatedTotal(totalAmount);
        setTotalDonorsCount(totalDonors);
        
        console.log(`✅ Calculated total from all payments: ₹${totalAmount}, Total donors: ${totalDonors}`);
        console.log(`📈 Donors fetched: ${donorsFetched}, Calculated Total: ${totalAmount}`);
      } else {
        console.warn('⚠️ Payments API returned success: false');
        setRecentDonors([]);
        setCalculatedTotal(0);
        setTotalDonorsCount(0);
      }
    } catch (error) {
      console.error('❌ Error fetching recent donors:', error);
      setRecentDonors([]);
      setCalculatedTotal(0);
      setTotalDonorsCount(0);
    } finally {
      setDonorsLoading(false);
      setDonorsFetched(true); // Mark as fetched regardless of success/failure
    }
  };

  const handleGuestFormSubmit = (guestData) => {
    setGuestDonorData(guestData);
    setShowGuestForm(false);
    // Proceed with donation flow using guest data
    handleDonationPayment(guestData);
  };

  const handleDonation = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setShowGuestForm(true);
      return;
    }

    handleDonationPayment();
  };

  const handleDonationPayment = async (guestData = null) => {

    // Load Razorpay script
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) return resolve(true);
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    try {
      setError('');
      // Fetch Razorpay key
      const keyRes = await api.get('/config/razorpay-key');
      const razorpayKey = keyRes.data.key;

      // 1. Create order on backend
      const headers = {};
      const token = localStorage.getItem('token');
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const orderData = {
        amount: Number(donationAmount),
        message
      };

      // Include guest donor info if not logged in
      if (guestData) {
        orderData.guestDonor = {
          name: guestData.name,
          email: guestData.email,
          phone: guestData.phone,
          address: guestData.address,
          panNumber: guestData.want80G ? guestData.panNumber : undefined
        };
      }

      const orderRes = await api.post(
        `/donations/${id}/create-order`,
        orderData,
        { headers }
      );
      if (!orderRes.data.success) throw new Error(orderRes.data.message || 'Order creation failed');

      // 2. Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error('Failed to load Razorpay. Please try again.');

      // 3. Open Razorpay checkout
      const options = {
        key: razorpayKey,
        amount: orderRes.data.order.amount,
        currency: orderRes.data.order.currency,
        name: donation.title,
        // discritption should be less than 255 word
        description: donation.description.slice(0, 200),
        order_id: orderRes.data.order.id,
        handler: async function (response) {
          // 4. Verify payment on backend
          setVerifyingPayment(true);
          try {
            const verifyRes = await api.post(
              `/donations/${id}/verify-payment`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                amount: Number(donationAmount),
                message,
                guestDonor: guestData
              },
              { headers }
            );
            setVerifyingPayment(false);
            if (verifyRes.data.success) {
              // Refresh donation data and recent donors to get updated amounts
              await fetchDonationDetails();
              await fetchRecentDonors();
              
              // Redirect to success page
              navigate('/payment/success', {
                state: {
                  amount: Number(donationAmount),
                  donationTitle: donation.title,
                  paymentId: verifyRes.data.paymentId || response.razorpay_payment_id,
                  orderId: verifyRes.data.orderId || response.razorpay_order_id,
                  donationId: id
                }
              });
            } else {
              // Redirect to failure page
              navigate('/payment/failure', {
                state: {
                  error: verifyRes.data.message || 'Payment verification failed',
                  donationId: id,
                  amount: Number(donationAmount)
                }
              });
            }
          } catch (err) {
            console.error('Payment verification error:', err);
            setVerifyingPayment(false);
            // Redirect to failure page
            navigate('/payment/failure', {
              state: {
                error: err.response?.data?.message || 'Payment verification failed',
                donationId: id,
                amount: Number(donationAmount)
              }
            });
          }
        },
        modal: {
          ondismiss: function () {
            // User closed the payment modal
            navigate('/payment/failure', {
              state: {
                error: 'Payment was cancelled',
                donationId: id,
                amount: Number(donationAmount)
              }
            });
          }
        },
        prefill: {
          name: guestData?.name || currentUser?.name || '',
          email: guestData?.email || currentUser?.email || '',
          contact: guestData?.phone || currentUser?.mobileNumber || ''
        },
        theme: { color: '#3b82f6' }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Error processing donation');
    }
  };

  // Calculate values safely (before early returns to ensure hooks are called unconditionally)
  const collectedAmount = donation && donorsFetched
    ? calculatedTotal
    : donation
    ? Number(donation.collectedAmount || 0)
    : 0;
  
  const goal = donation
    ? Number(String(donation.goal || '0').replace(/,/g, ''))
    : 0;
      
  // Calculate percentage: (achieved / goal) * 100 (safe + precise)
  const progressPercentage =
    goal > 0
      ? Math.min((collectedAmount / goal) * 100, 100)
      : 0;
  const remainingAmount = goal > 0 ? Math.max(goal - collectedAmount, 0) : 0;
  const daysLeft = donation?.endDate ? Math.ceil((new Date(donation.endDate) - new Date()) / (1000 * 60 * 60 * 24)) : 0;

  // Counter animations - only start when data is fully loaded
  const shouldAnimate = !loading && !donorsLoading && donation !== null;

  // Animated collected amount (hooks must be called unconditionally)
  const animatedCollectedAmount = useCountUp(
    collectedAmount || 0,
    2000,
    shouldAnimate,
    (val) => val.toLocaleString('en-IN')
  );

  // Animated goal amount
  const animatedGoal = useCountUp(
    goal || 0,
    2000,
    shouldAnimate,
    (val) => val.toLocaleString('en-IN')
  );

  // Animated progress percentage
  const animatedProgress = useCountUp(
    Math.round(progressPercentage) || 0,
    2000,
    shouldAnimate
  );

  // Animated total donors count
  const donorsToShow = totalDonorsCount > 0 ? totalDonorsCount : (recentDonors.length || 0);
  const animatedDonors = useCountUp(
    donorsToShow,
    1500,
    shouldAnimate
  );

  // Animated days left
  const animatedDaysLeft = useCountUp(
    Math.max(daysLeft, 0),
    1500,
    shouldAnimate
  );

  const handleAddOnsPayment = async () => {
    if (selectedAddOns.length === 0) {
      setError('Please select at least one add-on');
      return;
    }

    if (!customerInfo.name || !customerInfo.email || !customerInfo.whatsapp) {
      setError('Please fill in all customer information');
      return;
    }

    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) return resolve(true);
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    try {
      setError('');
      const keyRes = await api.get('/config/razorpay-key');
      const razorpayKey = keyRes.data.key;

      const orderRes = await api.post(
        `/donations/${id}/create-order-with-addons`,
        {
          addOns: selectedAddOns,
          customer: customerInfo
        }
      );

      if (!orderRes.data.success) throw new Error(orderRes.data.message || 'Order creation failed');

      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error('Failed to load Razorpay. Please try again.');

      // Truncate description to 255 characters for Razorpay (keep full text in UI)
      const fullDescription = `Add-ons order for ${donation.title}`;
      const truncatedDescription = fullDescription.length > 255 
        ? fullDescription.substring(0, 252) + '...' 
        : fullDescription;

      const options = {
        key: razorpayKey,
        amount: orderRes.data.razorpayOrder.amount,
        currency: 'INR',
        name: donation.title,
        description: truncatedDescription,
        order_id: orderRes.data.razorpayOrder.id,
        handler: async function (response) {
          try {
            const verifyRes = await api.post(`/donations/${id}/verify-order-payment`, {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderRes.data.order._id
            });

            if (verifyRes.data.success) {
              // Refresh donation data and recent donors to get updated amounts
              try {
                await fetchDonationDetails();
                await fetchRecentDonors();
                console.log('✅ Donation data refreshed after add-ons payment');
              } catch (refreshError) {
                console.error('Failed to refresh donation data:', refreshError);
              }
              
              navigate('/payment/success', {
                state: {
                  amount: orderRes.data.order.total, // Already in INR, no need to divide by 100
                  donationTitle: donation.title,
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  donationId: id
                }
              });
            } else {
              // Mark order as failed if verification fails
              try {
                await api.put(`/donations/orders/${orderRes.data.order._id}/status`, {
                  status: 'failed',
                  notes: 'Payment verification failed'
                });
              } catch (updateError) {
                console.error('Failed to update order status:', updateError);
              }
              navigate('/payment/failure', {
                state: {
                  error: verifyRes.data.message || 'Payment verification failed',
                  donationId: id
                }
              });
            }
          } catch (err) {
            console.error('Payment verification error:', err);
            // Mark order as failed if verification fails
            try {
              await api.put(`/donations/orders/${orderRes.data.order._id}/status`, {
                status: 'failed',
                notes: 'Payment verification error: ' + (err.response?.data?.message || err.message)
              });
            } catch (updateError) {
              console.error('Failed to update order status:', updateError);
            }
            navigate('/payment/failure', {
              state: {
                error: err.response?.data?.message || 'Payment verification failed',
                donationId: id
              }
            });
          }
        },
        modal: {
          ondismiss: async function() {
            // User closed the payment modal without paying
            // Mark order payment as failed
            try {
              await api.put(`/donations/orders/${orderRes.data.order._id}/status`, {
                status: 'failed',
                notes: 'Payment cancelled by user'
              });
            } catch (updateError) {
              console.error('Failed to update order status:', updateError);
            }
            navigate('/payment/failure', {
              state: {
                error: 'Payment was cancelled',
                donationId: id
              }
            });
          }
        },
        prefill: {
          name: customerInfo.name,
          email: customerInfo.email,
          contact: customerInfo.whatsapp
        },
        theme: { color: '#3b82f6' }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Error processing order');
    }
  };

  if (loading) return <PageLoader subtitle="Loading donation details..." />;
  if (error) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 py-8">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (!donation) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 py-8">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Donation not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Debug logging
  console.log({
    donorsFetched,
    calculatedTotal,
    donationCollectedAmount: donation.collectedAmount,
    collectedAmount,
    goal,
    progressPercentage: progressPercentage.toFixed(2) + '%'
  });

  // UX: Premium Quick donation amounts (higher tiers for large donations)
  const quickAmounts = [1000, 3000, 5000, 10000, 25000, 50000, 100000].filter(amt => 
    amt >= (donation.minDonationAmount || 100) && (remainingAmount === 0 || amt <= remainingAmount)
  );
  
  // Format large numbers elegantly
  const formatAmount = (amount) => {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
    return `₹${amount}`;
  };

  // UX: Handle quick amount selection
  const handleQuickAmount = (amount) => {
    setDonationAmount(amount.toString());
    // Smooth scroll to form on mobile
    if (window.innerWidth < 1024) {
      document.getElementById('donation-form-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  
  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-12">
      {/* Hero Section with Progress Card */}
      <div className="donation-hero-container sm:pt-8">
        
        {/* Title Row - Centered */}
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 mb-6 sm:mb-8 text-center">
           <h1 className="text-xl sm:text-2xl lg:text-4xl h-font-donation font-bold text-foreground leading-tight">
            {donation.title}
           </h1>
        </div>
        
        {/* Premium Floating Progress Card - Enhanced Design */}
        <div className="floating-info-card premium-floating-card" style={{marginTop: '0'}}>
          {/* Top Stats Row */}
          <div className="premium-progress-header">
            <div className="premium-stat-group premium-stat-left">
              <div className="premium-stat-value premium-stat-raised">₹{animatedCollectedAmount.count}</div>
              <div className="premium-stat-label premium-label-raised">RAISED</div>
            </div>
            
            <div className="premium-stat-group premium-stat-center">
              <div className="premium-percentage premium-percentage-large">{animatedProgress.count}%</div>
              <div className="premium-stat-label premium-label-progress">PROGRESS</div>
            </div>

            <div className="premium-stat-group premium-stat-end">
              <div className="premium-stat-value premium-stat-target">₹{animatedGoal.count}</div>
              <div className="premium-stat-label premium-label-goal">GOAL</div>
            </div>
          </div>

          {/* Premium Progress Bar with Gradient */}
          <div className="premium-progress-container">
            <div className="premium-progress-track">
              <div 
                className="premium-progress-fill premium-progress-animated" 
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="premium-progress-shine"></div>
              </div>
            </div>
          </div>

       

          {/* Footer: Status & Share - Enhanced */}
         
        </div>
      </div>


      {/* UX: Main Content - Reordered to prioritize donation action */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
      
      {/* Mobile-first: Donation Form at Top (Mobile), Right Side (Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
        
        {/* LEFT: Informational Content (Mobile: Below Form, Desktop: Left) */}
        <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
          
          {/* Premium Description Section with Enhanced Typography */}
          <Card className="premium-content-card">
            <CardHeader 
              className="premium-section-header cursor-pointer select-none"
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="premium-section-icon">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="premium-section-title">About this Campaign</CardTitle>
                </div>
                <button
                  type="button"
                  className="premium-collapse-btn"
                  aria-label={isDescriptionExpanded ? 'Collapse description' : 'Expand description'}
                  aria-expanded={isDescriptionExpanded}
                >
                  {isDescriptionExpanded ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </div>
            </CardHeader>
            <CardContent className="premium-section-content">
              {isDescriptionExpanded || donation.description.length < 200 ? (
                <p className="premium-description-text">
                  {donation.description}
                </p>
              ) : (
                <div>
                  <p className="premium-description-text premium-description-preview">
                    {donation.description.substring(0, 200)}...
                  </p>
                  <button
                    onClick={() => setIsDescriptionExpanded(true)}
                    className="premium-read-more-btn"
                  >
                    Read more
                  </button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Premium Benefits Section with Enhanced Typography */}
          {donation.benefits && donation.benefits.length > 0 && (
            <Card className="premium-content-card">
              <CardHeader 
                className="premium-section-header cursor-pointer select-none"
                onClick={() => setIsBenefitsExpanded(!isBenefitsExpanded)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="premium-section-icon">
                      <Heart className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="premium-section-title">How Your Donation Helps</CardTitle>
                  </div>
                  <button
                    type="button"
                    className="premium-collapse-btn"
                    aria-label={isBenefitsExpanded ? 'Collapse benefits' : 'Expand benefits'}
                    aria-expanded={isBenefitsExpanded}
                  >
                    {isBenefitsExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </CardHeader>
              {isBenefitsExpanded && (
                <CardContent className="premium-section-content">
                  <ul className="premium-benefits-list">
                    {donation.benefits
                      .filter(benefit => {
                        // Filter out empty, null, or undefined benefits
                        if (!benefit) return false;
                        if (Array.isArray(benefit) && benefit.length === 0) return false;
                        if (typeof benefit === 'string' && !benefit.trim()) return false;
                        return true;
                      })
                      .map((benefit, index) => {
                      // Use the deep cleaning utility function
                      const text = deepCleanText(benefit);

                      // Skip if text is empty after cleaning
                      if (!text || !text.trim()) {
                        return null;
                      }

                      const parseBilingualText = (text) => {
                        const trimmedText = text.trim();
                        
                        if (!trimmedText) {
                          return null;
                        }

                        // Match pattern: "English text (Hindi/Devanagari text)"
                        const match = trimmedText.match(/^(.+?)\s*\(([^)]+)\)\s*$/);

                        if (match) {
                          return {
                            english: match[1].trim(),
                            marathi: match[2].trim(),
                            isLongDescription: false
                          };
                        }

                        const hasDevanagari = /[\u0900-\u097F]/.test(trimmedText);

                        if (hasDevanagari && trimmedText.length > 100) {
                          return {
                            english: null,
                            marathi: trimmedText,
                            isLongDescription: true
                          };
                        }

                        return {
                          english: trimmedText,
                          marathi: null,
                          isLongDescription: false
                        };
                      };

                      const parsed = parseBilingualText(text);

                      // Skip if parsing returned null or empty
                      if (!parsed || (!parsed.english && !parsed.marathi)) {
                        return null;
                      }

                      if (parsed.isLongDescription) {
                        return (
                          <li key={index} className="premium-benefit-item">
                            <div className="premium-benefit-icon">
                              <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <p className="premium-benefit-text premium-benefit-long">
                              {parsed.marathi}
                            </p>
                          </li>
                        );
                      }

                      return (
                        <li key={index} className="premium-benefit-item">
                          <div className="premium-benefit-icon">
                            <CheckCircle2 className="w-6 h-6" />
                          </div>
                          <div className="premium-benefit-content">
                            {parsed.english && <span className="premium-benefit-text">{parsed.english}</span>}
                            {parsed.marathi && (
                              <span className="premium-benefit-translation">
                                ({parsed.marathi})
                              </span>
                            )}
                          </div>
                        </li>
                      );
                    })
                    .filter(item => item !== null) // Remove null items
                  }
                  </ul>
                </CardContent>
              )}
            </Card>
          )}

          {/* Premium Add-ons Section */}
          {donation.hasAddOns && donation.addOns && donation.addOns.length > 0 && (
            <Card className="premium-addons-card">
              <CardHeader 
                className="premium-addons-header cursor-pointer select-none"
                onClick={() => setIsAddOnsExpanded(!isAddOnsExpanded)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="premium-addons-icon-wrapper">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="premium-addons-title">Campaign Add-ons</CardTitle>
                      <p className="premium-addons-subtitle">Enhance your contribution</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="premium-addons-collapse-btn"
                    aria-label={isAddOnsExpanded ? 'Collapse add-ons' : 'Expand add-ons'}
                    aria-expanded={isAddOnsExpanded}
                  >
                    {isAddOnsExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </CardHeader>
              {isAddOnsExpanded && (
                <CardContent className="premium-addons-content">
                  <AddOnsSelector
                    addOns={donation.addOns}
                    onSelectionChange={(selected) => {
                      setSelectedAddOns(selected);
                    }}
                    onTotalChange={(total) => {
                      setTotalAddOnsAmount(total);
                    }}
                  />
                  {selectedAddOns.length > 0 && (
                    <div className="premium-addons-checkout">
                      <div className="premium-addons-checkout-header">
                        <h4 className="premium-addons-checkout-title">Customer Information</h4>
                        <p className="premium-addons-checkout-subtitle">Complete your order details</p>
                      </div>
                      <div className="premium-addons-checkout-body">
                        <div className="premium-addons-total-card">
                          <div className="premium-addons-total-label">Total Amount</div>
                          <div className="premium-addons-total-amount">₹{totalAddOnsAmount.toLocaleString('en-IN')}</div>
                          <p className="premium-addons-total-note">
                            Based on selected add-ons
                          </p>
                        </div>
                        <div className="premium-addons-form">
                          <div className="premium-form-field">
                            <label className="premium-form-label-premium">Full Name *</label>
                            <Input
                              type="text"
                              value={customerInfo.name}
                              onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                              required
                              placeholder="Enter your full name"
                              className="premium-form-input"
                            />
                          </div>
                          <div className="premium-form-field">
                            <label className="premium-form-label-premium">Email Address *</label>
                            <Input
                              type="email"
                              value={customerInfo.email}
                              onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                              required
                              placeholder="your.email@example.com"
                              className="premium-form-input"
                            />
                          </div>
                          <div className="premium-form-field">
                            <label className="premium-form-label-premium">WhatsApp Number *</label>
                            <Input
                              type="tel"
                              value={customerInfo.whatsapp}
                              onChange={(e) => setCustomerInfo({ ...customerInfo, whatsapp: e.target.value })}
                              required
                              placeholder="Enter your WhatsApp number"
                              className="premium-form-input"
                            />
                          </div>
                          <Button
                            type="button"
                            className="premium-addons-payment-btn"
                            onClick={handleAddOnsPayment}
                            disabled={!customerInfo.name || !customerInfo.email || !customerInfo.whatsapp}
                          >
                            <Package className="w-5 h-5 mr-2" />
                            Proceed to Payment
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          )}
        </div>

        {/* RIGHT: Premium Donation Form Card */}
        <div className="lg:col-span-1 order-1 lg:order-2">
          <Card 
            id="donation-form-card"
            className="premium-donation-card sticky top-4 lg:top-8"
          >
            <CardHeader className="premium-card-header">
              <div className="premium-card-title-wrapper">
                <div className="premium-heart-icon">
                  <Heart className="w-7 h-7" />
                </div>
                <div>
                  <CardTitle className="premium-card-title">Make a Donation</CardTitle>
                  <p className="premium-card-subtitle">Your contribution creates lasting impact</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="premium-card-content">
              <form onSubmit={handleDonation} className="space-y-6">
                {/* Premium Amount Selector */}
                <div>
                  <label className="premium-form-label">
                    Select Donation Amount
                  </label>
                  
                  {/* Premium Quick Amount Buttons */}
                  {quickAmounts.length > 0 && (
                    <div className="premium-quick-amounts">
                      {quickAmounts.map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => handleQuickAmount(amount)}
                          className={`premium-amount-btn ${
                            donationAmount === amount.toString()
                              ? 'premium-amount-btn-active'
                              : 'premium-amount-btn-inactive'
                          }`}
                          aria-label={`Donate ${formatAmount(amount)}`}
                        >
                          {formatAmount(amount)}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Premium Custom Amount Input */}
                  <div className="premium-amount-input-wrapper">
                    <span className="premium-currency-symbol">₹</span>
                    <Input
                      type="number"
                      min={donation.minDonationAmount || 100}
                      max={remainingAmount || undefined}
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      required
                      placeholder={`Enter amount (Min: ₹${donation.minDonationAmount || 100})`}
                      className="premium-amount-input"
                      aria-label="Enter donation amount"
                    />
                  </div>
                  {remainingAmount > 0 && (
                    <p className="premium-remaining-text">
                      <Target className="w-4 h-4 inline mr-1" />
                      ₹{remainingAmount.toLocaleString('en-IN')} remaining to reach goal
                    </p>
                  )}
                  {donationAmount && parseInt(donationAmount) >= 10000 && (
                    <div className="premium-large-donation-badge">
                      <TrendingUp className="w-4 h-4" />
                      <span>Major Contributor</span>
                    </div>
                  )}
                </div>

                {/* Premium Message Input */}
                <div>
                  <label className="premium-form-label">
                    Personal Message (Optional)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share your message of support..."
                    rows="3"
                    className="premium-textarea"
                    aria-label="Optional donation message"
                  />
                </div>

                {/* Premium Error Display */}
                {error && (
                  <div className="premium-error-alert">
                    <XCircle className="w-5 h-5" />
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                )}

                {/* Premium Primary CTA Button */}
                <Button
                  type="submit"
                  className="premium-donate-button"
                  size="lg"
                  disabled={donation.status !== 'active' || !donationAmount}
                >
                  <div className="premium-button-content">
                    <Heart className="w-6 h-6 premium-button-icon" />
                    <span className="premium-button-text">
                      {donation.status === 'active' 
                        ? donationAmount 
                          ? `Donate ₹${parseInt(donationAmount).toLocaleString('en-IN')}`
                          : 'Donate Now'
                        : 'Campaign Ended'}
                    </span>
                  </div>
                  {donation.status === 'active' && donationAmount && (
                    <div className="premium-button-glow"></div>
                  )}
                </Button>

                {/* Premium Trust Indicators */}
                <div className="premium-trust-section">
                  <div className="premium-trust-badges">
                    <div className="premium-trust-badge">
                      <CheckCircle2 className="w-5 h-5" />
                      <div>
                        <div className="premium-trust-title">Secure Payment</div>
                        <div className="premium-trust-desc">256-bit SSL encrypted</div>
                      </div>
                    </div>
                    <div className="premium-trust-badge">
                      <CheckCircle2 className="w-5 h-5" />
                      <div>
                        <div className="premium-trust-title">Tax Deductible</div>
                        <div className="premium-trust-desc">80G certificate provided</div>
                      </div>
                    </div>
                    <div className="premium-trust-badge">
                      <CheckCircle2 className="w-5 h-5" />
                      <div>
                        <div className="premium-trust-title">Transparent</div>
                        <div className="premium-trust-desc">Track your impact</div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Premium Campaign Info Section */}
      <Card className="premium-campaign-info-card mb-6">
        <CardContent className="premium-campaign-info-content">
          <div className="premium-campaign-info-grid">
            {donation.location && (
              <div className="premium-campaign-info-item premium-info-location">
                <div className="premium-info-icon-wrapper premium-icon-location">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="premium-info-content">
                  <p className="premium-info-label">Location</p>
                  <p className="premium-info-value">{donation.location}</p>
                </div>
              </div>
            )}
            {(donation.startDate || donation.endDate) && (
              <div className="premium-campaign-info-item premium-info-period">
                <div className="premium-info-icon-wrapper premium-icon-period">
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="premium-info-content">
                  <p className="premium-info-label">Campaign Period</p>
                  <p className="premium-info-value">
                    {donation.startDate && new Date(donation.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'numeric', year: 'numeric' })}
                    {donation.startDate && donation.endDate && ' - '}
                    {donation.endDate && new Date(donation.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
            )}
            <div className="premium-campaign-info-item premium-info-status">
              <div className="premium-info-icon-wrapper premium-icon-status">
                <Clock className="w-6 h-6" />
              </div>
              <div className="premium-info-content">
                <p className="premium-info-label">Status</p>
                <Badge
                  variant={
                    donation.status === 'active' ? 'default' :
                      donation.status === 'completed' ? 'secondary' :
                        'destructive'
                  }
                  className={`premium-status-badge-inline ${
                    donation.status === 'active' ? 'premium-status-active-inline' :
                      donation.status === 'completed' ? 'premium-status-completed-inline' :
                        'premium-status-cancelled-inline'
                  }`}
                >
                  {donation.status === 'active' && <CheckCircle2 className="w-4 h-4 mr-1" />}
                  {donation.status === 'completed' && <CheckCircle2 className="w-4 h-4 mr-1" />}
                  {donation.status === 'cancelled' && <XCircle className="w-4 h-4 mr-1" />}
                  {donation.status?.charAt(0).toUpperCase() + donation.status?.slice(1) || 'Unknown'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Premium Recent Donors Section */}
      <Card className="premium-donors-card mb-6">
        <CardHeader className="premium-donors-header">
          <div className="flex items-center gap-3">
            <div className="premium-donors-icon-wrapper">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="premium-donors-title">Recent Donors</CardTitle>
              <p className="premium-donors-subtitle">{totalDonorsCount > 0 ? `${totalDonorsCount} total contributors` : 'Be the first to contribute'}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="premium-donors-content">
          {donorsLoading ? (
            <div className="flex items-center justify-center py-16 min-h-[250px]">
              <ImageLoader size={80} text="Loading recent donors..." />
            </div>
          ) : recentDonors.length > 0 ? (
            <div className="premium-donors-grid">
              {recentDonors.map((donor, index) => (
                <div 
                  key={index} 
                  className="premium-donor-card"
                >
                  <div className="premium-donor-card-header">
                    <div className="premium-donor-name-section">
                      <p className="premium-donor-name">{donor.name || 'Anonymous'}</p>
                      {donor.name && donor.name !== 'Anonymous' && donor.name.split(' ').length > 1 && (
                        <p className="premium-donor-nickname">
                          {donor.name.split(' ').slice(0, 2).join(' ').toUpperCase()}
                        </p>
                      )}
                    </div>
                    <div className="premium-donor-amount-wrapper">
                      <p className="premium-donor-amount">₹{donor.amount?.toLocaleString('en-IN') || '0'}</p>
                    </div>
                  </div>
                  {donor.message && (
                    <div className="premium-donor-message-section">
                      <p className="premium-donor-message">
                        "{donor.message}"
                      </p>
                    </div>
                  )}
                  <div className="premium-donor-footer">
                    <div className="premium-donor-date">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{donor.date && new Date(donor.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="premium-donor-badge">
                      <Heart className="w-3.5 h-3.5" />
                      <span>Supporter</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="premium-donors-empty">
              <div className="premium-donors-empty-icon">
                <Users className="w-16 h-16" />
              </div>
              <p className="premium-donors-empty-title">Be the First to Donate!</p>
              <p className="premium-donors-empty-subtitle">Your contribution will make a difference</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Premium Professional Image Gallery Carousel */}
      {donation.images && donation.images.length > 0 && (
        <Card className="premium-gallery-card">
          <CardHeader className="premium-gallery-header">
            <div className="flex items-center gap-3">
              <div className="premium-gallery-icon-wrapper">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="premium-gallery-title">Campaign Gallery</CardTitle>
                <p className="premium-gallery-subtitle">{donation.images.length} {donation.images.length === 1 ? 'Image' : 'Images'} available</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="premium-gallery-content">
            <div className="premium-carousel-wrapper">
              {/* Main Image Display with Full Controls */}
              <div className="premium-carousel-main-wrapper">
                <div className="premium-carousel-main-image">
                  <img 
                    src={donation.images[activeImage]} 
                    alt={`${donation.title} - Image ${activeImage + 1}`}
                    className="premium-carousel-main-img"
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="premium-carousel-overlay"></div>
                  
                  {/* Navigation Arrows - Always Visible */}
                  {donation.images.length > 1 && (
                    <>
                      <button 
                        onClick={() => setActiveImage((prev) => prev === 0 ? donation.images.length - 1 : prev - 1)}
                        className="premium-carousel-arrow premium-carousel-arrow-left"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-7 h-7" />
                      </button>
                      <button 
                        onClick={() => setActiveImage((prev) => prev === donation.images.length - 1 ? 0 : prev + 1)}
                        className="premium-carousel-arrow premium-carousel-arrow-right"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-7 h-7" />
                      </button>
                    </>
                  )}

                  {/* Image Counter & Info */}
                  {donation.images.length > 1 && (
                    <div className="premium-carousel-info">
                      <div className="premium-carousel-counter-badge">
                        <span className="premium-carousel-counter-number">{activeImage + 1}</span>
                        <span className="premium-carousel-counter-separator">/</span>
                        <span className="premium-carousel-counter-total">{donation.images.length}</span>
                      </div>
                    </div>
                  )}

                  {/* Image Dots Indicator */}
                  {donation.images.length > 1 && (
                    <div className="premium-carousel-dots">
                      {donation.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImage(idx)}
                          className={`premium-carousel-dot ${
                            idx === activeImage ? 'premium-carousel-dot-active' : ''
                          }`}
                          aria-label={`Go to image ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Thumbnail Strip */}
              {donation.images.length > 1 && (
                <div className="premium-carousel-thumbnails-wrapper">
                  <div className="premium-carousel-thumbnails-scroll">
                    {donation.images.map((image, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImage(idx)}
                        className={`premium-carousel-thumbnail-btn ${
                          idx === activeImage ? 'premium-carousel-thumbnail-btn-active' : ''
                        }`}
                        aria-label={`View image ${idx + 1}`}
                      >
                        <img 
                          src={image} 
                          alt={`Thumbnail ${idx + 1}`}
                          className="premium-carousel-thumbnail-img"
                        />
                        {idx === activeImage && (
                          <div className="premium-carousel-thumbnail-active-indicator">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      </div>

      {/* Premium Sticky Bottom CTA for Mobile */}
      {donation.status === 'active' && (
        <div className="premium-sticky-cta lg:hidden safe-area-inset-bottom">
          <div className="premium-sticky-content">
            <div className="premium-sticky-info">
              {donationAmount ? (
                <div>
                  <p className="premium-sticky-label">Donating</p>
                  <p className="premium-sticky-amount">₹{parseInt(donationAmount).toLocaleString('en-IN')}</p>
                </div>
              ) : (
                <p className="premium-sticky-prompt">Select an amount to donate</p>
              )}
            </div>
            <Button
              onClick={(e) => {
                if (!donationAmount) {
                  e.preventDefault();
                  document.getElementById('donation-form-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  setTimeout(() => {
                    document.querySelector('input[type="number"]')?.focus();
                  }, 500);
                } else {
                  handleDonation(e);
                }
              }}
              className="premium-sticky-button"
              size="lg"
              disabled={!donationAmount}
            >
              <Heart className="w-5 h-5 mr-2" />
              {donationAmount ? 'Donate Now' : 'Select Amount'}
            </Button>
          </div>
        </div>
      )}

      <GuestDonationForm
        isOpen={showGuestForm}
        onClose={() => setShowGuestForm(false)}
        onSubmit={handleGuestFormSubmit}
      />

      {/* Payment Verification Loading Overlay */}
      {verifyingPayment && (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full shadow-2xl">
            <CardContent className="pt-8 pb-8">
              <div className="text-center space-y-5">
                <ImageLoader size={80} />
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Verifying Payment</h3>
                  <p className="text-sm text-muted-foreground">Please wait while we verify your payment...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DonationDetails; 