// src/AddDebit.js
import React, { useState } from 'react';

const AddDebit = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to add debit
    alert(`Debit of ${amount} added: ${description}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-orange-500">Add Debit</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 my-2 rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 my-2 rounded"
        />
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
