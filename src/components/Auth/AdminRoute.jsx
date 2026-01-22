import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ImageLoader from '../ImageLoader';

const AdminRoute = ({ children }) => {
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
  
  // Check if user has admin role
  if (currentUser.role !== 'admin') {
    return <Navigate to="/access-denied" />;
  }
  
  // Render children if user is admin
  return children;
};

export default AdminRoute;
