import React from 'react';
import ExpenseForm from '../components/expenseForm';
import '../components/navbar'
import Navbar from '../components/navbar';

const AddExpense = () => {
  return (
    <div>
      <Navbar></Navbar>
      <ExpenseForm />
    </div>
  );
};

export default AddExpense;
