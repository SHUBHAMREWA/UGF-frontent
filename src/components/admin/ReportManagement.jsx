import React from 'react';
import { FiBarChart2 } from 'react-icons/fi';

const ReportManagement = () => {
  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">Reports & Analytics</h1>
        <p className="page-subtitle">Generate comprehensive reports and analytics</p>
      </div>
      
      <div className="content-card">
        <div className="content-card__body">
          <div className="empty-state">
            <div className="empty-state__icon">
              <FiBarChart2 />
            </div>
            <h3 className="empty-state__title">Reports & Analytics</h3>
            <p className="empty-state__description">
              Reports and analytics functionality will be implemented here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportManagement;
