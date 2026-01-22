import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ImageLoader from '../ImageLoader';

/**
 * Higher-Order Component (HOC) that provides admin access control
 * Wraps admin components to ensure only admin users can access them
 */
const withAdminAccess = (WrappedComponent) => {
  const WithAdminAccess = (props) => {
    const { currentUser, loading } = useAuth();

    // Show loading state while checking authentication
    if (loading) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <ImageLoader size={120} text="Loading..." />
        </div>
      );
    }

    // Redirect to login if not authenticated
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    // Redirect to access denied if not admin
    if (currentUser.role !== 'admin') {
      return <Navigate to="/access-denied" />;
    }

    // Render the wrapped component if user is admin
    return <WrappedComponent {...props} />;
  };

  // Set display name for debugging
  WithAdminAccess.displayName = `withAdminAccess(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithAdminAccess;
};

export default withAdminAccess;
