import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';  // Import the Login form
import SignupForm from './SignupForm';  // Import the signup form
import Home from './pages/Home';  // Import the Home page
import './App.css';  // Your global CSS file
import AddExpense from './pages/AddExpense';

const App = () => {
  return (
    <Router>
      <div className="container">
        <Routes>
          {/* Define the routes */}
          <Route path="/" element={<LoginRedirect />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/addexpense" element={<AddExpense />} />  {/* Route for ExpenseForm */}
        </Routes>
      </div>
    </Router>
  );
};

// New component for handling login redirection
const LoginRedirect = () => {
  const navigate = useNavigate();  // Move useNavigate inside the Router context

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/home');  // Redirect to home if logged in
    } else {
      navigate('/login');  // Redirect to login if not logged in
    }
  }, [navigate]);

  return null;  // This component doesn't render anything
};

// Home page component (you can add more logic for it)
const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return isLoggedIn ? <Home /> : <LoginForm />;
};

export default App;
