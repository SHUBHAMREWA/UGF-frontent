import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './SubadminManagement.css';
import api from '../../utils/api';

const SubadminManagement = () => {
  const { currentUser } = useAuth();
  const [subadmins, setSubadmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    password: '',
    permissions: []
  });

  const availablePermissions = [
    {
      key: 'manage_hero',
      label: 'Manage Hero Section',
      description: 'Edit homepage hero content and banners'
    },
    {
      key: 'manage_stats',
      label: 'Manage Statistics',
      description: 'Update impact statistics and numbers'
    },
    {
      key: 'manage_testimonials',
      label: 'Manage Testimonials',
      description: 'Add, edit, and remove testimonials'
    },
    {
      key: 'manage_volunteers',
      label: 'Manage Volunteers',
      description: 'Approve, reject, and manage volunteer applications'
    },
    {
      key: 'manage_programs',
      label: 'Manage Programs',
      description: 'Create and edit program information'
    },
    {
      key: 'manage_events',
      label: 'Manage Events',
      description: 'Create and edit events and activities'
    },
    {
      key: 'manage_gallery',
      label: 'Manage Gallery',
      description: 'Upload and manage gallery images'
    },
    {
      key: 'manage_carousel',
      label: 'Manage Carousel',
      description: 'Manage homepage carousel images'
    },
    {
      key: 'manage_blog',
      label: 'Manage Blog Posts',
      description: 'Create and edit blog articles'
    },
    {
      key: 'manage_donations',
      label: 'Manage Donation Cards',
      description: 'Create and edit donation campaigns'
    },
    {
      key: 'manage_payments',
      label: 'Manage Payments',
      description: 'View and manage payment records'
    },
    {
      key: 'manage_users',
      label: 'Manage Users',
      description: 'View and manage user accounts'
    },
    {
      key: 'view_reports',
      label: 'View Reports',
      description: 'Access analytics and reports'
    },
    {
      key: 'manage_subadmins',
      label: 'Manage Subadmins',
      description: 'Create and manage other subadmin accounts'
    }
  ];

  useEffect(() => {
    fetchSubadmins();
  }, []);

  const fetchSubadmins = async () => {
    try {
      const response = await api.get('/users/subadmins');
      // Ensure we always set an array, even if the response is unexpected
      if (Array.isArray(response.data)) {
        setSubadmins(response.data);
      } else if (response.data && Array.isArray(response.data.subadmins)) {
        setSubadmins(response.data.subadmins);
      } else {
        setSubadmins([]);
      }
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch subadmins');
      setSubadmins([]);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePermissionChange = (permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const handleSelectAll = () => {
    setFormData(prev => ({
      ...prev,
      permissions: availablePermissions.map(p => p.key)
    }));
  };

  const handleClearAll = () => {
    setFormData(prev => ({
      ...prev,
      permissions: []
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users/subadmin', formData);
      setShowAddForm(false);
      setFormData({
        name: '',
        email: '',
        mobileNumber: '',
        password: '',
        permissions: []
      });
      fetchSubadmins();
    } catch (error) {
      setError('Failed to create subadmin');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/users/subadmin/${id}`, { status: newStatus });
      fetchSubadmins();
    } catch (error) {
      setError('Failed to update subadmin status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subadmin?')) {
      try {
        await api.delete(`/users/subadmin/${id}`);
        fetchSubadmins();
      } catch (error) {
        setError('Failed to delete subadmin');
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="subadmin-management">
      <div className="subadmin-header">
        <h2>Subadmin Management</h2>
        <button 
          className="add-button"
          onClick={() => setShowAddForm(true)}
        >
          Add Subadmin
        </button>
      </div>

      {showAddForm && (
        <div className="add-subadmin-form">
          <h3>Add New Subadmin</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Mobile Number:</label>
              <input
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Permissions:</label>
              <div className="permissions-actions">
                <button 
                  type="button" 
                  className="select-all-btn"
                  onClick={handleSelectAll}
                >
                  Select All
                </button>
                <button 
                  type="button" 
                  className="clear-all-btn"
                  onClick={handleClearAll}
                >
                  Clear All
                </button>
              </div>
              <div className="permissions-grid">
                {availablePermissions.map(permission => (
                  <label key={permission.key} className="permission-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.permissions.includes(permission.key)}
                      onChange={() => handlePermissionChange(permission.key)}
                    />
                    <div className="permission-content">
                      <div className="permission-title">{permission.label}</div>
                      <div className="permission-description">{permission.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-button">Create Subadmin</button>
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="subadmins-list">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Permissions</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(subadmins) ? subadmins.map(subadmin => (
              <tr key={subadmin?._id}>
                <td>{subadmin?.name}</td>
                <td>{subadmin?.email}</td>
                <td>{subadmin?.mobileNumber}</td>
                <td>
                  <div className="permissions-list">
                    {Array.isArray(subadmin?.permissions) ? subadmin.permissions.map(permission => {
                      const permissionInfo = availablePermissions.find(p => p.key === permission);
                      return (
                        <span key={permission} className="permission-tag">
                          {permissionInfo ? permissionInfo.label : permission.replace('_', ' ')}
                        </span>
                      );
                    }) : <span>No permissions</span>}
                  </div>
                </td>
                <td>
                  <select
                    value={subadmin?.status}
                    onChange={(e) => handleStatusChange(subadmin?._id, e.target.value)}
                    className={`status-select ${subadmin?.status}`}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </td>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(subadmin?._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )) : <tr><td colSpan="6">No subadmins found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubadminManagement; 