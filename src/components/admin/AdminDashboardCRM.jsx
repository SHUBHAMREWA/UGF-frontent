import React, { useState, useEffect, useCallback } from 'react';
import { 
  FiDollarSign, FiUsers, FiFolder, FiTarget, FiFileText, FiBarChart2, 
  FiPlus, FiX, FiEdit, FiTrash2, FiDownload, FiSearch, FiFilter,
  FiCalendar, FiTrendingUp, FiTrendingDown, FiEye, FiMail, FiPrinter,
  FiRefreshCw, FiSave, FiChevronDown, FiChevronUp
} from 'react-icons/fi';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  LineChart, Line, CartesianGrid, Legend, PieChart, Pie, Cell,
  AreaChart, Area
} from 'recharts';
import axios from 'axios';
import { API_CONFIG, getAuthHeaders } from '../../config/api';
import crmApi from '../../services/crmApi';
import api from '../../utils/api';
import ImageLoader from '../ImageLoader';
import './AdminDashboardCRM.css';

const AdminDashboardCRM = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(false);

  const sections = [
    { key: 'dashboard', label: 'Dashboard Overview', icon: <FiBarChart2 /> },
    { key: 'donations', label: 'Donations', icon: <FiDollarSign /> },
    { key: 'donors', label: 'Donors', icon: <FiUsers /> },
    { key: 'programs', label: 'Programs', icon: <FiFolder /> },
    { key: 'events', label: 'Events', icon: <FiCalendar /> },
    { key: 'blogs', label: 'Blogs', icon: <FiFileText /> },
    { key: 'campaigns', label: 'Campaigns', icon: <FiTarget /> },
    { key: 'analytics', label: 'Analytics & Reports', icon: <FiTrendingUp /> }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <CRMDashboard />;
      case 'donations':
        return <DonationsSection />;
      case 'donors':
        return <DonorsSection />;
      case 'programs':
        return <ProgramsSection />;
      case 'events':
        return <EventsSection />;
      case 'blogs':
        return <BlogsSection />;
      case 'campaigns':
        return <CampaignsSection />;
      case 'analytics':
        return <AnalyticsSection />;
      default:
        return <CRMDashboard />;
    }
  };

  return (
    <div className="crm-container">
      <div className="crm-header">
        <h2>Comprehensive CRM Dashboard</h2>
        <p>Single source of truth for all donations, programs, events, blogs, and analytics</p>
      </div>
      
      <div className="crm-layout">
        <div className="crm-sidebar">
          <nav className="crm-nav">
            {sections.map(section => (
              <button
                key={section.key}
                className={`crm-nav-item ${activeSection === section.key ? 'active' : ''}`}
                onClick={() => setActiveSection(section.key)}
              >
                {section.icon}
                <span>{section.label}</span>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="crm-content">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

// Dashboard Overview Component
const CRMDashboard = () => {
  const [stats, setStats] = useState({
    donations: { total: 0, monthly: 0, today: 0 },
    programs: { total: 0, active: 0 },
    events: { total: 0, upcoming: 0 },
    blogs: { total: 0, published: 0 },
    campaigns: { total: 0, active: 0 }
  });
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load donation stats - use admin endpoint to get all donations (offline, online, campaign)
      let donationStats;
      try {
        const statsResponse = await api.get('/admin/donations/stats');
        if (statsResponse?.data?.success) {
          donationStats = { success: true, data: statsResponse.data.data };
        } else {
          donationStats = await crmApi.getCRMDonationStats();
        }
      } catch (error) {
        console.error('Error loading donation stats:', error);
        donationStats = await crmApi.getCRMDonationStats();
      }
      
      // Load other stats in parallel
      const [programsRes, eventsRes, blogsRes, campaignsRes, trendRes] = await Promise.all([
        api.get('/programs'),
        api.get('/events'),
        api.get('/blog'),
        crmApi.getCRMCampaigns(),
        api.get('/admin/dashboard/trend?days=30')
      ]);

      setStats({
        donations: {
          total: donationStats?.data?.totalAmount || 0,
          monthly: donationStats?.data?.monthlyAmount || 0,
          today: 0 // Calculate today separately
        },
        programs: {
          total: programsRes?.data?.length || 0,
          active: programsRes?.data?.filter(p => p.active)?.length || 0
        },
        events: {
          total: eventsRes?.data?.length || 0,
          upcoming: eventsRes?.data?.filter(e => e.status === 'upcoming')?.length || 0
        },
        blogs: {
          total: blogsRes?.data?.data?.length || blogsRes?.data?.length || 0,
          published: blogsRes?.data?.data?.filter(b => b.published)?.length || 0
        },
        campaigns: {
          total: campaignsRes?.data?.length || 0,
          active: campaignsRes?.data?.filter(c => c.isActive)?.length || 0
        }
      });

      // Process trend data
      if (trendRes?.data?.success) {
        const income = trendRes.data.data.income || [];
        const expense = trendRes.data.data.expense || [];
        
        // Combine and format for chart
        const combined = [];
        const dateMap = {};
        
        income.forEach(item => {
          const date = `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`;
          if (!dateMap[date]) dateMap[date] = { date, income: 0, expense: 0 };
          dateMap[date].income = item.amount;
        });
        
        expense.forEach(item => {
          const date = `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`;
          if (!dateMap[date]) dateMap[date] = { date, income: 0, expense: 0 };
          dateMap[date].expense = item.amount;
        });
        
        setTrendData(Object.values(dateMap).sort((a, b) => new Date(a.date) - new Date(b.date)));
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="loading-state" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <ImageLoader size={120} text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="crm-dashboard">
      <h3>Dashboard Overview</h3>
      
      <div className="stats-grid">
        <div className="stat-card green">
          <div className="stat-icon">
            <FiDollarSign />
          </div>
          <div className="stat-content">
            <h4>Total Donations</h4>
            <p className="stat-value">{formatCurrency(stats.donations.total)}</p>
            <span className="stat-change">This Month: {formatCurrency(stats.donations.monthly)}</span>
          </div>
        </div>

        <div className="stat-card blue">
          <div className="stat-icon">
            <FiFolder />
          </div>
          <div className="stat-content">
            <h4>Programs</h4>
            <p className="stat-value">{stats.programs.total}</p>
            <span className="stat-change">Active: {stats.programs.active}</span>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon">
            <FiCalendar />
          </div>
          <div className="stat-content">
            <h4>Events</h4>
            <p className="stat-value">{stats.events.total}</p>
            <span className="stat-change">Upcoming: {stats.events.upcoming}</span>
          </div>
        </div>

        <div className="stat-card red">
          <div className="stat-icon">
            <FiFileText />
          </div>
          <div className="stat-content">
            <h4>Blog Posts</h4>
            <p className="stat-value">{stats.blogs.total}</p>
            <span className="stat-change">Published: {stats.blogs.published}</span>
          </div>
        </div>

        <div className="stat-card blue">
          <div className="stat-icon">
            <FiTarget />
          </div>
          <div className="stat-content">
            <h4>Campaigns</h4>
            <p className="stat-value">{stats.campaigns.total}</p>
            <span className="stat-change">Active: {stats.campaigns.active}</span>
          </div>
        </div>
      </div>

      {trendData.length > 0 && (
        <div className="chart-container">
          <h4>Income vs Expense Trend (Last 30 Days)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Area type="monotone" dataKey="income" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Income" />
              <Area type="monotone" dataKey="expense" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="Expense" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

// Donations Section Component
const DonationsSection = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    method: '',
    paymentMode: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
    projectId: '',
    categoryId: '',
    campaignId: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 });
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view'); // view, edit, create

  useEffect(() => {
    loadFilterOptions();
  }, []);

  const loadFilterOptions = async () => {
    try {
      const [projectsRes, categoriesRes, campaignsRes] = await Promise.all([
        crmApi.getCRMProjects({ isActive: true }),
        crmApi.getCRMCategories({ kind: 'INCOME', isActive: true }),
        crmApi.getCRMCampaigns()
      ]);
      
      if (projectsRes?.success) setProjects(projectsRes.data || []);
      if (categoriesRes?.success) setCategories(categoriesRes.data || []);
      if (campaignsRes?.success) setCampaigns(campaignsRes.data || []);
    } catch (error) {
      console.error('Error loading filter options:', error);
    }
  };

  const loadDonations = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.current,
        limit: 20,
        ...filters
      };
      
      // Use admin donations endpoint to get ALL donations (offline, online, campaign)
      // Don't filter by paymentMode to get all types
      const allParams = { ...params };
      // Remove paymentMode filter if it's set, to get all donations
      if (allParams.paymentMode === '') delete allParams.paymentMode;
      
      const response = await api.get('/admin/donations', { params: allParams });
      if (response?.data?.success) {
        setDonations(response.data.data || []);
        setPagination(response.data.pagination || { current: 1, pages: 1, total: 0 });
      } else {
        // Fallback to CRM donations if admin endpoint fails
        const crmResponse = await crmApi.getCRMDonations(allParams);
        if (crmResponse?.success) {
          setDonations(crmResponse.data || []);
          setPagination(crmResponse.pagination || { current: 1, pages: 1, total: 0 });
        }
      }
    } catch (error) {
      console.error('Error loading donations:', error);
      // Try fallback to CRM donations
      try {
        const params = {
          page: pagination.current,
          limit: 20,
          ...filters
        };
        const crmResponse = await crmApi.getCRMDonations(params);
        if (crmResponse?.success) {
          setDonations(crmResponse.data || []);
          setPagination(crmResponse.pagination || { current: 1, pages: 1, total: 0 });
        }
      } catch (fallbackError) {
        console.error('Error loading donations from CRM:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.current]);

  // Reload donations when filters or pagination changes
  useEffect(() => {
    loadDonations();
  }, [loadDonations]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleExport = async () => {
    try {
      // Use admin donations export endpoint to get all donations (offline, online, campaign)
      let response;
      try {
        response = await api.post('/admin/donations/export', { filters }, {
          responseType: 'blob'
        });
      } catch (error) {
        // Fallback to CRM export
        response = await crmApi.exportCRMDonations(filters);
      }
      
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `donations-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting donations:', error);
      alert('Failed to export donations');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this donation?')) return;
    
    try {
      await crmApi.deleteCRMDonation(id);
      loadDonations();
    } catch (error) {
      console.error('Error deleting donation:', error);
      alert('Failed to delete donation');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  return (
    <div className="crm-section">
      <div className="section-header">
        <h3>Donations Management</h3>
        <div className="section-actions">
          <button className="crm-btn secondary" onClick={() => setShowFilters(!showFilters)}>
            <FiFilter /> {showFilters ? 'Hide' : 'Show'} Filters
          </button>
          <button className="crm-btn secondary" onClick={handleExport}>
            <FiDownload /> Export CSV
          </button>
          <button className="crm-btn primary" onClick={() => { setModalType('create'); setShowModal(true); }}>
            <FiPlus /> Add Donation
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-row">
            <div className="filter-group">
              <label>Search</label>
              <input
                type="text"
                placeholder="Search by reference, remarks, receipt..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Status</label>
              <select value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)}>
                <option value="">All Status</option>
                <option value="SUCCESS">Success</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Payment Method</label>
              <select value={filters.method} onChange={(e) => handleFilterChange('method', e.target.value)}>
                <option value="">All Methods</option>
                <option value="CASH">Cash</option>
                <option value="CHEQUE">Cheque</option>
                <option value="UPI">UPI</option>
                <option value="BANK">Bank Transfer</option>
                <option value="CARD">Card</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Donation Type</label>
              <select value={filters.paymentMode} onChange={(e) => handleFilterChange('paymentMode', e.target.value)}>
                <option value="">All Types (Online + Offline)</option>
                <option value="ONLINE">Online Only</option>
                <option value="OFFLINE">Offline Only</option>
              </select>
            </div>
          </div>
          <div className="filter-row">
            <div className="filter-group">
              <label>Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Min Amount</label>
              <input
                type="number"
                placeholder="Min"
                value={filters.minAmount}
                onChange={(e) => handleFilterChange('minAmount', e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Max Amount</label>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxAmount}
                onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
              />
            </div>
          </div>
          <div className="filter-row">
            <div className="filter-group">
              <label>Project</label>
              <select value={filters.projectId} onChange={(e) => handleFilterChange('projectId', e.target.value)}>
                <option value="">All Projects</option>
                {projects.map(p => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Category</label>
              <select value={filters.categoryId} onChange={(e) => handleFilterChange('categoryId', e.target.value)}>
                <option value="">All Categories</option>
                {categories.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Campaign</label>
              <select value={filters.campaignId} onChange={(e) => handleFilterChange('campaignId', e.target.value)}>
                <option value="">All Campaigns</option>
                {campaigns.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <button className="crm-btn secondary" onClick={() => setFilters({
                search: '', status: '', method: '', paymentMode: '',
                startDate: '', endDate: '', minAmount: '', maxAmount: '',
                projectId: '', categoryId: '', campaignId: ''
              })}>
                <FiRefreshCw /> Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-state" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <ImageLoader size={120} text="Loading donations..." />
        </div>
      ) : donations.length === 0 ? (
        <div className="empty-state">
          <FiDollarSign className="empty-icon" />
          <h4>No Donations Found</h4>
          <p>No donations match your current filters.</p>
        </div>
      ) : (
        <>
          <div className="data-table">
            <table>
              <thead>
                <tr>
                  <th>Receipt No</th>
                  <th>Donor</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Project</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {donations.map(donation => (
                  <tr key={donation._id}>
                    <td>{donation.receipt?.receiptNo || '-'}</td>
                    <td>
                      <div className="donor-info">
                        <span className="donor-name">{donation.donorId?.fullName || 'Anonymous'}</span>
                        {donation.donorId?.email && (
                          <span className="donor-email">{donation.donorId.email}</span>
                        )}
                      </div>
                    </td>
                    <td className="amount">{formatCurrency(donation.amount)}</td>
                    <td>
                      <span className={`type-badge ${
                        donation.paymentMode === 'ONLINE' || 
                        donation.paymentMode === 'online' || 
                        donation.method === 'ONLINE' || 
                        donation.method === 'UPI' || 
                        donation.method === 'CARD' ||
                        donation.method === 'BANK' && donation.paymentMode !== 'OFFLINE'
                          ? 'online' 
                          : 'offline'
                      }`}>
                        {donation.paymentMode === 'ONLINE' || 
                         donation.paymentMode === 'online' || 
                         donation.method === 'ONLINE' || 
                         donation.method === 'UPI' || 
                         donation.method === 'CARD' ||
                         (donation.method === 'BANK' && donation.paymentMode !== 'OFFLINE')
                          ? 'Online' 
                          : 'Offline'}
                      </span>
                    </td>
                    <td>
                      <span className={`mode-badge ${donation.method?.toLowerCase()}`}>
                        {donation.method}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${donation.status?.toLowerCase()}`}>
                        {donation.status}
                      </span>
                    </td>
                    <td>{new Date(donation.dateReceived).toLocaleDateString()}</td>
                    <td>{donation.projectId?.name || '-'}</td>
                    <td>{donation.categoryId?.name || '-'}</td>
                    <td>
                      <div className="actions">
                        <button className="action-btn view" onClick={() => { setSelectedDonation(donation); setModalType('view'); setShowModal(true); }}>
                          <FiEye />
                        </button>
                        <button className="action-btn edit" onClick={() => { setSelectedDonation(donation); setModalType('edit'); setShowModal(true); }}>
                          <FiEdit />
                        </button>
                        <button className="action-btn delete" onClick={() => handleDelete(donation._id)}>
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button 
              className="pagination-btn" 
              disabled={pagination.current === 1}
              onClick={() => setPagination(prev => ({ ...prev, current: prev.current - 1 }))}
            >
              Previous
            </button>
            <span className="pagination-info">
              Page {pagination.current} of {pagination.pages} ({pagination.total} total)
            </span>
            <button 
              className="pagination-btn"
              disabled={pagination.current === pagination.pages}
              onClick={() => setPagination(prev => ({ ...prev, current: prev.current + 1 }))}
            >
              Next
            </button>
          </div>
        </>
      )}

      {showModal && (
        <DonationModal
          donation={selectedDonation}
          type={modalType}
          onClose={() => { setShowModal(false); setSelectedDonation(null); }}
          onSave={loadDonations}
        />
      )}
    </div>
  );
};

// Donors Section Component
const DonorsSection = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    email: '',
    phone: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 });
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view');

  useEffect(() => {
    loadDonors();
  }, [filters, pagination.current]);

  const loadDonors = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.current,
        limit: 20,
        ...filters
      };
      
      // Use admin donors endpoint to get ALL donors (from offline and online donations)
      const response = await api.get('/admin/donors', { params });
      if (response?.data?.success) {
        setDonors(response.data.data || []);
        setPagination(response.data.pagination || { current: 1, pages: 1, total: 0 });
      } else {
        // Fallback to CRM donors
        const crmResponse = await crmApi.getCRMDonors(params);
        if (crmResponse?.success) {
          setDonors(crmResponse.data || []);
          setPagination(crmResponse.pagination || { current: 1, pages: 1, total: 0 });
        }
      }
    } catch (error) {
      console.error('Error loading donors:', error);
      // Try fallback to CRM donors
      try {
        const params = {
          page: pagination.current,
          limit: 20,
          ...filters
        };
        const crmResponse = await crmApi.getCRMDonors(params);
        if (crmResponse?.success) {
          setDonors(crmResponse.data || []);
          setPagination(crmResponse.pagination || { current: 1, pages: 1, total: 0 });
        }
      } catch (fallbackError) {
        console.error('Error loading donors from CRM:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this donor?')) return;
    
    try {
      await crmApi.deleteCRMDonor(id);
      loadDonors();
    } catch (error) {
      console.error('Error deleting donor:', error);
      alert('Failed to delete donor');
    }
  };

  return (
    <div className="crm-section">
      <div className="section-header">
        <h3>Donors Management</h3>
        <div className="section-actions">
          <button className="crm-btn secondary" onClick={() => setShowFilters(!showFilters)}>
            <FiFilter /> {showFilters ? 'Hide' : 'Show'} Filters
          </button>
          <button className="crm-btn primary" onClick={() => { setModalType('create'); setShowModal(true); }}>
            <FiPlus /> Add Donor
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-row">
            <div className="filter-group">
              <label>Search</label>
              <input
                type="text"
                placeholder="Search by name, email, phone, code..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Filter by email"
                value={filters.email}
                onChange={(e) => handleFilterChange('email', e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Phone</label>
              <input
                type="tel"
                placeholder="Filter by phone"
                value={filters.phone}
                onChange={(e) => handleFilterChange('phone', e.target.value)}
              />
            </div>
            <div className="filter-group">
              <button className="crm-btn secondary" onClick={() => setFilters({ search: '', email: '', phone: '' })}>
                <FiRefreshCw /> Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-state" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <ImageLoader size={120} text="Loading donors..." />
        </div>
      ) : donors.length === 0 ? (
        <div className="empty-state">
          <FiUsers className="empty-icon" />
          <h4>No Donors Found</h4>
          <p>No donors match your current filters.</p>
        </div>
      ) : (
        <>
          <div className="data-table">
            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Preferred Contact</th>
                  <th>Tags</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {donors.map(donor => (
                  <tr key={donor._id}>
                    <td>{donor.code || '-'}</td>
                    <td>
                      <span className="donor-name">{donor.fullName || 'N/A'}</span>
                    </td>
                    <td>{donor.email || '-'}</td>
                    <td>{donor.phone || '-'}</td>
                    <td>{donor.preferredContact || '-'}</td>
                    <td>
                      {donor.tags && donor.tags.length > 0 ? (
                        <div className="tags">
                          {donor.tags.slice(0, 2).map((tag, idx) => (
                            <span key={idx} className="tag">{tag}</span>
                          ))}
                          {donor.tags.length > 2 && <span className="tag">+{donor.tags.length - 2}</span>}
                        </div>
                      ) : '-'}
                    </td>
                    <td>
                      <div className="actions">
                        <button className="action-btn view" onClick={() => { setSelectedDonor(donor); setModalType('view'); setShowModal(true); }}>
                          <FiEye />
                        </button>
                        <button className="action-btn edit" onClick={() => { setSelectedDonor(donor); setModalType('edit'); setShowModal(true); }}>
                          <FiEdit />
                        </button>
                        <button className="action-btn delete" onClick={() => handleDelete(donor._id)}>
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.pages > 1 && (
            <div className="pagination">
              <button 
                className="pagination-btn" 
                disabled={pagination.current === 1}
                onClick={() => setPagination(prev => ({ ...prev, current: Math.max(1, prev.current - 1) }))}
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {pagination.current} of {pagination.pages} ({pagination.total} total)
              </span>
              <button 
                className="pagination-btn"
                disabled={pagination.current >= pagination.pages}
                onClick={() => setPagination(prev => ({ ...prev, current: Math.min(prev.pages, prev.current + 1) }))}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {showModal && (
        <DonorModal
          donor={selectedDonor}
          type={modalType}
          onClose={() => { setShowModal(false); setSelectedDonor(null); }}
          onSave={loadDonors}
        />
      )}
    </div>
  );
};

// Donor Modal Component
const DonorModal = ({ donor, type, onClose, onSave }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (donor && type === 'edit') {
      setFormData({
        fullName: donor.fullName || '',
        email: donor.email || '',
        phone: donor.phone || '',
        address: donor.address || '',
        preferredContact: donor.preferredContact || 'email'
      });
    }
  }, [donor, type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (type === 'create') {
        await crmApi.createCRMDonor(formData);
      } else if (type === 'edit') {
        await crmApi.updateCRMDonor(donor._id, formData);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving donor:', error);
      alert('Failed to save donor');
    } finally {
      setLoading(false);
    }
  };

  if (type === 'view') {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Donor Details</h3>
            <button className="modal-close" onClick={onClose}>
              <FiX />
            </button>
          </div>
          <div className="modal-body">
            {donor && (
              <div className="detail-view">
                <div className="detail-item">
                  <label>Code:</label>
                  <span>{donor.code || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <label>Name:</label>
                  <span>{donor.fullName || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <label>Email:</label>
                  <span>{donor.email || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>Phone:</label>
                  <span>{donor.phone || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>Address:</label>
                  <span>{donor.address || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>Preferred Contact:</label>
                  <span>{donor.preferredContact || '-'}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{type === 'create' ? 'Add New' : 'Edit'} Donor</h3>
          <button className="modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                required
                value={formData.fullName || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea
                value={formData.address || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                rows="3"
              />
            </div>
            <div className="form-group">
              <label>Preferred Contact</label>
              <select
                value={formData.preferredContact || 'email'}
                onChange={(e) => setFormData(prev => ({ ...prev, preferredContact: e.target.value }))}
              >
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="button" className="crm-btn secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="crm-btn primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Placeholder components for other sections (to be implemented)
const ProgramsSection = () => (
  <div className="crm-section">
    <div className="section-header">
      <h3>Programs Management</h3>
      <button className="crm-btn primary">
        <FiPlus /> Add Program
      </button>
    </div>
    <div className="empty-state">
      <FiFolder className="empty-icon" />
      <h4>Programs Management</h4>
      <p>Manage all programs and initiatives.</p>
    </div>
  </div>
);

const EventsSection = () => (
  <div className="crm-section">
    <div className="section-header">
      <h3>Events Management</h3>
      <button className="crm-btn primary">
        <FiPlus /> Add Event
      </button>
    </div>
    <div className="empty-state">
      <FiCalendar className="empty-icon" />
      <h4>Events Management</h4>
      <p>Manage all events and activities.</p>
    </div>
  </div>
);

const BlogsSection = () => (
  <div className="crm-section">
    <div className="section-header">
      <h3>Blogs Management</h3>
      <button className="crm-btn primary">
        <FiPlus /> Add Blog
      </button>
    </div>
    <div className="empty-state">
      <FiFileText className="empty-icon" />
      <h4>Blogs Management</h4>
      <p>Manage all blog posts and articles.</p>
    </div>
  </div>
);

const CampaignsSection = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [modalType, setModalType] = useState('create');
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    loadCampaigns();
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await crmApi.getCRMProjects({ isActive: true });
      if (response?.success) setProjects(response.data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const response = await crmApi.getCRMCampaigns();
      if (response?.success) {
        setCampaigns(response.data || []);
      }
    } catch (error) {
      console.error('Error loading campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;
    try {
      await crmApi.delete(`/crm/campaigns/${id}`);
      loadCampaigns();
    } catch (error) {
      console.error('Error deleting campaign:', error);
      alert('Failed to delete campaign');
    }
  };

  return (
    <div className="crm-section">
      <div className="section-header">
        <h3>Campaigns Management</h3>
        <button className="crm-btn primary" onClick={() => { setModalType('create'); setSelectedCampaign(null); setShowModal(true); }}>
          <FiPlus /> Add Campaign
        </button>
      </div>

      {loading ? (
        <div className="loading-state" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <ImageLoader size={120} text="Loading campaigns..." />
        </div>
      ) : campaigns.length === 0 ? (
        <div className="empty-state">
          <FiTarget className="empty-icon" />
          <h4>No Campaigns Found</h4>
          <p>Start by creating your first campaign.</p>
        </div>
      ) : (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Project</th>
                <th>Status</th>
                <th>For User</th>
                <th>Start Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map(campaign => (
                <tr key={campaign._id}>
                  <td>{campaign.code}</td>
                  <td>{campaign.name}</td>
                  <td>{campaign.projectId?.name || '-'}</td>
                  <td>
                    <span className={`status-badge ${campaign.isActive ? 'active' : 'inactive'}`}>
                      {campaign.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{campaign.CampaignForUser || 'Public'}</td>
                  <td>{new Date(campaign.startDate).toLocaleDateString()}</td>
                  <td>
                    <div className="actions">
                      <button className="action-btn edit" onClick={() => { setSelectedCampaign(campaign); setModalType('edit'); setShowModal(true); }}>
                        <FiEdit />
                      </button>
                      <button className="action-btn delete" onClick={() => handleDelete(campaign._id)}>
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <CampaignModal
          campaign={selectedCampaign}
          projects={projects}
          type={modalType}
          onClose={() => setShowModal(false)}
          onSave={loadCampaigns}
        />
      )}
    </div>
  );
};

const CampaignModal = ({ campaign, projects, type, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    projectId: '',
    channels: ['website'],
    notes: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    isActive: true,
    isForUser: false,
    CampaignForUser: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (campaign && type === 'edit') {
      setFormData({
        name: campaign.name,
        projectId: campaign.projectId?._id || campaign.projectId,
        channels: campaign.channels || ['website'],
        notes: campaign.notes || '',
        startDate: campaign.startDate ? new Date(campaign.startDate).toISOString().split('T')[0] : '',
        endDate: campaign.endDate ? new Date(campaign.endDate).toISOString().split('T')[0] : '',
        isActive: campaign.isActive,
        isForUser: !!campaign.CampaignForUser,
        CampaignForUser: campaign.CampaignForUser || ''
      });
    }
  }, [campaign, type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submitData = { ...formData };
      if (!formData.isForUser) {
        submitData.CampaignForUser = null;
      }
      delete submitData.isForUser;

      if (type === 'create') {
        await crmApi.post('/crm/campaigns', submitData);
      } else {
        await crmApi.put(`/crm/campaigns/${campaign._id}`, submitData);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving campaign:', error);
      alert(error.response?.data?.message || 'Failed to save campaign');
    } finally {
      setLoading(false);
    }
  };

  const handleChannelChange = (channel) => {
    const newChannels = formData.channels.includes(channel)
      ? formData.channels.filter(c => c !== channel)
      : [...formData.channels, channel];
    setFormData({ ...formData, channels: newChannels });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{type === 'create' ? 'Add New' : 'Edit'} Campaign</h3>
          <button className="modal-close" onClick={onClose}><FiX /></button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-group">
              <label>Campaign Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter campaign name"
              />
            </div>
            <div className="form-group">
              <label>Project *</label>
              <select
                required
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              >
                <option value="">Select Project</option>
                {projects.map(p => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Channels *</label>
              <div className="checkbox-group" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '5px' }}>
                {['website', 'walk-in', 'event', 'social', 'other'].map(channel => (
                  <label key={channel} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem' }}>
                    <input
                      type="checkbox"
                      checked={formData.channels.includes(channel)}
                      onChange={() => handleChannelChange(channel)}
                    />
                    {channel.charAt(0).toUpperCase() + channel.slice(1)}
                  </label>
                ))}
              </div>
            </div>
            <div className="form-row" style={{ display: 'flex', gap: '15px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows="3"
                placeholder="Additional notes..."
              />
            </div>
            
            <div className="form-group" style={{ borderTop: '1px solid #eee', pt: '15px', mt: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.isForUser}
                  onChange={(e) => setFormData({ ...formData, isForUser: e.target.checked })}
                  style={{ width: '18px', height: '18px' }}
                />
                <span style={{ fontWeight: '600' }}>Is this campaign for user?</span>
              </label>
              
              {formData.isForUser && (
                <div style={{ marginTop: '10px', animation: 'fadeIn 0.3s ease' }}>
                  <input
                    type="email"
                    required={formData.isForUser}
                    value={formData.CampaignForUser}
                    onChange={(e) => setFormData({ ...formData, CampaignForUser: e.target.value })}
                    placeholder="Enter user email"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                  />
                </div>
              )}
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                Active Campaign
              </label>
            </div>
            
            <div className="form-actions">
              <button type="button" className="crm-btn secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="crm-btn primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Campaign'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Analytics Section Component
const AnalyticsSection = () => {
  const [analyticsData, setAnalyticsData] = useState({
    paymentMethods: [],
    categories: [],
    projects: [],
    trends: [],
    monthlyComparison: []
  });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    projectId: '',
    categoryId: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, [filters]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.projectId) params.append('projectId', filters.projectId);
      if (filters.categoryId) params.append('categoryId', filters.categoryId);

      const queryString = params.toString();
      
      // Load all analytics data in parallel
      const [paymentMethodsRes, categoriesRes, projectsRes, trendsRes] = await Promise.all([
        api.get(`/admin/dashboard/payment-methods${queryString ? `?${queryString}` : ''}`),
        api.get(`/admin/dashboard/categories${queryString ? `?${queryString}&type=income` : '?type=income'}`),
        api.get(`/admin/dashboard/projects${queryString ? `?${queryString}` : ''}`),
        api.get(`/admin/dashboard/trend${queryString ? `&${queryString}` : '?days=90'}`)
      ]);

      setAnalyticsData({
        paymentMethods: paymentMethodsRes?.data?.success ? paymentMethodsRes.data.data.income || [] : [],
        categories: categoriesRes?.data?.success ? categoriesRes.data.data || [] : [],
        projects: projectsRes?.data?.success ? projectsRes.data.data || [] : [],
        trends: trendsRes?.data?.success ? processTrendData(trendsRes.data.data) : []
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const processTrendData = (data) => {
    const income = data.income || [];
    const expense = data.expense || [];
    const dateMap = {};
    
    income.forEach(item => {
      const date = `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`;
      if (!dateMap[date]) dateMap[date] = { date, income: 0, expense: 0 };
      dateMap[date].income = item.amount;
    });
    
    expense.forEach(item => {
      const date = `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`;
      if (!dateMap[date]) dateMap[date] = { date, income: 0, expense: 0 };
      dateMap[date].expense = item.amount;
    });
    
    return Object.values(dateMap).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const handleDownloadReport = async () => {
    try {
      // Generate comprehensive report
      const reportData = {
        filters,
        analytics: analyticsData,
        generatedAt: new Date().toISOString()
      };
      
      // Convert to JSON and download
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Failed to download report');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];

  return (
    <div className="crm-section">
      <div className="section-header">
        <h3>Analytics & Reports</h3>
        <div className="section-actions">
          <button className="crm-btn secondary" onClick={() => setShowFilters(!showFilters)}>
            <FiFilter /> {showFilters ? 'Hide' : 'Show'} Filters
          </button>
          <button className="crm-btn primary" onClick={handleDownloadReport}>
            <FiDownload /> Download Report
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-row">
            <div className="filter-group">
              <label>Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div className="filter-group">
              <label>End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
            <div className="filter-group">
              <button className="crm-btn secondary" onClick={() => setFilters({ startDate: '', endDate: '', projectId: '', categoryId: '' })}>
                <FiRefreshCw /> Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-state" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <ImageLoader size={120} text="Loading analytics..." />
        </div>
      ) : (
        <div className="analytics-grid">
          {/* Payment Methods Breakdown */}
          {analyticsData.paymentMethods.length > 0 && (
            <div className="chart-container">
              <h4>Payment Methods Breakdown</h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.paymentMethods.map(item => ({
                      name: item._id || 'Unknown',
                      value: item.amount || 0
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analyticsData.paymentMethods.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Category Breakdown */}
          {analyticsData.categories.length > 0 && (
            <div className="chart-container">
              <h4>Category Breakdown</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.categories.slice(0, 10).map(item => ({
                  name: item.categoryName || 'Unknown',
                  amount: item.amount || 0,
                  count: item.count || 0
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="amount" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Project Performance */}
          {analyticsData.projects.length > 0 && (
            <div className="chart-container">
              <h4>Project Performance</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.projects.slice(0, 10).map(item => ({
                  name: item.name || 'Unknown',
                  income: item.totalIncome || 0,
                  expense: item.totalExpense || 0,
                  net: (item.totalIncome || 0) - (item.totalExpense || 0)
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="income" fill="#10b981" name="Income" />
                  <Bar dataKey="expense" fill="#ef4444" name="Expense" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Income vs Expense Trend */}
          {analyticsData.trends.length > 0 && (
            <div className="chart-container full-width">
              <h4>Income vs Expense Trend (Last 90 Days)</h4>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={analyticsData.trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Area type="monotone" dataKey="income" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Income" />
                  <Area type="monotone" dataKey="expense" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="Expense" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Summary Statistics */}
          <div className="analytics-summary">
            <h4>Summary Statistics</h4>
            <div className="stats-grid">
              {analyticsData.paymentMethods.length > 0 && (
                <div className="stat-card">
                  <div className="stat-content">
                    <h4>Total Payment Methods</h4>
                    <p className="stat-value">{analyticsData.paymentMethods.length}</p>
                    <span className="stat-change">
                      Total: {formatCurrency(analyticsData.paymentMethods.reduce((sum, item) => sum + (item.amount || 0), 0))}
                    </span>
                  </div>
                </div>
              )}
              {analyticsData.categories.length > 0 && (
                <div className="stat-card">
                  <div className="stat-content">
                    <h4>Active Categories</h4>
                    <p className="stat-value">{analyticsData.categories.length}</p>
                    <span className="stat-change">
                      Total: {formatCurrency(analyticsData.categories.reduce((sum, item) => sum + (item.amount || 0), 0))}
                    </span>
                  </div>
                </div>
              )}
              {analyticsData.projects.length > 0 && (
                <div className="stat-card">
                  <div className="stat-content">
                    <h4>Active Projects</h4>
                    <p className="stat-value">{analyticsData.projects.length}</p>
                    <span className="stat-change">
                      Net: {formatCurrency(analyticsData.projects.reduce((sum, item) => sum + ((item.totalIncome || 0) - (item.totalExpense || 0)), 0))}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Donation Modal Component
const DonationModal = ({ donation, type, onClose, onSave }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (donation && type === 'edit') {
      setFormData({
        amount: donation.amount,
        method: donation.method,
        status: donation.status,
        dateReceived: new Date(donation.dateReceived).toISOString().split('T')[0],
        reference: donation.reference || '',
        remarks: donation.remarks || ''
      });
    }
  }, [donation, type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (type === 'create') {
        await crmApi.createCRMDonation(formData);
      } else if (type === 'edit') {
        await crmApi.updateCRMDonation(donation._id, formData);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving donation:', error);
      alert('Failed to save donation');
    } finally {
      setLoading(false);
    }
  };

  if (type === 'view') {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Donation Details</h3>
            <button className="modal-close" onClick={onClose}>
              <FiX />
            </button>
          </div>
          <div className="modal-body">
            {donation && (
              <div className="detail-view">
                <div className="detail-item">
                  <label>Receipt No:</label>
                  <span>{donation.receipt?.receiptNo || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <label>Donor:</label>
                  <span>{donation.donorId?.fullName || 'Anonymous'}</span>
                </div>
                <div className="detail-item">
                  <label>Amount:</label>
                  <span>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(donation.amount)}</span>
                </div>
                <div className="detail-item">
                  <label>Type:</label>
                  <span>
                    {donation.paymentMode === 'ONLINE' || 
                     donation.paymentMode === 'online' || 
                     donation.method === 'ONLINE' || 
                     donation.method === 'UPI' || 
                     donation.method === 'CARD' ||
                     (donation.method === 'BANK' && donation.paymentMode !== 'OFFLINE')
                      ? 'Online' 
                      : 'Offline'}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Method:</label>
                  <span>{donation.method}</span>
                </div>
                <div className="detail-item">
                  <label>Status:</label>
                  <span>{donation.status}</span>
                </div>
                <div className="detail-item">
                  <label>Date:</label>
                  <span>{new Date(donation.dateReceived).toLocaleDateString()}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{type === 'create' ? 'Add New' : 'Edit'} Donation</h3>
          <button className="modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-group">
              <label>Amount (₹)</label>
              <input
                type="number"
                required
                value={formData.amount || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label>Payment Method</label>
              <select
                required
                value={formData.method || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, method: e.target.value }))}
              >
                <option value="">Select method</option>
                <option value="CASH">Cash</option>
                <option value="CHEQUE">Cheque</option>
                <option value="UPI">UPI</option>
                <option value="BANK">Bank Transfer</option>
                <option value="CARD">Card</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                required
                value={formData.status || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="">Select status</option>
                <option value="SUCCESS">Success</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date Received</label>
              <input
                type="date"
                required
                value={formData.dateReceived || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, dateReceived: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label>Reference</label>
              <input
                type="text"
                value={formData.reference || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
                placeholder="Transaction ID, cheque number, etc."
              />
            </div>
            <div className="form-group">
              <label>Remarks</label>
              <textarea
                value={formData.remarks || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
                rows="3"
              />
            </div>
            <div className="form-actions">
              <button type="button" className="crm-btn secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="crm-btn primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardCRM;
