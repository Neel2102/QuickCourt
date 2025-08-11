import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVenues } from '../../services/venueService';
import VenueCard from '../../components/venue/VenueCard';
import SearchBar from '../../components/common/SearchBar';
import '../../CSS/Home.css';

const Home = () => {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('all');
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
    navigate(`/venue/${venueId}`);
  };

  const handleBookNow = (venueId) => {
    navigate(`/venue/${venueId}`);
  };

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading">Loading venues...</div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Welcome Banner */}
      <section className="welcome-banner">
        <div className="banner-content">
          <h1>Welcome to QuickCourt</h1>
          <p>Book your favorite sports facilities and join the game!</p>
          <button 
            className="cta-button"
            onClick={() => navigate('/venues')}
          >
            Explore Venues
          </button>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="search-section">
        <div className="search-container">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search venues by name or location..."
          />
          <div className="sport-filters">
            {sports.map(sport => (
              <button
                key={sport}
                className={`sport-filter ${selectedSport === sport ? 'active' : ''}`}
                onClick={() => setSelectedSport(sport)}
              >
                {sport === 'all' ? 'All Sports' : sport}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Venues */}
      <section className="venues-section">
        <div className="section-header">
          <h2>Popular Venues</h2>
          <p>Discover the best sports facilities in your area</p>
        </div>
        
        {filteredVenues.length === 0 ? (
          <div className="no-venues">
            <p>No venues found matching your criteria.</p>
            <button onClick={() => {
              setSearchTerm('');
              setSelectedSport('all');
            }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="venues-grid">
            {filteredVenues.slice(0, 6).map(venue => (
              <VenueCard
                key={venue._id}
                venue={venue}
                onVenueClick={() => handleVenueClick(venue._id)}
                onBookNow={() => handleBookNow(venue._id)}
              />
            ))}
          </div>
        )}

        {filteredVenues.length > 6 && (
          <div className="view-more">
            <button 
              className="view-more-btn"
              onClick={() => navigate('/venues')}
            >
              View All Venues
            </button>
          </div>
        )}
      </section>

      {/* Quick Stats */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{venues.length}</h3>
            <p>Available Venues</p>
          </div>
          <div className="stat-card">
            <h3>{sports.length - 1}</h3>
            <p>Sports Types</p>
          </div>
          <div className="stat-card">
            <h3>24/7</h3>
            <p>Booking Available</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 
