import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication
    const checkAuth = async () => {
      try {
        // Check if user is already logged in (from localStorage)
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (token && storedUser) {
          // Verify token is still valid by fetching current user
          try {
            // Add timeout to prevent hanging
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Auth check timeout')), 5000)
            );
            
            const userData = await Promise.race([
              authService.getCurrentUser(),
              timeoutPromise
            ]);
            
            if (userData) {
              setUser(userData);
            } else {
              // Token is invalid, clear storage
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setUser(null);
            }
          } catch (error) {
            console.warn('⚠️ Auth verification skipped:', error.message);
            // Don't clear token on timeout/network error - use cached user
            try {
              const cachedUser = JSON.parse(storedUser);
              setUser(cachedUser);
            } catch {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setUser(null);
            }
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      console.log('🔑 AuthContext - Login called with:', { email, password: password ? '***' : 'MISSING' });
      
      // Use the real API service for login
      const response = await authService.login({ email, password });
      console.log('📡 AuthContext - API response:', response);
      
      if (response.token) {
        // Store token in localStorage
        localStorage.setItem('token', response.token);
        
        // Get user data after successful login
        const userData = await authService.getCurrentUser();
        
        if (userData) {
          // Update state immediately
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          
          return { success: true, user: userData };
        } else {
          return { success: false, error: 'Failed to fetch user data' };
        }
      } else {
        return { success: false, error: 'Login failed' };
      }
      
    } catch (error) {
      console.error('Login failed:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Use the real API service for logout
      authService.logout();
      
      setUser(null);
      // Remove user and token from localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return { success: true };
    } catch (error) {
      console.error('Logout failed:', error);
      return { success: false, error: error.message };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      // Use the real API service for profile update
      const response = await authService.updateProfile(profileData);
      
      const updatedUser = { ...user, ...response };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Profile update failed:', error);
      return { success: false, error: error.message };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { success: true };
    } catch (error) {
      console.error('Password change failed:', error);
      return { success: false, error: error.message };
    }
  };

  const hasRole = (role) => {
    // Check both the roles array and the role field for compatibility
    return user && (
      (user.roles && user.roles.includes(role)) || 
      (user.role === role) ||
      (user.role === 'admin' && ['ADMIN', 'ACCOUNTANT', 'VIEWER'].includes(role))
    );
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    
    // Handle both old and new user data structures
    const userRoles = user.roles || [];
    const userRole = user.role;
    
    switch (permission) {
      case 'VIEW':
        return userRoles.some(role => ['VIEWER', 'ACCOUNTANT', 'ADMIN'].includes(role)) || 
               userRole === 'admin' || userRole === 'user';
      case 'EDIT':
        return userRoles.some(role => ['ACCOUNTANT', 'ADMIN'].includes(role)) || 
               userRole === 'admin';
      case 'MANAGE_USERS':
        return userRoles.includes('ADMIN') || userRole === 'admin';
      default:
        return false;
    }
  };

  const updateUserState = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('user');
    }
  };

  const value = {
    user,
    currentUser: user, // Add alias for compatibility
    loading,
    login,
    logout,
    updateProfile,
    changePassword,
    hasRole,
    hasPermission,
    updateUserState // Export function to update user state from components
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;