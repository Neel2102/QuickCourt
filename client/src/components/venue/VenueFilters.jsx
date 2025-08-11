import React from 'react';

const VenueFilters = ({
  city = '',
  sport = '',
  minPrice = '',
  maxPrice = '',
  sports = [],
  onChange,
  onClear
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange && onChange({ name, value });
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
      <input
        type="text"
        name="city"
        value={city}
        onChange={handleChange}
        placeholder="City"
        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
      />

      <select
        name="sport"
        value={sport}
        onChange={handleChange}
        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Sports</option>
        {sports.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <input
        type="number"
        name="minPrice"
        value={minPrice}
        onChange={handleChange}
        placeholder="Min Price"
        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex items-center space-x-2">
        <input
          type="number"
          name="maxPrice"
          value={maxPrice}
          onChange={handleChange}
          placeholder="Max Price"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={onClear}
          className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default VenueFilters; 
