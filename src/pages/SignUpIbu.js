import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SignUpIbu.css';

function SignUpIbu() {
  const [newData, setNewData] = useState({
    nama: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Validate data input
  const validateInput = () => {
    if (!newData.nama || !newData.email || newData.password.length < 6) {
      setError('Please fill in all fields correctly.');
      return false;
    }
    setError(null); // Clear error if validation passes
    return true;
  };

  // Create new data (handle submit)
  const handleCreate = async () => {
    if (!validateInput()) return;

    try {
      // Sending POST request to the backend
      const response = await axios.post('http://localhost:8080/ibu/signup', newData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.message) {
        setSuccess(response.data.message);

        // Redirect to login page after successful signup
        navigate('/ibu/login');
      } else {
        setError('Unexpected response from the server.');
      }
    } catch (err) {
      console.error('Error:', err.response || err);
      if (err.response) {
        setError(err.response.data.message || 'Failed to sign up');
      } else {
        setError('Failed to sign up. Please try again later.');
      }
    }
  };

  return (
    <div className="signup-form">
      <h2>Sign Up</h2>
      {error && <p className="error" style={{ color: 'red' }}>{error}</p>}
      {success && <p className="success" style={{ color: 'green' }}>{success}</p>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreate();
        }}
      >
        <input
          type="text"
          name="nama"
          placeholder="Name"
          onChange={handleInputChange}
          value={newData.nama}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleInputChange}
          value={newData.email}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleInputChange}
          value={newData.password}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUpIbu;
