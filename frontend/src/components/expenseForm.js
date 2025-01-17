import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExpenseForm = () => {
  const [email, setEmail] = useState(localStorage.getItem('email') || '');  // Get email from localStorage
  const [amount, setAmount] = useState('');
  const [spentAt, setSpentAt] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [bank, setBank] = useState('');
  const [banks, setBanks] = useState([]);  // To store list of available banks
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch the bank accounts data from the API (this would be based on the logged-in email)
    const fetchBanks = async () => {
      try {
        const bankAccountUrl = `https://price-tracker-backend-one.vercel.app/users/bank-accounts/${email}`;
        const response = await axios.get(bankAccountUrl);
        setBanks(response.data);  // Set the list of banks from the response
      } catch (err) {
        console.error('Error fetching bank accounts:', err);
        setError('Failed to load banks. Please try again.');
      }
      
    };

    if (email) {
      fetchBanks();
    }
  }, [email]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || !spentAt || !paymentMode) {
      setError('Please fill in all the required fields.');
      return;
    }

    const expenseData = {
      email,
      amount,
      spentAt,
      paymentMode,
      bank: paymentMode === 'Cash' ? '' : bank,  // Only include bank if paymentMode is not Cash
    };

    try {
      // Send the expense data to your backend API
      const response = await axios.post('https://price-tracker-backend-one.vercel.app/transactions/add', expenseData);
      console.log('Expense added:', response.data);
      // Handle success (e.g., reset form, show success message)
      setAmount('');
      setSpentAt('');
      setPaymentMode('Cash');
      setBank('');
      setError('');
      alert('Expense added successfully!');
    } catch (err) {
      console.error('Error adding expense:', err);
      setError('Failed to add expense. Please try again.');
    }
  };

  return (
    <div className="expense-form-container">
      <h2>Add Expense</h2>
      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            disabled  // Email is auto-filled and not editable
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Spent At:</label>
          <input
            type="text"
            value={spentAt}
            onChange={(e) => setSpentAt(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Payment Mode:</label>
          <select
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
            required
          >
            <option value="Cash">Cash</option>
            <option value="Credit">Credit</option>
            <option value="Debit">Debit</option>
            <option value="UPI">UPI</option>
            <option value="NetBanking">NetBanking</option>
          </select>
        </div>

        {paymentMode !== 'Cash' && (
          <div className="form-group">
            <label>Bank:</label>
            <select
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              required={paymentMode !== 'Cash'}
            >
              <option value="">Select Bank</option>
              {banks.map((bankItem) => (
                <option key={bankItem.id} value={bankItem.name}>
                  {bankItem.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <button type="submit">Add Expense</button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
