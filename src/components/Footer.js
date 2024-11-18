// src/components/Footer.js
import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <p>&copy; {new Date().getFullYear()} CareBot. Semua hak cipta dilindungi.</p>
        </div>
        <div className="footer-right">
          <a href="#about-us">Tentang Kami</a>
          <a href="#contact">Kontak</a>
          <a href="#privacy-policy">Kebijakan Privasi</a>
          <a href="#terms">Syarat dan Ketentuan</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
