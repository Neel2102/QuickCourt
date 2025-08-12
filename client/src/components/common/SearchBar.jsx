import React from 'react';

const SearchBar = ({ value, onChange, placeholder = "Search...", className = "" }) => {
  return (
    <div className={`search-bar ${className}`}  style={{ width: '46%' }}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="search-input"
      />
      {/* <div className="search-icon">🔍</div> */}
    </div>
  );
};

export default SearchBar; 
