import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExpenseForm from './expenseForm'; // Import the ExpenseForm component

const ExpenseList = ({ expenses }) => {
  const [showForm, setShowForm] = useState(false);  // To toggle the form display

  // Optionally, fetch the list of transactions if you are using this component separately
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get('https://price-tracker-backend-one.vercel.app/transactions');
        console.log(response.data);  // Optional log for the fetched expenses
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    fetchExpenses();
  }, []);

  return (
    <div>
      <h2>Expense List</h2>
      <button onClick={() => setShowForm(!showForm)}>Add New Transaction</button>

      {/* Conditionally show the form to add a new transaction */}
      {showForm && <ExpenseForm />}
      
      <ul>
        {expenses.map((expense, index) => (
          <li key={index}>
            <div>
              <strong>{expense.spentAt}</strong> - ${expense.amount} - {expense.paymentMode} - {expense.bank}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseList;
