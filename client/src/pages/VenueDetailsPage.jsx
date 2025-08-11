import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookingModal from '../components/booking/BookingModal';
import '../CSS/VenueDetailsPage.css';

const VenueDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    fetchVenueDetails();
    fetchCourts();
  }, [id]);

  const fetchVenueDetails = async () => {
    try {
      const response = await fetch(`/api/venues/${id}`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setVenue(data.data);
      } else {
        setError(data.message || 'Failed to fetch venue details');
      }
    } catch (err) {
      setError('Failed to load venue details');
      console.error('Error fetching venue:', err);
    }
  };

  const fetchCourts = async () => {
    try {
      const response = await fetch(`/api/courts/${id}`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setCourts(data.data || []);
      } else {
        console.error('Failed to fetch courts:', data.message);
      }
    } catch (err) {
      console.error('Error fetching courts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookCourt = (court) => {
    const userRole = localStorage.getItem('role');
    if (!userRole) {
      navigate('/login');
      return;
    }
    
    setSelectedCourt(court);
    setShowBookingModal(true);
  };

  const handleBookingSuccess = () => {
    setShowBookingModal(false);
    setSelectedCourt(null);
    // Optionally refresh courts data or show success message
  };

  if (loading) {
    return (
      <div className="venue-details-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading venue details...</p>
        </div>
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="venue-details-page">
        <div className="error-container">
          <p className="error-message">{error || 'Venue not found'}</p>
          <button onClick={() => navigate('/venues')} className="back-button">
            Back to Venues
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="venue-details-page">
      {/* Header */}
      <div className="venue-header">
        <button onClick={() => navigate('/venues')} className="back-button">
          ← Back to Venues
        </button>
        <div className="venue-title-section">
          <h1>{venue.name}</h1>
          <div className="venue-meta">
            <span className="location">📍 {venue.address.street}, {venue.address.city}, {venue.address.state}</span>
            <div className="rating">
              <span>⭐ {venue.rating || 0}</span>
              <span>({venue.numberOfReviews || 0} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="venue-content">
        {/* Image Gallery */}
        <div className="image-gallery">
          {venue.photos && venue.photos.length > 0 ? (
            <>
              <div className="main-image">
                <img src={venue.photos[activeImageIndex]} alt={venue.name} />
              </div>
              {venue.photos.length > 1 && (
                <div className="image-thumbnails">
                  {venue.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`${venue.name} ${index + 1}`}
                      className={index === activeImageIndex ? 'active' : ''}
                      onClick={() => setActiveImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="no-images">
              <span>🏟️</span>
              <p>No images available</p>
            </div>
          )}
        </div>

        {/* Venue Information */}
        <div className="venue-info">
          <div className="info-section">
            <h2>About This Venue</h2>
            <p>{venue.description}</p>
          </div>

          <div className="info-section">
            <h3>Sports Available</h3>
            <div className="sports-list">
              {venue.sportTypes.map(sport => (
                <span key={sport} className="sport-badge">{sport}</span>
              ))}
            </div>
          </div>

          {venue.amenities && venue.amenities.length > 0 && (
            <div className="info-section">
              <h3>Amenities</h3>
              <div className="amenities-list">
                {venue.amenities.map(amenity => (
                  <span key={amenity} className="amenity-item">✓ {amenity}</span>
                ))}
              </div>
            </div>
          )}

          <div className="info-section">
            <h3>Address</h3>
            <div className="address-details">
              <p>{venue.address.street}</p>
              <p>{venue.address.city}, {venue.address.state} {venue.address.postalCode}</p>
            </div>
          </div>
        </div>

        {/* Courts Section */}
        <div className="courts-section">
          <h2>Available Courts</h2>
          {courts.length === 0 ? (
            <div className="no-courts">
              <p>No courts available at this venue</p>
            </div>
          ) : (
            <div className="courts-grid">
              {courts.map(court => (
                <div key={court._id} className="court-card">
                  <div className="court-header">
                    <h3>{court.name}</h3>
                    <span className="sport-type">{court.sportType}</span>
                  </div>
                  
                  <div className="court-details">
                    <div className="price">
                      <span className="price-amount">₹{court.pricePerHour}</span>
                      <span className="price-unit">/hour</span>
                    </div>
                    
                    <div className="operating-hours">
                      <span>🕒 {court.operatingHours.start} - {court.operatingHours.end}</span>
                    </div>
                  </div>

                  <button 
                    className="book-court-btn"
                    onClick={() => handleBookCourt(court)}
                  >
                    Book This Court
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedCourt && (
        <BookingModal
          court={selectedCourt}
          venue={venue}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedCourt(null);
          }}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};

export default VenueDetailsPage;
