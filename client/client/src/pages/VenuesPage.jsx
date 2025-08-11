import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/VenuesPage.css';

const VenuesPage = () => {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const navigate = useNavigate();

  const sportTypes = ['Badminton', 'Tennis', 'Football', 'Basketball', 'Cricket', 'Table Tennis'];

  useEffect(() => {
    fetchVenues();
  }, []);

  useEffect(() => {
    filterVenues();
  }, [venues, searchTerm, selectedSport, selectedCity, priceRange]);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/venues/', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setVenues(data.data);
      } else {
        setError(data.message || 'Failed to fetch venues');
      }
    } catch (err) {
      setError('Failed to load venues');
      console.error('Error fetching venues:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterVenues = () => {
    let filtered = venues;

    // Search by name or description
    if (searchTerm) {
      filtered = filtered.filter(venue =>
        venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by sport type
    if (selectedSport) {
      filtered = filtered.filter(venue =>
        venue.sportTypes.includes(selectedSport)
      );
    }

    // Filter by city
    if (selectedCity) {
      filtered = filtered.filter(venue =>
        venue.address.city.toLowerCase().includes(selectedCity.toLowerCase())
      );
    }

    setFilteredVenues(filtered);
  };

  const handleVenueClick = (venueId) => {
    navigate(`/venue/${venueId}`);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSport('');
    setSelectedCity('');
    setPriceRange({ min: '', max: '' });
  };

  if (loading) {
    return (
      <div className="venues-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading venues...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="venues-page">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={fetchVenues} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="venues-page">
      <div className="venues-header">
        <h1>Find Your Perfect Court</h1>
        <p>Discover and book sports facilities near you</p>
      </div>

      <div className="venues-container">
        {/* Filters Sidebar */}
        <aside className="filters-sidebar">
          <div className="filters-header">
            <h3>Filters</h3>
            <button onClick={clearFilters} className="clear-filters">
              Clear All
            </button>
          </div>

          <div className="filter-group">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search venues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label>Sport Type</label>
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="filter-select"
            >
              <option value="">All Sports</option>
              {sportTypes.map(sport => (
                <option key={sport} value={sport}>{sport}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>City</label>
            <input
              type="text"
              placeholder="Enter city..."
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="filter-input"
            />
          </div>
        </aside>

        {/* Venues Grid */}
        <main className="venues-grid">
          {filteredVenues.length === 0 ? (
            <div className="no-venues">
              <h3>No venues found</h3>
              <p>Try adjusting your filters or search terms</p>
            </div>
          ) : (
            filteredVenues.map(venue => (
              <div
                key={venue._id}
                className="venue-card"
                onClick={() => handleVenueClick(venue._id)}
              >
                <div className="venue-image">
                  {venue.photos && venue.photos.length > 0 ? (
                    <img src={venue.photos[0]} alt={venue.name} />
                  ) : (
                    <div className="venue-placeholder">
                      <span>🏟️</span>
                    </div>
                  )}
                </div>
                
                <div className="venue-info">
                  <h3 className="venue-name">{venue.name}</h3>
                  <p className="venue-location">
                    📍 {venue.address.city}, {venue.address.state}
                  </p>
                  
                  <div className="venue-sports">
                    {venue.sportTypes.slice(0, 3).map(sport => (
                      <span key={sport} className="sport-tag">{sport}</span>
                    ))}
                    {venue.sportTypes.length > 3 && (
                      <span className="sport-tag more">+{venue.sportTypes.length - 3}</span>
                    )}
                  </div>

                  <div className="venue-rating">
                    <span className="rating">⭐ {venue.rating || 0}</span>
                    <span className="reviews">({venue.numberOfReviews || 0} reviews)</span>
                  </div>

                  <div className="venue-amenities">
                    {venue.amenities && venue.amenities.slice(0, 2).map(amenity => (
                      <span key={amenity} className="amenity-tag">{amenity}</span>
                    ))}
                  </div>
                </div>

                <div className="venue-actions">
                  <button className="book-now-btn">
                    Book Now
                  </button>
                </div>
              </div>
            ))
          )}
        </main>
      </div>
    </div>
  );
};

export default VenuesPage;
