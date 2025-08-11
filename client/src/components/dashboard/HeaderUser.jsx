import React from 'react';
import '../../CSS/userDashboard.css';

const HeaderUser = ({ userName = 'User', onBookCourt }) => (
  <header className="header-userDashboard">
    <div className="header-content">
      <div>
        <h2>Welcome, {userName}!</h2>
        <p className="header-role">User Dashboard</p>
      </div>
      <button className="btn-userDashboard" onClick={onBookCourt}>
        Book Court
      </button>
    </div>
  </header>
);

export default HeaderUser;
