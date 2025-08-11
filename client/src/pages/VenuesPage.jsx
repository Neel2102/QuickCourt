import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/VenuesPage.css';
import Navbar from '../components/Navbar';

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
      <div className="venues-page-venuepages">
        <div className="loading-container-venuepages">
          <div className="loading-spinner-venuepages"></div>
          <p>Loading venues...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="venues-page-venuepages">
        <div className="error-container-venuepages">
          <p className="error-message-venuepages">{error}</p>
          <button onClick={fetchVenues} className="retry-button-venuepages">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="venues-page-venuepages">
       <Navbar/>
      <div className="venues-header-venuepages">
        <h1>Find Your Perfect Court</h1>
        <p>Discover and book sports facilities near you</p>
      </div>

      <div className="venues-container-venuepages">
        {/* Filters Sidebar */}
        <aside className="filters-sidebar-venuepages">
          <div className="filters-header-venuepages">
            <h3>Filters</h3>
            <button onClick={clearFilters} className="clear-filters-venuepages">
              Clear All
            </button>
          </div>

          <div className="filter-group-venuepages">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search venues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filter-input-venuepages"
            />
          </div>

          <div className="filter-group-venuepages">
            <label>Sport Type</label>
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="filter-select-venuepages"
            >
              <option value="">All Sports</option>
              {sportTypes.map(sport => (
                <option key={sport} value={sport}>{sport}</option>
              ))}
            </select>
          </div>

          <div className="filter-group-venuepages">
            <label>City</label>
            <input
              type="text"
              placeholder="Enter city..."
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="filter-input-venuepages"
            />
          </div>
        </aside>

        {/* Venues Grid */}
        <main className="venues-grid-venuepages">
          {filteredVenues.length === 0 ? (
            <div className="no-venues-venuepages">
              <h3>No venues found</h3>
              <p>Try adjusting your filters or search terms</p>
            </div>
          ) : (
            filteredVenues.map(venue => (
              <div
                key={venue._id}
                className="venue-card-venuepages"
                onClick={() => handleVenueClick(venue._id)}
              >
                <div className="venue-image-venuepages">
                  {venue.photos && venue.photos.length > 0 ? (
                    <img src={venue.photos[0]} alt={venue.name} />
                  ) : (
                    <div className="venue-placeholder-venuepages">
                      <span>🏟️</span>
                    </div>
                  )}
                  <div className="venue-rating-badge-venuepages">
                    <span className="rating-venuepages">⭐ {venue.rating || 4.5}</span>
                  </div>
                </div>
                
                <div className="venue-info-venuepages">
                  <h3 className="venue-name-venuepages">{venue.name}</h3>
                  <p className="venue-location-venuepages">
                    📍 {venue.address.city}, {venue.address.state}
                  </p>
                  
                  <div className="venue-sports-venuepages">
                    {venue.sportTypes.slice(0, 1).map(sport => (
                      <span key={sport} className="sport-tag-venuepages">{sport.toUpperCase()}</span>
                    ))}
                  </div>

                  <div className="venue-price-venuepages">
                    <span className="price-symbol-venuepages">₹</span>
                    <span className="price-amount-venuepages">N/A</span>
                    <span className="price-unit-venuepages">/hour</span>
                  </div>

                  <div className="venue-amenities-venuepages">
                    {venue.amenities && venue.amenities.slice(0, 2).map(amenity => (
                      <span key={amenity} className="amenity-tag-venuepages">{amenity}</span>
                    ))}
                  </div>
                </div>

                <div className="venue-actions-venuepages">
                  <button className="btn-venuepages">
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