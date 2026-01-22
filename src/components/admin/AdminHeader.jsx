import React, { useState } from 'react';
import {
  FiMenu,
  FiBell,
  FiSearch,
  FiUser,
  FiSettings,
  FiLogOut,
  FiMoon,
  FiSun,
  FiChevronDown
} from 'react-icons/fi';
import './AdminHeader.css';

const AdminHeader = ({ onToggleSidebar, sidebarCollapsed }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Toggle dark mode implementation
    document.documentElement.setAttribute('data-theme', darkMode ? 'light' : 'dark');
  };

  const handleLogout = () => {
    // Logout implementation
    console.log('Logout clicked');
  };

  const notifications = [
    {
      id: 1,
      title: 'New donation received',
      message: '₹5,000 donation from John Doe',
      time: '2 minutes ago',
      unread: true
    },
    {
      id: 2,
      title: 'Receipt issued',
      message: 'Receipt DR-2025-000123 issued successfully',
      time: '1 hour ago',
      unread: true
    },
    {
      id: 3,
      title: 'Monthly report ready',
      message: 'December 2024 report is available',
      time: '3 hours ago',
      unread: false
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="admin-header">
      <div className="header-left">
        <button
          className="sidebar-toggle-btn"
          onClick={onToggleSidebar}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <FiMenu />
        </button>
        
        <div className="search-container">
          <div className="search-input-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search donations, donors, projects..."
              className="search-input"
            />
          </div>
        </div>
      </div>

      <div className="header-right">
        <button
          className="theme-toggle-btn"
          onClick={toggleDarkMode}
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? <FiSun /> : <FiMoon />}
        </button>

        <div className="notifications-container">
          <button
            className="notifications-btn"
            onClick={toggleNotifications}
            title="Notifications"
          >
            <FiBell />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="dropdown-header">
                <h3>Notifications</h3>
                <button className="mark-all-read">Mark all read</button>
              </div>
              <div className="notifications-list">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`notification-item ${notification.unread ? 'unread' : ''}`}
                  >
                    <div className="notification-content">
                      <h4>{notification.title}</h4>
                      <p>{notification.message}</p>
                      <span className="notification-time">{notification.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="dropdown-footer">
                <button className="view-all-btn">View all notifications</button>
              </div>
            </div>
          )}
        </div>

        <div className="user-menu-container">
          <button
            className="user-menu-btn"
            onClick={toggleUserMenu}
            title="User menu"
          >
            <div className="user-avatar">
              <FiUser />
            </div>
            <span className="user-name">Admin User</span>
            <FiChevronDown className="chevron-icon" />
          </button>

          {showUserMenu && (
            <div className="user-dropdown">
              <div className="user-info">
                <div className="user-avatar-large">
                  <FiUser />
                </div>
                <div className="user-details">
                  <h4>Admin User</h4>
                  <p>admin@example.com</p>
                </div>
              </div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-menu">
                <button className="dropdown-item">
                  <FiUser />
                  <span>Profile</span>
                </button>
                <button className="dropdown-item">
                  <FiSettings />
                  <span>Settings</span>
                </button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout" onClick={handleLogout}>
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showUserMenu || showNotifications) && (
        <div
          className="dropdown-overlay"
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
          }}
        />
      )}
    </header>
  );
};

export default AdminHeader;
