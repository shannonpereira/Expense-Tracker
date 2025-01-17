import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.setItem('userEmail', null);

    toast.success('Logged out successfully!', {
      position: 'top-center',
      duration: 3000,
    });

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
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav className="bg-gray-900 p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo and Title */}
          <div
            className="text-white font-bold text-xl cursor-pointer"
            onClick={navigateToDashboard}
          >
            Expense Tracker
          </div>

          {/* Hamburger Icon for Mobile */}
          <div className="sm:hidden">
            <button
              className="text-white text-2xl"
              onClick={toggleMenu}
            >
              {isMenuOpen ? 'X' : '☰'}
            </button>
          </div>

          {/* Navigation Links */}
          <div className={`sm:flex space-x-6 ${isMenuOpen ? 'block' : 'hidden'} sm:block`}>
            {/* Mobile Dropdown Menu Items */}
            <div className="sm:hidden flex flex-col items-center space-y-4 bg-gray-800 shadow-md rounded-md p-4 absolute top-16 right-4 z-10 w-40">
              <button
                onClick={navigateToDashboard}
                className="text-gray-300 text-lg w-full text-center py-2 rounded-md hover:text-white transition-colors duration-300"
              >
                Dashboard
              </button>
              <button
                onClick={navigateToAddDebit}
                className="text-gray-300 text-lg w-full text-center py-2 rounded-md hover:text-white transition-colors duration-300"
              >
                Add Debit
              </button>
              <button
                onClick={navigateToAddCredit}
                className="text-gray-300 text-lg w-full text-center py-2 rounded-md hover:text-white transition-colors duration-300"
              >
                Add Credit
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden sm:flex space-x-6">
              <button
                onClick={navigateToDashboard}
                className="text-gray-300 text-lg hover:text-white transition-colors duration-300"
              >
                Dashboard
              </button>
              <button
                onClick={navigateToAddDebit}
                className="text-gray-300 text-lg hover:text-white transition-colors duration-300"
              >
                Add Debit
              </button>
              <button
                onClick={navigateToAddCredit}
                className="text-gray-300 text-lg hover:text-white transition-colors duration-300"
              >
                Add Credit
              </button>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300"
          >
            Logout
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
