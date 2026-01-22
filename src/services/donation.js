// Mock donation service
// In a real application, this would connect to your backend API

// Mock data
let donations = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    amount: 50.00,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString() // 2 days ago
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    amount: 100.00,
    createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
  }
];

// Get all donations
export const getDonations = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...donations];
};

// Create a new donation
export const createDonation = async (donationData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Validate data
  if (!donationData.amount || donationData.amount <= 0) {
    throw new Error("Invalid donation amount");
  }
  
  if (!donationData.name || !donationData.email) {
    throw new Error("Name and email are required");
  }
  
  // Create new donation
  const newDonation = {
    id: donations.length + 1,
    ...donationData,
    createdAt: new Date().toISOString()
  };
  
  // Add to mock database
  donations = [...donations, newDonation];
  
  return newDonation;
};

// Get donation statistics
export const getDonationStats = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const totalAmount = donations.reduce((sum, donation) => sum + donation.amount, 0);
  
  return {
    totalDonations: donations.length,
    totalAmount,
    averageDonation: donations.length > 0 ? totalAmount / donations.length : 0
  };
}; 