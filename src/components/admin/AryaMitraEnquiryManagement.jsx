import React, { useState, useEffect } from 'react';
import { FaEye, FaEdit, FaTrash, FaCheck, FaTimes, FaClock, FaUser, FaMapMarkerAlt, FaPhone, FaEnvelope, FaCalendar, FaFilter, FaSearch } from 'react-icons/fa';
import api from '../../utils/api';
import './AryaMitraEnquiryManagement.css';

const AryaMitraEnquiryManagement = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchEnquiries();
    fetchStats();
  }, [currentPage, filters]);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 20
      });
      
      if (filters.status) {
        params.append('status', filters.status);
      }

      const response = await api.get(`/arya-mitra-enquiries/admin/all?${params}`);
      
      if (response.data.success) {
        setEnquiries(response.data.enquiries);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching enquiries:', error);
      setError('Failed to fetch enquiries');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/arya-mitra-enquiries/admin/stats');
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleStatusUpdate = async (enquiryId, newStatus, notes = '') => {
    try {
      const response = await api.put(`/arya-mitra-enquiries/admin/${enquiryId}/status`, {
        status: newStatus,
        notes
      });

      if (response.data.success) {
        setSuccess('Status updated successfully!');
        // Refetch both enquiries and stats to update the UI
        await Promise.all([fetchEnquiries(), fetchStats()]);
        setShowStatusModal(false);
        setSelectedEnquiry(null);
      }
    } catch (error) {
      setError('Failed to update status');
    }
  };

  const handleDelete = async (enquiryId) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) {
      return;
    }

    try {
      const response = await api.delete(`/arya-mitra-enquiries/admin/${enquiryId}`);
      if (response.data.success) {
        setSuccess('Enquiry deleted successfully!');
        // Refetch both enquiries and stats to update the UI
        await Promise.all([fetchEnquiries(), fetchStats()]);
      }
    } catch (error) {
      setError('Failed to delete enquiry');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'pending', label: 'Pending' },
      contacted: { class: 'contacted', label: 'Contacted' },
      completed: { class: 'completed', label: 'Completed' },
      cancelled: { class: 'cancelled', label: 'Cancelled' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && enquiries.length === 0) {
    return <div className="enquiry-loading">Loading enquiries...</div>;
  }

  return (
    <div className="enquiry-management">
      <div className="enquiry-header">
        <h2>WAERF Enquiries</h2>
        <div className="enquiry-stats">
          <div className="stat-card">
            <div className="stat-number">{stats.total || 0}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-card pending">
            <div className="stat-number">{stats.pending || 0}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card contacted">
            <div className="stat-number">{stats.contacted || 0}</div>
            <div className="stat-label">Contacted</div>
          </div>
          <div className="stat-card completed">
            <div className="stat-number">{stats.completed || 0}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card recent">
            <div className="stat-number">{stats.recent || 0}</div>
            <div className="stat-label">Recent (7d)</div>
          </div>
        </div>
      </div>

      {success && (
        <div className="success-message">
          <p>{success}</p>
          <button onClick={() => setSuccess('')}>Close</button>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError('')}>Close</button>
        </div>
      )}

      <div className="enquiry-filters">
        <div className="filter-group">
          <label>Status:</label>
          <select 
            value={filters.status} 
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="enquiries-table-wrapper">
        <table className="enquiries-table">
          <thead>
            <tr>
              <th>Enquirer</th>
              <th>WAERF Volunteer</th>
              <th>Services</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((enquiry) => (
              <tr key={enquiry._id}>
                <td>
                  <div className="enquirer-info">
                    <div className="enquirer-name">{enquiry.enquirerName}</div>
                    <div className="enquirer-contact">{enquiry.enquirerContact}</div>
                    <div className="enquirer-region">{enquiry.enquirerRegion}</div>
                  </div>
                </td>
                <td>
                  <div className="arya-mitra-info">
                    <div className="arya-mitra-name">{enquiry.aryaMitraName}</div>
                    <div className="arya-mitra-location">{enquiry.aryaMitraLocation}</div>
                  </div>
                </td>
                <td>
                  <div className="services-list">
                    {enquiry.aryaMitraServices.slice(0, 2).map((service, index) => (
                      <span key={index} className="service-tag">{service}</span>
                    ))}
                    {enquiry.aryaMitraServices.length > 2 && (
                      <span className="service-more">+{enquiry.aryaMitraServices.length - 2} more</span>
                    )}
                  </div>
                </td>
                <td>{formatDate(enquiry.enquiryDate)}</td>
                <td>{getStatusBadge(enquiry.status)}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="view-btn"
                      onClick={() => {
                        setSelectedEnquiry(enquiry);
                        setShowDetailModal(true);
                      }}
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    <button 
                      className="edit-btn"
                      onClick={() => {
                        setSelectedEnquiry(enquiry);
                        setShowStatusModal(true);
                      }}
                      title="Update Status"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(enquiry._id)}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedEnquiry && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Enquiry Details</h3>
              <button onClick={() => setShowDetailModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h4>Enquirer Information</h4>
                <div className="detail-row">
                  <span className="label">Name:</span>
                  <span>{selectedEnquiry.enquirerName}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Contact:</span>
                  <span>{selectedEnquiry.enquirerContact}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Region:</span>
                  <span>{selectedEnquiry.enquirerRegion}</span>
                </div>
              </div>

              <div className="detail-section">
                <h4>WAERF Volunteer Information</h4>
                <div className="detail-row">
                  <span className="label">Name:</span>
                  <span>{selectedEnquiry.aryaMitraName}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Location:</span>
                  <span>{selectedEnquiry.aryaMitraLocation}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Contact:</span>
                  <span>{selectedEnquiry.aryaMitraMobileNumber}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Email:</span>
                  <span>{selectedEnquiry.aryaMitraEmail}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Services:</span>
                  <div className="services-tags">
                    {selectedEnquiry.aryaMitraServices.map((service, index) => (
                      <span key={index} className="service-tag">{service}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4>Enquiry Information</h4>
                <div className="detail-row">
                  <span className="label">Date:</span>
                  <span>{formatDate(selectedEnquiry.enquiryDate)}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Status:</span>
                  <span>{getStatusBadge(selectedEnquiry.status)}</span>
                </div>
                {selectedEnquiry.notes && (
                  <div className="detail-row">
                    <span className="label">Notes:</span>
                    <span>{selectedEnquiry.notes}</span>
                  </div>
                )}
                {selectedEnquiry.handledBy && (
                  <div className="detail-row">
                    <span className="label">Handled By:</span>
                    <span>{selectedEnquiry.handledBy.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedEnquiry && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Update Enquiry Status</h3>
              <button onClick={() => setShowStatusModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="status-options">
                <button 
                  className={`status-option ${selectedEnquiry.status === 'pending' ? 'active' : ''}`}
                  onClick={() => handleStatusUpdate(selectedEnquiry._id, 'pending')}
                >
                  <FaClock /> Pending
                </button>
                <button 
                  className={`status-option ${selectedEnquiry.status === 'contacted' ? 'active' : ''}`}
                  onClick={() => handleStatusUpdate(selectedEnquiry._id, 'contacted')}
                >
                  <FaPhone /> Contacted
                </button>
                <button 
                  className={`status-option ${selectedEnquiry.status === 'completed' ? 'active' : ''}`}
                  onClick={() => handleStatusUpdate(selectedEnquiry._id, 'completed')}
                >
                  <FaCheck /> Completed
                </button>
                <button 
                  className={`status-option ${selectedEnquiry.status === 'cancelled' ? 'active' : ''}`}
                  onClick={() => handleStatusUpdate(selectedEnquiry._id, 'cancelled')}
                >
                  <FaTimes /> Cancelled
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AryaMitraEnquiryManagement; 