import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext'; // Import the context
import { toast, ToastContainer } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import the default Toastify styles

const AddCredit = () => {
  const { userEmail } = useAuth(); // Use the email from context
  const [amount, setAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [linkedBank, setLinkedBank] = useState('');
  const [totalCredits, setTotalCredits] = useState(0);
  const [bankAccounts, setBankAccounts] = useState([]); // Initialize as an empty array
  const [error, setError] = useState(null);

  useEffect(() => {
    // Replace this with actual logic to get the logged-in user's email (e.g., from localStorage, context, or API)
    const loggedInEmail = 'shannon@example.com'; // Use dynamic logic to get the actual logged-in email
    setEmail(loggedInEmail);
  }, []);

  // Fetch total credits for the logged-in user
  useEffect(() => {
    if (email) {
      const fetchTotalCredits = async () => {
        try {
          const response = await axios.get(`https://price-tracker-backend-one.vercel.app/transactions/${email}`, {
            params: { email },
          });

          if (response.data && response.data.total !== undefined) {
            setTotalCredits(response.data.total || 0);
          } else {
            setError('Failed to fetch total credits');
          }
        } catch (error) {
          console.error('Error fetching total credits:', error);
          setError('An error occurred while fetching total credits');
        }
      };

      fetchTotalCredits();
    }
  }, [email]);

  // Fetch user's bank accounts from API
  useEffect(() => {
    if (email) {
      const fetchBankAccounts = async () => {
        try {
          const response = await axios.get(`https://price-tracker-backend-one.vercel.app/users/bank-accounts/${email}`);
          
          // Limit to the first 5 banks (or set a custom limit as per your need)
          const limitedBanks = response.data.slice(0, 5); 

          if (Array.isArray(limitedBanks)) {
            setBankAccounts(limitedBanks);
          } else {
            setError('No bank accounts found');
          }
        } catch (error) {
          setError('Failed to fetch bank accounts');
        }
      };

      fetchBankAccounts();
    }
  }, [userEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !paymentMode || (paymentMode !== 'Cash' && !linkedBank)) {
      setError('Amount, Payment Mode, and Bank details (if applicable) are required');
      console.log('Form validation failed: Missing required fields');
      return;
    }

    const payload = {
      email: userEmail,
      amount: parseFloat(amount),
      paymentMode,
      linkedBank: paymentMode !== 'Cash' ? linkedBank : undefined,
    };

    try {
      const response = await axios.post('https://price-tracker-backend-one.vercel.app/transactions/add', payload);

      if (response.status === 200) {
        alert('Credit added successfully!');
        setTotalCredits((prev) => prev + parseFloat(amount)); // Update total credits locally
        setAmount('');
        setPaymentMode('');
        setLinkedBank('');
      } else {
        setError('Failed to add credit');
      }
    } catch (error) {
      console.error('Error adding credit:', error);
      setError('Failed to add credit. Please try again.');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-orange-500">Add Income</h2>

      {/* Display Logged-in User's Email */}
      <div className="my-4 p-4 border rounded shadow bg-gray-100">
        <h3 className="text-lg font-semibold">Logged in as: {email}</h3>
      </div>

      {/* Display Total Credits */}
      <div className="my-4 p-4 border rounded shadow bg-gray-100">
        <h3 className="text-lg font-semibold">Total Credits: ₹{totalCredits}</h3>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      {/* Add Credit Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 my-2 rounded w-full"
        />
        
        <select
          value={paymentMode}
          onChange={(e) => setPaymentMode(e.target.value)}
          className="border p-2 my-2 rounded w-full"
        >
          <option value="">Select Payment Mode</option>
          <option value="Cash">Cash</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Cheque">Cheque</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Other">Other</option>
        </select>

        {paymentMode !== 'Cash' && (
          <select
            value={linkedBank}
            onChange={(e) => setLinkedBank(e.target.value)}
            className="border p-2 my-2 rounded w-full"
          >
            <option value="">Select Bank</option>
            {bankAccounts.length > 0 ? (
              bankAccounts.map((bank, index) => (
                <option key={index} value={bank}>
                  {bank}
                </option>
              ))
            ) : (
              <option value="">No banks available</option>
            )}
          </select>
        )}

        <button
          type="submit"
          className="bg-orange-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200"
        >
          Add Income
        </button>
      </form>

      <ToastContainer /> {/* Display toast notifications */}
    </div>
  );
};

export default AddCredit;
