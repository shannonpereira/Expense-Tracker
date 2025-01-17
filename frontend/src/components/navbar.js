import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner'; // Import toast from Sonner
import { Toaster } from 'sonner'; // Import Toaster component from Sonner

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the localStorage or any user data
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    
    // Show toast notification for successful logout
    toast.success('Logged out successfully!', {
      // Success toast will be green by default
      position: 'top-center',
      duration: 3000,
    });

    // You can show another notification here if you want
    // Example of another notification (you can customize it)
    toast.info('We hope to see you again soon!', {
      position: 'top-center',
      duration: 3000,
    });

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
    <>
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

        {/* Logout Button moved to the extreme right */}
        <button
          onClick={handleLogout}
          className="bg-orange-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 ml-auto"
        >
          Logout
        </button>
      </nav>

      {/* Add Sonner's Toaster component at a high level */}
      <Toaster position="top-center" />
    </>
  );
};

export default Navbar;
