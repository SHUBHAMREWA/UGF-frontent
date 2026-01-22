import React from 'react';
import { FiCreditCard } from 'react-icons/fi';

const ExpenseManagement = () => {
  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">Expense Management</h1>
        <p className="page-subtitle">Track and manage organizational expenses</p>
      </div>
      
      <div className="content-card">
        <div className="content-card__body">
          <div className="empty-state">
            <div className="empty-state__icon">
              <FiCreditCard />
            </div>
            <h3 className="empty-state__title">Expense Management</h3>
            <p className="empty-state__description">
              Expense management functionality will be implemented here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseManagement;
