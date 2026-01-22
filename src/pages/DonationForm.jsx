import React, { useState } from 'react';
import { useStripe, useElements } from '@stripe/stripe-react-js';
import { DonationAmount, PaymentMethod, DonorInfo } from '../components';

const DonationForm = () => {
  const [donationData, setDonationData] = useState({
    amount: 0,
    frequency: 'one-time',
    paymentMethod: 'card',
    donorInfo: {
      name: '',
      email: '',
      address: '',
    }
  });

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement('card'),
      });

      // API call to process donation
      // ... implementation
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  return (
    <div className="g-g-py-6">
      <form onSubmit={handleSubmit} className="g-form g-shadow-md g-rounded">
        <DonationAmount 
          value={donationData.amount}
          onChange={(amount) => setDonationData({...donationData, amount})}
        />
        
        <PaymentMethod 
          value={donationData.paymentMethod}
          onChange={(method) => setDonationData({...donationData, paymentMethod: method})}
        />
        
        <DonorInfo 
          value={donationData.donorInfo}
          onChange={(info) => setDonationData({...donationData, donorInfo: info})}
        />
        
        <button type="submit" className="g-btn g-btn-primary g-w-full">
          Complete Donation
        </button>
      </form>
    </div>
  );
};

export default DonationForm; 