// src/context/AuthContext.js
import { createContext, useState, useEffect } from 'react';

// Membuat AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize admin state from local storage
  const [admin, setAdmin] = useState(() => {
    const savedUser = localStorage.getItem('admin');
    return savedUser ? JSON.parse(savedUser) : null; // Parse JSON if user exists
  });

  // Fungsi login
  const login = (user) => {
    setAdmin(user);
    localStorage.setItem('admin', JSON.stringify(user)); // Save user to local storage
  };

  // Fungsi logout
  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('admin'); // Remove user from local storage
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
