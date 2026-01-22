import { useState } from 'react';
import { processDonation } from '../services/donationService';

export const useDonation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitDonation = async (donationData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await processDonation(donationData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submitDonation, loading, error };
}; 