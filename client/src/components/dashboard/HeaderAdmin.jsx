import React from 'react';
import '../../CSS/adminDashboard.css';

const HeaderAdmin = ({ adminName = 'Admin', onApproveFacilities }) => (
  <header className="header-adminDashboard">
    <div className="header-content">
      <div>
        <h2>Welcome, {adminName}!</h2>
        <p className="header-role">Admin Dashboard</p>
      </div>
      <button className="btn-adminDashboard" onClick={onApproveFacilities}>
        Approve Facilities
      </button>
    </div>
  </header>
);

export default HeaderAdmin;
