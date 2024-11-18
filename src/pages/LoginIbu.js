import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginIbu.css';

function LoginIbu() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post('http://localhost:8080/ibu/login', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.message === 'Login successful') {
        // Save user data to localStorage
        localStorage.setItem('loggedInUser', JSON.stringify(response.data.ibu));

        // Navigate to home page or wherever you want after login
        navigate('/');
      }
    } catch (err) {
      console.error('Error:', err.response || err);
      if (err.response) {
        setError(err.response.data.message || 'Failed to log in');
      } else {
        setError('Failed to log in. Please try again later.');
      }
    }
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleInputChange}
          value={formData.email}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleInputChange}
          value={formData.password}
          required
        />
        <button type="submit">Login</button>
      </form>
      <div className="signup-link">
        <p>Don't have an account? <a href="/ibu/signup">Sign up here</a></p>
      </div>
    </div>
  );
}

export default LoginIbu;
