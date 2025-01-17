import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // Check if userEmail is present in localStorage
  const userEmail = localStorage.getItem('userEmail');

  // If userEmail is null or doesn't exist, redirect to login
  if (!userEmail || userEmail === 'null') {
    return <Navigate to="/login" />;
  }

  // Otherwise, allow access to the requested route
  return children;
};

export default PrivateRoute;
