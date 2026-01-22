import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaPlus, FaTrash, FaInfoCircle, FaEdit } from 'react-icons/fa';
import api from '../../utils/api';
import RejectionModal from './RejectionModal';
import VolunteerDetailModal from './VolunteerDetailModal';
import VolunteerEditModal from './VolunteerEditModal';
import '../../styles/VolunteersTable.css';

const VolunteersTable = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rejectionModal, setRejectionModal] = useState({
    isOpen: false,
    volunteerId: null,
    volunteerName: ''
  });
  const [detailModal, setDetailModal] = useState({
    isOpen: false,
    volunteer: null
  });
  const [editModal, setEditModal] = useState({
    isOpen: false,
    volunteer: null
  });

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      const response = await api.get('/volunteers');
      setVolunteers(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch volunteers');
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (volunteerId, newStatus, rejectionReason = null) => {
    try {
      const requestData = { status: newStatus };
      if (rejectionReason) {
        requestData.rejectionReason = rejectionReason;
      }
      
      await api.patch(`/volunteers/${volunteerId}/status`, requestData);
      
      // Show success message
      alert(`Volunteer ${newStatus === 'approved' ? 'approved' : 'rejected'} successfully! Email notification sent.`);
      
      // Refresh the volunteers list
      fetchVolunteers();
    } catch (err) {
      setError('Failed to update volunteer status');
      alert('Failed to update volunteer status. Please try again.');
    }
  };

  const handleApprove = (volunteerId) => {
    if (window.confirm('Are you sure you want to approve this volunteer? An email notification will be sent.')) {
      handleStatusUpdate(volunteerId, 'approved');
    }
  };

  const handleReject = (volunteerId, volunteerName) => {
    setRejectionModal({
      isOpen: true,
      volunteerId,
      volunteerName
    });
  };

  const handleRejectionConfirm = (rejectionReason) => {
    handleStatusUpdate(rejectionModal.volunteerId, 'rejected', rejectionReason);
    setRejectionModal({ isOpen: false, volunteerId: null, volunteerName: '' });
  };

  const handleRejectionCancel = () => {
    setRejectionModal({ isOpen: false, volunteerId: null, volunteerName: '' });
  };

  const handleViewDetails = (volunteer) => {
    setDetailModal({
      isOpen: true,
      volunteer
    });
  };

  const handleDetailModalClose = () => {
    setDetailModal({ isOpen: false, volunteer: null });
  };

  const handleEditVolunteer = (volunteer) => {
    setEditModal({
      isOpen: true,
      volunteer
    });
  };

  const handleEditModalClose = () => {
    setEditModal({ isOpen: false, volunteer: null });
  };

  const handleEditSubmit = async (updatedData) => {
    try {
      await api.put(`/volunteers/${editModal.volunteer._id}`, updatedData);
      alert('Volunteer updated successfully!');
      setEditModal({ isOpen: false, volunteer: null });
      fetchVolunteers();
    } catch (err) {
      setError('Failed to update volunteer');
      alert('Failed to update volunteer. Please try again.');
    }
  };

  const StatusDropdown = ({ volunteer }) => (
    <select
      value={volunteer.status}
      onChange={(e) => {
        const newStatus = e.target.value;
        if (newStatus === 'rejected') {
          handleReject(volunteer._id, volunteer.fullName);
        } else if (newStatus === 'approved') {
          handleApprove(volunteer._id);
        } else {
          handleStatusUpdate(volunteer._id, newStatus);
        }
      }}
      className={`status-dropdown ${volunteer.status}`}
    >
      <option value="pending">Pending</option>
      <option value="approved">Approve</option>
      <option value="rejected">Reject</option>
    </select>
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) return <div >Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="volunteers-table-container">
      <div className="table-header">
        <h2>Volunteer Management</h2>
        <button className="add-volunteer-btn">Volunteers</button>
      </div>
      <table className="volunteers-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Contact Info</th>
            <th>Areas of Interest</th>
            <th>Emergency Contact</th>
            <th>Registration Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {volunteers?.length > 0 ? (
            volunteers.map((volunteer) => (
              <tr key={volunteer._id}>
                <td>{volunteer.fullName}</td>
                <td>
                  <div>{volunteer.email}</div>
                  <div>{volunteer.contactNumber}</div>
                  <div className="address-text">{volunteer.address}, {volunteer.district}</div>
                </td>
                <td>
                  <div className="interests-list">
                    {volunteer.areasOfInterest.map((interest, index) => (
                      <span key={index} className="interest-tag">
                        {interest}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <div>{volunteer.emergencyContact.name}</div>
                  <div>{volunteer.emergencyContact.contactNumber}</div>
                </td>
                <td>{formatDate(volunteer.createdAt)}</td>
                <td>
                  <StatusDropdown volunteer={volunteer} />
                </td>
                <td className="action-buttons">
                  <button 
                    className="action-btn view"
                    onClick={() => handleViewDetails(volunteer)}
                    title="View Details"
                  >
                    <FaInfoCircle />
                  </button>
                  <button 
                    className="action-btn edit"
                    onClick={() => handleEditVolunteer(volunteer)}
                    title="Edit Volunteer"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="action-btn approve"
                    onClick={() => handleApprove(volunteer._id)}
                    title="Approve"
                    disabled={volunteer.status === 'approved'}
                  >
                    <FaCheck />
                  </button>
                  <button 
                    className="action-btn reject"
                    onClick={() => handleReject(volunteer._id, volunteer.fullName)}
                    title="Reject"
                    disabled={volunteer.status === 'rejected'}
                  >
                    <FaTimes />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="no-data">
                No volunteers found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <RejectionModal
        isOpen={rejectionModal.isOpen}
        onClose={handleRejectionCancel}
        onConfirm={handleRejectionConfirm}
        volunteerName={rejectionModal.volunteerName}
      />

      <VolunteerDetailModal
        isOpen={detailModal.isOpen}
        onClose={handleDetailModalClose}
        volunteer={detailModal.volunteer}
      />

      <VolunteerEditModal
        isOpen={editModal.isOpen}
        onClose={handleEditModalClose}
        volunteer={editModal.volunteer}
        onSubmit={handleEditSubmit}
      />
    </div>
  );
};

export default VolunteersTable; 