import React from 'react';
import { X } from 'lucide-react';

const EventDetailsModal = ({ event, onClose, onAddExpense, onAddDonation, onStatusChange }) => {
  const balance = (event.totalDonations || 0) - (event.totalExpenses || 0);
  const utilization = event.budget?.totalBudget > 0 
    ? ((event.totalExpenses / event.budget.totalBudget) * 100).toFixed(1) 
    : 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{event.title}</h2>
          <button onClick={onClose} className="close-btn">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="modal-body">
          <div className="event-status-banner">
            <span>Status: {event.status}</span>
            {event.status === 'draft' && (
              <button onClick={() => onStatusChange(event._id, 'active')} className="btn-activate">
                Activate Event
              </button>
            )}
          </div>
          <div className="event-details-grid">
            <div className="detail-section">
              <h3>Event Information</h3>
              <div className="detail-grid">
                <div><strong>Type:</strong> {event.type}</div>
                <div><strong>Venue:</strong> {event.venue}</div>
                <div><strong>Start:</strong> {new Date(event.startDate).toLocaleDateString()}</div>
                <div><strong>End:</strong> {new Date(event.endDate).toLocaleDateString()}</div>
                <div><strong>Budget:</strong> ₹{event.budget?.totalBudget?.toLocaleString() || 0}</div>
                <div><strong>Program:</strong> {event.program}</div>
              </div>
            </div>
            <div className="detail-section">
              <h3>Financial Summary</h3>
              <div className="financial-grid">
                <div className="financial-card bg-green-100">
                  <div className="financial-label">Total Funds In</div>
                  <div className="financial-value">₹{(event.totalDonations || 0).toLocaleString()}</div>
                </div>
                <div className="financial-card bg-red-100">
                  <div className="financial-label">Total Funds Out</div>
                  <div className="financial-value">₹{(event.totalExpenses || 0).toLocaleString()}</div>
                </div>
                <div className="financial-card bg-blue-100">
                  <div className="financial-label">Net Balance</div>
                  <div className={`financial-value ${balance >= 0 ? 'text-blue-800' : 'text-red-800'}`}>
                    ₹{balance.toLocaleString()}
                  </div>
                </div>
                <div className="financial-card bg-purple-100">
                  <div className="financial-label">Budget Utilization</div>
                  <div className="financial-value">{utilization}%</div>
                </div>
              </div>
            </div>
          </div>
          {event.status === 'active' && (
            <div className="action-buttons-row">
              <button onClick={onAddDonation} className="btn-add-donation">Add Donation</button>
              <button onClick={onAddExpense} className="btn-add-expense">Add Expense</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;



