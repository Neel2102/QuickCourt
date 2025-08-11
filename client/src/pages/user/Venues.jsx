import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVenues, searchVenues } from '../../services/venueService';
import { getCourts } from '../../services/courtService';
import VenueCard from '../../components/venue/VenueCard';
import SearchBar from '../../components/common/SearchBar';
import VenueFilters from '../../components/venue/VenueFilters';
import BookingModal from '../../components/booking/BookingModal';
import { toast } from 'react-toastify';
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
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [venueCourts, setVenueCourts] = useState({});
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

      // Fetch courts for each venue
      const courtsData = {};
      for (const venue of data) {
        try {
          const courts = await getCourts(venue._id);
          courtsData[venue._id] = courts;
        } catch (error) {
          console.error(`Error fetching courts for venue ${venue._id}:`, error);
          courtsData[venue._id] = [];
        }
      }
      setVenueCourts(courtsData);
    } catch (error) {
      console.error('Error fetching venues:', error);
      toast.error('Failed to load venues. Please try again.');
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

  const handleBookNow = async (venueId) => {
    try {
      const venue = venues.find(v => v._id === venueId);
      const courts = venueCourts[venueId] || [];

      if (!venue) {
        toast.error('Venue not found');
        return;
      }

      if (courts.length === 0) {
        toast.error('No courts available for this venue');
        return;
      }

      // If only one court, select it automatically
      if (courts.length === 1) {
        setSelectedVenue(venue);
        setSelectedCourt(courts[0]);
        setShowBookingModal(true);
      } else {
        // Multiple courts - show court selection or navigate to venue details
        navigate(`/venue/${venueId}`);
      }
    } catch (error) {
      console.error('Error handling book now:', error);
      toast.error('Failed to initiate booking. Please try again.');
    }
  };

  const handleCloseBookingModal = () => {
    setShowBookingModal(false);
    setSelectedVenue(null);
    setSelectedCourt(null);
  };

  const handleBookingSuccess = () => {
    toast.success('Booking created successfully!');
    handleCloseBookingModal();
    // Optionally refresh data or navigate to bookings page
  };

  // Pagination
  const indexOfLastVenue = currentPage * venuesPerPage;
  const indexOfFirstVenue = indexOfLastVenue - venuesPerPage;
  const currentVenues = filteredVenues.slice(indexOfFirstVenue, indexOfLastVenue);
  const totalPages = Math.ceil(filteredVenues.length / venuesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="venues-container-venues">
        <div className="loading-venues">Loading venues...</div>
      </div>
    );
  }

  return (
    <div className="venues-container-venues">
      <div className="page-header-venues">
        <h1>Sports Venues</h1>
        <p>Discover and book sports facilities in your area</p>
      </div>

      {/* Search and Filters */}
      <div className="search-filters-section-venues">
        <div className="search-container-venues">
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
      <div className="results-summary-venues">
        <span className="results-count-venues">
          {filteredVenues.length} venue(s) found
        </span>
        {Object.values(filters).some(f => f !== 'all' && f !== '') && (
          <button 
            className="clear-filters-btn-venues"
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
      <div className="venues-section-venues">
        {currentVenues.length === 0 ? (
          <div className="no-venues-venues">
            <div className="no-venues-icon-venues">🔍</div>
            <h3>No venues found</h3>
            <p>
              {searchTerm || Object.values(filters).some(f => f !== 'all' && f !== '')
                ? 'Try adjusting your search criteria or filters'
                : 'No venues are currently available'
              }
            </p>
            {(searchTerm || Object.values(filters).some(f => f !== 'all' && f !== '')) && (
              <button 
                className="clear-search-btn-venues"
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
            <div className="venues-grid-venues">
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
              <div className="pagination-venues">
                <button
                  className="pagination-btn-venues"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                  <button
                    key={number}
                    className={`pagination-btn-venues ${currentPage === number ? 'active-venues' : ''}`}
                    onClick={() => paginate(number)}
                  >
                    {number}
                  </button>
                ))}
                
                <button
                  className="pagination-btn-venues"
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
      <div className="quick-actions-venues">
        <button 
          className="primary-btn-venues"
          onClick={() => navigate('/venues')}
        >
          View All Venues
        </button>
        <button 
          className="secondary-btn-venues"
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

      {/* Booking Modal */}
      {showBookingModal && selectedVenue && selectedCourt && (
        <BookingModal
          venue={selectedVenue}
          court={selectedCourt}
          onClose={handleCloseBookingModal}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};

export default Venues;