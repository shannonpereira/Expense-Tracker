// privateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import useAuth hook

const PrivateRoute = ({ children }) => {
  const { userEmail } = useAuth(); // Check if user is authenticated

  if (!userEmail) {
    // Redirect to login page if no userEmail (unauthenticated)
    return <Navigate to="/login" />;
  }

  return children; // Render the protected route if user is authenticated
};

export default PrivateRoute;
