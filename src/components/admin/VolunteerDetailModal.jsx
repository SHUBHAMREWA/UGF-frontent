import React from 'react';
import './VolunteerDetailModal.css';

const VolunteerDetailModal = ({ isOpen, onClose, volunteer }) => {
  if (!isOpen || !volunteer) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="volunteer-detail-modal-overlay">
      <div className="volunteer-detail-modal">
        <div className="volunteer-detail-modal-header">
          <h3>Volunteer Details</h3>
          <button className="close-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="volunteer-detail-modal-body">
          <div className="volunteer-detail-grid">
            {/* Personal Information */}
            <div className="detail-section">
              <h4 className="section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="18" height="18">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Personal Information
              </h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Full Name:</label>
                  <span>{volunteer.fullName}</span>
                </div>
                <div className="detail-item">
                  <label>Age:</label>
                  <span>{volunteer.age} years</span>
                </div>
                <div className="detail-item">
                  <label>Gender:</label>
                  <span>{volunteer.gender || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <label>Email:</label>
                  <span>{volunteer.email}</span>
                </div>
                <div className="detail-item">
                  <label>Contact Number:</label>
                  <span>{volunteer.contactNumber}</span>
                </div>
                <div className="detail-item">
                  <label>Address:</label>
                  <span>{volunteer.address}</span>
                </div>
                <div className="detail-item">
                  <label>District:</label>
                  <span>{volunteer.district}</span>
                </div>
              </div>
            </div>

            {/* Areas of Interest & Skills */}
            <div className="detail-section">
              <h4 className="section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="18" height="18">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Areas of Interest & Skills
              </h4>
              <div className="detail-grid">
                <div className="detail-item full-width">
                  <label>Areas of Interest:</label>
                  <div className="tags-container">
                    {volunteer.areasOfInterest && volunteer.areasOfInterest.length > 0 ? (
                      volunteer.areasOfInterest.map((interest, index) => (
                        <span key={index} className="tag">{interest}</span>
                      ))
                    ) : (
                      <span className="no-data">No areas of interest specified</span>
                    )}
                  </div>
                </div>
                <div className="detail-item full-width">
                  <label>Skills:</label>
                  <div className="tags-container">
                    {volunteer.skills && volunteer.skills.length > 0 ? (
                      volunteer.skills.map((skill, index) => (
                        <span key={index} className="tag">{skill}</span>
                      ))
                    ) : (
                      <span className="no-data">No skills specified</span>
                    )}
                  </div>
                </div>
                <div className="detail-item full-width">
                  <label>Previous Experience:</label>
                  <span>{volunteer.previousExperience || 'No previous experience mentioned'}</span>
                </div>
              </div>
            </div>

            {/* Motivation & Goals */}
            <div className="detail-section">
              <h4 className="section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="18" height="18">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Motivation & Goals
              </h4>
              <div className="detail-grid">
                <div className="detail-item full-width">
                  <label>Motivation:</label>
                  <span>{volunteer.motivation}</span>
                </div>
                <div className="detail-item full-width">
                  <label>Goals:</label>
                  <span>{volunteer.goals || 'No goals specified'}</span>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="detail-section">
              <h4 className="section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="18" height="18">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Emergency Contact
              </h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Name:</label>
                  <span>{volunteer.emergencyContact.name}</span>
                </div>
                <div className="detail-item">
                  <label>Relationship:</label>
                  <span>{volunteer.emergencyContact.relationship || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <label>Contact Number:</label>
                  <span>{volunteer.emergencyContact.contactNumber}</span>
                </div>
              </div>
            </div>

            {/* ID Proof */}
            {volunteer.idProof && (
              <div className="detail-section">
                <h4 className="section-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="18" height="18">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  ID Proof
                </h4>
                <div className="id-proof-container">
                  <img 
                    src={volunteer.idProof} 
                    alt="ID Proof" 
                    className="id-proof-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div className="id-proof-error" style={{ display: 'none' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="48" height="48">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>Image not available</p>
                  </div>
                </div>
              </div>
            )}

            {/* Application Details */}
            <div className="detail-section">
              <h4 className="section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="18" height="18">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Application Details
              </h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Status:</label>
                  <span className={`status-badge ${volunteer.status}`}>
                    {volunteer.status.charAt(0).toUpperCase() + volunteer.status.slice(1)}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Registration Date:</label>
                  <span>{formatDate(volunteer.createdAt)}</span>
                </div>
                <div className="detail-item">
                  <label>Last Updated:</label>
                  <span>{formatDate(volunteer.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDetailModal; 