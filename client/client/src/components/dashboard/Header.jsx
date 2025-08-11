import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { assets } from '../../assets/assets';
import '../../CSS/Header.css';

const Header = ({ userName = 'User' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname.split('/').pop();
    switch (path) {
      case 'venues':
        return 'Venue Management';
      case 'bookings':
        return 'Booking Overview';
      case 'analytics':
        return 'Analytics & Reports';
      case 'profile':
        return 'Profile Settings';
      default:
        return 'Dashboard';
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
    <>
      <div className="header">
        <img src={assets.header_img} alt="" className="profile-pic"/>
        <h1 className="heading">
          Hey {userName}
          <img src={assets.hand_wave} alt="" className="wave-icon"/>
        </h1>

        <h2 className="title">
          {getPageTitle()}
        </h2>
        <p className="description">
          Navigate through your dashboard and manage your activities efficiently!
        </p>

        <button className="get-started-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </>
  );
};

export default Header;