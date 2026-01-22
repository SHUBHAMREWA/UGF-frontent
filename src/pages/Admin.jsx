import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDonation } from "../context/DonationContext";
import ImageLoader from "../components/ImageLoader";

// Admin Dashboard component
const Dashboard = () => {
  const { donations, loading, error } = useDonation();
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalAmount: 0,
    averageDonation: 0
  });

  useEffect(() => {
    if (donations.length > 0) {
      const totalAmount = donations.reduce((sum, donation) => sum + donation.amount, 0);
      setStats({
        totalDonations: donations.length,
        totalAmount,
        averageDonation: totalAmount / donations.length
      });
    }
  }, [donations]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8 px-6 flex items-center justify-center">
        <ImageLoader size={120} text="Loading dashboard data..." />
      </div>
    );
  }
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow dark:bg-gray-700">
          <h3 className="text-gray-500 text-sm font-medium dark:text-gray-300">Total Donations</h3>
          <p className="text-2xl font-bold dark:text-white">{stats.totalDonations}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow dark:bg-gray-700">
          <h3 className="text-gray-500 text-sm font-medium dark:text-gray-300">Total Amount</h3>
          <p className="text-2xl font-bold dark:text-white">${stats.totalAmount.toFixed(2)}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow dark:bg-gray-700">
          <h3 className="text-gray-500 text-sm font-medium dark:text-gray-300">Average Donation</h3>
          <p className="text-2xl font-bold dark:text-white">
            ${stats.averageDonation ? stats.averageDonation.toFixed(2) : '0.00'}
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden dark:bg-gray-700">
        <h3 className="p-4 border-b font-medium dark:text-white dark:border-gray-600">Recent Donations</h3>
        {donations.length === 0 ? (
          <p className="p-4 text-gray-500 dark:text-gray-300">No donations yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-700 dark:divide-gray-600">
                {donations.slice(0, 5).map((donation) => (
                  <tr key={donation.id}>
                    <td className="px-6 py-4 whitespace-nowrap dark:text-white">{donation.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap dark:text-white">{donation.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap dark:text-white">${donation.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap dark:text-white">
                      {new Date(donation.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Donations List component
const DonationsList = () => {
  const { donations, loading, error } = useDonation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8 px-6 flex items-center justify-center">
        <ImageLoader size={120} text="Loading donations..." />
      </div>
    );
  }
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">All Donations</h2>
      
      {donations.length === 0 ? (
        <div className="bg-white p-4 rounded-lg shadow text-center dark:bg-gray-700 dark:text-white">
          No donations found.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden dark:bg-gray-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-700 dark:divide-gray-600">
                {donations.map((donation) => (
                  <tr key={donation.id}>
                    <td className="px-6 py-4 whitespace-nowrap dark:text-white">{donation.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap dark:text-white">{donation.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap dark:text-white">${donation.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap dark:text-white">
                      {new Date(donation.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// Settings component
const Settings = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Settings</h2>
      <div className="bg-white p-6 rounded-lg shadow dark:bg-gray-700">
        <p className="text-gray-500 dark:text-gray-300">Admin settings will be implemented in a future update.</p>
      </div>
    </div>
  );
};

// Main Admin component
const Admin = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold dark:text-white">Admin Panel</h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600 dark:text-gray-300">
            Welcome, {currentUser?.email || "Admin"}
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-4 dark:bg-gray-700">
            <nav className="space-y-2">
              <Link 
                to="/admin" 
                className="block px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white"
              >
                Dashboard
              </Link>
              <Link 
                to="/admin/donations" 
                className="block px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white"
              >
                Donations
              </Link>
              <Link 
                to="/admin/settings" 
                className="block px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white"
              >
                Settings
              </Link>
            </nav>
          </div>
        </div>
        
        <div className="md:col-span-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/donations" element={<DonationsList />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Admin; 