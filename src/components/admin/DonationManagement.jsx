import React, { useState, useEffect } from 'react';
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiDownload,
  FiEdit,
  FiTrash2,
  FiEye,
  FiFileText,
  FiDollarSign
} from 'react-icons/fi';
import ImageLoader from '../ImageLoader';
import './DonationManagement.css';

const DonationManagement = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    paymentMode: '',
    method: '',
    project: ''
  });

  useEffect(() => {
    fetchDonations();
  }, [filters]);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - replace with actual API call
      setDonations([
        {
          id: 1,
          receiptNo: 'DR-2025-000001',
          donorName: 'John Doe',
          donorEmail: 'john.doe@email.com',
          amount: 5000,
          currency: 'INR',
          paymentMode: 'ONLINE',
          method: 'UPI',
          reference: 'UPI123456789',
          status: 'SUCCESS',
          dateReceived: '2024-12-01',
          projectName: 'Education Fund',
          categoryName: 'General Donation',
          remarks: 'Monthly donation for education fund',
          receiptStatus: 'ISSUED'
        },
        {
          id: 2,
          receiptNo: 'DR-2025-000002',
          donorName: 'Sarah Wilson',
          donorEmail: 'sarah.wilson@email.com',
          amount: 10000,
          currency: 'INR',
          paymentMode: 'OFFLINE',
          method: 'CHEQUE',
          reference: 'CHQ001234',
          status: 'SUCCESS',
          dateReceived: '2024-11-28',
          projectName: 'Medical Assistance',
          categoryName: 'CSR Donation',
          remarks: 'Corporate donation for medical assistance',
          receiptStatus: 'ISSUED'
        },
        {
          id: 3,
          receiptNo: null,
          donorName: 'Anonymous',
          donorEmail: null,
          amount: 1000,
          currency: 'INR',
          paymentMode: 'OFFLINE',
          method: 'CASH',
          reference: null,
          status: 'SUCCESS',
          dateReceived: '2024-11-20',
          projectName: 'Food Distribution',
          categoryName: 'General Donation',
          remarks: 'Walk-in donation for food distribution',
          receiptStatus: 'NOT_ISSUED'
        }
      ]);
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'SUCCESS': 'neo-badge--success',
      'PENDING': 'neo-badge--warning',
      'FAILED': 'neo-badge--danger',
      'REFUNDED': 'neo-badge--danger'
    };
    
    return (
      <span className={`neo-badge ${statusClasses[status] || ''}`}>
        {status}
      </span>
    );
  };

  const getReceiptBadge = (receiptStatus) => {
    if (receiptStatus === 'ISSUED') {
      return (
        <span className="neo-badge neo-badge--success">
          Issued
        </span>
      );
    }
    return (
      <span className="neo-badge">
        Not Issued
      </span>
    );
  };

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = !searchTerm || 
      donation.donorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.receiptNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.reference?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilters = Object.keys(filters).every(key => 
      !filters[key] || donation[key.toLowerCase()] === filters[key]
    );
    
    return matchesSearch && matchesFilters;
  });

  if (loading) {
    return (
      <div className="donation-management">
        <div className="page-header">
          <h1 className="page-title">Donation Management</h1>
          <p className="page-subtitle">Manage and track all donation transactions</p>
        </div>
        
        <div className="content-card">
          <div className="content-card__body">
            <div className="loading-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '16px' }}>
              <ImageLoader size={100} text="Loading donations..." />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="donation-management">
      <div className="page-header">
        <h1 className="page-title">Donation Management</h1>
        <p className="page-subtitle">Manage and track all donation transactions</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--income">
            <FiDollarSign />
          </div>
          <h3 className="stat-card__title">Total Donations</h3>
          <p className="stat-card__value">{formatCurrency(16000)}</p>
          <div className="stat-card__change stat-card__change--positive">
            <span>+12.5%</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--donors">
            <FiFileText />
          </div>
          <h3 className="stat-card__title">Receipts Issued</h3>
          <p className="stat-card__value">2</p>
          <div className="stat-card__change stat-card__change--positive">
            <span>+100%</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--projects">
            <FiEye />
          </div>
          <h3 className="stat-card__title">Pending Receipts</h3>
          <p className="stat-card__value">1</p>
          <div className="stat-card__change stat-card__change--neutral">
            <span>0%</span>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="content-card">
        <div className="content-card__header">
          <h2 className="content-card__title">Donations</h2>
          <div className="content-card__actions">
            <button className="neo-btn neo-btn--sm">
              <FiDownload />
              Export
            </button>
            <button 
              className="neo-btn neo-btn--primary"
              onClick={() => setShowCreateModal(true)}
            >
              <FiPlus />
              Add Donation
            </button>
          </div>
        </div>
        
        <div className="content-card__body">
          {/* Search and Filters */}
          <div className="filters-section">
            <div className="search-container">
              <div className="search-input-wrapper">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search donations, donors, receipts..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="filters-row">
              <select 
                className="neo-select"
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="">All Status</option>
                <option value="SUCCESS">Success</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
                <option value="REFUNDED">Refunded</option>
              </select>
              
              <select 
                className="neo-select"
                value={filters.paymentMode}
                onChange={(e) => setFilters({...filters, paymentMode: e.target.value})}
              >
                <option value="">All Payment Modes</option>
                <option value="ONLINE">Online</option>
                <option value="OFFLINE">Offline</option>
              </select>
              
              <select 
                className="neo-select"
                value={filters.method}
                onChange={(e) => setFilters({...filters, method: e.target.value})}
              >
                <option value="">All Methods</option>
                <option value="UPI">UPI</option>
                <option value="NETBANKING">Net Banking</option>
                <option value="CARD">Card</option>
                <option value="CASH">Cash</option>
                <option value="CHEQUE">Cheque</option>
                <option value="DD">DD</option>
              </select>
            </div>
          </div>

          {/* Donations Table */}
          <div className="table-container">
            <table className="neo-table data-table">
              <thead>
                <tr>
                  <th>Receipt No</th>
                  <th>Donor</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Project</th>
                  <th>Receipt</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonations.map((donation) => (
                  <tr key={donation.id}>
                    <td>
                      {donation.receiptNo || (
                        <span className="text-muted">Not issued</span>
                      )}
                    </td>
                    <td>
                      <div className="donor-info">
                        <div className="donor-name">{donation.donorName}</div>
                        {donation.donorEmail && (
                          <div className="donor-email">{donation.donorEmail}</div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="amount-cell">
                        <span className="amount">{formatCurrency(donation.amount)}</span>
                      </div>
                    </td>
                    <td>
                      <div className="payment-info">
                        <div className="payment-mode">{donation.paymentMode}</div>
                        <div className="payment-method">{donation.method}</div>
                        {donation.reference && (
                          <div className="payment-reference">{donation.reference}</div>
                        )}
                      </div>
                    </td>
                    <td>{getStatusBadge(donation.status)}</td>
                    <td>{donation.dateReceived}</td>
                    <td>{donation.projectName}</td>
                    <td>{getReceiptBadge(donation.receiptStatus)}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="action-btn view-btn"
                          title="View Details"
                        >
                          <FiEye />
                        </button>
                        <button 
                          className="action-btn edit-btn"
                          title="Edit Donation"
                        >
                          <FiEdit />
                        </button>
                        {donation.receiptStatus === 'NOT_ISSUED' && (
                          <button 
                            className="action-btn receipt-btn"
                            title="Issue Receipt"
                          >
                            <FiFileText />
                          </button>
                        )}
                        <button 
                          className="action-btn delete-btn"
                          title="Delete Donation"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredDonations.length === 0 && (
              <div className="empty-state">
                <div className="empty-state__icon">
                  <FiDollarSign />
                </div>
                <h3 className="empty-state__title">No donations found</h3>
                <p className="empty-state__description">
                  {searchTerm || Object.values(filters).some(f => f) 
                    ? 'Try adjusting your search criteria or filters'
                    : 'Start by adding your first donation'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Donation Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal__header">
              <h3 className="modal__title">Add New Donation</h3>
              <button 
                className="modal__close"
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal__body">
              <p>Donation form will be implemented here...</p>
            </div>
            <div className="modal__footer">
              <button 
                className="neo-btn"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button className="neo-btn neo-btn--primary">
                Save Donation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationManagement;
