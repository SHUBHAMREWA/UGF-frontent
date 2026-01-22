import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import HeroEditor from './HeroEditor';
import StatsEditor from './StatsEditor';
import TestimonialsEditor from './TestimonialsEditor';
import VolunteersTable from './VolunteersTable';
import ProgramsEditor from './ProgramsEditor';
import EventsEditor from './EventsEditor';
import GalleryEditor from './GalleryEditor';
import BlogEditor from './BlogEditor';
import DonationEditor from './DonationEditor';
import CarouselEditor from './CarouselEditor';
import SubadminManagement from './SubadminManagement';
import './SubadminDashboard.css';

const SubadminDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState([]);

  // Helper function to map permission keys to readable labels
  const getPermissionLabel = (permission) => {
    const permissionMap = {
      'manage_hero': 'Manage Hero Section',
      'manage_stats': 'Manage Statistics',
      'manage_testimonials': 'Manage Testimonials',
      'manage_volunteers': 'Manage Volunteers',
      'manage_programs': 'Manage Programs',
      'manage_events': 'Manage Events',
      'manage_gallery': 'Manage Gallery',
      'manage_carousel': 'Manage Carousel',
      'manage_blog': 'Manage Blog Posts',
      'manage_donations': 'Manage Donation Cards',
      'manage_payments': 'Manage Payments',
      'manage_users': 'Manage Users',
      'view_reports': 'View Reports',
      'manage_subadmins': 'Manage Subadmins'
    };
    return permissionMap[permission] || permission.replace('_', ' ').toUpperCase();
  };

  useEffect(() => {
    if (currentUser?.permissions) {
      setPermissions(currentUser.permissions);
    }
  }, [currentUser]);

  const renderContent = () => {
    switch (activeTab) {
      case 'stats':
        return permissions.includes('manage_stats') ? (
          <StatsEditor />
        ) : (
          <div className="no-permission">You don't have permission to manage statistics</div>
        );
      case 'testimonials':
        return permissions.includes('manage_testimonials') ? (
          <TestimonialsEditor />
        ) : (
          <div className="no-permission">You don't have permission to manage testimonials</div>
        );
      case 'volunteers':
        return permissions.includes('manage_volunteers') ? (
          <VolunteersTable />
        ) : (
          <div className="no-permission">You don't have permission to manage volunteers</div>
        );
      case 'programs':
        return permissions.includes('manage_programs') ? (
          <ProgramsEditor />
        ) : (
          <div className="no-permission">You don't have permission to manage programs</div>
        );
      case 'events':
        return permissions.includes('manage_events') ? (
          <EventsEditor />
        ) : (
          <div className="no-permission">You don't have permission to manage events</div>
        );
      case 'gallery':
        return permissions.includes('manage_gallery') ? (
          <GalleryEditor />
        ) : (
          <div className="no-permission">You don't have permission to manage gallery</div>
        );
      case 'blog':
        return permissions.includes('manage_blog') ? (
          <BlogEditor />
        ) : (
          <div className="no-permission">You don't have permission to manage blog posts</div>
        );
      case 'donations':
        return permissions.includes('manage_donations') ? (
          <DonationEditor />
        ) : (
          <div className="no-permission">You don't have permission to manage donations</div>
        );
      case 'hero':
        return permissions.includes('manage_hero') ? (
          <HeroEditor />
        ) : (
          <div className="no-permission">You don't have permission to manage hero section</div>
        );
      case 'carousel':
        return permissions.includes('manage_carousel') ? (
          <CarouselEditor />
        ) : (
          <div className="no-permission">You don't have permission to manage carousel</div>
        );
      case 'payments':
        return permissions.includes('manage_payments') ? (
          <div className="payments-section">
            <h2>Payments Management</h2>
            <p>Payment management functionality will be implemented here.</p>
          </div>
        ) : (
          <div className="no-permission">You don't have permission to manage payments</div>
        );
      case 'users':
        return permissions.includes('manage_users') ? (
          <div className="users-section">
            <h2>Users Management</h2>
            <p>User management functionality will be implemented here.</p>
          </div>
        ) : (
          <div className="no-permission">You don't have permission to manage users</div>
        );
      default:
        return (
          <div className="overview">
            <h2>Welcome, {currentUser?.name}</h2>
            <div className="permissions-overview">
              <h3>Your Permissions</h3>
              <ul>
                {permissions.map((permission, index) => (
                  <li key={index}>{getPermissionLabel(permission)}</li>
                ))}
              </ul>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="subadmin-dashboard">
      <div className="admin-sidebar">
        <h2>Subadmin Dashboard</h2>
        <ul className="admin-nav">
          {permissions.includes('manage_stats') && (
            <li 
              className={activeTab === 'stats' ? 'active' : ''} 
              onClick={() => setActiveTab('stats')}
            >
              Statistics
            </li>
          )}
          {permissions.includes('manage_testimonials') && (
            <li 
              className={activeTab === 'testimonials' ? 'active' : ''} 
              onClick={() => setActiveTab('testimonials')}
            >
              Testimonials
            </li>
          )}
          {permissions.includes('manage_volunteers') && (
            <li 
              className={activeTab === 'volunteers' ? 'active' : ''} 
              onClick={() => setActiveTab('volunteers')}
            >
              Volunteers
            </li>
          )}
          {permissions.includes('manage_programs') && (
            <li 
              className={activeTab === 'programs' ? 'active' : ''} 
              onClick={() => setActiveTab('programs')}
            >
              Programs
            </li>
          )}
          {permissions.includes('manage_events') && (
            <li 
              className={activeTab === 'events' ? 'active' : ''} 
              onClick={() => setActiveTab('events')}
            >
              Events
            </li>
          )}
          {permissions.includes('manage_gallery') && (
            <li 
              className={activeTab === 'gallery' ? 'active' : ''} 
              onClick={() => setActiveTab('gallery')}
            >
              Gallery
            </li>
          )}
          {permissions.includes('manage_blog') && (
            <li 
              className={activeTab === 'blog' ? 'active' : ''} 
              onClick={() => setActiveTab('blog')}
            >
              Blog Posts
            </li>
          )}
          {permissions.includes('manage_donations') && (
            <li 
              className={activeTab === 'donations' ? 'active' : ''} 
              onClick={() => setActiveTab('donations')}
            >
              Donation Cards
            </li>
          )}
          {permissions.includes('manage_hero') && (
            <li 
              className={activeTab === 'hero' ? 'active' : ''} 
              onClick={() => setActiveTab('hero')}
            >
              Hero Section
            </li>
          )}
          {permissions.includes('manage_carousel') && (
            <li 
              className={activeTab === 'carousel' ? 'active' : ''} 
              onClick={() => setActiveTab('carousel')}
            >
              Carousel
            </li>
          )}
          {permissions.includes('manage_payments') && (
            <li 
              className={activeTab === 'payments' ? 'active' : ''} 
              onClick={() => setActiveTab('payments')}
            >
              Payments
            </li>
          )}
          {permissions.includes('manage_users') && (
            <li 
              className={activeTab === 'users' ? 'active' : ''} 
              onClick={() => setActiveTab('users')}
            >
              Users
            </li>
          )}
        </ul>
      </div>
      <div className="admin-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default SubadminDashboard; 