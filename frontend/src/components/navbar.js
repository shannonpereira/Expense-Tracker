import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; // Import ToastContainer along with toast
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for the toast notifications

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the localStorage or any user data
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    
    // Show toast notification for successful logout
    toast.success('Logged out successfully!', {
      position: "top-right", // Position of the toast
      autoClose: 3000, // Time before it disappears (in ms)
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
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

      {/* ToastContainer to show toast notifications */}
      <ToastContainer />
    </nav>
  );
};

export default Navbar;
