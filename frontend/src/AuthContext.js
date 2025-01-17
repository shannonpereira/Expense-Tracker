// authContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext); // Returns current user data
};

export const AuthProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || null); // Retrieve from localStorage if available

  const login = (email) => {
    setUserEmail(email); // Update state with logged-in user's email
    localStorage.setItem('userEmail', email); // Optionally store email in localStorage
  };

  const logout = () => {
    setUserEmail(null); // Clear user data on logout
    localStorage.removeItem('userEmail'); // Clear from localStorage
  };

  return (
    <AuthContext.Provider value={{ userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
