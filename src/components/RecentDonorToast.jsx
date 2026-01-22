import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import api from '../utils/api';
import './RecentDonorToast.css';

const RecentDonorToast = () => {
  const [currentToast, setCurrentToast] = useState(null);
  const [toastCount, setToastCount] = useState(0);
  const [recentDonations, setRecentDonations] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const location = useLocation();
  const timeoutRef = useRef(null);
  const autoHideRef = useRef(null);
  const isInitialMount = useRef(true);

  // Emoji mapping for causes
  const causeEmoji = {
    animal: '🐾',
    child: '🎒',
    medical: '🚑',
    relief: '❤️'
  };

  // Get cause text (memoized)
  const getCauseText = useCallback((cause) => {
    const causeMap = {
      animal: 'an injured animal',
      child: 'child education',
      medical: 'medical care',
      relief: 'relief efforts'
    };
    return causeMap[cause] || 'a cause';
  }, []);

  // Format toast message (memoized)
  const formatToastMessage = useCallback((donation) => {
    if (!donation) return null;

    const emoji = causeEmoji[donation.cause] || '❤️';
    
    // Get first name only
    let name = 'A supporter';
    if (donation.donorName) {
      const firstName = donation.donorName.split(' ')[0];
      if (firstName) {
        name = firstName;
      }
    }

    // Format amount
    const amountText = donation.amount 
      ? `₹${donation.amount.toLocaleString('en-IN')}` 
      : null;

    // Prefer city + amount, then city only, then amount only
    if (donation.city && amountText) {
      return `${emoji} ${name} from ${donation.city} donated ${amountText} to ${getCauseText(donation.cause)}`;
    }

    if (donation.city) {
      return `${emoji} ${name} from ${donation.city} helped ${getCauseText(donation.cause)}`;
    }

    if (amountText) {
      return `${emoji} ${name} just donated ${amountText} to ${getCauseText(donation.cause)}`;
    }

    // Fallback
    return `${emoji} ${name} just donated to ${getCauseText(donation.cause)}`;
  }, [getCauseText]);

  // Check if current route is a payment/checkout route
  const isPaymentRoute = () => {
    const path = location.pathname.toLowerCase();
    return (
      path.includes('/payment') ||
      path.includes('/checkout') ||
      path.includes('/success') ||
      path.includes('/failure')
    );
  };

  // Check if we're on donation details page
  const isDonationDetailsPage = () => {
    const path = location.pathname.toLowerCase();
    return path.includes('/donations/') && path.split('/').length === 3;
  };

  // Fetch recent paid donations from payments collection
  useEffect(() => {
    const fetchRecentDonations = async () => {
      try {
        const response = await api.get('/payments/recent-paid?limit=10');
        if (response.data && Array.isArray(response.data)) {
          setRecentDonations(response.data);
        }
      } catch (error) {
        console.error('Error fetching recent paid donations:', error);
      }
    };

    fetchRecentDonations();
  }, []);


  // Show toast function
  const showToast = useCallback(() => {
    if (recentDonations.length === 0) return;

    // Get next donation from the list
    const nextIndex = currentIndex % recentDonations.length;
    const donation = recentDonations[nextIndex];
    const message = formatToastMessage(donation);

    if (message) {
      setCurrentToast({ message, donation });
      setToastCount(prev => prev + 1);
      setCurrentIndex(prev => (prev + 1) % recentDonations.length);

      // Auto-hide after 6 seconds
      if (autoHideRef.current) {
        clearTimeout(autoHideRef.current);
      }
      autoHideRef.current = setTimeout(() => {
        setCurrentToast(null);
      }, 6000);
    }
  }, [recentDonations, currentIndex, formatToastMessage]);

  // Calculate delay based on toast count for donation details page
  const getNextToastDelay = useCallback(() => {
    if (toastCount === 0) {
      // First toast: 1 second
      return 1000;
    } else if (toastCount === 1) {
      // Second toast: 3 seconds after first
      return 3000;
    } else if (toastCount === 2) {
      // Third toast: 5 seconds after second
      return 5000;
    } else {
      // After third: each toast every 3 seconds
      return 3000;
    }
  }, [toastCount]);

  // Schedule initial toast on donation details page
  useEffect(() => {
    // Don't schedule if on payment route or no donations
    if (isPaymentRoute() || recentDonations.length === 0) {
      return;
    }

    const onDonationDetailsPage = isDonationDetailsPage();

    if (onDonationDetailsPage && isInitialMount.current && toastCount === 0) {
      isInitialMount.current = false;
      // First toast after 1 second
      timeoutRef.current = setTimeout(() => {
        showToast();
      }, 1000);
    }

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [location.pathname, recentDonations.length, toastCount, showToast]);

  // Schedule next toast when current one is dismissed (donation details page)
  useEffect(() => {
    if (!isDonationDetailsPage() || isPaymentRoute() || recentDonations.length === 0) {
      return;
    }

    // When toast is dismissed, schedule next one with progressive timing
    if (!currentToast) {
      const delay = getNextToastDelay();
      timeoutRef.current = setTimeout(() => {
        showToast();
      }, delay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentToast, location.pathname, recentDonations.length, toastCount, showToast, getNextToastDelay]);

  // Schedule toasts for other pages (non-donation details)
  useEffect(() => {
    if (isDonationDetailsPage() || isPaymentRoute() || recentDonations.length === 0) {
      return;
    }

    // On other pages: first after 15 seconds, then every 90 seconds
    if (isInitialMount.current && toastCount === 0) {
      isInitialMount.current = false;
      timeoutRef.current = setTimeout(() => {
        showToast();
      }, 15000);
    } else if (!currentToast && toastCount > 0 && toastCount < 5) {
      timeoutRef.current = setTimeout(() => {
        showToast();
      }, 90000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [location.pathname, recentDonations.length, currentToast, toastCount, showToast]);

  // Handle manual dismiss
  const handleDismiss = () => {
    setCurrentToast(null);
    if (autoHideRef.current) {
      clearTimeout(autoHideRef.current);
    }
  };

  if (!currentToast) {
    return null;
  }

  return (
    <div className="recent-donor-toast">
      <div className="recent-donor-toast-content">
        <p className="recent-donor-toast-message">{currentToast.message}</p>
        <button
          className="recent-donor-toast-dismiss"
          onClick={handleDismiss}
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default RecentDonorToast;

