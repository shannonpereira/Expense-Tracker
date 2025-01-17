import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';  // Assuming you have a CSS file for styling

const Navbar = () => {
  const navigate = useNavigate();  // Initialize useNavigate for logout redirection

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token on logout
    navigate('/login');  // Redirect to login page after logout
  };

  return (
    <nav className="navbar">
      <div className="navbar-links">
        <Link to="/home" className="navbar-logo">
          Expense Tracker
        </Link>
      </div>
      <div className="navbar-buttons">
        <button className="navbar-button" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
