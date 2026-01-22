import React, { useState } from 'react';
import './RejectionModal.css';

const RejectionModal = ({ isOpen, onClose, onConfirm, volunteerName }) => {
  const [rejectionReason, setRejectionReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rejectionReason.trim()) {
      onConfirm(rejectionReason.trim());
      setRejectionReason('');
      onClose();
    }
  };

  const handleCancel = () => {
    setRejectionReason('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="rejection-modal-overlay">
      <div className="rejection-modal">
        <div className="rejection-modal-header">
          <h3>Reject Volunteer Application</h3>
          <button className="close-btn" onClick={handleCancel}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="rejection-modal-body">
          <p className="rejection-modal-text">
            You are about to reject <strong>{volunteerName}</strong>'s volunteer application.
            Please provide a reason for the rejection. This will be included in the email sent to the volunteer.
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="rejectionReason" className="form-label">
                Rejection Reason *
              </label>
              <textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="rejection-reason-textarea"
                placeholder="Please provide a clear and constructive reason for the rejection..."
                rows="4"
                required
              />
            </div>
            
            <div className="rejection-modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-danger"
                disabled={!rejectionReason.trim()}
              >
                Confirm Rejection
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RejectionModal; 