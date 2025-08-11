import React from 'react';
import '../../CSS/VenueCard.css';

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
    <div className="venue-card-venuecard" onClick={handleVenueClick}>
      <div className="venue-image-venuecard">
        {venue.photos && venue.photos.length > 0 ? (
          <img src={venue.photos[0]} alt={venue.name} className="venue-img-venuecard" />
        ) : (
          <div className="placeholder-venuecard">🏟️</div>
        )}
      </div>
      
      <div className="venue-content-venuecard">
        <div className="venue-header-venuecard">
          <h3 className="venue-name-venuecard">{venue.name}</h3>
          {venue.rating && (
            <div className="venue-rating-venuecard">
              ⭐ {venue.rating}
            </div>
          )}
        </div>
        
        <div className="venue-location-venuecard">
          📍 {venue.address?.city}, {venue.address?.state}
        </div>
        
        <div className="venue-sports-venuecard">
          {venue.sportTypes?.slice(0, 3).map((sport, index) => (
            <span key={index} className={`sport-tag-venuecard ${sport.toLowerCase()}-venuecard`}>
              {sport}
            </span>
          ))}
          {venue.sportTypes?.length > 3 && (
            <span className="sport-tag-venuecard">+{venue.sportTypes.length - 3}</span>
          )}
        </div>
        
        <div className="venue-footer-venuecard">
          <div className="venue-price-venuecard">
            <span className="currency-venuecard">₹</span>
            {venue.courts?.[0]?.pricePerHour || venue.pricePerHour || 'N/A'}
            <span className="per-hour-venuecard">/hour</span>
          </div>
          
          <button className="btn-venuecard" onClick={handleBookNow}>
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default VenueCard;