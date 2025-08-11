import React, { useState, useEffect } from 'react';
import '../CSS/Navbar.css';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {

  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-brand">
          <span className="brand-text">QuickCourt</span>
        </div>

        <div className={`navbar-menu ${isMobileMenuOpen ? 'navbar-menu-active' : ''}`}>
          <a href="#home" className="navbar-link">Home</a>
          <a href="/venues" className="navbar-link">Venues</a>
          <a href="/login" className="navbar-link">Sports</a>
          <a href="/about" className="navbar-link">About</a>
        </div>

        <div className="navbar-actions">
          <button className="navbar-cta" onClick={() => navigate('/login')}>Login</button>
          <button 
            className={`navbar-toggle ${isMobileMenuOpen ? 'navbar-toggle-active' : ''}`}
            onClick={toggleMobileMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;