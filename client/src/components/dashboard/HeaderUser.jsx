import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import "../../CSS/Dashboard/Header.css";

const HeaderUser = ({ onToggleSidebar, userName = 'User' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname.split('/').pop();
    switch (path) {
      case 'venues':
        return 'Browse Venues';
      case 'my-bookings':
        return 'My Bookings';
      case 'profile':
        return 'Profile Settings';
      default:
        return 'User Dashboard';
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:4000/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      navigate('/login');
    }
  };

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <button
          className="mobile-menu-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="header-title">
          {getPageTitle()}
        </h1>
      </div>

      <div className="header-right">
        <div className="user-info">
          <div className="user-avatar">
            🏆
          </div>
          <span className="user-name">{userName}</span>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </header>
  );
};

export default HeaderUser;
