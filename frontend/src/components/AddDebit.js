import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { Toaster, toast } from 'sonner'; // Importing Sonner for notifications

const AddDebit = () => {
  const { userEmail } = useAuth();
  const [amount, setAmount] = useState('');
  const [spentAt, setSpentAt] = useState('');
  const [paymentMode, setPaymentMode] = useState('Debit');
  const [linkedBank, setLinkedBank] = useState('');
  const [bankAccounts, setBankAccounts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userEmail) {
      const fetchBankAccounts = async () => {
        try {
          const response = await axios.get(
            `https://price-tracker-backend-one.vercel.app/users/bank-accounts/${userEmail}`
          );
          if (response.data && response.data.bankAccounts) {
            const { bankAccounts } = response.data;
            setBankAccounts([
              bankAccounts.primaryBankAccount,
              bankAccounts.secondaryBankAccount,
              bankAccounts.tertiaryBankAccount,
            ]);
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

    if (!amount || !spentAt || !paymentMode || (paymentMode !== 'Cash' && !linkedBank)) {
      setError('Amount, Spent At, Payment Mode, and Bank details (if applicable) are required');
      return;
    }

    const payload = {
      email: userEmail,
      amount: parseFloat(amount),
      spentAt,
      paymentMode,
    };

    if (paymentMode !== 'Cash') {
      if (!linkedBank) {
        setError('Please select a bank account for non-cash payments.');
        return;
      }
      payload.bank = linkedBank;
    }

    try {
      const response = await axios.post(
        'https://price-tracker-backend-one.vercel.app/transactions/add',
        payload
      );

      if (response.status === 201) {
        toast.success('Debit added successfully!');
        setAmount('');
        setSpentAt('');
        setPaymentMode('Debit');
        setLinkedBank(bankAccounts.length > 0 ? bankAccounts[0] : '');
        setError(null);
      } else {
        toast.error(`Failed to add debit. Status: ${response.status}`);
      }
    } catch (error) {
      toast.error('Failed to add debit. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <Toaster position="top-center" />
      <div className="w-full max-w-md p-6 bg-gray-800 text-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-orange-500 text-center mb-4">Add Debit</h2>

        <div className="my-4 p-4 border rounded bg-gray-700 text-gray-300">
          <h3 className="text-lg font-semibold text-center">Logged in as: {userEmail}</h3>
        </div>

        {error && <div className="text-red-400 text-center mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-gray-600 bg-gray-700 text-white p-2 my-2 rounded"
          />

          <input
            type="text"
            placeholder="Spent At (Description)"
            value={spentAt}
            onChange={(e) => setSpentAt(e.target.value)}
            className="w-full border border-gray-600 bg-gray-700 text-white p-2 my-2 rounded"
          />

          <select
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
            className="w-full border border-gray-600 bg-gray-700 text-white p-2 my-2 rounded"
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
              className="w-full border border-gray-600 bg-gray-700 text-white p-2 my-2 rounded"
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
            className="w-full bg-orange-500 text-white px-4 py-2 mt-4 rounded-md font-semibold hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200"
          >
            Add Debit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDebit;
