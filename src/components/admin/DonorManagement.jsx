import React from 'react';
import { FiUsers } from 'react-icons/fi';

const DonorManagement = () => {
  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">Donor Management</h1>
        <p className="page-subtitle">Manage donor information and relationships</p>
      </div>
      
      <div className="content-card">
        <div className="content-card__body">
          <div className="empty-state">
            <div className="empty-state__icon">
              <FiUsers />
            </div>
            <h3 className="empty-state__title">Donor Management</h3>
            <p className="empty-state__description">
              Donor management functionality will be implemented here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorManagement;
