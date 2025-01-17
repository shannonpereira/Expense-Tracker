import React, { useState, useEffect } from 'react';
import ExpenseList from '../components/expenseList'; // Your ExpenseList component
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link for navigation

const Home = () => {
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);

  // Fetch expenses on component mount
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get('https://price-tracker-backend-one.vercel.app/transactions');
        setExpenses(response.data);
        const totalAmount = response.data.reduce((sum, expense) => sum + expense.amount, 0);
        setTotal(totalAmount);
      } catch (err) {
        console.error('Error fetching expenses:', err);
      }
    };

    fetchExpenses();
  }, []);

  // Logout handler
  const handleLogout = () => {
    // Remove token from localStorage and redirect to login page
    localStorage.removeItem('token');
    window.location.href = '/login'; // Redirect after logout
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/home">Home</Link>
          <Link to="/addexpense">Expense Tracker</Link>
        </div>
        <div className="navbar-right">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* Content */}
      <div className="content">
        <h2>Welcome to the Expense Tracker</h2>
        <h3>Total Expenses: ${total}</h3>
        <ExpenseList expenses={expenses} />  {/* Pass expenses to ExpenseList component */}
      </div>
    </div>
  );
};

export default Home;
