import React, { createContext, useContext, useState, useEffect } from "react";
import { getDonations, createDonation as createDonationService } from "../services/donation";

const DonationContext = createContext();

export const useDonation = () => useContext(DonationContext);

export const DonationProvider = ({ children }) => {
  const [donations, setDonations] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [currentCampaign, setCurrentCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const data = await getDonations();
      setDonations(data);
      setCampaigns(data);
      setCurrentCampaign(data[0] || null);
      setError(null);
    } catch (err) {
      setError("Failed to fetch campaigns");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createDonation = async (donationData) => {
    try {
      setLoading(true);
      const newDonation = await createDonationService(donationData);
      setDonations(prev => [...prev, newDonation]);
      return newDonation;
    } catch (err) {
      setError("Failed to create donation");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const selectCampaign = (campaignId) => {
    const campaign = campaigns.find((c) => c.id === campaignId);
    if (campaign) {
      setCurrentCampaign(campaign);
    }
  };

  const value = {
    donations,
    campaigns,
    currentCampaign,
    loading,
    error,
    createDonation,
    selectCampaign,
    fetchCampaigns,
  };

  return (
    <DonationContext.Provider value={value}>
      {children}
    </DonationContext.Provider>
  );
}; 