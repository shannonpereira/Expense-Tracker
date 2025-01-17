import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the localStorage or any user data
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    
    // Redirect to login page after logout
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center shadow-md">
      <h1 className="text-orange-500 text-2xl font-semibold">Expense Tracker</h1>
      <button
        onClick={handleLogout}
        className="bg-orange-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
