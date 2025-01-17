import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext'; // Import the context
import { toast } from 'sonner'; // Import Sonner

const AddCredit = () => {
  const { userEmail } = useAuth(); // Use the email from context
  const [amount, setAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('Bank Transfer');
  const [linkedBank, setLinkedBank] = useState('');
  const [bankAccounts, setBankAccounts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userEmail) {
      const fetchBankAccounts = async () => {
        try {
          const response = await axios.get(`https://price-tracker-backend-one.vercel.app/users/bank-accounts/${userEmail}`);
          
          if (response.data && response.data.bankAccounts) {
            const { bankAccounts } = response.data;
            setBankAccounts([bankAccounts.primaryBankAccount, bankAccounts.secondaryBankAccount, bankAccounts.tertiaryBankAccount]);
            setLinkedBank(bankAccounts.primaryBankAccount);
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
      return;
    }

    const payload = {
      email: userEmail,
      amount: parseFloat(amount),
      paymentMode,
      linkedBank: paymentMode !== 'Cash' ? linkedBank : undefined,
    };

    try {
      const response = await axios.post('https://price-tracker-backend-one.vercel.app/income/add', payload);

      if (response.status === 201) {
        toast.success('Income added successfully!');
        
        setAmount('');
        setPaymentMode('Bank Transfer');
        setLinkedBank(bankAccounts.length > 0 ? bankAccounts[0] : '');
      } else {
        setError(`Failed to add income. Status: ${response.status}`);
        toast.error('Failed to add income. Please try again.');
      }
    } catch (error) {
      setError('Failed to add income. Please try again.');
      toast.error('Failed to add income. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="w-full max-w-lg p-8 bg-gray-800 text-white rounded-lg shadow-2xl transform transition duration-300 hover:scale-105 hover:shadow-xl">
        <h2 className="text-2xl font-semibold text-orange-500 mb-6">Add Income</h2>

        {/* Display Logged-in User's Email */}
        <div className="mb-4 p-4 border border-gray-700 rounded shadow bg-gray-700">
          <h3 className="text-lg font-semibold">Logged in as: {userEmail}</h3>
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border border-gray-600 p-2 my-2 rounded w-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <select
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
            className="border border-gray-600 p-2 my-2 rounded w-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
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
              className="border border-gray-600 p-2 my-2 rounded w-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
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
            className="bg-orange-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 w-full mt-4"
          >
            Add Income
          </button>
        </form>
      </div>
      
    </div>
  );
};

export default AddCredit;
