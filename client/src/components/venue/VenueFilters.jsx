import React from 'react';
import '../../CSS/VenueFilters.css';

const VenueFilters = ({ filters, onFilterChange }) => {
  const handleFilterChange = (filterName, value) => {
    onFilterChange({ [filterName]: value });
  };

  const handleClearFilters = () => {
    onFilterChange({
      sportType: 'all',
      priceRange: 'all',
      rating: 'all',
      city: ''
    });
  };

  return (
    <div className="venue-filters-container">
      <div className="filters-row">
        {/* City Filter */}
        <div className="filter-group">
          <label>City</label>
          <input
            type="text"
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            placeholder="Enter city name"
            className="filter-input"
          />
        </div>

        {/* Sport Type Filter */}
        <div className="filter-group">
          <select
            value={filters.sportType}
            onChange={(e) => handleFilterChange('sportType', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Sports</option>
            <option value="Tennis">Tennis</option>
            <option value="Badminton">Badminton</option>
            <option value="Football">Football</option>
            <option value="Cricket">Cricket</option>
            <option value="Basketball">Basketball</option>
          </select>
        </div>

        {/* Price Range Filter */}
        <div className="filter-group">
          <label>Min Price</label>
          <select
            value={filters.priceRange}
            onChange={(e) => handleFilterChange('priceRange', e.target.value)}
            className="filter-select"
          >
            <option value="all">Any Price</option>
            <option value="0-500">₹0 - ₹500</option>
            <option value="500-1000">₹500 - ₹1000</option>
            <option value="1000-2000">₹1000 - ₹2000</option>
            <option value="2000">₹2000+</option>
          </select>
        </div>

        {/* Max Price and Clear Button */}
        <div className="filter-group">
          <label>Max Price</label>
          <button
            onClick={handleClearFilters}
            className="clear-btn"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default VenueFilters; 
