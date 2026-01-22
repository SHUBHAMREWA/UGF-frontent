import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Heart, Lock, CheckCircle2, ArrowRight, CreditCard, Smartphone, AlertCircle } from 'lucide-react';
import api from '../utils/api';

const SubscriptionButton = ({ 
  onSubscribe, 
  buttonLabel = "Subscribe Now",
  buttonTheme = "primary",
  plans = [],
  oneTimePayments = [],
  showUPIAutopay = true,
  isLoading = false
}) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedOneTime, setSelectedOneTime] = useState(null);
  const [paymentType, setPaymentType] = useState('recurring'); // 'recurring' or 'one-time'
  const [useUPIAutopay, setUseUPIAutopay] = useState(true);
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [isTestMode, setIsTestMode] = useState(false);

  useEffect(() => {
    const checkRazorpayMode = async () => {
      try {
        const res = await api.get('/config/razorpay-key');
        const key = res.data.key || '';
        if (key && key.startsWith('rzp_test_')) {
          setIsTestMode(true);
        }
      } catch (error) {
        console.error('Error checking Razorpay mode:', error);
      }
    };
    checkRazorpayMode();
  }, []);

  const defaultPlans = plans.length > 0 ? plans : [
    {
      id: 'plan_100',
      name: 'Basic Supporter',
      description: 'Support our cause monthly',
      amount: 100,
      frequency: 'monthly',
      cycles: null // null means unlimited
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
    }
  ];

  const defaultOneTimePayments = oneTimePayments.length > 0 ? oneTimePayments : [
    { label: 'Quick Donation', value: 100 },
    { label: 'Standard Donation', value: 500 },
    { label: 'Generous Donation', value: 1000 }
  ];

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setSelectedOneTime(null);
    setPaymentType('recurring');
  };

  const handleOneTimeSelect = (payment) => {
    setSelectedOneTime(payment);
    setSelectedPlan(null);
    setPaymentType('one-time');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!customerDetails.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!customerDetails.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(customerDetails.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!customerDetails.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(customerDetails.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (paymentType === 'recurring' && !selectedPlan) {
      newErrors.plan = 'Please select a subscription plan';
    }

    if (paymentType === 'one-time' && !selectedOneTime) {
      newErrors.oneTime = 'Please select a donation amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubscribe = () => {
    if (!validateForm()) return;

    const subscriptionData = {
      paymentType,
      customerDetails,
      useUPIAutopay: paymentType === 'recurring' ? useUPIAutopay : false,
      plan: selectedPlan,
      oneTimeAmount: selectedOneTime?.value,
      amount: paymentType === 'recurring' 
        ? selectedPlan.amount 
        : selectedOneTime.value
    };

    onSubscribe(subscriptionData);
  };

  const getButtonThemeClass = () => {
    switch (buttonTheme) {
      case 'dark':
        return 'bg-gray-900 hover:bg-gray-800 text-white';
      case 'light':
        return 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300';
      case 'outline':
        return 'bg-transparent hover:bg-primary/10 text-primary border-2 border-primary';
      default:
        return 'bg-primary hover:bg-primary/90 text-white';
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Support Our Cause</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Type Selection */}
        <div className="flex gap-4 p-1 bg-muted rounded-lg">
          <button
            type="button"
            onClick={() => {
              setPaymentType('recurring');
              setSelectedOneTime(null);
            }}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
              paymentType === 'recurring'
                ? 'bg-primary text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Recurring Plans
          </button>
          <button
            type="button"
            onClick={() => {
              setPaymentType('one-time');
              setSelectedPlan(null);
            }}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
              paymentType === 'one-time'
                ? 'bg-primary text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            One-Time Payment
          </button>
        </div>

        {/* Recurring Plans */}
        {paymentType === 'recurring' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select a Subscription Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {defaultPlans.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => handlePlanSelect(plan)}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    selectedPlan?.id === plan.id
                      ? 'border-primary bg-primary/10 shadow-md'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-lg">{plan.name}</h4>
                    {selectedPlan?.id === plan.id && (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-primary">₹{plan.amount}</span>
                    <span className="text-sm text-muted-foreground">/{plan.frequency}</span>
                  </div>
                </button>
              ))}
            </div>
            {errors.plan && (
              <p className="text-sm text-destructive">{errors.plan}</p>
            )}

            {/* UPI Autopay Option */}
            {showUPIAutopay && selectedPlan && (
              <div className={`p-4 rounded-xl border ${
                isTestMode 
                  ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' 
                  : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
              }`}>
                <div className="flex items-start gap-3">
                  {isTestMode ? (
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                  ) : (
                    <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        id="useUPIAutopay"
                        checked={useUPIAutopay}
                        onChange={(e) => setUseUPIAutopay(e.target.checked)}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                      />
                      <label htmlFor="useUPIAutopay" className="font-semibold text-foreground cursor-pointer">
                        Enable UPI Autopay
                      </label>
                    </div>
                    {isTestMode ? (
                      <div className="space-y-1">
                        <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
                          ⚠️ Test Mode Detected
                        </p>
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                          UPI Autopay is not available in test mode. You can still make payments using other methods (Card, Net Banking, etc.). For UPI Autopay, switch to LIVE Razorpay keys.
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Automatically process payments every month using UPI. Secure, convenient, and hassle-free.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* One-Time Payments */}
        {paymentType === 'one-time' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select Donation Amount</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {defaultOneTimePayments.map((payment, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleOneTimeSelect(payment)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedOneTime?.value === payment.value
                      ? 'border-primary bg-primary/10 font-semibold'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="font-medium mb-1">{payment.label}</div>
                  <div className="text-xl font-bold text-primary">₹{payment.value}</div>
                </button>
              ))}
            </div>
            {errors.oneTime && (
              <p className="text-sm text-destructive">{errors.oneTime}</p>
            )}
          </div>
        )}

        {/* Customer Details */}
        <div className="space-y-4 pt-6 border-t border-border">
          <h3 className="text-lg font-semibold">Your Information</h3>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Full Name *
            </label>
            <Input
              type="text"
              id="name"
              name="name"
              value={customerDetails.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address *
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                value={customerDetails.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                Phone Number *
              </label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={customerDetails.phone}
                onChange={handleInputChange}
                placeholder="10-digit mobile number"
                maxLength="10"
                className={errors.phone ? 'border-destructive' : ''}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-destructive">{errors.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Summary */}
        {(selectedPlan || selectedOneTime) && (
          <div className="p-4 bg-muted/50 rounded-xl">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">
                {paymentType === 'recurring' ? 'Monthly Amount:' : 'Donation Amount:'}
              </span>
              <span className="text-2xl font-bold text-primary">
                ₹{paymentType === 'recurring' ? selectedPlan?.amount : selectedOneTime?.value}
                {paymentType === 'recurring' && <span className="text-sm font-normal text-muted-foreground ml-1">/month</span>}
              </span>
            </div>
            {paymentType === 'recurring' && useUPIAutopay && (
              <div className="mt-2 text-sm text-muted-foreground flex items-center gap-1">
                <Smartphone className="w-4 h-4" />
                <span>UPI Autopay enabled</span>
              </div>
            )}
          </div>
        )}

        {/* Subscribe Button */}
        <Button
          onClick={handleSubscribe}
          disabled={isLoading || (!selectedPlan && !selectedOneTime)}
          className={`w-full h-12 text-base font-semibold ${getButtonThemeClass()}`}
        >
          {isLoading ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Processing...
            </>
          ) : (
            <>
              {buttonLabel}
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Lock className="w-4 h-4" />
          <span>Secure payment processing by Razorpay</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionButton;

