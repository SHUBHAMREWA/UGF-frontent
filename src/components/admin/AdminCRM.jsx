import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ImageLoader from '../ImageLoader';
import './AdminCRM.css';

// Components
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminDashboard from './AdminDashboard';
import DonationManagement from './DonationManagement';
import ExpenseManagement from './ExpenseManagement';
import DonorManagement from './DonorManagement';
import ProjectManagement from './ProjectManagement';
import CategoryManagement from './CategoryManagement';
import CampaignManagement from './CampaignManagement';
import ReceiptManagement from './ReceiptManagement';
import ReportManagement from './ReportManagement';
import AdminLogin from './AdminLogin';

// Context
import { useAuth } from '../../context/AuthContext';

const AdminCRM = () => {
  const { user, loading, hasRole } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPath, setCurrentPath] = useState('/admin');

  // If not authenticated, redirect to login
  if (loading) {
    return (
      <div className="admin-loading" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div className="neo-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '40px' }}>
          <ImageLoader size={120} text="Loading..." />
        </div>
      </div>
    );
  }

  // Removed automatic redirect - let the component handle the display

  // Debug: Log user data to console
  console.log('AdminCRM - User data:', user);

  // TEMPORARY FIX: Allow all logged-in users to access CRM for now
  // TODO: Implement proper admin role checking once user data structure is confirmed
  if (!user) {
    return (
      <div className="admin-loading">
        <div className="neo-card">
          <h2>Not Logged In</h2>
          <p>Please log in to access the CRM system.</p>
          <button onClick={() => window.location.href = '/login'} className="neo-btn">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="admin-crm">
      <AdminSidebar 
        collapsed={sidebarCollapsed} 
        currentPath={currentPath}
        onPathChange={setCurrentPath}
      />
      
      <div className={`admin-main ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <AdminHeader 
          onToggleSidebar={toggleSidebar}
          sidebarCollapsed={sidebarCollapsed}
        />
        
        <main className="admin-content">
          <Routes>
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/donations" element={<DonationManagement />} />
            <Route path="/admin/expenses" element={<ExpenseManagement />} />
            <Route path="/admin/donors" element={<DonorManagement />} />
            <Route path="/admin/projects" element={<ProjectManagement />} />
            <Route path="/admin/categories" element={<CategoryManagement />} />
            <Route path="/admin/campaigns" element={<CampaignManagement />} />
            <Route path="/admin/receipts" element={<ReceiptManagement />} />
            <Route path="/admin/reports" element={<ReportManagement />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminCRM;
