import React from 'react';

const VenueCard = ({ venue, onVenueClick, onBookNow }) => {
  const handleVenueClick = (e) => {
    e.stopPropagation();
    onVenueClick();
  };

  const handleBookNow = (e) => {
    e.stopPropagation();
    onBookNow();
  };

  return (
    <div className="venue-card" onClick={handleVenueClick}>
      <div className="venue-image">
        {venue.photos && venue.photos.length > 0 ? (
          <img src={venue.photos[0]} alt={venue.name} />
        ) : (
          <div className="placeholder">🏟️</div>
        )}
      </div>
      
      <div className="venue-content">
        <div className="venue-header">
          <h3 className="venue-name">{venue.name}</h3>
          {venue.rating && (
            <div className="venue-rating">
              ⭐ {venue.rating}
            </div>
          )}
        </div>
        
        <div className="venue-location">
          📍 {venue.address?.city}, {venue.address?.state}
        </div>
        
        <div className="venue-sports">
          {venue.sportTypes?.slice(0, 3).map((sport, index) => (
            <span key={index} className={`sport-tag ${sport.toLowerCase()}`}>
              {sport}
            </span>
          ))}
          {venue.sportTypes?.length > 3 && (
            <span className="sport-tag">+{venue.sportTypes.length - 3}</span>
          )}
        </div>
        
        <div className="venue-footer">
          <div className="venue-price">
            <span className="currency">₹</span>
            {venue.courts?.[0]?.pricePerHour || venue.pricePerHour || 'N/A'}
            <span className="per-hour">/hour</span>
          </div>
          
          <button className="view-venue-btn" onClick={handleBookNow}>
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default VenueCard; 
