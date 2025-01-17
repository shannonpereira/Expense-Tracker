import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext'; // Import the context

const AddDebit = () => {
  const { userEmail } = useAuth(); // Use the email from context
  const [amount, setAmount] = useState('');
  const [spentAt, setSpentAt] = useState(''); // Spent At (description) field
  const [paymentMode, setPaymentMode] = useState('Debit'); // Default payment mode set to 'Debit'
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
            setLinkedBank(bankAccounts.primaryBankAccount); // Set default bank
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

    if (!amount || !spentAt || !paymentMode || (paymentMode !== 'Cash' && !linkedBank)) {
      setError('Amount, Spent At, Payment Mode, and Bank details (if applicable) are required');
      return;
    }

    // Prepare the payload
    const payload = {
      email: userEmail,
      amount: parseFloat(amount),
      spentAt,
      paymentMode,
    };

    // Include 'bank' in the payload only if payment mode is not 'Cash'
    if (paymentMode !== 'Cash') {
      if (!linkedBank) {
        setError('Please select a bank account for non-cash payments.');
        return;
      }
      payload.bank = linkedBank;
    }

    try {
      const response = await axios.post('https://price-tracker-backend-one.vercel.app/transactions/add', payload); // Changed URL for debit

      if (response.status === 201) {
        alert('Debit added successfully!');
        setAmount('');
        setSpentAt('');
        setPaymentMode('Debit');
        setLinkedBank(bankAccounts.length > 0 ? bankAccounts[0] : '');
        setError(null); // Reset error message on successful submission
      } else {
        setError(`Failed to add debit. Status: ${response.status}`);
      }
    } catch (error) {
      setError('Failed to add debit. Please try again.');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-orange-500">Add Debit</h2>

      {/* Display Logged-in User's Email */}
      <div className="my-4 p-4 border rounded shadow bg-gray-100">
        <h3 className="text-lg font-semibold">Logged in as: {userEmail}</h3>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 my-2 rounded w-full"
        />

        <input
          type="text"
          placeholder="Spent At (Description)"
          value={spentAt}
          onChange={(e) => setSpentAt(e.target.value)}
          className="border p-2 my-2 rounded w-full"
        />
        
        <select
          value={paymentMode}
          onChange={(e) => setPaymentMode(e.target.value)}
          className="border p-2 my-2 rounded w-full"
        >
          <option value="Debit">Debit</option>
          <option value="Cash">Cash</option>
          <option value="Credit">Credit</option>
          <option value="UPI">UPI</option>
          <option value="NetBanking">NetBanking</option>
        </select>

        {paymentMode !== 'Cash' && bankAccounts.length > 0 && (
          <select
            value={linkedBank}
            onChange={(e) => setLinkedBank(e.target.value)}
            className="border p-2 my-2 rounded w-full"
          >
            <option value="">Select Bank</option>
            {bankAccounts.map((bank, index) => (
              <option key={index} value={bank}>
                {bank}
              </option>
            ))}
          </select>
        )}

        <button
          type="submit"
          className="bg-orange-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200"
        >
          Add Debit
        </button>
      </form>
    </div>
  );
};

export default AddDebit;
