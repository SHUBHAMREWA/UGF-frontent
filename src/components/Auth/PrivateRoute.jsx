import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ImageLoader from '../ImageLoader';

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  // Robust check: context user or cached user in localStorage
  const storedUser = localStorage.getItem('user');
  const isAuthenticated = currentUser || (storedUser && storedUser !== 'undefined');

  // Show loading state while checking authentication IF no cached user found
  if (loading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <ImageLoader size={120} text="Loading configuration..." />
      </div>
    );
  }
  
  // Redirect to login if not authenticated (checked context and storage)
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Render children if authenticated
  return children;
};

export default PrivateRoute; 