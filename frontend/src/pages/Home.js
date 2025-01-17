import React from 'react';
import Navbar from '../components/navbar'; // Import the Navbar component

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar /> {/* Add Navbar here */}
      <div className="p-8 text-center">
        <h2 className="text-3xl text-white">Welcome to the Expense Tracker</h2>
        <p className="text-gray-400 mt-4">Manage your expenses efficiently!</p>
      </div>
    </div>
  );
};

export default HomePage;
