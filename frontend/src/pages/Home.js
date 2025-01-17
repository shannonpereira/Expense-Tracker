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
      <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
  <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#f97316' }}>
    Welcome
  </h1>
  <h2
    style={{
      fontSize: '2rem',
      fontWeight: '800',
      WebkitTextStroke: '1px gray',
      color: 'transparent',
    }}
  >
    &nbsp;&nbsp;&nbsp;&nbsp;to Your Dashboard
  </h2>
</div>

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
  {/* Monthly Spending Chart */}
  <div
    className="w-full lg:w-5/12 bg-gray-800 rounded-lg shadow-lg p-4"
    style={{ height: "420px" }}
  >
    <h2 className="text-xl font-semibold text-center text-gray-100 mb-4">
      Monthly Spending
    </h2>
    <div className="h-[85%] flex items-center justify-center">
      <Line
        data={monthlyChartData}
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: { color: "#fff" }, // White legend text
            },
          },
          scales: {
            x: {
              ticks: { color: "#aaa" }, // White x-axis labels
              grid: { color: "#555" }, // Subtle x-axis grid color
            },
            y: {
              ticks: { color: "#aaa" }, // White y-axis labels
              grid: { color: "#555" }, // Subtle y-axis grid color
            },
          },
        }}
      />
    </div>
  </div>

  {/* Spending by Category Chart */}
  <div
    className="w-full lg:w-5/12 bg-gray-800 rounded-lg shadow-lg p-4"
    style={{ height: "420px" }}
  >
    <h2 className="text-xl font-semibold text-center text-gray-100 mb-4">
      Spending by Category
    </h2>
    <div className="h-[85%] flex items-center justify-center">
      <Bar
        data={categoryChartData}
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: { color: "#fff" }, // White legend text
            },
          },
          scales: {
            x: {
              ticks: { color: "#aaa" }, // White x-axis labels
              grid: { color: "#555" }, // Subtle x-axis grid color
            },
            y: {
              ticks: { color: "#aaa" }, // White y-axis labels
              grid: { color: "#555" }, // Subtle y-axis grid color
            },
          },
        }}
      />
    </div>
  </div>
</div>


   {/* Transaction Details */}
<div className="mb-6">
  <h2 className="text-xl font-semibold mb-4 text-gray-100">Transaction Details</h2>
  <div className="bg-gray-800 p-6 rounded-lg shadow-md overflow-x-auto">
    <table className="w-full text-left border-collapse min-w-[600px]">
      <thead>
        <tr className="bg-gray-700 text-gray-300">
          <th className="p-3 text-sm font-medium uppercase">Date</th>
          <th className="p-3 text-sm font-medium uppercase">Amount</th>
          <th className="p-3 text-sm font-medium uppercase">Category</th>
          <th className="p-3 text-sm font-medium uppercase">Payment Mode</th>
        </tr>
      </thead>
      <tbody>
        {transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <tr
              key={index}
              className={`${
                index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
              } hover:bg-gray-600 transition-colors`}
            >
              <td className="p-3 text-sm text-gray-300">
                {new Date(transaction.transactionDate).toLocaleDateString()}
              </td>
              <td className="p-3 text-sm text-red-600">₹{transaction.amount}</td>
              <td className="p-3 text-sm text-gray-300">{transaction.spentAt}</td>
              <td className="p-3 text-sm text-gray-300">{transaction.paymentMode}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="text-center p-3 text-gray-400">
              No transactions available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>


     {/* Download PDF Button */}
<div className="flex justify-end mt-6">
  <button 
    className="bg-orange-500 p-3 rounded-lg text-white hover:bg-orange-600 transition duration-300" 
    onClick={downloadPDF}
  >
    Download PDF
  </button>
</div>

    </div>
  );
};

export default Home;
