import React from 'react';
import { FiTag } from 'react-icons/fi';

const CategoryManagement = () => {
  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">Category Management</h1>
        <p className="page-subtitle">Manage income and expense categories</p>
      </div>
      
      <div className="content-card">
        <div className="content-card__body">
          <div className="empty-state">
            <div className="empty-state__icon">
              <FiTag />
            </div>
            <h3 className="empty-state__title">Category Management</h3>
            <p className="empty-state__description">
              Category management functionality will be implemented here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;
