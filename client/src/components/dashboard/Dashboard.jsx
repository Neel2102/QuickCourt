import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../components/Dashboard/Header";
import Sidebar from "../components/Dashboard/Sidebar";
import { useAuth } from '../context/AuthContext';
import "../CSS/Dashboard.css";

// Dashboard Components
const VenueManagement = () => (
  <div className="dashboard-content">
    <h2>Venue Management</h2>
    <div className="venue-grid">
      <div className="venue-card">
        <h3>Add New Venue</h3>
        <p>Create and manage your sports facilities</p>
        <button className="btn-primary">Add Venue</button>
      </div>
      <div className="venue-card">
        <h3>Manage Courts</h3>
        <p>Set up courts, pricing, and availability</p>
        <button className="btn-primary">Manage Courts</button>
      </div>
      <div className="venue-card">
        <h3>Time Slots</h3>
        <p>Configure operating hours and maintenance</p>
        <button className="btn-primary">Set Schedule</button>
      </div>
    </div>
  </div>
);

const BookingOverview = () => (
  <div className="dashboard-content">
    <h2>Booking Overview</h2>
    <div className="booking-stats">
      <div className="stat-card">
        <h3>Today's Bookings</h3>
        <div className="stat-number">12</div>
        <div className="stat-label">Active</div>
      </div>
      <div className="stat-card">
        <h3>This Week</h3>
        <div className="stat-number">45</div>
        <div className="stat-label">Total</div>
      </div>
      <div className="stat-card">
        <h3>Revenue</h3>
        <div className="stat-number">$2,450</div>
        <div className="stat-label">This Month</div>
      </div>
    </div>
    <div className="recent-bookings">
      <h3>Recent Bookings</h3>
      <div className="booking-list">
        <div className="booking-item">
          <div className="booking-info">
            <h4>Court 1 - Badminton</h4>
            <p>John Doe • Today 2:00 PM - 4:00 PM</p>
          </div>
          <div className="booking-status confirmed">Confirmed</div>
        </div>
        <div className="booking-item">
          <div className="booking-info">
            <h4>Turf Ground - Football</h4>
            <p>Team Alpha • Tomorrow 6:00 PM - 8:00 PM</p>
          </div>
          <div className="booking-status pending">Pending</div>
        </div>
      </div>
    </div>
  </div>
);

const Analytics = () => (
  <div className="dashboard-content">
    <h2>Analytics & Reports</h2>
    <div className="analytics-grid">
      <div className="chart-card">
        <h3>Booking Trends</h3>
        <div className="chart-placeholder">
          <p>📊 Daily/Weekly/Monthly Booking Trends</p>
        </div>
      </div>
      <div className="chart-card">
        <h3>Earnings Summary</h3>
        <div className="chart-placeholder">
          <p>💰 Revenue Analysis</p>
        </div>
      </div>
      <div className="chart-card">
        <h3>Peak Hours</h3>
        <div className="chart-placeholder">
          <p>⏰ Popular Booking Times</p>
        </div>
      </div>
    </div>
  </div>
);

const Profile = () => {
  const { authUser, loading } = useAuth();
  if (loading) return <div className="dashboard-content"><p>Loading...</p></div>;
  if (!authUser) return <div className="dashboard-content"><p>No user data found.</p></div>;
  return (
    <div className="dashboard-content">
      <h2>Profile Settings</h2>
      <div className="profile-section">
        <div className="profile-info">
          <h3>Facility Owner Details</h3>
          <div className="profile-avatar" style={{marginBottom: 16}}>
            {authUser.profilePic ? (
              <img src={authUser.profilePic} alt="avatar" style={{width: 64, height: 64, borderRadius: '50%'}} />
            ) : (
              <span role="img" aria-label="avatar" style={{fontSize: 48}}>🏆</span>
            )}
          </div>
          <div className="profile-details">
            <div><strong>Name:</strong> {authUser.fullName || authUser.name}</div>
            <div><strong>Email:</strong> {authUser.email}</div>
            {authUser.phone && <div><strong>Phone:</strong> {authUser.phone}</div>}
            {authUser.bio && <div><strong>Bio:</strong> {authUser.bio}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Close sidebar when clicking on a link (mobile)
    const handleNavClick = () => {
        if (window.innerWidth <= 768) {
            setSidebarOpen(false);
        }
    };

    return (
    <div className="dashboard">
      <Header onToggleSidebar={toggleSidebar} />
      <div className="dashboard__main">
        <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} onNavClick={handleNavClick} />
        <main className="dashboard__content">
          <Routes>
            <Route path="venues" element={<VenueManagement />} />
            <Route path="bookings" element={<BookingOverview />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="profile" element={<Profile />} />
            <Route path="/" element={<VenueManagement />} />
          </Routes>
        </main>
      </div>
    </div>
    );
};

export default Dashboard;