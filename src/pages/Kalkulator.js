import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Kalkulator.css';

const Kalkulator = () => {
  const [nutrisi, setNutrisi] = useState([]);
  const [formData, setFormData] = useState({
    gender: '',
    weight: '',
    height: '',
    age: '',
    activity_level: ''
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch Nutrisi Data
  const fetchNutrisi = async () => {
    try {
      const response = await axios.get('http://localhost:8080/kalkulator_gizi');
      const sortedNutrisi = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setNutrisi(sortedNutrisi);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Initial Fetch
  useEffect(() => {
    fetchNutrisi();
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

// Handle Form Submission
const handleSubmit = async (e) => {
  e.preventDefault();

  // Retrieve loggedUser from localStorage
  const loggedUser = JSON.parse(localStorage.getItem('loggedInUser'));
  if (!loggedUser || !loggedUser.id) {
    // Show an alert and redirect to the login page if the user is not logged in
    window.alert('You must be logged in to perform this calculation.');
    window.location.href = '/ibu/login'; // Redirect to the login page
    return; // Prevent the calculation if not logged in
  }

  setLoading(true); // Set loading state to true
  setError(null); // Clear previous errors

  const ibuId = loggedUser.id; // Retrieve ibu_id from the loggedUser

  // Add ibu_id to the formData
  const formDataWithIbuId = { ...formData, ibu_id: ibuId };

  try {
    const response = await axios.post('http://localhost:8080/kalkulator_gizi/calculate', formDataWithIbuId, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    setResults(response.data); // Set results from API response
    setFormData({
      gender: '',
      weight: '',
      height: '',
      age: '',
      activity_level: ''
    });

    await fetchNutrisi(); // Refresh nutrient data
  } catch (error) {
    console.error('Error calculating data:', error);
    setError('Error calculating data. Please try again.');
  } finally {
    setLoading(false); // Set loading state to false after the request completes
  }
};


  return (
    <div className="div-kalkulator">
      <h1 className="h1-kalkulator">Kalkulator Nutrisi</h1>

      <div className="kalkulator-container">
        <form className="form-kalkulator" onSubmit={handleSubmit}>
          <div className="flex-container">
            <div className="left-side">
              <div>
                <label className="label-kalkulator">Gender:</label>
                <select className="select-kalkulator" name="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="label-kalkulator">Weight (kg):</label>
                <input className="input-kalkulator" type="number" name="weight" value={formData.weight} onChange={handleChange} required min="0" />
              </div>
              <div>
                <label className="label-kalkulator">Height (cm):</label>
                <input className="input-kalkulator" type="number" name="height" value={formData.height} onChange={handleChange} required min="0" />
              </div>
            </div>

            <div className="right-side">
              <div>
                <label className="label-kalkulator">Age (years):</label>
                <input className="input-kalkulator" type="number" name="age" value={formData.age} onChange={handleChange} required min="0" />
              </div>
              <div>
                <label className="label-kalkulator">Activity Level:</label>
                <select className="select-kalkulator" name="activity_level" value={formData.activity_level} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="sedentary">Sedentary (little or no exercise)</option>
                  <option value="light">Light (light exercise/sports 1-3 days/week)</option>
                  <option value="moderate">Moderate (moderate exercise/sports 3-5 days/week)</option>
                  <option value="active">Active (hard exercise/sports 6-7 days a week)</option>
                </select>
              </div>
            </div>
          </div>

          <button className="button-kalkulator" type="submit" disabled={loading}>
            {loading ? 'Calculating...' : 'Calculate'}
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        {results && (
          <div className="results-container">
            <h2 className="h2-kalkulator">Results</h2>
            <div className="result-item">
              <span className="result-label">Total Daily Energy Expenditure (TDEE):</span>
              <span className="result-value">{results.tdee} kcal</span>
            </div>
            <div className="result-item">
              <span className="result-label">Carbohydrates:</span>
              <span className="result-value">{results.carbs} g</span>
            </div>
            <div className="result-item">
              <span className="result-label">Protein:</span>
              <span className="result-value">{results.protein} g</span>
            </div>
            <div className="result-item">
              <span className="result-label">Fat:</span>
              <span className="result-value">{results.fat} g</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Kalkulator;
