import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import "../../CSS/Dashboard/Sidebar.css";

const SIDEBAR_MENUS = {
  User: [
    { path: '', label: 'Home', icon: '🏠' },
    { path: 'venues', label: 'Venues', icon: '🏟️' },
    { path: 'my-bookings', label: 'My Bookings', icon: '📅' },
    { path: 'profile', label: 'Profile', icon: '👤' },
  ],
  FacilityOwner: [
    { path: '', label: 'Dashboard', icon: '📊' },
    { path: 'manage-facilities', label: 'Manage Facilities', icon: '🏟️' },
    { path: 'manage-courts', label: 'Manage Courts', icon: '🎾' },
    { path: 'time-slots', label: 'Time Slots', icon: '⏰' },
    { path: 'bookings-overview', label: 'Bookings Overview', icon: '📅' },
    { path: 'profile', label: 'Profile', icon: '👤' },
  ],
  Admin: [
    { path: '', label: 'Dashboard', icon: '📊' },
    { path: 'analytics', label: 'Analytics', icon: '📈' },
    { path: 'facility-approvals', label: 'Facility Approvals', icon: '✅' },
    { path: 'user-management', label: 'User Management', icon: '🧑‍💼' },
    { path: 'reports', label: 'Reports & Moderation', icon: '🚩' },
    { path: 'profile', label: 'Profile', icon: '👤' },
  ],
};

const SIDEBAR_SUBTITLES = {
  User: 'User Dashboard',
  FacilityOwner: 'Facility Owner Dashboard',
  Admin: 'Admin Dashboard',
};

const Sidebar = ({ isOpen, onToggle, onNavClick, role = 'User', userName = 'User', userAvatar = '🏆', userProfilePic = null }) => {
  const location = useLocation();
  const menuItems = SIDEBAR_MENUS[role] || SIDEBAR_MENUS.User;
  const subtitle = SIDEBAR_SUBTITLES[role] || SIDEBAR_SUBTITLES.User;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="sidebar-toggle" 
        onClick={onToggle}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={onToggle}
        />
      )}
      <aside className={`dashboard-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <a href="/" className="sidebar-logo">
            QuickCourt
          </a>
          <p className="sidebar-subtitle">
            {subtitle}
          </p>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section">
            <h3 className="nav-section-title">Menu</h3>
            <ul className="nav-list">
              {menuItems.map((item) => (
                <li key={item.path} className="nav-item">
                  <NavLink
                    to={item.path ? `/${role === 'User' ? 'user-dashboard' : role === 'FacilityOwner' ? 'facility-dashboard' : 'admin-dashboard'}/${item.path}` : `/${role === 'User' ? 'user-dashboard' : role === 'FacilityOwner' ? 'facility-dashboard' : 'admin-dashboard'}`}
                    className={({ isActive }) =>
                      `nav-link ${isActive || location.pathname === `/${role === 'User' ? 'user-dashboard' : role === 'FacilityOwner' ? 'facility-dashboard' : 'admin-dashboard'}/${item.path}` ? 'active' : ''}`
                    }
                    onClick={onNavClick}
                    end={item.path === ''}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-text">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              {userProfilePic ? (
                <img
                  src={userProfilePic}
                  alt={userName}
                  className="user-avatar-img"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <div className="user-avatar-placeholder">
                  {userName?.charAt(0)?.toUpperCase() || userAvatar}
                </div>
              )}
            </div>
            <div className="user-details">
              <p className="user-name">{userName}</p>
              <p className="user-role">{role}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar; 