// privateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  // If the user is not logged in, redirect to login page
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
