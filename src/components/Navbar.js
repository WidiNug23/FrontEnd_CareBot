import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [user, setUser] = useState(null); // State to hold logged-in user information
  const [nutritionData, setNutritionData] = useState(null); // State to hold nutrition data
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Fetch the logged-in user data from localStorage and the corresponding nutrition data
  const fetchUserData = () => {
    const loggedUser = JSON.parse(localStorage.getItem('loggedInUser')); // Get user data from localStorage
    if (loggedUser) {
      setUser(loggedUser); // Set user data in the state if found
      
      // Fetch the nutrition data from your API
      const ibuId = loggedUser.id; // Get ibu_id from logged-in user

      fetch(`/api/kalkulator_gizi/ibu/${ibuId}`) // Assuming the API endpoint for nutrition data is like this
        .then((response) => response.json())
        .then((data) => {
          setNutritionData(data); // Store the nutrition data in state
        })
        .catch((error) => {
          console.error('Error fetching nutrition data:', error);
        });
    }
  };

  // Initial fetch and setup storage listener
  useEffect(() => {
    fetchUserData(); // Fetch user data initially

    // Listen for changes in localStorage
    const handleStorageChange = () => {
      fetchUserData(); // Re-fetch user data when localStorage changes
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // This effect runs once on component mount

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY) {
      setVisible(false);
    } else {
      setVisible(true);
    }

    setLastScrollY(currentScrollY);
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser'); // Clear user data from localStorage
    setUser(null); // Reset the user state
    setNutritionData(null); // Clear the nutrition data
    navigate('/'); // Redirect to the homepage or login page
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <div className={`sidebar ${visible ? 'visible' : 'hidden'}`}>
      <Link to="/" className="carebot-link">
        <h2>CareBot</h2>
      </Link>
      <button className="menu-toggle" onClick={toggleMenu}>
        &#9776;
      </button>
      <ul className={`menu ${isOpen ? 'active' : ''}`}>
        <li>
          <Link to="/">Dashboard</Link>
        </li>
        <li>
          <Link to="/remaja">Nutrisi Remaja</Link>
        </li>
        <li>
          <Link to="/lansia">Nutrisi Lansia</Link>
        </li>
        <li>
          <Link to="/ibu_hamil">Nutrisi Ibu Hamil</Link>
        </li>
        <li>
          <Link to="/ibu_menyusui">Nutrisi Ibu Menyusui</Link>
        </li>
        <li>
          <Link to="/kalkulator">Kalkulator</Link>
        </li>
        {user ? (
          <>
            <li>
              <Link to={`/profile/${user.id}`}>Welcome, {user.nama}</Link> {/* Navigate to Profile page */}
            </li>
            {nutritionData && (
              <li>
                <strong>Nutrition Info:</strong>
                <ul>
                  <li>Calories: {nutritionData.tdee}</li>
                  <li>Carbs: {nutritionData.carbs}</li>
                  <li>Protein: {nutritionData.protein}</li>
                  <li>Fat: {nutritionData.fat}</li>
                </ul>
              </li>
            )}
            <li>
              <button onClick={handleLogout} className="logout-button">Logout</button> {/* Logout button */}
            </li>
          </>
        ) : (
          <li>
            <Link to="/ibu/login" className="login-button">Login</Link> {/* Login button */}
          </li>
        )}
      </ul>
    </div>
  );
}

export default Navbar;
