import React, { useEffect, useState } from "react";
import AnalyticsCard from "./AnalyticsCard";
import DonationTable from "./DonationTable";
import VolunteerTable from './VolunteerTable';

const Dashboard = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      const response = await fetch('/api/volunteers', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Adjust based on your auth setup
        }
      });
      const data = await response.json();
      if (data.success) {
        setVolunteers(data.data);
      }
    } catch (error) {
      console.error('Error fetching volunteers:', error);
    } finally {
      setLoading(false);
    }
  };

  // This would come from your API/context in a real app
  const analyticsData = {
    totalDonations: 124582,
    monthlyDonations: 28450,
    totalDonors: 1243,
    averageDonation: 100,
    recentDonations: [
      { id: 1, name: "John Doe", amount: 50, date: "2023-06-15", status: "completed" },
      { id: 2, name: "Jane Smith", amount: 100, date: "2023-06-14", status: "completed" },
      { id: 3, name: "Robert Johnson", amount: 250, date: "2023-06-14", status: "completed" },
      { id: 4, name: "Emily Davis", amount: 75, date: "2023-06-13", status: "completed" },
      { id: 5, name: "Michael Brown", amount: 150, date: "2023-06-12", status: "completed" },
    ],
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-richBlack mb-2">Dashboard</h1>
        <p className="text-subtext">Welcome back, Admin. Here's an overview of your donation platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AnalyticsCard
          title="Total Donations"
          value={`$${analyticsData.totalDonations.toLocaleString()}`}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="primary"
          trend={8.2}
        />
        <AnalyticsCard
          title="Monthly Donations"
          value={`$${analyticsData.monthlyDonations.toLocaleString()}`}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
          color="secondary"
          trend={12.5}
        />
        <AnalyticsCard
          title="Total Donors"
          value={analyticsData.totalDonors.toLocaleString()}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          color="accent"
          trend={5.3}
        />
        <AnalyticsCard
          title="Average Donation"
          value={`$${analyticsData.averageDonation}`}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
          color="richBlack"
          trend={-2.1}
        />
      </div>

      <div className="bg-white rounded-xl shadow-soft p-6 mb-8">
        <h2 className="text-xl font-bold text-richBlack mb-6">Volunteer Applications</h2>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <VolunteerTable volunteers={volunteers} />
        )}
      </div>

      <div className="bg-white rounded-xl shadow-soft p-6 mb-8">
        <h2 className="text-xl font-bold text-richBlack mb-6">Donation Overview</h2>
        <div className="h-80 w-full">
          {/* Chart component would go here - using a placeholder */}
          <div className="w-full h-full bg-background rounded-lg flex items-center justify-center">
            <p className="text-subtext">Donation chart visualization would render here</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-soft p-6">
        <h2 className="text-xl font-bold text-richBlack mb-6">Recent Donations</h2>
        <DonationTable donations={analyticsData.recentDonations} />
      </div>
    </div>
  );
};

export default Dashboard; 