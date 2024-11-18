import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProfilePage.css';

function ProfilePage() {
  const [ibu, setIbu] = useState(null);
  const [kalkulatorData, setKalkulatorData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve user data from localStorage
    const loggedUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedUser && loggedUser.id) {
      setIbu(loggedUser);
      fetchKalkulatorData(loggedUser.id);
    } else {
      setLoading(false); // Stop loading if user data is not found
    }
  }, []);

  // Function to fetch calculator data from API and filter by ibu_id
  const fetchKalkulatorData = async (ibuId) => {
    try {
      const response = await axios.get('http://localhost:8080/kalkulator_gizi');
      // Filter data to include only those with the matching ibu_id
      const filteredData = response.data.filter(item => item.ibu_id === ibuId);
      setKalkulatorData(filteredData);
    } catch (error) {
      console.error('Error fetching kalkulator data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-info">
        <h1>Profile</h1>
        {ibu ? (
          <div>
            <h2>{ibu.nama}</h2>
            <p>Email: {ibu.email}</p>
          </div>
        ) : (
          <p>Data pengguna tidak ditemukan.</p>
        )}
      </div>

      <div className="kalkulator-results">
        <h2>Hasil Perhitungan Nutrisi</h2>
        {kalkulatorData.length > 0 ? (
          kalkulatorData.map((item, index) => (
            <div key={index} className="result-item">
              {/* <h3>Perhitungan #{index + 1}</h3> */}
              <p><strong>Total Daily Energy Expenditure (TDEE):</strong> {item.tdee} kcal</p>
              <p className="carbs-text"><strong>Karbohidrat:</strong> {item.carbs} g</p>
              <p className="protein-text"><strong>Protein:</strong> {item.protein} g</p>
              <p className="fat-text"><strong>Lemak:</strong> {item.fat} g</p>


              {/* Move statistics below the perhitungan */}
              <div className="stat-bar-container">
                <div
                  className="stat-bar carbs"
                  style={{ width: `${item.carbs}%` }} // Dividing by 4 for smaller bars
                >
                  {/* Karbohidrat */}
                </div>
                <div
                  className="stat-bar protein"
                  style={{ width: `${item.protein}%` }} // Dividing by 4 for smaller bars
                >
                  {/* Protein */}
                </div>
                <div
                  className="stat-bar fat"
                  style={{ width: `${item.fat}%` }} // Dividing by 4 for smaller bars
                >
                  {/* Lemak */}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Belum ada hasil perhitungan.</p>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
