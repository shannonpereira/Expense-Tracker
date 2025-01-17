// authContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext); // Returns current user data (email)
};

export const AuthProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || null); // Retrieve email from localStorage if available

  const login = (email) => {
    setUserEmail(email); // Update state with logged-in user's email
  };

  const logout = () => {
    setUserEmail(null); // Clear user data on logout
    localStorage.removeItem('userEmail'); // Clear email from localStorage
    localStorage.removeItem('token'); // Optionally clear other data
    localStorage.removeItem('userId'); // Optionally clear other data
  };

  return (
    <AuthContext.Provider value={{ userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
