import React from 'react';
import { FiTarget } from 'react-icons/fi';

const CampaignManagement = () => {
  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">Campaign Management</h1>
        <p className="page-subtitle">Manage fundraising campaigns and initiatives</p>
      </div>
      
      <div className="content-card">
        <div className="content-card__body">
          <div className="empty-state">
            <div className="empty-state__icon">
              <FiTarget />
            </div>
            <h3 className="empty-state__title">Campaign Management</h3>
            <p className="empty-state__description">
              Campaign management functionality will be implemented here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignManagement;
