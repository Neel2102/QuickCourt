import React from 'react';
import '../../CSS/facilityDashboard.css';

const HeaderFacility = ({ ownerName = 'Owner', onAddFacility }) => (
  <header className="header-facilityDashboard">
    <div className="header-content">
      <div>
        <h2>Welcome, {ownerName}!</h2>
        <p className="header-role">Facility Owner Dashboard</p>
      </div>
      <button className="btn-facilityDashboard" onClick={onAddFacility}>
        Add Facility
      </button>
    </div>
  </header>
);

export default HeaderFacility;
