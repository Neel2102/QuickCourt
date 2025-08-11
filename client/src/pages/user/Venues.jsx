import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVenues, searchVenues } from '../../services/venueService';
import VenueCard from '../../components/venue/VenueCard';
import SearchBar from '../../components/common/SearchBar';
import VenueFilters from '../../components/venue/VenueFilters';
import '../../CSS/Venues.css';

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    sportType: 'all',
    priceRange: 'all',
    rating: 'all',
    city: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [venuesPerPage] = useState(12);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVenues();
  }, []);

  useEffect(() => {
    filterVenues();
  }, [searchTerm, filters, venues]);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const data = await getVenues();
      setVenues(data);
      setFilteredVenues(data);
    } catch (error) {
      console.error('Error fetching venues:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterVenues = () => {
    let filtered = venues;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(venue =>
        venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sport type filter
    if (filters.sportType !== 'all') {
      filtered = filtered.filter(venue =>
        venue.sportTypes.includes(filters.sportType)
      );
    }

    // Price range filter
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(venue => {
        const minPrice = Math.min(...venue.courts?.map(c => c.pricePerHour) || [0]);
        if (max) {
          return minPrice >= min && minPrice <= max;
        } else {
          return minPrice >= min;
        }
      });
    }

    // Rating filter
    if (filters.rating !== 'all') {
      const minRating = Number(filters.rating);
      filtered = filtered.filter(venue => venue.rating >= minRating);
    }

    // City filter
    if (filters.city) {
      filtered = filtered.filter(venue =>
        venue.address.city.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    setFilteredVenues(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleVenueClick = (venueId) => {
    navigate(`/venue/${venueId}`);
  };

  const handleBookNow = (venueId) => {
    navigate(`/venue/${venueId}`);
  };

  // Pagination
  const indexOfLastVenue = currentPage * venuesPerPage;
  const indexOfFirstVenue = indexOfLastVenue - venuesPerPage;
  const currentVenues = filteredVenues.slice(indexOfFirstVenue, indexOfLastVenue);
  const totalPages = Math.ceil(filteredVenues.length / venuesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="venues-container">
        <div className="loading">Loading venues...</div>
      </div>
    );
  }

  return (
    <div className="venues-container">
      <div className="page-header">
        <h1>Sports Venues</h1>
        <p>Discover and book sports facilities in your area</p>
      </div>

      {/* Search and Filters */}
      <div className="search-filters-section">
        <div className="search-container">
          <SearchBar
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search venues by name, location, or description..."
          />
        </div>
        
        <VenueFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </div>

      {/* Results Summary */}
      <div className="results-summary">
        <span className="results-count">
          {filteredVenues.length} venue(s) found
        </span>
        {Object.values(filters).some(f => f !== 'all' && f !== '') && (
          <button 
            className="clear-filters-btn"
            onClick={() => {
              setFilters({
                sportType: 'all',
                priceRange: 'all',
                rating: 'all',
                city: ''
              });
              setSearchTerm('');
            }}
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* Venues Grid */}
      <div className="venues-section">
        {currentVenues.length === 0 ? (
          <div className="no-venues">
            <div className="no-venues-icon">🔍</div>
            <h3>No venues found</h3>
            <p>
              {searchTerm || Object.values(filters).some(f => f !== 'all' && f !== '')
                ? 'Try adjusting your search criteria or filters'
                : 'No venues are currently available'
              }
            </p>
            {(searchTerm || Object.values(filters).some(f => f !== 'all' && f !== '')) && (
              <button 
                className="clear-search-btn"
                onClick={() => {
                  setFilters({
                    sportType: 'all',
                    priceRange: 'all',
                    rating: 'all',
                    city: ''
                  });
                  setSearchTerm('');
                }}
              >
                Clear Search & Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="venues-grid">
              {currentVenues.map(venue => (
                <VenueCard
                  key={venue._id}
                  venue={venue}
                  onVenueClick={() => handleVenueClick(venue._id)}
                  onBookNow={() => handleBookNow(venue._id)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                  <button
                    key={number}
                    className={`pagination-btn ${currentPage === number ? 'active' : ''}`}
                    onClick={() => paginate(number)}
                  >
                    {number}
                  </button>
                ))}
                
                <button
                  className="pagination-btn"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button 
          className="primary-btn"
          onClick={() => navigate('/venues')}
        >
          View All Venues
        </button>
        <button 
          className="secondary-btn"
          onClick={() => {
            setSearchTerm('');
            setFilters({
              sportType: 'all',
              priceRange: 'all',
              rating: 'all',
              city: ''
            });
          }}
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default Venues; 
