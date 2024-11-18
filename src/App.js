// src/App.js
import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Remaja from './pages/Remaja';
import Lansia from './pages/Lansia';
import IbuHamil from './pages/IbuHamil';
import IbuMenyusui from './pages/IbuMenyusui';
import Kalkulator from './pages/Kalkulator';
import Login from './pages/Admin/Login';
import Dashboard from './pages/Admin/Dashboard';
import RemajaCrud from './pages/Admin/RemajaCrud';
import LansiaCrud from './pages/Admin/LansiaCrud';
import IbuHamilCrud from './pages/Admin/IbuHamilCrud';
import IbuMenyusuiCrud from './pages/Admin/IbuMenyusuiCrud';
import KalkulatorCrud from './pages/Admin/KalkulatorCrud';
import BeritaCrud from './pages/Admin/BeritaCrud';
import ScrollToTopButton from './components/ScrollToTopButton.js';

// Import new components for Ibu SignUp, Login, and Profile
import SignUpIbu from './pages/SignUpIbu';
import LoginIbu from './pages/LoginIbu';
import ProfilePage from './pages/ProfilePage';  // Import ProfilePage component

// Component for protecting routes
const ProtectedRoute = ({ children }) => {
  const { admin } = useContext(AuthContext);
  if (!admin) {
    return <Navigate to="/admin/login" />;
  }
  return children;
};

function Layout() {
  const location = useLocation();
  const { admin } = useContext(AuthContext);

  // Check if the current path is an admin page
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {/* Show Navbar for user routes, Sidebar for admin routes */}
      {!isAdminRoute && <Navbar />}
      {isAdminRoute && <Sidebar adminName={admin?.name} />}
      
      {/* Add a 'content' class to ensure content has padding-top */}
      <div className="content">
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/remaja" element={<Remaja />} />
          <Route path="/lansia" element={<Lansia />} />
          <Route path="/ibu_hamil" element={<IbuHamil />} />
          <Route path="/ibu_menyusui" element={<IbuMenyusui />} />
          <Route path="/kalkulator" element={<Kalkulator />} />
          <Route path="/ibu/signup" element={<SignUpIbu />} />  {/* New SignUp Route */}
          <Route path="/ibu/login" element={<LoginIbu />} />   {/* New Login Route */}
          <Route path="/profile/:ibuId" element={<ProfilePage />} />  {/* New Profile Route */}

          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/remaja" element={<ProtectedRoute><RemajaCrud /></ProtectedRoute>} />
          <Route path="/admin/lansia" element={<ProtectedRoute><LansiaCrud /></ProtectedRoute>} />
          <Route path="/admin/ibu_hamil" element={<ProtectedRoute><IbuHamilCrud /></ProtectedRoute>} />
          <Route path="/admin/ibu_menyusui" element={<ProtectedRoute><IbuMenyusuiCrud /></ProtectedRoute>} />
          <Route path="/admin/berita" element={<ProtectedRoute><BeritaCrud /></ProtectedRoute>} />
          {/* <Route path="/admin/kalkulator_gizi" element={<ProtectedRoute><KalkulatorCrud /></ProtectedRoute>} /> */}
        </Routes>
      </div>

      {/* Footer only appears on user pages */}
      {!isAdminRoute && <Footer />}
      {/* Include Scroll to Top Button */}
      <ScrollToTopButton />
    </>
  );
}

function App() {
  const location = useLocation();

  // Check if the current path is an admin page
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {/* Chatbot only appears on user pages */}
      {!isAdminRoute && <Chatbot />}
      <Layout />
    </>
  );
}

function RootApp() {
  return (
    <AuthProvider>
      <Router>
        <App />
      </Router>
    </AuthProvider>
  );
}

export default RootApp;
