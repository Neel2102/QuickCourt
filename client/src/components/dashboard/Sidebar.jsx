import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import "../../CSS/Dashboard/Sidebar.css";

const Sidebar = ({ isOpen, onToggle, onNavClick }) => {
  const location = useLocation();

  const dashboard = [
    { path: 'venues', label: 'Venue Management', icon: '🏟️' },
    { path: 'bookings', label: 'Booking Overview', icon: '📅' },
    { path: 'analytics', label: 'Analytics', icon: '📊' },
    { path: 'profile', label: 'Profile', icon: '👤' },
  ];

  const menuItems = dashboard;

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
            Facility Owner Dashboard
          </p>
        </div>
      
      <nav className="sidebar-nav">
        <div className="nav-section">
          <h3 className="nav-section-title">Management</h3>
          <ul className="nav-list">
            {menuItems.map((item) => (
              <li key={item.path} className="nav-item">
                <NavLink
                  to={`/dashboard/${item.path}`}
                  className={({ isActive }) => 
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                  onClick={onNavClick}
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
            🏆
          </div>
          <div className="user-details">
            <p className="user-name">Facility Owner</p>
            <p className="user-role">QuickCourt</p>
          </div>
        </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar; 