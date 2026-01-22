import React from 'react';
import { FiFolder } from 'react-icons/fi';

const ProjectManagement = () => {
  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">Project Management</h1>
        <p className="page-subtitle">Manage fundraising projects and initiatives</p>
      </div>
      
      <div className="content-card">
        <div className="content-card__body">
          <div className="empty-state">
            <div className="empty-state__icon">
              <FiFolder />
            </div>
            <h3 className="empty-state__title">Project Management</h3>
            <p className="empty-state__description">
              Project management functionality will be implemented here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectManagement;
