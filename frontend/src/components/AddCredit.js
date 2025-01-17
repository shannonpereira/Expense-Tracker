import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddCredit = () => {
  const [email, setEmail] = useState(''); // Store logged-in user's email
  const [amount, setAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('Bank Transfer'); // Default to "Bank Transfer"
  const [linkedBank, setLinkedBank] = useState(''); // To hold the selected bank
  const [bankAccounts, setBankAccounts] = useState([]); // Initialize as an empty array
  const [error, setError] = useState(null);

  // Simulate getting the logged-in user's email (replace this with actual login logic)
  useEffect(() => {
    // Replace this with actual logic to get the logged-in user's email (e.g., from localStorage, context, or API)
    const loggedInEmail = 'shannon@example.com'; // Use dynamic logic to get the actual logged-in email
    setEmail(loggedInEmail);
  }, []);

  // Fetch user's bank accounts from API
  useEffect(() => {
    if (email) {
      const fetchBankAccounts = async () => {
        try {
          const response = await axios.get(`https://price-tracker-backend-one.vercel.app/users/bank-accounts/${email}`);
          
          console.log('Bank accounts response:', response.data);

          // Check if the response has bank accounts data
          if (response.data && response.data.bankAccounts) {
            const { bankAccounts } = response.data;
            setBankAccounts([
              bankAccounts.primaryBankAccount,
              bankAccounts.secondaryBankAccount,
              bankAccounts.tertiaryBankAccount,
            ]);
            // Set the default bank to the first available bank
            setLinkedBank(bankAccounts.primaryBankAccount);
          } else {
            setError('No bank accounts found');
          }
        } catch (error) {
          console.error('Error fetching bank accounts:', error);
          setError('Failed to fetch bank accounts');
        }
      };

      fetchBankAccounts();
    }
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Debugging: log the current state of form values
    console.log('Submitting form with values:', {
      email,
      amount,
      paymentMode,
      linkedBank,
    });

    // Validate inputs
    if (!amount || !paymentMode || (paymentMode !== 'Cash' && !linkedBank)) {
      setError('Amount, Payment Mode, and Bank details (if applicable) are required');
      console.log('Form validation failed: Missing required fields');
      return;
    }

    const payload = {
      email,
      amount: parseFloat(amount),
      paymentMode,
      linkedBank: paymentMode !== 'Cash' ? linkedBank : undefined, // Only include bank details if not "Cash"
    };

    // Debugging: log the payload that will be sent in the API request
    console.log('Payload to be sent:', payload);

    try {
      const response = await axios.post('https://price-tracker-backend-one.vercel.app/income/add', payload);

      // Debugging: log the response from the API
      console.log('API response:', response);

      // Explicitly handle the 201 status code as success
      if (response.status === 201) {
        alert('Income added successfully!');
        setAmount('');
        setPaymentMode('Bank Transfer'); // Reset to the default payment mode
        setLinkedBank(bankAccounts.length > 0 ? bankAccounts[0] : ''); // Reset to the first bank
      } else {
        setError(`Failed to add income. Status: ${response.status}`);
        console.log('API request failed with status:', response.status);
      }
    } catch (error) {
      console.error('Error adding income:', error);
      setError('Failed to add income. Please try again.');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-orange-500">Add Income</h2>

      {/* Display Logged-in User's Email */}
      <div className="my-4 p-4 border rounded shadow bg-gray-100">
        <h3 className="text-lg font-semibold">Logged in as: {email}</h3>
      </div>

      {/* Display Error Message */}
      {error && <div className="text-red-500">{error}</div>}

      {/* Add Income Form */}
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

        {/* Render bank accounts only if payment mode is not Cash */}
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
    </div>
  );
};

export default AddCredit;
