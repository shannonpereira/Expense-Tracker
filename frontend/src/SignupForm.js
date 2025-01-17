import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SignupForm.css';

const SignupForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [primaryBankAccount, setPrimaryBankAccount] = useState('');
  const [secondaryBankAccount, setSecondaryBankAccount] = useState('');
  const [tertiaryBankAccount, setTertiaryBankAccount] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://price-tracker-backend-one.vercel.app/users/add', {
        name,
        email,
        password,
        primaryBankAccount,
        secondaryBankAccount,
        tertiaryBankAccount,
      });

      // Store the token, userId, and email after successful signup
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId); // Store userId
      localStorage.setItem('email', email); // Store email

      alert('Signup successful!');
      
      // Redirect to home page
      navigate('/home');
    } catch (err) {
      setError('Error signing up. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2>Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="text"
            placeholder="Primary Bank Account"
            value={primaryBankAccount}
            onChange={(e) => setPrimaryBankAccount(e.target.value)}
          />
          <input
            type="text"
            placeholder="Secondary Bank Account"
            value={secondaryBankAccount}
            onChange={(e) => setSecondaryBankAccount(e.target.value)}
          />
          <input
            type="text"
            placeholder="Tertiary Bank Account"
            value={tertiaryBankAccount}
            onChange={(e) => setTertiaryBankAccount(e.target.value)}
          />
          <button type="submit">Sign Up</button>
        </form>
        <p className="signup-link">
          Already have an account? <a href="/login">Log In</a>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
