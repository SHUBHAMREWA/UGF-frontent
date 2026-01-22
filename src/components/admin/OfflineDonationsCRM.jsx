import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FiDollarSign, 
  FiUsers, 
  FiFileText, 
  FiTrendingUp, 
  FiPlus, 
  FiX, 
  FiSearch, 
  FiDownload, 
  FiEye, 
  FiEdit, 
  FiMail, 
  FiPrinter, 
  FiTrash2,
  FiSave,
  FiUserPlus,
  FiRefreshCw,
  FiFilter
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import * as crmApi from '../../services/crmApi';
import { printReceipt } from '../../utils/receiptGenerator';
import ImageLoader from '../ImageLoader';
import './OfflineDonationsCRM.css';

const OfflineDonationsCRM = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Data States
  const [donations, setDonations] = useState([]);
  const [donors, setDonors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  
  // Loading States
  const [loading, setLoading] = useState(false);
  const [donationsLoading, setDonationsLoading] = useState(false);
  const [donorsLoading, setDonorsLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  
  // Filter and Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentModeFilter, setPaymentModeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRangeFilter, setDateRangeFilter] = useState({ from: '', to: '' });
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });
  
  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  
  // Form States
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [donorSearchResults, setDonorSearchResults] = useState([]);
  const [showDonorSearch, setShowDonorSearch] = useState(false);
  const [donorSearchInput, setDonorSearchInput] = useState('');
  const [showNewDonorForm, setShowNewDonorForm] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  // Form data
  const [donationForm, setDonationForm] = useState({
    donorId: '',
    donorName: '',
    donorMobile: '',
    donorEmail: '',
    donorPan: '',
    donorAddress: '',
    donorCity: '',
    donorState: '',
    donorPincode: '',
    projectId: '',
    campaignId: '',
    categoryId: '',
    amount: '',
    paymentMode: '',
    reference: '',
    dateReceived: new Date().toISOString().split('T')[0],
    eightyG: 'no',
    notes: ''
  });

  // Dashboard stats
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalDonors: 0,
    eightyGCount: 0,
    monthlyDonations: 0
  });

  const loadDonations = useCallback(async () => {
    try {
      setDonationsLoading(true);
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        sortBy: 'dateReceived',
        sortOrder: 'desc'
      });

      if (searchTerm) params.append('search', searchTerm);
      if (paymentModeFilter !== 'all') params.append('method', paymentModeFilter.toUpperCase());
      if (statusFilter !== 'all') params.append('status', statusFilter.toUpperCase());
      if (dateRangeFilter.from) params.append('startDate', dateRangeFilter.from);
      if (dateRangeFilter.to) params.append('endDate', dateRangeFilter.to);

      const response = await crmApi.getCRMDonations(Object.fromEntries(params));
      if (response?.success) {
        setDonations(response?.data || []);
        setPagination(prev => ({
          ...prev,
          total: response?.pagination?.total || 0,
          pages: response?.pagination?.pages || 1
        }));
      }
    } catch (error) {
      console.error('Error loading donations:', error);
      toast.error('Failed to load donations');
    } finally {
      setDonationsLoading(false);
    }
  }, [searchTerm, paymentModeFilter, statusFilter, dateRangeFilter, pagination.page, pagination.limit]);

  const loadDonors = useCallback(async () => {
    try {
      setDonorsLoading(true);
      const response = await crmApi.getCRMDonors({ limit: 1000 }); // Load all donors for search
      if (response?.success) {
        setDonors(response?.data || []);
      }
    } catch (error) {
      console.error('Error loading donors:', error);
      toast.error('Failed to load donors');
    } finally {
      setDonorsLoading(false);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      const response = await crmApi.getCRMCategories({ kind: 'INCOME', isActive: true });
      if (response?.success) {
        setCategories(response?.data || []);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  const loadProjects = useCallback(async () => {
    try {
      const response = await crmApi.getCRMProjects({ isActive: true });
      if (response?.success) {
        setProjects(response?.data || []);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  }, []);

  const loadCampaigns = useCallback(async () => {
    try {
      const response = await crmApi.getCRMCampaigns();
      if (response?.success) {
        setCampaigns(response?.data || []);
      }
    } catch (error) {
      console.error('Error loading campaigns:', error);
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const filters = {};
      if (searchTerm) filters.search = searchTerm;
      if (paymentModeFilter !== 'all') filters.method = paymentModeFilter;
      if (statusFilter !== 'all') filters.status = statusFilter;
      if (dateRangeFilter.from) filters.startDate = dateRangeFilter.from;
      if (dateRangeFilter.to) filters.endDate = dateRangeFilter.to;
      
      const response = await crmApi.getCRMDonationStats(filters);
      if (response?.success) {
        const data = response?.data || {};
        setStats({
          totalDonations: data?.totalAmount || 0,
          totalDonors: data?.totalDonors || 0,
          eightyGCount: data?.eightyGCount || 0,
          monthlyDonations: data?.monthlyAmount || 0
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setStatsLoading(false);
    }
  }, [searchTerm, paymentModeFilter, statusFilter, dateRangeFilter]);

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadDonations(),
        loadDonors(),
        loadCategories(),
        loadProjects(),
        loadCampaigns(),
        loadStats()
      ]);
    } catch (error) {
      console.error('Error loading initial data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [loadDonations, loadDonors, loadCategories, loadProjects, loadCampaigns, loadStats]);

  // Check admin authentication and load initial data
  useEffect(() => {
    // Check if user is logged in and is admin
    if (!currentUser) {
      // If no user, redirect to login
      navigate('/admin/login');
      return;
    }
    
    // Check if user has admin role
    const isAdmin = currentUser.role === 'admin' || 
                    currentUser.role === 'AdminUser' || 
                    (currentUser.roles && currentUser.roles.includes('ADMIN'));
    
    if (!isAdmin) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/admin/login');
      return;
    }
    
    // User is authenticated and has admin role - load data
    loadInitialData();
  }, [currentUser, navigate, loadInitialData]);

  // Load data when filters change
  useEffect(() => {
    loadDonations();
  }, [loadDonations]);
  
  // Load stats when filters change
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Donor search functionality with API
  const handleDonorSearch = useCallback(async (query) => {
    setDonorSearchInput(query);
    const searchQuery = query?.trim() || '';
    if (searchQuery.length > 2) {
      try {
        const response = await crmApi.searchCRMDonors(searchQuery);
        if (response?.success) {
          const results = response?.data || [];
          setDonorSearchResults(results);
          setShowDonorSearch(true);
        } else {
          // If API returns no success, try local search
          const results = donors?.filter(donor => 
            donor?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            donor?.phone?.includes(searchQuery) ||
            donor?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            donor?.panOrTaxId?.toLowerCase().includes(searchQuery.toLowerCase())
          ) || [];
          setDonorSearchResults(results);
          setShowDonorSearch(true);
        }
      } catch (error) {
        console.error('Error searching donors:', error);
        // Fallback to local search
        const results = donors?.filter(donor => 
          donor?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          donor?.phone?.includes(searchQuery) ||
          donor?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          donor?.panOrTaxId?.toLowerCase().includes(searchQuery.toLowerCase())
        ) || [];
        setDonorSearchResults(results);
        setShowDonorSearch(true);
      }
    } else {
      setShowDonorSearch(false);
      setDonorSearchResults([]);
    }
  }, [donors]);

  const selectDonor = (donor) => {
    setDonationForm(prev => ({
      ...prev,
      donorId: donor?._id || '',
      donorName: donor?.fullName || '',
      donorMobile: donor?.phone || '',
      donorEmail: donor?.email || '',
      donorPan: donor?.panOrTaxId || '',
      donorAddress: donor?.address || '',
      donorCity: donor?.city || '',
      donorState: donor?.state || '',
      donorPincode: donor?.pincode || ''
    }));
    setSelectedDonor(donor);
    setShowDonorSearch(false);
    setDonorSearchInput('');
    setShowNewDonorForm(false);
  };

  const handleNewDonor = () => {
    setShowNewDonorForm(true);
    setShowDonorSearch(false);
    setDonationForm(prev => ({
      ...prev,
      donorId: '',
      donorName: '',
      donorMobile: '',
      donorEmail: '',
      donorPan: '',
      donorAddress: '',
      donorCity: '',
      donorState: '',
      donorPincode: ''
    }));
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Validate 80G requirement
      if (donationForm.eightyG === 'yes' && !donationForm.donorPan.trim()) {
        toast.error('PAN number is required for 80G certificate');
        return;
      }

      // Validate required donor fields for new donors
      if (!donationForm.donorId) {
        if (!donationForm.donorName.trim()) {
          toast.error('Donor name is required');
          return;
        }
        if (!donationForm.donorMobile.trim()) {
          toast.error('Mobile number is required');
          return;
        }
        if (!donationForm.donorCity.trim()) {
          toast.error('City is required');
          return;
        }
        if (!donationForm.donorState.trim()) {
          toast.error('State is required');
          return;
        }
        if (!donationForm.donorPincode.trim()) {
          toast.error('Pincode is required');
          return;
        }
        
        // Validate mobile number format
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobileRegex.test(donationForm.donorMobile)) {
          toast.error('Please enter a valid 10-digit mobile number');
          return;
        }
        
        // Validate pincode format
        const pincodeRegex = /^\d{6}$/;
        if (!pincodeRegex.test(donationForm.donorPincode)) {
          toast.error('Please enter a valid 6-digit pincode');
          return;
        }
        
        // Validate PAN format if provided
        if (donationForm.donorPan.trim()) {
          const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
          if (!panRegex.test(donationForm.donorPan)) {
            toast.error('Please enter a valid PAN number (format: ABCDE1234F)');
            return;
          }
        }
      }

      // Create or update donor first
      let donorId = donationForm.donorId;
      if (!donorId) {
        // Create new donor
        const donorData = {
          fullName: donationForm.donorName,
          phone: donationForm.donorMobile,
          email: donationForm.donorEmail,
          panOrTaxId: donationForm.donorPan,
          address: donationForm.donorAddress,
          city: donationForm.donorCity,
          state: donationForm.donorState,
          pincode: donationForm.donorPincode,
          preferredContact: 'email'
        };
        
        const donorResponse = await crmApi.createCRMDonor(donorData);
        if (donorResponse?.success) {
          donorId = donorResponse?.data?._id;
        }
      }

      // Create donation
      const donationData = {
        donorId,
        projectId: donationForm.projectId || null,
        campaignId: donationForm.campaignId || null,
        categoryId: donationForm.categoryId,
        paymentMode: donationForm.paymentMode === 'cash' ? 'OFFLINE' : 'ONLINE',
        method: donationForm.paymentMode.toUpperCase(),
        reference: donationForm.reference || null,
        amount: parseFloat(donationForm.amount),
        dateReceived: donationForm.dateReceived,
        remarks: donationForm.notes,
        status: 'SUCCESS'
      };

      const response = await crmApi.createCRMDonation(donationData);
      
      if (response?.success) {
        toast.success('Donation created successfully!');
        setShowAddModal(false);
        setShowSuccessModal(true);
        setSelectedDonation(response?.data?.data || response?.data);
        resetForm();
        loadInitialData(); // Reload data
      }
    } catch (error) {
      console.error('Error creating donation:', error);
      toast.error(error.response?.data?.message || 'Failed to create donation');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setDonationForm({
      donorId: '',
      donorName: '',
      donorMobile: '',
      donorEmail: '',
      donorPan: '',
      donorAddress: '',
      donorCity: '',
      donorState: '',
      donorPincode: '',
      projectId: '',
      campaignId: '',
      categoryId: '',
      amount: '',
      paymentMode: '',
      reference: '',
      dateReceived: new Date().toISOString().split('T')[0],
      eightyG: 'no',
      notes: ''
    });
    setSelectedDonor(null);
    setDonorSearchInput('');
    setDonorSearchResults([]);
    setShowDonorSearch(false);
    setShowNewDonorForm(false);
    setFormErrors({});
  };

  // View donation
  const handleViewDonation = (donation) => {
    setSelectedDonation(donation);
    setShowViewModal(true);
  };

  // Edit donation
  const handleEditDonation = (donation) => {
    setSelectedDonation(donation);
    setDonationForm({
      donorId: donation.donorId?._id || '',
      donorName: donation.donorId?.fullName || '',
      donorMobile: donation.donorId?.phone || '',
      donorEmail: donation.donorId?.email || '',
      donorPan: donation.donorId?.panOrTaxId || '',
      donorAddress: donation.donorId?.address || '',
      donorCity: donation.donorId?.city || '',
      donorState: donation.donorId?.state || '',
      donorPincode: donation.donorId?.pincode || '',
      projectId: donation.projectId?._id || '',
      campaignId: donation.campaignId?._id || '',
      categoryId: donation.categoryId?._id || '',
      amount: donation.amount,
      paymentMode: donation.method.toLowerCase(),
      reference: donation.reference || '',
      dateReceived: new Date(donation.dateReceived).toISOString().split('T')[0],
      eightyG: donation.eightyG || 'no',
      notes: donation.remarks || ''
    });
    setShowEditModal(true);
  };

  // Update donation
  const handleUpdateDonation = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const updateData = {
        donorId: donationForm.donorId,
        projectId: donationForm.projectId || null,
        campaignId: donationForm.campaignId || null,
        categoryId: donationForm.categoryId,
        paymentMode: donationForm.paymentMode === 'cash' ? 'OFFLINE' : 'ONLINE',
        method: donationForm.paymentMode.toUpperCase(),
        reference: donationForm.reference || null,
        amount: parseFloat(donationForm.amount),
        dateReceived: donationForm.dateReceived,
        remarks: donationForm.notes
      };

      const response = await crmApi.updateCRMDonation(selectedDonation?._id, updateData);
      
      if (response?.success) {
        toast.success('Donation updated successfully!');
        setShowEditModal(false);
        loadInitialData();
      }
    } catch (error) {
      console.error('Error updating donation:', error);
      toast.error(error.response?.data?.message || 'Failed to update donation');
    } finally {
      setLoading(false);
    }
  };

  // Delete donation
  const handleDeleteDonation = async () => {
    try {
      setLoading(true);
      
      const response = await crmApi.deleteCRMDonation(selectedDonation?._id);
      
      if (response?.success) {
        toast.success('Donation deleted successfully!');
        setShowDeleteModal(false);
        loadInitialData();
      }
    } catch (error) {
      console.error('Error deleting donation:', error);
      toast.error(error?.response?.data?.message || 'Failed to delete donation');
    } finally {
      setLoading(false);
    }
  };

  // Refresh data
  const refreshData = useCallback(async () => {
    await Promise.all([
      loadDonations(),
      loadStats()
    ]);
  }, [loadDonations, loadStats]);

  // Export functionality
  const handleExport = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      if (paymentModeFilter !== 'all') params.append('method', paymentModeFilter.toUpperCase());
      if (statusFilter !== 'all') params.append('status', statusFilter.toUpperCase());
      if (dateRangeFilter.from) params.append('startDate', dateRangeFilter.from);
      if (dateRangeFilter.to) params.append('endDate', dateRangeFilter.to);

      const response = await crmApi.exportCRMDonations(Object.fromEntries(params));

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response?.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `donations-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Donations exported successfully!');
    } catch (error) {
      console.error('Error exporting donations:', error);
      toast.error('Failed to export donations');
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Receipt functions
  const handleDownloadReceipt = async (donation) => {
    try {
      if (!donation?.receipt?.receiptNo) {
        toast.error('Receipt number not found');
        return;
      }

      setLoading(true);
      const response = await crmApi.downloadCRMReceipt(donation.receipt.receiptNo);
      
      // Check if response data exists and is a valid blob
      if (!response || !response.data) {
        throw new Error('No data received from server');
      }
      
      // response.data should already be a Blob when responseType is 'blob'
      const blob = response.data instanceof Blob 
        ? response.data 
        : new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `Receipt-${donation.receipt.receiptNo}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Receipt downloaded successfully');
    } catch (error) {
      console.error('Error downloading receipt:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to download receipt';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReceipt = (donation, format = 'professional') => {
    const donor = donors?.find(d => d?._id === donation?.donorId?._id) || donation?.donorId;
    if (donor) {
      printReceipt(donation, donor, format);
    } else {
      toast.error('Donor information not found');
    }
  };

  const handleEmailReceipt = async (donation) => {
    try {
      setLoading(true);
      
      // Always try to send email - backend will handle receipt generation and email finding
      const response = await crmApi.emailCRMReceipt(donation?._id);
      
      if (response?.success) {
        toast.success(`Receipt emailed successfully to ${response?.data?.email}!`);
      } else {
        // If no email found, ask user to provide one
        if (response?.message?.includes('email not found')) {
          const email = prompt('Enter email address to send receipt:');
          if (!email) {
            toast.info('Email cancelled');
            return;
          }
          
          // Validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address');
            return;
          }
          
          // Send email with provided address
          const emailResponse = await crmApi.emailCRMReceipt(donation?._id, email);
          
          if (emailResponse?.success) {
            toast.success(`Receipt emailed successfully to ${email}!`);
          } else {
            toast.error(emailResponse?.message || 'Failed to email receipt');
          }
        } else {
          toast.error(response?.message || 'Failed to email receipt');
        }
      }
    } catch (error) {
      console.error('Error emailing receipt:', error);
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error('Failed to email receipt');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="offline-donations-crm">
      {/* Main Content */}
      <div className="main-content">
      <div className="crm-main">
        {/* Dashboard Cards */}
        <div className="stats-grid">
          <motion.div 
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="stat-icon">
              <FiDollarSign />
            </div>
            <div className="stat-value">{formatCurrency(stats.totalDonations)}</div>
            <div className="stat-label">Total Donations</div>
          </motion.div>

          <motion.div 
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="stat-icon">
              <FiUsers />
            </div>
            <div className="stat-value">{stats.totalDonors}</div>
            <div className="stat-label">Total Donors</div>
          </motion.div>

          <motion.div 
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="stat-icon">
              <FiFileText />
            </div>
            <div className="stat-value">{stats.eightyGCount}</div>
            <div className="stat-label">80G Certificates</div>
          </motion.div>

          <motion.div 
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="stat-icon">
              <FiTrendingUp />
            </div>
            <div className="stat-value">{formatCurrency(stats.monthlyDonations)}</div>
            <div className="stat-label">This Month</div>
          </motion.div>
        </div>

        {/* Actions Section */}
        <div className="actions-section">
          <h2>Offline Donations</h2>
          <button 
            className="add-donation-btn"
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
          >
            <FiPlus />
            <span>Add New Donation</span>
          </button>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by donor name, mobile, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            value={paymentModeFilter}
            onChange={(e) => setPaymentModeFilter(e.target.value)}
          >
            <option value="all">All Payment Modes</option>
            <option value="cash">Cash</option>
            <option value="cheque">Cheque</option>
            <option value="upi">UPI</option>
            <option value="bank">Bank Transfer</option>
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          
          <input
            type="date"
            value={dateRangeFilter.from}
            onChange={(e) => setDateRangeFilter(prev => ({ ...prev, from: e.target.value }))}
            placeholder="From Date"
          />
          
          <input
            type="date"
            value={dateRangeFilter.to}
            onChange={(e) => setDateRangeFilter(prev => ({ ...prev, to: e.target.value }))}
            placeholder="To Date"
          />
          
          <button 
            className="refresh-btn"
            onClick={refreshData}
            disabled={loading}
          >
            <FiRefreshCw className={loading ? 'spinning' : ''} />
            <span>Refresh</span>
          </button>
          
          <button 
            className="export-btn"
            onClick={handleExport}
            disabled={loading}
          >
            <FiDownload />
            <span>Export</span>
          </button>
        </div>

        {/* Donations Table */}
        <div className="donations-table-container">
          {donationsLoading ? (
            <div className="loading-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '16px' }}>
              <ImageLoader size={100} text="Loading donations..." />
            </div>
          ) : donations.length === 0 ? (
            <div className="empty-state">
              <FiDollarSign className="empty-icon" />
              <h3>No Donations Found</h3>
              <p>No donations match your current filters. Try adjusting your search criteria.</p>
            </div>
          ) : (
            <table className="donations-table">
              <thead>
                <tr>
                  <th>Receipt No.</th>
                  <th>Donor</th>
                  <th>Amount</th>
                  <th>Mode</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>80G</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {donations?.map((donation) => (
                  <motion.tr
                    key={donation?._id}
                    className="donation-row"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ backgroundColor: '#f9fafb' }}
                  >
                    <td className="receipt-number">
                      {donation?.receipt?.receiptNo || 'N/A'}
                    </td>
                    <td className="donor-info">
                      <div className="donor-name">
                        {donation?.donorId?.fullName || 'Anonymous'}
                      </div>
                      <div className="donor-mobile">
                        {donation?.donorId?.phone || 'N/A'}
                      </div>
                    </td>
                    <td className="amount">
                      {formatCurrency(donation?.amount || 0)}
                    </td>
                    <td className="payment-mode">
                      <span className={`mode-badge ${donation?.method?.toLowerCase() || 'unknown'}`}>
                        {donation?.method || 'N/A'}
                      </span>
                    </td>
                    <td className="date">
                      {formatDate(donation?.dateReceived)}
                    </td>
                    <td className="status">
                      <span className={`status-badge ${donation?.status?.toLowerCase() || 'unknown'}`}>
                        {donation?.status || 'N/A'}
                      </span>
                    </td>
                    <td className="eighty-g">
                      <span className={`eighty-g-badge ${donation?.eightyG === 'yes' ? 'yes' : 'no'}`}>
                        {donation?.eightyG === 'yes' ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="actions">
                      <button
                        className="action-btn view"
                        onClick={() => handleViewDonation(donation)}
                        title="View Details"
                      >
                        <FiEye />
                      </button>
                      <button
                        className="action-btn edit"
                        onClick={() => handleEditDonation(donation)}
                        title="Edit Donation"
                      >
                        <FiEdit />
                      </button>
                      <button 
                        className="action-btn email"
                        onClick={() => handleEmailReceipt(donation)}
                        title="Email Receipt"
                      >
                        <FiMail />
                      </button>
                      <button
                        className="action-btn download"
                        onClick={() => handleDownloadReceipt(donation)}
                        title="Download Receipt"
                      >
                        <FiDownload />
                      </button>
                      <button 
                        className="action-btn print"
                        onClick={() => handlePrintReceipt(donation, 'professional')}
                        title="Print Receipt"
                      >
                        <FiPrinter />
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => {
                          setSelectedDonation(donation);
                          setShowDeleteModal(true);
                        }}
                        title="Delete Donation"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
          
          {/* Pagination */}
          {donations?.length > 0 && pagination?.pages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination?.page === 1}
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {pagination?.page || 1} of {pagination?.pages || 1} ({pagination?.total || 0} total)
              </span>
              <button
                className="pagination-btn"
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination?.page === pagination?.pages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
      </div>

      {/* Add Donation Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowAddModal(false);
              resetForm();
            }}
          >
            <motion.div
              className="modal-content add-donation-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Add New Offline Donation</h3>
                <button
                  className="close-btn"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                >
                  <FiX />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="donation-form">
                {/* Donor Search Section */}
                <div className="form-section donor-search">
                  <h4>Step 1: Find or Add Donor</h4>
                  
                  <div className="search-container">
                    <FiSearch className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search by name, mobile, email, or PAN..."
                      value={donorSearchInput}
                      onChange={(e) => handleDonorSearch(e.target.value)}
                    />
                    
                    {showDonorSearch && (
                      <div className="search-results">
                        {donorSearchResults?.length > 0 ? (
                          donorSearchResults.map((donor) => (
                            <div
                              key={donor?._id}
                              className="search-result-item"
                              onClick={() => selectDonor(donor)}
                            >
                              <div className="donor-name">{donor?.fullName || 'N/A'}</div>
                              <div className="donor-contact">
                                {donor?.phone || 'N/A'} • {donor?.email || 'N/A'}
                              </div>
                            </div>
                          ))
                        ) : (
                          donorSearchInput.length > 2 && (
                            <div className="search-result-item no-results">
                              <div className="donor-name">No donors found</div>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>

                  <div className="or-divider">OR</div>
                  
                  <button
                    type="button"
                    className="new-donor-btn"
                    onClick={handleNewDonor}
                  >
                    <FiUserPlus />
                    <span>Create New Donor</span>
                  </button>
                </div>

                {/* Donor Details Section */}
                {(showNewDonorForm || selectedDonor) && (
                  <div className="form-section donor-details">
                    <h4>Donor Information</h4>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Full Name *</label>
                        <input
                          type="text"
                          value={donationForm.donorName}
                          onChange={(e) => setDonationForm(prev => ({
                            ...prev,
                            donorName: e.target.value
                          }))}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Mobile Number *</label>
                        <input
                          type="tel"
                          value={donationForm.donorMobile}
                          onChange={(e) => setDonationForm(prev => ({
                            ...prev,
                            donorMobile: e.target.value
                          }))}
                          placeholder="10-digit mobile number"
                          pattern="[6-9][0-9]{9}"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          type="email"
                          value={donationForm.donorEmail}
                          onChange={(e) => setDonationForm(prev => ({
                            ...prev,
                            donorEmail: e.target.value
                          }))}
                        />
                      </div>
                      <div className="form-group">
                        <label>PAN Number</label>
                        <input
                          type="text"
                          value={donationForm.donorPan}
                          onChange={(e) => setDonationForm(prev => ({
                            ...prev,
                            donorPan: e.target.value.toUpperCase()
                          }))}
                          placeholder="ABCDE1234F"
                          pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                          maxLength="10"
                        />
                      </div>
                      <div className="form-group full-width">
                        <label>Address</label>
                        <textarea
                          value={donationForm.donorAddress}
                          onChange={(e) => setDonationForm(prev => ({
                            ...prev,
                            donorAddress: e.target.value
                          }))}
                          rows="2"
                        />
                      </div>
                      <div className="form-group">
                        <label>City *</label>
                        <input
                          type="text"
                          value={donationForm.donorCity}
                          onChange={(e) => setDonationForm(prev => ({
                            ...prev,
                            donorCity: e.target.value
                          }))}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>State *</label>
                        <input
                          type="text"
                          value={donationForm.donorState}
                          onChange={(e) => setDonationForm(prev => ({
                            ...prev,
                            donorState: e.target.value
                          }))}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Pincode *</label>
                        <input
                          type="text"
                          value={donationForm.donorPincode}
                          onChange={(e) => setDonationForm(prev => ({
                            ...prev,
                            donorPincode: e.target.value
                          }))}
                          placeholder="6-digit pincode"
                          pattern="[0-9]{6}"
                          maxLength="6"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Donation Details Section */}
                <div className="form-section donation-details">
                  <h4>Step 2: Donation Details</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Purpose/Category *</label>
                      <select
                        value={donationForm.categoryId}
                        onChange={(e) => setDonationForm(prev => ({
                          ...prev,
                          categoryId: e.target.value
                        }))}
                        required
                      >
                        <option value="">Select Purpose</option>
                        {categories?.map((category) => (
                          <option key={category?._id} value={category?._id}>
                            {category?.name || 'N/A'}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Project (Optional)</label>
                      <select
                        value={donationForm.projectId}
                        onChange={(e) => setDonationForm(prev => ({
                          ...prev,
                          projectId: e.target.value
                        }))}
                      >
                        <option value="">Select Project</option>
                        {projects?.map((project) => (
                          <option key={project?._id} value={project?._id}>
                            {project?.name || 'N/A'}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Campaign (Optional)</label>
                      <select
                        value={donationForm.campaignId}
                        onChange={(e) => setDonationForm(prev => ({
                          ...prev,
                          campaignId: e.target.value
                        }))}
                      >
                        <option value="">Select Campaign</option>
                        {campaigns?.map((campaign) => (
                          <option key={campaign?._id} value={campaign?._id}>
                            {campaign?.name || 'N/A'}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Amount (₹) *</label>
                      <input
                        type="number"
                        value={donationForm.amount}
                        onChange={(e) => setDonationForm(prev => ({
                          ...prev,
                          amount: e.target.value
                        }))}
                        min="1"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Donation Date *</label>
                      <input
                        type="date"
                        value={donationForm.dateReceived}
                        onChange={(e) => setDonationForm(prev => ({
                          ...prev,
                          dateReceived: e.target.value
                        }))}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Payment Mode *</label>
                      <select
                        value={donationForm.paymentMode}
                        onChange={(e) => setDonationForm(prev => ({
                          ...prev,
                          paymentMode: e.target.value
                        }))}
                        required
                      >
                        <option value="">Select Mode</option>
                        <option value="cash">Cash</option>
                        <option value="cheque">Cheque</option>
                        <option value="upi">UPI</option>
                        <option value="bank">Bank Transfer</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Reference/UTR/Cheque No.</label>
                      <input
                        type="text"
                        value={donationForm.reference}
                        onChange={(e) => setDonationForm(prev => ({
                          ...prev,
                          reference: e.target.value
                        }))}
                      />
                    </div>
                    <div className="form-group">
                      <label>80G Certificate Required?</label>
                      <select
                        value={donationForm.eightyG}
                        onChange={(e) => setDonationForm(prev => ({
                          ...prev,
                          eightyG: e.target.value
                        }))}
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>
                    <div className="form-group full-width">
                      <label>Notes</label>
                      <textarea
                        value={donationForm.notes}
                        onChange={(e) => setDonationForm(prev => ({
                          ...prev,
                          notes: e.target.value
                        }))}
                        rows="2"
                        placeholder="Any additional notes..."
                      />
                    </div>
                  </div>
                </div>

                {/* 80G Warning */}
                {donationForm.eightyG === 'yes' && !donationForm.donorPan && (
                  <div className="warning-box">
                    <span className="warning-icon">⚠️</span>
                    <div>
                      <h5>PAN Required for 80G Certificate</h5>
                      <p>For 80G tax exemption certificate, donor's PAN number is mandatory as per Income Tax regulations.</p>
                    </div>
                  </div>
                )}

                {/* Form Actions */}
                <div className="form-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="save-btn"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Donation'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && selectedDonation && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSuccessModal(false)}
          >
            <motion.div
              className="modal-content success-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="success-icon">✓</div>
              <h3>Donation Recorded Successfully!</h3>
              <p>
                Receipt Number: <span className="receipt-number">
                  {selectedDonation?.receipt?.receiptNo || 'N/A'}
                </span>
              </p>
              <div className="success-actions">
                <button 
                  className="email-btn"
                  onClick={() => handleEmailReceipt(selectedDonation)}
                >
                  <FiMail />
                  <span>Email Receipt</span>
                </button>
                <button 
                  className="download-btn"
                  onClick={() => handleDownloadReceipt(selectedDonation)}
                >
                  <FiDownload />
                  <span>Download</span>
                </button>
                <button 
                  className="print-btn"
                  onClick={() => handlePrintReceipt(selectedDonation, 'professional')}
                >
                  <FiPrinter />
                  <span>Print Receipt</span>
                </button>
              </div>
              <button
                className="close-success"
                onClick={() => setShowSuccessModal(false)}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Modal */}
      <AnimatePresence>
        {showViewModal && selectedDonation && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowViewModal(false)}
          >
            <motion.div
              className="modal-content view-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Donation Details</h3>
                <button
                  className="close-btn"
                  onClick={() => setShowViewModal(false)}
                >
                  <FiX />
                </button>
              </div>
              
              <div className="donation-details-content">
                <div className="details-grid">
                  <div className="detail-section donor-info">
                    <h4>Donor Information</h4>
                    <div className="detail-list">
                      <div className="detail-item">
                        <span className="label">Name:</span>
                        <span className="value">{selectedDonation?.donorId?.fullName || 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Mobile:</span>
                        <span className="value">{selectedDonation?.donorId?.phone || 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Email:</span>
                        <span className="value">{selectedDonation?.donorId?.email || 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">PAN:</span>
                        <span className="value">{selectedDonation?.donorId?.pan || 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Address:</span>
                        <span className="value">{selectedDonation?.donorId?.address || 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">City:</span>
                        <span className="value">{selectedDonation?.donorId?.city || 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">State:</span>
                        <span className="value">{selectedDonation?.donorId?.state || 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Pincode:</span>
                        <span className="value">{selectedDonation?.donorId?.pincode || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="detail-section donation-info">
                    <h4>Donation Details</h4>
                    <div className="detail-list">
                      <div className="detail-item">
                        <span className="label">Receipt No:</span>
                        <span className="value">{selectedDonation?.receipt?.receiptNo || 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Amount:</span>
                        <span className="value">{formatCurrency(selectedDonation?.amount || 0)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Purpose:</span>
                        <span className="value">{selectedDonation?.categoryId?.name || 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Payment Mode:</span>
                        <span className="value">{selectedDonation?.method || 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Reference:</span>
                        <span className="value">{selectedDonation?.reference || 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Date:</span>
                        <span className="value">{formatDate(selectedDonation?.dateReceived)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">80G Certificate:</span>
                        <span className="value">{selectedDonation?.eightyG === 'yes' ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {selectedDonation?.remarks && (
                  <div className="notes-section">
                    <h4>Notes</h4>
                    <p>{selectedDonation?.remarks}</p>
                  </div>
                )}
              </div>
              
              <div className="modal-actions">
                <button
                  className="edit-btn"
                  onClick={() => {
                    setShowViewModal(false);
                    handleEditDonation(selectedDonation);
                  }}
                >
                  <FiEdit />
                  <span>Edit Donation</span>
                </button>
                <button 
                  className="download-btn"
                  onClick={() => handleDownloadReceipt(selectedDonation)}
                >
                  <FiDownload />
                  <span>Download</span>
                </button>
                <button 
                  className="print-btn"
                  onClick={() => handlePrintReceipt(selectedDonation, 'professional')}
                >
                  <FiPrinter />
                  <span>Print Receipt</span>
                </button>
                <button 
                  className="email-btn"
                  onClick={() => handleEmailReceipt(selectedDonation)}
                >
                  <FiMail />
                  <span>Email Receipt</span>
                </button>
                <button
                  className="delete-btn"
                  onClick={() => {
                    setShowViewModal(false);
                    setShowDeleteModal(true);
                  }}
                >
                  <FiTrash2 />
                  <span>Delete</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && selectedDonation && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              className="modal-content edit-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Edit Donation</h3>
                <button
                  className="close-btn"
                  onClick={() => setShowEditModal(false)}
                >
                  <FiX />
                </button>
              </div>
              
              <form onSubmit={handleUpdateDonation} className="donation-form">
                {/* Similar form structure as add modal but with pre-filled values */}
                <div className="form-section donation-details">
                  <h4>Donation Details</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Purpose/Category *</label>
                      <select
                        value={donationForm.categoryId}
                        onChange={(e) => setDonationForm(prev => ({
                          ...prev,
                          categoryId: e.target.value
                        }))}
                        required
                      >
                        <option value="">Select Purpose</option>
                        {categories?.map((category) => (
                          <option key={category?._id} value={category?._id}>
                            {category?.name || 'N/A'}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Amount (₹) *</label>
                      <input
                        type="number"
                        value={donationForm.amount}
                        onChange={(e) => setDonationForm(prev => ({
                          ...prev,
                          amount: e.target.value
                        }))}
                        min="1"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Donation Date *</label>
                      <input
                        type="date"
                        value={donationForm.dateReceived}
                        onChange={(e) => setDonationForm(prev => ({
                          ...prev,
                          dateReceived: e.target.value
                        }))}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Payment Mode *</label>
                      <select
                        value={donationForm.paymentMode}
                        onChange={(e) => setDonationForm(prev => ({
                          ...prev,
                          paymentMode: e.target.value
                        }))}
                        required
                      >
                        <option value="">Select Mode</option>
                        <option value="cash">Cash</option>
                        <option value="cheque">Cheque</option>
                        <option value="upi">UPI</option>
                        <option value="bank">Bank Transfer</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Reference/UTR/Cheque No.</label>
                      <input
                        type="text"
                        value={donationForm.reference}
                        onChange={(e) => setDonationForm(prev => ({
                          ...prev,
                          reference: e.target.value
                        }))}
                      />
                    </div>
                    <div className="form-group">
                      <label>80G Certificate Required?</label>
                      <select
                        value={donationForm.eightyG}
                        onChange={(e) => setDonationForm(prev => ({
                          ...prev,
                          eightyG: e.target.value
                        }))}
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>
                    <div className="form-group full-width">
                      <label>Notes</label>
                      <textarea
                        value={donationForm.notes}
                        onChange={(e) => setDonationForm(prev => ({
                          ...prev,
                          notes: e.target.value
                        }))}
                        rows="2"
                        placeholder="Any additional notes..."
                      />
                    </div>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="update-btn"
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update Donation'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedDonation && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              className="modal-content delete-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="delete-icon">⚠️</div>
              <h3>Delete Donation Record</h3>
              <p>Are you sure you want to delete this donation record? This action cannot be undone.</p>
              
              <div className="delete-info">
                <p><strong>Receipt:</strong> {selectedDonation?.receipt?.receiptNo || 'N/A'}</p>
                <p><strong>Donor:</strong> {selectedDonation?.donorId?.fullName || 'N/A'}</p>
                <p><strong>Amount:</strong> {formatCurrency(selectedDonation?.amount || 0)}</p>
              </div>
              
              <div className="delete-actions">
                <button
                  className="cancel-btn"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="delete-btn"
                  onClick={handleDeleteDonation}
                  disabled={loading}
                >
                  {loading ? 'Deleting...' : 'Delete Record'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OfflineDonationsCRM;
