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

  const navigateToDashboard = () => {
    navigate('/home'); // Navigate to the Dashboard (Home Page)
  };

  const navigateToAddDebit = () => {
    navigate('/add-debit'); // Navigate to Add Debit page
  };

  const navigateToAddCredit = () => {
    navigate('/add-credit'); // Navigate to Add Credit page
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center shadow-md">
      
      
      {/* Navigation Buttons */}
      <div className="space-x-4">
        <button
          onClick={navigateToDashboard}
          className="bg-orange-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200"
        >
          Dashboard
        </button>
        <button
          onClick={navigateToAddDebit}
          className="bg-orange-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200"
        >
          Add Debit
        </button>
        <button
          onClick={navigateToAddCredit}
          className="bg-orange-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200"
        >
          Add Credit
        </button>
      </div>

      {/* Logout Button */}
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
