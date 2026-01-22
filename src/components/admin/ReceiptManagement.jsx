import React from 'react';
import { FiFileText } from 'react-icons/fi';

const ReceiptManagement = () => {
  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">Receipt Management</h1>
        <p className="page-subtitle">Generate and manage donation receipts</p>
      </div>
      
      <div className="content-card">
        <div className="content-card__body">
          <div className="empty-state">
            <div className="empty-state__icon">
              <FiFileText />
            </div>
            <h3 className="empty-state__title">Receipt Management</h3>
            <p className="empty-state__description">
              Receipt management functionality will be implemented here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptManagement;
