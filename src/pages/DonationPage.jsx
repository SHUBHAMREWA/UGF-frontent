import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Heart, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import api from '../utils/api';
import PageLoader from '../components/PageLoader';
import usePageLoader from '../hooks/usePageLoader';
import SubscriptionButton from '../components/SubscriptionButton';

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

const DonationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const preselectedAmount = queryParams.get('amount');
  const campaignId = queryParams.get('campaign');
  const isPageLoading = usePageLoader();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    amount: preselectedAmount || '',
    customAmount: '',
    isMonthly: false,
    isAnonymous: false,
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [razorpayKey, setRazorpayKey] = useState('');
  const [viewMode, setViewMode] = useState('subscription'); // 'subscription' or 'traditional'

  const predefinedAmounts = [100, 250, 500, 1000, 2500, 5000];

  useEffect(() => {
    const fetchRazorpayKey = async () => {
      try {
        const res = await api.get('/config/razorpay-key');
        setRazorpayKey(res.data.key || '');
      } catch (error) {
        console.error('Error fetching Razorpay key:', error);
      }
    };
    fetchRazorpayKey();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'amount' && value !== 'custom') {
      setFormData({
        ...formData,
        amount: value,
        customAmount: '',
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    const donationAmount = formData.amount === 'custom' 
      ? parseFloat(formData.customAmount) 
      : parseFloat(formData.amount);
      
    if (isNaN(donationAmount) || donationAmount <= 0) {
      newErrors.amount = "Please enter a valid donation amount";
    } else if (donationAmount < 1) {
      newErrors.amount = "Minimum donation amount is ₹1";
    }
    
    return newErrors;
  };

  const handleRazorpayPayment = async (donationAmount, isRecurring, guestDonorInfo = null) => {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setErrors({ submit: 'Failed to load Razorpay. Please try again.' });
      return;
    }

    if (!razorpayKey) {
      setErrors({ submit: 'Payment gateway not configured. Please try again later.' });
      return;
    }

    try {
      const endpoint = campaignId 
        ? `/donations/${campaignId}/create-order`
        : '/donations/general/create-order';
      
      const donorName = `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || formData.email;
      const orderRes = await api.post(endpoint, {
        amount: donationAmount,
        message: formData.message || '',
        isRecurring: isRecurring,
        email: formData.email,
        name: donorName,
        guestDonor: guestDonorInfo || {
          name: donorName,
          email: formData.email,
          phone: window._tempGuestDonor?.phone || ''
        }
      });
      
      // Clean up temporary guest donor info
      if (window._tempGuestDonor) {
        delete window._tempGuestDonor;
      }

      if (!orderRes.data.success) {
        throw new Error(orderRes.data.message || 'Order creation failed');
      }

      const orderData = orderRes.data;
      const isRecurringPayment = orderData.isRecurring && orderData.mandateInfo;

      // Check if we're using test keys (UPI Autopay doesn't work in test mode)
      const isTestMode = razorpayKey && razorpayKey.startsWith('rzp_test_');
      
      // IMPORTANT: In test mode, UPI Autopay (recurring with token) doesn't work
      // So we disable recurring configuration in test mode to allow all payment methods
      // In production, we try UPI Autopay but allow fallback to regular UPI and other methods
      const shouldUseRecurring = isRecurringPayment && !isTestMode;
      
      // Debug logging for production troubleshooting
      console.log('🔍 Razorpay Checkout Configuration:', {
        isRecurring: isRecurringPayment,
        shouldUseRecurring,
        hasMandateInfo: !!orderData.mandateInfo,
        mandateInfo: orderData.mandateInfo ? {
          max_amount: orderData.mandateInfo.max_amount,
          frequency: orderData.mandateInfo.frequency,
          expiry: orderData.mandateInfo.expiry,
          expiryDate: new Date(orderData.mandateInfo.expiry * 1000).toISOString() // Convert to readable date
        } : null,
        isTestMode,
        keyPrefix: razorpayKey?.substring(0, 8), // Show first 8 chars for debugging
        amount: orderData.order.amount,
        orderId: orderData.order.id
      });
      
      // SEBI-compliant UPI Autopay configuration
      // 
      // IMPORTANT NOTES:
      // 1. UPI Autopay does NOT work in Razorpay Test Mode
      // 2. Must use LIVE Razorpay keys (rzp_live_XXXX) for UPI Autopay
      // 3. Must have approved @valid RZP2 VPA mapped to Razorpay MID
      // 4. In test mode, we disable recurring config to allow all payment methods
      // 5. Users can still make one-time payments in test mode
      
      // CRITICAL: Razorpay requires explicit method configuration for UPI to appear
      // For UPI Autopay (recurring), we MUST include: method.upi + recurring + token
      // For one-time payments, we MUST include: method.upi (no recurring/token)
      
      // Truncate description to 255 characters for Razorpay (keep full text in UI)
      const fullDescription = isRecurringPayment 
        ? isTestMode 
          ? `Monthly recurring donation of ₹${donationAmount} (Test Mode - will process as one-time payment)`
          : `Monthly recurring donation of ₹${donationAmount} (UPI Autopay)`
        : `Donation of ₹${donationAmount}`;
      const truncatedDescription = fullDescription.length > 255 
        ? fullDescription.substring(0, 252) + '...' 
        : fullDescription;

      const options = {
        key: razorpayKey,
        amount: orderData.order.amount,
        currency: 'INR',
        name: 'United Global Federation',
        description: truncatedDescription,
        order_id: orderData.order.id,
        prefill: {
          name: `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || formData.email,
          email: formData.email,
          contact: window._tempGuestDonor?.phone || ''
        },
        // ✅ CRITICAL FIX: Set method INSIDE the recurring block
        // When recurring + token is set, Razorpay may restrict methods
        // Setting method after recurring ensures all methods are available
        ...(shouldUseRecurring && orderData.mandateInfo ? {
          recurring: true,
          token: {
            max_amount: orderData.mandateInfo.max_amount,
            frequency: orderData.mandateInfo.frequency || 'monthly',
            expiry: orderData.mandateInfo.expiry
          },
          // ✅ MUST set method AFTER recurring/token to override Razorpay restrictions
          method: {
            upi: true,
            card: true,
            netbanking: true,
            wallet: true,
            emi: true,
            paylater: true
          }
        } : {
          // For one-time payments: Just set methods
          method: {
            upi: true,
            card: true,
            netbanking: true,
            wallet: true,
            emi: true,
            paylater: true
          }
        }),
        handler: async function (response) {
          try {
            // SEBI UPI Autopay: For recurring payments, mandate_id may be in response.token.mandate_id
            // The mandate activation will be handled via webhook (mandate.activated event)
            const verifyRes = await api.post(
              campaignId 
                ? `/donations/${campaignId}/verify-payment`
                : '/donations/general/verify-payment',
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                amount: donationAmount,
                message: formData.message,
                isRecurring: isRecurring,
                mandate_id: response.token?.mandate_id || null // SEBI Autopay mandate ID if available
              }
            );

            if (verifyRes.data.success) {
              setIsSuccess(true);
              setTimeout(() => {
                navigate('/payment/success', {
                  state: {
                    amount: donationAmount,
                    isMonthly: isRecurring,
                    paymentId: verifyRes.data.paymentId || response.razorpay_payment_id,
                    orderId: verifyRes.data.orderId || response.razorpay_order_id
                  }
                });
              }, 2000);
            } else {
              setErrors({ submit: verifyRes.data.message || 'Payment verification failed' });
            }
          } catch (err) {
            console.error('Payment verification error:', err);
            setErrors({ submit: err.response?.data?.message || 'Payment verification failed' });
          }
        },
        theme: { color: '#14b8a6' },
        modal: {
          ondismiss: function() {
            setIsSubmitting(false);
          }
        },
        // Error handler for payment failures
        handler_error: function(error) {
          console.error('Razorpay error:', error);
          setIsSubmitting(false);
          if (error.error && error.error.description) {
            if (error.error.description.includes('No appropriate payment method')) {
              setErrors({ 
                submit: 'UPI payment method is not available. Please check: 1) UPI enabled in Razorpay Dashboard (Settings → Payment Methods), 2) HTTPS in production, 3) Domain whitelisted, 4) Business KYC verified. You can still use Card, Net Banking, or Wallet.' 
              });
            } else {
              setErrors({ submit: error.error.description || 'Payment failed. Please try again.' });
            }
          } else {
            setErrors({ submit: 'Payment failed. Please try again.' });
          }
        }
      };

      // Log final options for debugging (remove sensitive data)
      console.log('🚀 Opening Razorpay Checkout with final options:', {
        key: razorpayKey?.substring(0, 8) + '...',
        amount: options.amount,
        currency: options.currency,
        order_id: options.order_id,
        method: options.method,
        recurring: options.recurring || false,
        hasToken: !!options.token,
        tokenExpiry: options.token?.expiry ? new Date(options.token.expiry * 1000).toISOString() : null
      });

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Razorpay payment error:', err);
      setErrors({ submit: err.response?.data?.message || err.message || 'Payment processing failed' });
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      const donationAmount = formData.amount === 'custom' 
        ? parseFloat(formData.customAmount) 
        : parseFloat(formData.amount);
      
      await handleRazorpayPayment(donationAmount, formData.isMonthly);
    } catch (error) {
      setErrors({ submit: 'There was an error processing your donation. Please try again.' });
      setIsSubmitting(false);
    }
  };

  const handleSubscription = async (subscriptionData) => {
    setIsSubmitting(true);
    setErrors({});
    
    try {
      const { amount, paymentType, customerDetails, useUPIAutopay } = subscriptionData;
      const isRecurring = paymentType === 'recurring' && useUPIAutopay;
      
      // Update form data for payment processing
      const nameParts = customerDetails.name.trim().split(' ');
      const updatedFormData = {
        ...formData,
        firstName: nameParts[0] || customerDetails.name,
        lastName: nameParts.slice(1).join(' ') || '',
        email: customerDetails.email,
        amount: amount.toString(),
        isMonthly: isRecurring
      };
      setFormData(updatedFormData);
      
      // Store phone for guest donor info
      const guestDonorInfo = {
        name: customerDetails.name,
        email: customerDetails.email,
        phone: customerDetails.phone || ''
      };
      
      // Temporarily store guest donor info for payment processing
      window._tempGuestDonor = guestDonorInfo;
      
      await handleRazorpayPayment(amount, isRecurring, guestDonorInfo);
    } catch (error) {
      setErrors({ submit: error.message || 'There was an error processing your subscription. Please try again.' });
      setIsSubmitting(false);
    }
  };

  if (isPageLoading) {
    return <PageLoader subtitle="Loading donation form..." />;
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Make a Donation
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your generosity makes a real difference in the lives of those in need
          </p>
          
          {/* View Mode Toggle */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              type="button"
              onClick={() => setViewMode('subscription')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'subscription'
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              Subscription Plans
            </button>
            <button
              type="button"
              onClick={() => setViewMode('traditional')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'traditional'
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              Custom Donation
            </button>
          </div>
        </div>

        {isSuccess ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Thank You!</h2>
              <p className="text-muted-foreground mb-2">Your donation has been processed successfully.</p>
              <p className="text-sm text-muted-foreground">Redirecting you to the confirmation page...</p>
            </CardContent>
          </Card>
        ) : viewMode === 'subscription' ? (
          <SubscriptionButton
            onSubscribe={handleSubscription}
            buttonLabel="Subscribe Now"
            buttonTheme="primary"
            showUPIAutopay={true}
            isLoading={isSubmitting}
            plans={[
              {
                id: 'plan_100',
                name: 'Basic Supporter',
                description: 'Support our cause monthly',
                amount: 100,
                frequency: 'monthly',
                cycles: null
              },
              {
                id: 'plan_500',
                name: 'Regular Donor',
                description: 'Make a meaningful impact',
                amount: 500,
                frequency: 'monthly',
                cycles: null
              },
              {
                id: 'plan_1000',
                name: 'Premium Supporter',
                description: 'Help us achieve our goals',
                amount: 1000,
                frequency: 'monthly',
                cycles: null
              },
              {
                id: 'plan_2500',
                name: 'Champion Donor',
                description: 'Transform lives with your generosity',
                amount: 2500,
                frequency: 'monthly',
                cycles: null
              },
              {
                id: 'plan_5000',
                name: 'Hero Supporter',
                description: 'Make a lasting impact on our mission',
                amount: 5000,
                frequency: 'monthly',
                cycles: null
              }
            ]}
            oneTimePayments={[
              { label: 'Quick Donation', value: 100 },
              { label: 'Standard Donation', value: 500 },
              { label: 'Generous Donation', value: 1000 },
              { label: 'Major Donation', value: 2500 },
              { label: 'Transformational Gift', value: 5000 }
            ]}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Donation Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {errors.submit && (
                      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                        {errors.submit}
                      </div>
                    )}
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-3 block">
                          Select Donation Amount
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {predefinedAmounts.map(amount => (
                            <button
                              key={amount}
                              type="button"
                              onClick={() => setFormData({ ...formData, amount: amount.toString(), customAmount: '' })}
                              className={`p-4 rounded-xl border-2 transition-all ${
                                formData.amount === amount.toString()
                                  ? 'border-primary bg-primary/10 text-primary font-semibold'
                                  : 'border-border hover:border-primary/50 text-foreground'
                              }`}
                            >
                              ₹{amount.toLocaleString('en-IN')}
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, amount: 'custom' })}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              formData.amount === 'custom'
                                ? 'border-primary bg-primary/10 text-primary font-semibold'
                                : 'border-border hover:border-primary/50 text-foreground'
                            }`}
                          >
                            Custom
                          </button>
                        </div>
                        {formData.amount === 'custom' && (
                          <div className="mt-4">
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₹</span>
                              <Input
                                type="number"
                                name="customAmount"
                                value={formData.customAmount}
                                onChange={handleChange}
                                placeholder="Enter amount"
                                min="1"
                                step="1"
                                className="pl-8 h-12"
                              />
                            </div>
                            {errors.amount && (
                              <p className="mt-2 text-sm text-destructive">{errors.amount}</p>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-xl">
                        <input
                          type="checkbox"
                          id="isMonthly"
                          name="isMonthly"
                          checked={formData.isMonthly}
                          onChange={handleChange}
                          className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                        />
                        <label htmlFor="isMonthly" className="flex-1 cursor-pointer">
                          <span className="font-medium text-foreground">Make this a monthly donation</span>
                          <span className="block text-sm text-muted-foreground mt-1">
                            Your donation will be automatically processed every month
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-border">
                      <h3 className="text-lg font-semibold text-foreground">Your Information</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                            First Name *
                          </label>
                          <Input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className={errors.firstName ? 'border-destructive' : ''}
                            placeholder="Your first name"
                          />
                          {errors.firstName && (
                            <p className="mt-1 text-sm text-destructive">{errors.firstName}</p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
                            Last Name *
                          </label>
                          <Input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className={errors.lastName ? 'border-destructive' : ''}
                            placeholder="Your last name"
                          />
                          {errors.lastName && (
                            <p className="mt-1 text-sm text-destructive">{errors.lastName}</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                          Email Address *
                        </label>
                        <Input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={errors.email ? 'border-destructive' : ''}
                          placeholder="your.email@example.com"
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-destructive">{errors.email}</p>
                        )}
                      </div>

                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="isAnonymous"
                          name="isAnonymous"
                          checked={formData.isAnonymous}
                          onChange={handleChange}
                          className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                        />
                        <label htmlFor="isAnonymous" className="text-sm text-foreground cursor-pointer">
                          Make my donation anonymous
                        </label>
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                          Message (Optional)
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          className="w-full min-h-[100px] px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          placeholder="Share why you're donating..."
                          rows="3"
                        />
                      </div>
                    </div>

                    <div className="pt-6 border-t border-border">
                      <div className="bg-muted/50 rounded-xl p-6 space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">Donation Summary</h3>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Donation Amount:</span>
                          <span className="text-2xl font-bold text-primary">
                            ₹{formData.amount === 'custom' 
                              ? (formData.customAmount || '0').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                              : (formData.amount || '0').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            {formData.isMonthly && (
                              <span className="text-sm font-normal text-muted-foreground ml-2">/month</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base font-semibold"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Processing...
                        </>
                      ) : (
                        <>
                          Complete Donation
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                    
                    <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                      <Lock className="w-4 h-4" />
                      <span>Secure payment processing by Razorpay</span>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="text-xl">Your Impact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Heart className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">₹100</h4>
                        <p className="text-sm text-muted-foreground">Provides essential supplies for one person</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Heart className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">₹500</h4>
                        <p className="text-sm text-muted-foreground">Supports a family for a week</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Heart className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">₹1,000</h4>
                        <p className="text-sm text-muted-foreground">Funds community development projects</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationPage;
