import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from 'chart.js';
import { jsPDF } from "jspdf";

// Register necessary chart elements
ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement);

const Home = () => {
  const [transactions, setTransactions] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [monthlyTransactions, setMonthlyTransactions] = useState([]);
  const [spendingCategory, setSpendingCategory] = useState([]);
  const [yearlyIncome, setYearlyIncome] = useState([]);

  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}transactions/${userEmail}`);
        const transactionData = Array.isArray(response.data.transactions) ? response.data.transactions : [];
        setTransactions(transactionData);

        const totalSpentAmount = transactionData.reduce((acc, curr) => acc + curr.amount, 0);
        setTotalSpent(totalSpentAmount);

        const monthlyData = groupByMonth(transactionData);
        setMonthlyTransactions(monthlyData);

        const categoryData = getSpendingByCategory(transactionData);
        setSpendingCategory(categoryData);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    const fetchIncomeData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}income/${userEmail}`);
        const incomeData = Array.isArray(response.data.incomes) ? response.data.incomes : [];
        setTotalIncome(incomeData.reduce((acc, curr) => acc + curr.amount, 0));

        // Group income by year
        const yearlyData = groupByYear(incomeData);
        setYearlyIncome(yearlyData);
      } catch (error) {
        console.error('Error fetching income:', error);
      }
    };

    fetchTransactionData();
    fetchIncomeData();
  }, [userEmail]);

  // Helper function to group transactions by month
  const groupByMonth = (transactions) => {
    const months = transactions.reduce((acc, curr) => {
      const month = new Date(curr.transactionDate).toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!acc[month]) {
        acc[month] = { month: month, transactions: [] };
      }
      acc[month].transactions.push(curr);
      return acc;
    }, {});
    return Object.values(months);
  };

  // Helper function to calculate spending by category
  const getSpendingByCategory = (transactions) => {
    const categories = transactions.reduce((acc, curr) => {
      if (!acc[curr.spentAt]) acc[curr.spentAt] = 0;
      acc[curr.spentAt] += curr.amount;
      return acc;
    }, {});
    return Object.entries(categories).map(([category, amount]) => ({ category, amount }));
  };

  // Helper function to group income by year
  const groupByYear = (incomeData) => {
    const years = incomeData.reduce((acc, curr) => {
      const year = new Date(curr.date).getFullYear();
      if (!acc[year]) {
        acc[year] = 0;
      }
      acc[year] += curr.amount;
      return acc;
    }, {});
    return Object.entries(years).map(([year, amount]) => ({ year, amount }));
  };

  // Calculate savings as income - spent
  const savings = totalIncome - totalSpent;

  // Chart for monthly spending visualization
  const monthlyChartData = {
    labels: monthlyTransactions.map(item => item.month),
    datasets: [
      {
        label: 'Total Spending',
        data: monthlyTransactions.map(item => item.transactions.reduce((sum, t) => sum + t.amount, 0)),
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  // Chart for category spending visualization
  const categoryChartData = {
    labels: spendingCategory.map(item => item.category),
    datasets: [
      {
        label: 'Spending by Category',
        data: spendingCategory.map(item => item.amount),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Download PDF of transactions, income, and savings
  const downloadPDF = () => {
    const doc = new jsPDF();
    const currentMonth = new Date().toLocaleString('default', { month: 'short', year: 'numeric' });

    // Add title
    doc.setFontSize(20);
    doc.text('Financial Summary for ' + currentMonth, 10, 10);

    // Add income, spent, and savings
    doc.setFontSize(12);
    doc.text(`Total Income: ₹${totalIncome}`, 10, 20);
    doc.text(`Total Spent: ₹${totalSpent}`, 10, 30);
    doc.text(`Savings: ₹${savings}`, 10, 40);

    // Add transactions grouped by month
    doc.text('Transactions by Month:', 10, 50);
    const groupedByMonth = groupByMonth(transactions);
    groupedByMonth.forEach((monthGroup, index) => {
      const yStart = 60 + (index * 10);
      const monthName = monthGroup.month;

      // Add month title
      doc.setFontSize(14);
      doc.text(monthName, 10, yStart);

      // Add transaction details for that month
      let yPosition = yStart + 10;
      monthGroup.transactions.forEach((transaction, tIndex) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 10;
        }
        doc.setFontSize(10);
        doc.text(`${new Date(transaction.transactionDate).toLocaleDateString()} | ₹${transaction.amount} | ${transaction.spentAt} | ${transaction.paymentMode}`, 10, yPosition);
        yPosition += 10;
      });

      if (index < groupedByMonth.length - 1) {
        doc.addPage(); // Add a new page between months
      }
    });

    // Add income data grouped by year
    doc.addPage();
    doc.text('Income by Year:', 10, 10);
    yearlyIncome.forEach((income, index) => {
      const y = 20 + (index * 10);
      doc.text(`${income.year}: ₹${income.amount}`, 10, y);
    });

    // Add page for Spending Categories
    doc.addPage();
    doc.text('Spending by Category:', 10, 10);
    spendingCategory.forEach((category, index) => {
      const y = 20 + (index * 10);
      doc.text(`${category.category}: ₹${category.amount}`, 10, y);
    });

    // Save the PDF
    doc.save('financial_report.pdf');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-semibold text-orange-500 mb-6">Welcome to Your Dashboard</h1>
    
      {/* Income, Spent, and Savings Summary */}
      <div className="mb-6 flex flex-wrap justify-between gap-6">
        <div className="bg-gray-800 p-3 rounded-lg w-full sm:w-1/3">
          <h2 className="text-xl font-semibold">Total Income</h2>
          <p className="text-2xl">₹{totalIncome}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg w-full sm:w-1/3">
          <h2 className="text-xl font-semibold">Savings</h2>
          <p className="text-2xl">₹{savings}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg w-full sm:w-1/3">
          <h2 className="text-xl font-semibold">Total Spent</h2>
          <p className="text-2xl">₹{totalSpent}</p>
        </div>
      </div>

      {/* Charts Side by Side */}
      <div className="mb-6 flex flex-wrap justify-between gap-6">
        <div className="w-full lg:w-5/12" style={{ height: '400px' }}>
          <h2 className="text-xl font-semibold text-center">Monthly Spending</h2>
          <Line data={monthlyChartData} />
        </div>

        <div className="w-full lg:w-5/12" style={{ height: '400px' }}>
          <h2 className="text-xl font-semibold text-center">Spending by Category</h2>
          <Bar data={categoryChartData} />
        </div>
      </div>

      {/* Transaction Details */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Transaction Details</h2>
        <div className="bg-gray-800 p-4 rounded-lg">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="p-2">Date</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Category</th>
                <th className="p-2">Payment Mode</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((transaction, index) => (
                  <tr key={index} className="border-b border-gray-600">
                    <td className="p-2">{new Date(transaction.transactionDate).toLocaleDateString()}</td>
                    <td className="p-2">₹{transaction.amount}</td>
                    <td className="p-2">{transaction.spentAt}</td>
                    <td className="p-2">{transaction.paymentMode}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-2">No transactions available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Download PDF Button */}
      <button 
        className="bg-orange-500 p-3 rounded-lg text-white mt-6" 
        onClick={downloadPDF}
      >
        Download PDF
      </button>
    </div>
  );
};

export default Home;
