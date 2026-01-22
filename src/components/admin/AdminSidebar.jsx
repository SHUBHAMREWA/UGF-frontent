import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiDollarSign,
  FiCreditCard,
  FiUsers,
  FiFolder,
  FiTag,
  FiTarget,
  FiFileText,
  FiBarChart2,
  FiSettings,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import './AdminSidebar.css';

const AdminSidebar = ({ collapsed, currentPath, onPathChange }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      path: '/admin/dashboard',
      icon: FiHome,
      label: 'Dashboard',
      badge: null
    },
    {
      path: '/admin/donations',
      icon: FiDollarSign,
      label: 'Donations',
      badge: null
    },
    {
      path: '/admin/expenses',
      icon: FiCreditCard,
      label: 'Expenses',
      badge: null
    },
    {
      path: '/admin/donors',
      icon: FiUsers,
      label: 'Donors',
      badge: null
    },
    {
      path: '/admin/projects',
      icon: FiFolder,
      label: 'Projects',
      badge: null
    },
    {
      path: '/admin/categories',
      icon: FiTag,
      label: 'Categories',
      badge: null
    },
    {
      path: '/admin/campaigns',
      icon: FiTarget,
      label: 'Campaigns',
      badge: null
    },
    {
      path: '/admin/receipts',
      icon: FiFileText,
      label: 'Receipts',
      badge: null
    },
    {
      path: '/admin/reports',
      icon: FiBarChart2,
      label: 'Reports',
      badge: null
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    onPathChange(path);
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <FiDollarSign />
          </div>
          {!collapsed && (
            <div className="logo-text">
              <span className="logo-title">United Global Federation India</span>
              <span className="logo-subtitle">CRM Admin</span>
            </div>
          )}
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <li key={item.path} className="nav-item">
                <button
                  className={`nav-link ${active ? 'active' : ''}`}
                  onClick={() => handleNavigation(item.path)}
                  title={collapsed ? item.label : ''}
                >
                  <div className="nav-icon">
                    <Icon />
                  </div>
                  {!collapsed && (
                    <>
                      <span className="nav-label">{item.label}</span>
                      {item.badge && (
                        <span className="nav-badge">{item.badge}</span>
                      )}
                    </>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-stats">
          {!collapsed && (
            <>
              <div className="stat-item">
                <span className="stat-label">Total Donations</span>
                <span className="stat-value">₹1,25,000</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">This Month</span>
                <span className="stat-value">₹25,000</span>
              </div>
            </>
          )}
        </div>
        
        <button className="sidebar-toggle" title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
