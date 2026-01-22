import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiX, FiCheck, FiXCircle, FiTrash2, FiEye, FiFileText, FiCalendar, FiMapPin } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import { uploadPDFToFirebase, deleteFileByUrl } from '../../utils/firebaseStorage';
import ImageLoader from '../ImageLoader';
import './TenderManagement.css';

const TenderManagement = () => {
  const [activeTab, setActiveTab] = useState('tenders');
  const [tenders, setTenders] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [showTenderForm, setShowTenderForm] = useState(false);
  const [showApplicationView, setShowApplicationView] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [tenderForm, setTenderForm] = useState({
    tenderTitle: '',
    tenderDescription: '',
    tenderCategory: '',
    tenderType: '',
    budget: '',
    applicationFee: '',
    feeType: '',
    emdAmount: '',
    startDate: '',
    deadline: '',
    location: '',
    eligibility: '',
    requiredDocuments: [],
    termsAndConditions: '',
    tenderDocument: ''
  });
  const [errors, setErrors] = useState({});

  const documentOptions = [
    'Aadhaar Card',
    'PAN Card',
    'Company Registration Certificate',
    'GST Certificate',
    'Bank Cancelled Cheque',
    'Experience Certificate',
    'NGO Registration Certificate',
    'Other Document'
  ];

  useEffect(() => {
    if (activeTab === 'tenders') {
      fetchTenders();
    } else {
      fetchApplications();
    }
  }, [activeTab]);

  const fetchTenders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tenders/admin/all');
      if (response.data.success) {
        setTenders(response.data.tenders);
      }
    } catch (error) {
      console.error('Error fetching tenders:', error);
      toast.error('Failed to load tenders');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/applications');
      if (response.data.success) {
        setApplications(response.data.applications);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleTenderInputChange = (e) => {
    const { name, value } = e.target;
    setTenderForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDocumentToggle = (doc) => {
    setTenderForm(prev => {
      const docs = prev.requiredDocuments || [];
      if (docs.includes(doc)) {
        return { ...prev, requiredDocuments: docs.filter(d => d !== doc) };
      } else {
        return { ...prev, requiredDocuments: [...docs, doc] };
      }
    });
  };

  const handleDocumentUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Only PDF documents are allowed');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error('File size should be less than 50MB');
      return;
    }

    try {
      setUploadingDoc(true);
      const url = await uploadPDFToFirebase(file, 'tenders');
      setTenderForm(prev => ({ ...prev, tenderDocument: url }));
      toast.success('Tender document uploaded successfully');
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    } finally {
      setUploadingDoc(false);
    }
  };

  const removeDocument = async () => {
      if (!tenderForm.tenderDocument) return;
      
      if (window.confirm('Are you sure you want to remove this document? This will delete it from the server.')) {
        await deleteFileByUrl(tenderForm.tenderDocument);
        setTenderForm(prev => ({ ...prev, tenderDocument: '' }));
        toast.success('Document removed successfully');
      }
  };

  const validateTenderForm = () => {
    const newErrors = {};
    if (!tenderForm.tenderTitle.trim()) newErrors.tenderTitle = 'Title is required';
    if (!tenderForm.tenderDescription.trim()) newErrors.tenderDescription = 'Description is required';
    if (!tenderForm.tenderCategory) newErrors.tenderCategory = 'Category is required';
    if (!tenderForm.tenderType) newErrors.tenderType = 'Tender Type is required';
    if (!tenderForm.budget.trim()) newErrors.budget = 'Budget is required';
    if (!tenderForm.startDate) newErrors.startDate = 'Start date is required';
    if (!tenderForm.deadline) newErrors.deadline = 'Deadline is required';
    if (!tenderForm.location.trim()) newErrors.location = 'Location is required';
    if (new Date(tenderForm.deadline) <= new Date(tenderForm.startDate)) {
      newErrors.deadline = 'Deadline must be after start date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitTender = async (e) => {
    e.preventDefault();
    if (!validateTenderForm()) return;

    try {
      setLoading(true);
      const response = await api.post('/tenders', tenderForm);
      if (response.data.success) {
        toast.success('Tender created successfully');
        setShowTenderForm(false);
        resetTenderForm();
        fetchTenders();
      }
    } catch (error) {
      console.error('Error creating tender:', error);
      toast.error(error.response?.data?.message || 'Failed to create tender');
    } finally {
      setLoading(false);
    }
  };

  const resetTenderForm = () => {
    setTenderForm({
      tenderTitle: '',
      tenderDescription: '',
      tenderCategory: '',
      tenderType: '',
      budget: '',
      applicationFee: '',
      feeType: '',
      emdAmount: '',
      startDate: '',
      deadline: '',
      location: '',
      eligibility: '',
      requiredDocuments: [],
      termsAndConditions: '',
      tenderDocument: ''
    });
    setErrors({});
  };

  const handleCloseTender = async (tenderId) => {
    if (!window.confirm('Are you sure you want to close this tender?')) return;

    try {
      const response = await api.patch(`/tenders/${tenderId}/close`);
      if (response.data.success) {
        toast.success('Tender closed successfully');
        fetchTenders();
      }
    } catch (error) {
      console.error('Error closing tender:', error);
      toast.error('Failed to close tender');
    }
  };

  const handleDeleteTender = async (tenderId) => {
    if (!window.confirm('Are you sure you want to delete this tender? This action cannot be undone.')) return;

    try {
      const response = await api.delete(`/tenders/${tenderId}`);
      if (response.data.success) {
        toast.success('Tender deleted successfully');
        fetchTenders();
      }
    } catch (error) {
      console.error('Error deleting tender:', error);
      toast.error('Failed to delete tender');
    }
  };

  const handleStatusChange = async (applicationId, status) => {
    try {
      const response = await api.patch(`/applications/${applicationId}/status`, { status });
      if (response.data.success) {
        toast.success(`Application ${status.toLowerCase()} successfully`);
        fetchApplications();
        setShowApplicationView(false);
        setSelectedApplication(null);
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Failed to update application status');
    }
  };

  const handleDeleteApplication = async (applicationId) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;

    try {
      const response = await api.delete(`/applications/${applicationId}`);
      if (response.data.success) {
        toast.success('Application deleted successfully');
        fetchApplications();
        setShowApplicationView(false);
        setSelectedApplication(null);
      }
    } catch (error) {
      console.error('Error deleting application:', error);
      toast.error('Failed to delete application');
    }
  };

  const handleViewApplication = async (applicationId) => {
    try {
      const response = await api.get(`/applications/${applicationId}`);
      if (response.data.success) {
        setSelectedApplication(response.data.application);
        setShowApplicationView(true);
      }
    } catch (error) {
      console.error('Error fetching application:', error);
      toast.error('Failed to load application details');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Approved': return 'status-approved';
      case 'Rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  };

  return (
    <div className="tender-management">
      <div className="tender-management-header">
        <h2>Tender Management</h2>
        {activeTab === 'tenders' && (
          <button className="btn-primary" onClick={() => setShowTenderForm(true)}>
            <FiPlus /> Post New Tender
          </button>
        )}
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'tenders' ? 'active' : ''}`}
          onClick={() => setActiveTab('tenders')}
        >
          <FiFileText /> Tenders
        </button>
        <button
          className={`tab ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => setActiveTab('applications')}
        >
          <FiCalendar /> Applications
        </button>
      </div>

      {activeTab === 'tenders' && (
        <div className="tenders-tab-content">
          {loading ? (
            <div className="loading-state" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
              <ImageLoader size={100} text="Loading tenders..." />
            </div>
          ) : tenders.length === 0 ? (
            <div className="empty-state">
              <FiFileText className="empty-icon" />
              <h3>No Tenders</h3>
              <p>Create your first tender to get started</p>
            </div>
          ) : (
            <div className="tenders-list">
              {tenders.map((tender) => (
                <div key={tender._id} className="tender-item">
                  <div className="tender-item-header">
                    <div>
                      <h3>{tender.tenderTitle}</h3>
                      <span className={`status-badge ${tender.status === 'Active' ? 'active' : 'closed'}`}>
                        {tender.status}
                      </span>
                    </div>
                    <div className="tender-actions">
                      {tender.status === 'Active' && (
                        <button
                          className="btn-secondary"
                          onClick={() => handleCloseTender(tender._id)}
                        >
                          Close
                        </button>
                      )}
                      <button
                        className="btn-danger"
                        onClick={() => handleDeleteTender(tender._id)}
                      >
                        <FiTrash2 /> Delete
                      </button>
                    </div>
                  </div>
                  <div className="tender-item-details">
                    <div className="detail-row">
                      <span className="detail-label">Category:</span>
                      <span>{tender.tenderCategory}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Budget:</span>
                      <span>{tender.budget}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Location:</span>
                      <span>{tender.location}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Deadline:</span>
                      <span>{formatDate(tender.deadline)}</span>
                    </div>
                    {tender.requiredDocuments && tender.requiredDocuments.length > 0 && (
                      <div className="detail-row">
                        <span className="detail-label">Required Docs:</span>
                        <span>{tender.requiredDocuments.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'applications' && (
        <div className="applications-tab-content">
          {loading ? (
            <div className="loading-state" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
              <ImageLoader size={100} text="Loading applications..." />
            </div>
          ) : applications.length === 0 ? (
            <div className="empty-state">
              <FiFileText className="empty-icon" />
              <h3>No Applications</h3>
              <p>No applications have been submitted yet</p>
            </div>
          ) : (
            <div className="applications-table">
              <table>
                <thead>
                  <tr>
                    <th>Application ID</th>
                    <th>Applicant Name</th>
                    <th>Tender</th>
                    <th>Type</th>
                    <th>Contact</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app._id}>
                      <td className="app-id">{app.applicationId}</td>
                      <td>{app.fullName}</td>
                      <td>{app.tenderId?.tenderTitle || 'N/A'}</td>
                      <td>{app.applicantType}</td>
                      <td>
                        <div className="contact-info">
                          <div>{app.email}</div>
                          <div className="text-muted">{app.mobile}</div>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusBadgeClass(app.applicationStatus)}`}>
                          {app.applicationStatus}
                        </span>
                      </td>
                      <td>{formatDate(app.applicationDate)}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-icon"
                            onClick={() => handleViewApplication(app._id)}
                            title="View Details"
                          >
                            <FiEye />
                          </button>
                          {app.applicationStatus === 'Pending' && (
                            <>
                              <button
                                className="btn-icon success"
                                onClick={() => handleStatusChange(app._id, 'Approved')}
                                title="Approve"
                              >
                                <FiCheck />
                              </button>
                              <button
                                className="btn-icon danger"
                                onClick={() => handleStatusChange(app._id, 'Rejected')}
                                title="Reject"
                              >
                                <FiXCircle />
                              </button>
                            </>
                          )}
                          <button
                            className="btn-icon danger"
                            onClick={() => handleDeleteApplication(app._id)}
                            title="Delete"
                          >
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
        </div>
      )}

      {/* Post Tender Modal */}
      <AnimatePresence>
        {showTenderForm && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowTenderForm(false);
              resetTenderForm();
            }}
          >
            <motion.div
              className="modal-content tender-form-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Post New Tender</h3>
                <button className="close-btn" onClick={() => {
                  setShowTenderForm(false);
                  resetTenderForm();
                }}>
                  <FiX />
                </button>
              </div>

              <form onSubmit={handleSubmitTender} className="tender-form">
                <div className="form-group">
                  <label>Tender Title *</label>
                  <input
                    type="text"
                    name="tenderTitle"
                    value={tenderForm.tenderTitle}
                    onChange={handleTenderInputChange}
                    className={errors.tenderTitle ? 'error' : ''}
                  />
                  {errors.tenderTitle && <span className="error-text">{errors.tenderTitle}</span>}
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    name="tenderDescription"
                    value={tenderForm.tenderDescription}
                    onChange={handleTenderInputChange}
                    rows="4"
                    className={errors.tenderDescription ? 'error' : ''}
                  />
                  {errors.tenderDescription && <span className="error-text">{errors.tenderDescription}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      name="tenderCategory"
                      value={tenderForm.tenderCategory}
                      onChange={handleTenderInputChange}
                      className={errors.tenderCategory ? 'error' : ''}
                    >
                      <option value="">Select Category</option>
                      <option value="Social Work">Social Work</option>
                      <option value="NGO Project">NGO Project</option>
                      <option value="Government Collaboration">Government Collaboration</option>
                      <option value="Education">Education</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Environment">Environment</option>
                      <option value="Infrastructure">Infrastructure</option>
                      <option value="Community Development">Community Development</option>
                    </select>
                    {errors.tenderCategory && <span className="error-text">{errors.tenderCategory}</span>}
                  </div>

                  <div className="form-group">
                    <label>Tender Type *</label>
                    <select
                      name="tenderType"
                      value={tenderForm.tenderType}
                      onChange={handleTenderInputChange}
                      className={errors.tenderType ? 'error' : ''}
                    >
                      <option value="">Select Tender Type</option>
                      <option value="UGF Internal Tender">UGF Internal Tender</option>
                      <option value="Joint NGO Tender">Joint NGO Tender</option>
                      <option value="Third-Party Tender">Third-Party Tender</option>
                    </select>
                    {errors.tenderType && <span className="error-text">{errors.tenderType}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Budget *</label>
                    <input
                      type="text"
                      name="budget"
                      value={tenderForm.budget}
                      onChange={handleTenderInputChange}
                      placeholder="e.g., ₹50,000"
                      className={errors.budget ? 'error' : ''}
                    />
                    {errors.budget && <span className="error-text">{errors.budget}</span>}
                  </div>

                  <div className="form-group">
                    <label>Application Fee</label>
                    <input
                      type="text"
                      name="applicationFee"
                      value={tenderForm.applicationFee}
                      onChange={handleTenderInputChange}
                      placeholder="e.g., ₹500"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Fee Type</label>
                    <select
                      name="feeType"
                      value={tenderForm.feeType}
                      onChange={handleTenderInputChange}
                    >
                      <option value="">Select Fee Type</option>
                      <option value="Refundable">Refundable</option>
                      <option value="Non-Refundable">Non-Refundable</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>EMD Amount (Earnest Money Deposit)</label>
                    <input
                      type="text"
                      name="emdAmount"
                      value={tenderForm.emdAmount}
                      onChange={handleTenderInputChange}
                      placeholder="e.g., ₹10,000"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Start Date *</label>
                    <input
                      type="date"
                      name="startDate"
                      value={tenderForm.startDate}
                      onChange={handleTenderInputChange}
                      className={errors.startDate ? 'error' : ''}
                    />
                    {errors.startDate && <span className="error-text">{errors.startDate}</span>}
                  </div>

                  <div className="form-group">
                    <label>Deadline *</label>
                    <input
                      type="date"
                      name="deadline"
                      value={tenderForm.deadline}
                      onChange={handleTenderInputChange}
                      className={errors.deadline ? 'error' : ''}
                    />
                    {errors.deadline && <span className="error-text">{errors.deadline}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label>Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={tenderForm.location}
                    onChange={handleTenderInputChange}
                    className={errors.location ? 'error' : ''}
                  />
                  {errors.location && <span className="error-text">{errors.location}</span>}
                </div>

                <div className="form-group">
                  <label>Eligibility (Optional)</label>
                  <textarea
                    name="eligibility"
                    value={tenderForm.eligibility}
                    onChange={handleTenderInputChange}
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Required Documents *</label>
                  <div className="document-checkboxes">
                    {documentOptions.map((doc) => (
                      <label key={doc} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={tenderForm.requiredDocuments.includes(doc)}
                          onChange={() => handleDocumentToggle(doc)}
                        />
                        <span>{doc}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Tender Document (PDF)</label>
                  <div className="document-upload-section" style={{ border: '2px dashed #e2e8f0', padding: '16px', borderRadius: '8px', marginTop: '8px' }}>
                    {tenderForm.tenderDocument ? (
                      <div className="uploaded-file-preview" style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', padding: '8px', borderRadius: '6px' }}>
                        <FiFileText size={20} className="text-primary" />
                        <a href={tenderForm.tenderDocument} target="_blank" rel="noopener noreferrer" style={{ flex: 1, color: '#2563eb', textDecoration: 'underline', fontSize: '14px' }}>
                          View Uploaded Document
                        </a>
                        <button type="button" onClick={removeDocument} className="btn-icon danger" title="Remove Document">
                          <FiTrash2 />
                        </button>
                      </div>
                    ) : (
                      <div className="upload-input-container">
                         {uploadingDoc ? (
                           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#64748b' }}>
                             <ImageLoader size={16} />
                             <span>Uploading PDF...</span>
                           </div>
                         ) : (
                           <input 
                             type="file" 
                             accept=".pdf" 
                             onChange={handleDocumentUpload}
                             style={{ display: 'block', width: '100%', fontSize: '14px' }}
                           />
                         )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Terms and Conditions</label>
                  <textarea
                    name="termsAndConditions"
                    value={tenderForm.termsAndConditions}
                    onChange={handleTenderInputChange}
                    rows="6"
                    placeholder="Enter terms and conditions for this tender..."
                  />
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setShowTenderForm(false);
                      resetTenderForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Tender'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Application View Modal */}
      <AnimatePresence>
        {showApplicationView && selectedApplication && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowApplicationView(false);
              setSelectedApplication(null);
            }}
          >
            <motion.div
              className="modal-content application-view-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Application Details</h3>
                <button className="close-btn" onClick={() => {
                  setShowApplicationView(false);
                  setSelectedApplication(null);
                }}>
                  <FiX />
                </button>
              </div>

              <div className="application-details">
                <div className="detail-section">
                  <h4>Application Information</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Application ID:</span>
                      <span className="detail-value">{selectedApplication.applicationId}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Status:</span>
                      <span className={`status-badge ${getStatusBadgeClass(selectedApplication.applicationStatus)}`}>
                        {selectedApplication.applicationStatus}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Tender:</span>
                      <span className="detail-value">{selectedApplication.tenderId?.tenderTitle || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Applicant Type:</span>
                      <span className="detail-value">{selectedApplication.applicantType}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Personal Information</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Full Name:</span>
                      <span className="detail-value">{selectedApplication.fullName}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Mobile:</span>
                      <span className="detail-value">{selectedApplication.mobile}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{selectedApplication.email}</span>
                    </div>
                    <div className="detail-item full-width">
                      <span className="detail-label">Address:</span>
                      <span className="detail-value">{selectedApplication.address}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">City:</span>
                      <span className="detail-value">{selectedApplication.city}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">State:</span>
                      <span className="detail-value">{selectedApplication.state}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Pincode:</span>
                      <span className="detail-value">{selectedApplication.pincode}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Identity Details</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Aadhaar No:</span>
                      <span className="detail-value">{selectedApplication.aadhaarNo}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">PAN No:</span>
                      <span className="detail-value">{selectedApplication.panNo}</span>
                    </div>
                  </div>
                </div>

                {selectedApplication.applicantType === 'Company' && (
                  <div className="detail-section">
                    <h4>Company Details</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">Company Name:</span>
                        <span className="detail-value">{selectedApplication.companyName || 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Registration No:</span>
                        <span className="detail-value">{selectedApplication.companyRegNo || 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">GST No:</span>
                        <span className="detail-value">{selectedApplication.gstNo || 'N/A'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Year Established:</span>
                        <span className="detail-value">{selectedApplication.yearEstablished || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedApplication.uploadedDocuments && selectedApplication.uploadedDocuments.length > 0 && (
                  <div className="detail-section">
                    <h4>Uploaded Documents</h4>
                    <div className="documents-list">
                      {selectedApplication.uploadedDocuments.map((doc, index) => (
                        <div key={index} className="document-item">
                          <FiFileText className="doc-icon" />
                          <div className="doc-info">
                            <div className="doc-name">{doc.documentName}</div>
                            <div className="doc-meta">{doc.fileName} ({(doc.fileSize / 1024).toFixed(2)} KB)</div>
                          </div>
                          <a
                            href={doc.filePath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="view-doc-btn"
                          >
                            View
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedApplication.adminRemark && (
                  <div className="detail-section">
                    <h4>Admin Remark</h4>
                    <p className="admin-remark">{selectedApplication.adminRemark}</p>
                  </div>
                )}
              </div>

              {selectedApplication.applicationStatus === 'Pending' && (
                <div className="modal-footer">
                  <button
                    className="btn-success"
                    onClick={() => handleStatusChange(selectedApplication._id, 'Approved')}
                  >
                    <FiCheck /> Approve
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => handleStatusChange(selectedApplication._id, 'Rejected')}
                  >
                    <FiXCircle /> Reject
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TenderManagement;

