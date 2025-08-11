import React, { useState, useEffect } from 'react';
import '../CSS/Navbar.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getDashboardRoute } from '../utils/authUtils';
import useAuthCheck from '../hooks/useAuthCheck';

const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout, loading } = useAuth();

  // Check auth status on route changes
  useAuthCheck();

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

  const handleAuthAction = async () => {
    if (isAuthenticated) {
      // Show confirmation dialog before logout
      const confirmed = window.confirm('Are you sure you want to logout?');
      if (confirmed) {
        await logout();
      }
    } else {
      // Navigate to login page
      navigate('/login');
    }
  };

  const handleDashboardNavigation = () => {
    if (isAuthenticated && user) {
      const dashboardRoute = getDashboardRoute(user.role);
      navigate(dashboardRoute);
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-brand">
          <span onClick={()=>navigate('/')} className="brand-text">QuickCourt</span>
        </div>

        <div className={`navbar-menu ${isMobileMenuOpen ? 'navbar-menu-active' : ''}`}>
          <a href="#home" className="navbar-link">Home</a>
          <a href="/venues" className="navbar-link">Venues</a>
          <a href="/about" className="navbar-link">About</a>
          {isAuthenticated && (
            <button
              className="navbar-link navbar-dashboard-btn"
              onClick={handleDashboardNavigation}
            >
              Dashboard
            </button>
          )}
        </div>

        <div className="navbar-actions">
          {loading ? (
            <div className="navbar-loading">
              <span className="navbar-loading-text">...</span>
            </div>
          ) : isAuthenticated ? (
            <div className="navbar-user-section">
              <span className="navbar-user-name">
                Welcome, {user?.name || 'User'}
              </span>
              <button
                className="navbar-cta navbar-logout"
                onClick={handleAuthAction}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              className="navbar-cta"
              onClick={handleAuthAction}
            >
              Login
            </button>
          )}
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