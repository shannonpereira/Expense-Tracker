import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner'; // Import toast from Sonner

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the localStorage or any user data
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.setItem('userEmail', null); // Set userEmail to null on logout
    
    // Show toast notification for successful logout
    toast.success('Logged out successfully!', {
      position: 'top-center',
      duration: 3000,
    });

    // Redirect to login page after logout
    navigate('/login');
  };

  const navigateToDashboard = () => {
    navigate('/home');
  };

  const navigateToAddDebit = () => {
    navigate('/add-debit');
  };

  const navigateToAddCredit = () => {
    navigate('/add-credit');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle menu visibility
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo and Title */}
          <div
            className="text-white font-bold text-xl cursor-pointer"
            onClick={navigateToDashboard}
          >
            <span className="text-orange-300">Expense</span> Tracker
          </div>

          {/* Hamburger Icon for Mobile */}
          <div className="sm:hidden">
            <button
              className="text-white text-2xl"
              onClick={toggleMenu}
            >
              {isMenuOpen ? 'X' : '☰'} {/* Hamburger icon or close icon */}
            </button>
          </div>

          {/* Navigation Links */}
          <div className={`sm:flex space-x-6 ${isMenuOpen ? 'block' : 'hidden'} sm:block`}>
            {/* Mobile Dropdown Menu Items */}
            <div className="sm:hidden flex flex-col items-center space-y-4 bg-white shadow-md rounded-md p-4 absolute top-16 right-4 z-10 w-40">
              <button
                onClick={navigateToDashboard}
                className="text-black text-lg hover:text-orange-300 w-full text-center py-2 rounded-md transition-colors duration-300"
              >
                Dashboard
              </button>
              <button
                onClick={navigateToAddDebit}
                className="text-black text-lg hover:text-orange-300 w-full text-center py-2 rounded-md transition-colors duration-300"
              >
                Add Debit
              </button>
              <button
                onClick={navigateToAddCredit}
                className="text-black text-lg hover:text-orange-300 w-full text-center py-2 rounded-md transition-colors duration-300"
              >
                Add Credit
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden sm:flex space-x-6">
              <button
                onClick={navigateToDashboard}
                className="text-white text-lg hover:text-orange-500 transition-colors duration-300"
              >
                Dashboard
              </button>
              <button
                onClick={navigateToAddDebit}
                className="text-white text-lg hover:text-orange-500 transition-colors duration-300"
              >
                Add Debit
              </button>
              <button
                onClick={navigateToAddCredit}
                className="text-white text-lg hover:text-orange-500 transition-colors duration-300"
              >
                Add Credit
              </button>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-transparent text-white px-6 py-2 rounded-lg font-semibold hover:text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300"
          >
            Logout
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
