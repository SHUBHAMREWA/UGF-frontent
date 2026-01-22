import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiDollarSign } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import ImageLoader from '../ImageLoader';
import './AdminLogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Use the auth context login function
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Redirect to admin dashboard
        navigate('/admin');
      } else {
        setErrors({ general: result.error || 'Login failed' });
      }
      
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="admin-login">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="logo">
              <div className="logo-icon">
                <FiDollarSign />
              </div>
              <div className="logo-text">
                <h1>United Global Federation India</h1>
                <p>CRM Admin Portal</p>
              </div>
            </div>
          </div>

          <div className="login-body">
            <div className="welcome-section">
              <h2>Welcome Back</h2>
              <p>Sign in to access the admin dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {errors.general && (
                <div className="error-message general">
                  {errors.general}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <div className="input-wrapper">
                  <div className="input-icon">
                    <FiMail />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`neo-input ${errors.email ? 'error' : ''}`}
                    placeholder="Enter your email"
                    disabled={loading}
                  />
                </div>
                {errors.email && (
                  <div className="error-message">
                    {errors.email}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="input-wrapper">
                  <div className="input-icon">
                    <FiLock />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`neo-input ${errors.password ? 'error' : ''}`}
                    placeholder="Enter your password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={togglePasswordVisibility}
                    disabled={loading}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.password && (
                  <div className="error-message">
                    {errors.password}
                  </div>
                )}
              </div>

              <div className="form-options">
                <label className="checkbox-wrapper">
                  <input type="checkbox" />
                  <span className="checkbox-label">Remember me</span>
                </label>
                <button type="button" className="forgot-password">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className={`neo-btn neo-btn--primary login-btn ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ImageLoader size={18} />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>

          <div className="login-footer">
            <p>
              Need help? Contact{' '}
              <a href="mailto:support@sntrust.org">support@sntrust.org</a>
            </p>
          </div>
        </div>

        <div className="login-info">
          <div className="info-card">
            <h3>Secure Admin Access</h3>
            <p>
              Access your organization's donation management system with secure authentication.
            </p>
            <ul className="feature-list">
              <li>Real-time donation tracking</li>
              <li>Comprehensive reporting</li>
              <li>Receipt management</li>
              <li>Donor relationship tools</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
