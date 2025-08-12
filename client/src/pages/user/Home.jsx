import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVenues } from '../../services/venueService';
import VenueCard from '../../components/venue/VenueCard';
import SearchBar from '../../components/common/SearchBar';
import ReportForm from '../../components/ReportForm';
import '../../CSS/Home.css';

const Home = () => {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('all');
  const [showReportForm, setShowReportForm] = useState(false);
  const navigate = useNavigate();

  const sports = ['all', 'Tennis', 'Badminton', 'Football', 'Cricket', 'Basketball'];

  useEffect(() => {
    fetchVenues();
  }, []);

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

  useEffect(() => {
    filterVenues();
  }, [searchTerm, selectedSport, venues]);

  const filterVenues = () => {
    let filtered = venues;

    if (searchTerm) {
      filtered = filtered.filter(venue =>
        venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.address.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSport !== 'all') {
      filtered = filtered.filter(venue =>
        venue.sportTypes.includes(selectedSport)
      );
    }

    setFilteredVenues(filtered);
  };

  const handleVenueClick = (venueId) => {
    navigate(`/user-dashboard/venue/${venueId}`);
  };

  const handleBookNow = (venueId) => {
    navigate(`/user-dashboard/venue/${venueId}`);
  };

  if (loading) {
    return (
      <div className="home-container-header">
        <div className="loading-header">Loading venues...</div>
      </div>
    );
  }

  return (
    <div className="home-container-header">
      {/* Welcome Banner */}
      <section className="welcome-banner-header">
        <div className="banner-content-header">
          <h1>Welcome to QuickCourt</h1>
          <p>Book your favorite sports facilities and join the game!</p>
          <button
            className="btn-header cta-button-header"
            onClick={() => navigate('/user-dashboard/venues')}
          >
            Explore Venues
          </button>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="search-section-header">
        <div className="search-container-header">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search venues by name or location...🔍"
          />
          <div className="sport-filters-header">
            {sports.map(sport => (
              <button
                key={sport}
                className={`sport-filter-header ${selectedSport === sport ? 'active' : ''}`}
                onClick={() => setSelectedSport(sport)}
              >
                {sport === 'all' ? 'All Sports' : sport}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Venues */}
      <section className="venues-section-header">
        <div className="section-header-header">
          <h2>Popular Venues</h2>
          <p>Discover the best sports facilities in your area</p>
        </div>
        
        {filteredVenues.length === 0 ? (
          <div className="no-venues-header">
            <p>No venues found matching your criteria.</p>
            <button 
              className="btn-header"
              onClick={() => {
                setSearchTerm('');
                setSelectedSport('all');
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="venues-grid-header">
            {filteredVenues.slice(0, 6).map(venue => (
              <div key={venue._id} className="venue-card-header">
                <div className="venue-image-header">
                  {venue.image ? (
                    <img src={venue.image} alt={venue.name} />
                  ) : (
                    <div className="placeholder-header">🏟️</div>
                  )}
                </div>
                <div className="venue-content-header">
                  <div className="venue-header-header">
                    <h3 className="venue-name-header">{venue.name}</h3>
                    <div className="venue-rating-header">
                      ⭐ {venue.rating || '4.5'}
                    </div>
                  </div>
                  <div className="venue-location-header">
                    📍 {venue.address?.city || 'Location'}
                  </div>
                  <div className="venue-sports-header">
                    {venue.sportTypes?.map(sport => (
                      <span key={sport} className={`sport-tag-header ${sport.toLowerCase()}`}>
                        {sport}
                      </span>
                    ))}
                  </div>
                  <div className="venue-footer-header">
                    <div className="venue-price-header">
                      <span className="currency-header">₹</span>
                      {venue.pricePerHour || 'N/A'}
                      <span className="per-hour-header">/hour</span>
                    </div>
                    <button 
                      className="btn-header view-venue-btn-header"
                      onClick={() => handleVenueClick(venue._id)}
                    >
                      View Venue
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredVenues.length > 6 && (
          <div className="view-more-header">
            <button
              className="btn-header view-more-btn-header"
              onClick={() => navigate('/user-dashboard/venues')}
            >
              View All Venues
            </button>
          </div>
        )}
      </section>

      {/* Quick Stats */}
      <section className="stats-section-header">
        <div className="stats-grid-header">
          <div className="stat-card-header">
            <h3>{venues.length}</h3>
            <p>Available Venues</p>
          </div>
          <div className="stat-card-header">
            <h3>{sports.length - 1}</h3>
            <p>Sports Types</p>
          </div>
          <div className="stat-card-header">
            <h3>24/7</h3>
            <p>Booking Available</p>
          </div>
        </div>
      </section>

      {/* Report Form Modal */}
      {showReportForm && (
        <ReportForm
          onClose={() => setShowReportForm(false)}
          onReportSubmitted={(report) => {
            setShowReportForm(false);
            // Optionally show success message or refresh data
          }}
        />
      )}
    </div>
  );
};

export default Home;