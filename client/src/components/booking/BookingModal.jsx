import React, { useMemo, useState, useEffect } from 'react';
import './BookingModal.css';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './PaymentElement.jsx';
import Button from '../common/Button.jsx';
import { toast } from 'react-toastify';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const BookingModal = ({ court, venue, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(() => {
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedStartTime, setSelectedStartTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [clientSecret, setClientSecret] = useState(null);
  const [bookingId, setBookingId] = useState(null);

  // Debug logging when component mounts or court changes
  useEffect(() => {
    console.log('BookingModal mounted/updated with court:', court);
    console.log('Court data structure:', {
      id: court?._id,
      name: court?.name,
      sportType: court?.sportType,
      pricePerHour: court?.pricePerHour,
      operatingHours: court?.operatingHours
    });
  }, [court]);

  const timeSlots = useMemo(() => {
    if (!court?.operatingHours?.start || !court?.operatingHours?.end) {
      console.log('Missing operating hours:', court?.operatingHours);
      return [];
    }
    const slots = [];
    const startHour = parseInt(court.operatingHours.start.split(':')[0]);
    const endHour = parseInt(court.operatingHours.end.split(':')[0]);
    console.log('Generating time slots:', { startHour, endHour, court: court });
    
    // Ensure we have valid hours and generate slots
    if (startHour < endHour) {
      for (let hour = startHour; hour < endHour; hour++) {
        const timeString = `${hour.toString().padStart(2, '0')}:00`;
        slots.push(timeString);
      }
    } else {
      // Handle case where operating hours might be invalid
      console.warn('Invalid operating hours:', { startHour, endHour });
      // Generate default slots from 6 AM to 10 PM
      for (let hour = 6; hour < 22; hour++) {
        const timeString = `${hour.toString().padStart(2, '0')}:00`;
        slots.push(timeString);
      }
    }
    
    console.log('Generated time slots:', slots);
    return slots;
  }, [court]);

  useEffect(() => {
    if (selectedStartTime && selectedEndTime && court?.pricePerHour) {
      // Convert time strings to Date objects for proper calculation
      const start = new Date(`1970-01-01T${selectedStartTime}:00`);
      const end = new Date(`1970-01-01T${selectedEndTime}:00`);
      
      // Calculate duration in hours
      const durationHours = (end - start) / (1000 * 60 * 60);
      
      console.log('Price calculation:', {
        startTime: selectedStartTime,
        endTime: selectedEndTime,
        start: start,
        end: end,
        durationHours: durationHours,
        pricePerHour: court.pricePerHour
      });
      
      if (durationHours > 0) {
        const calculatedPrice = durationHours * court.pricePerHour;
        const finalPrice = Math.round(calculatedPrice * 100) / 100;
        setTotalPrice(finalPrice);
        console.log('Final price:', finalPrice);
      } else {
        setTotalPrice(0);
        console.log('Duration is 0 or negative, setting price to 0');
      }
    } else {
      setTotalPrice(0);
      console.log('Missing required fields for price calculation:', {
        selectedStartTime,
        selectedEndTime,
        pricePerHour: court?.pricePerHour
      });
    }
  }, [selectedStartTime, selectedEndTime, court?.pricePerHour]);

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedStartTime || !selectedEndTime) {
      setError('Please fill in all fields');
      return;
    }
    if (selectedStartTime >= selectedEndTime) {
      setError('End time must be after start time');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          courtId: court._id,
          date: selectedDate,
          startTime: selectedStartTime,
          endTime: selectedEndTime,
        }),
      });
      const data = await response.json();
      if (data.success && data.clientSecret) {
        setClientSecret(data.clientSecret);
        setBookingId(data.booking._id);
      } else {
        setError(data.message || 'Failed to create booking');
      }
    } catch (err) {
      setError('Failed to create booking. Please try again.');
      console.error('Booking error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentFailure = (message) => {
    toast.error(message || 'Payment failed. Please try again.');
  };

  return (
    <div className="booking-modal-overlay" onClick={handleOverlayClick}>
      <div className="booking-modal">
        <div className="modal-header">
          <h2>Book Court</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-content">
          <div className="booking-details">
            <div className="venue-info">
              <h3>{venue.name}</h3>
              <p>{court.name} - {court.sportType}</p>
              <p className="price">₹{court.pricePerHour}/hour</p>
            </div>
          </div>

          {clientSecret ? (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm 
                bookingId={bookingId} 
                totalPrice={totalPrice}
                onPaymentSuccess={() => {
                  toast.success('Payment initiated successfully!');
                  onClose();
                }}
                onPaymentFailure={handlePaymentFailure} 
              />
            </Elements>
          ) : (
            <form onSubmit={submitBooking} className="booking-form">
              {error && <div className="error-message">{error}</div>}

              <div className="form-group">
                <label htmlFor="date">Select Date</label>
                <input
                  type="date"
                  id="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={getMinDate()}
                  max={getMaxDate()}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="startTime">Start Time</label>
                  <select 
                    id="startTime" 
                    value={selectedStartTime} 
                    onChange={(e) => {
                      const value = e.target.value;
                      console.log('Start time selected:', value);
                      setSelectedStartTime(value);
                      // Reset end time if it's before or equal to start time
                      if (selectedEndTime && value >= selectedEndTime) {
                        setSelectedEndTime('');
                      }
                    }} 
                    required
                  >
                    <option value="">Select start time</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                  <small className="help-text">Choose when you want to start playing</small>
                </div>
                <div className="form-group">
                  <label htmlFor="endTime">End Time</label>
                  <select 
                    id="endTime" 
                    value={selectedEndTime} 
                    onChange={(e) => {
                      const value = e.target.value;
                      console.log('End time selected:', value);
                      setSelectedEndTime(value);
                    }} 
                    required
                  >
                    <option value="">Select end time</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                  <small className="help-text">Choose when you want to finish playing</small>
                </div>
              </div>

              {totalPrice > 0 && (
                <div className="price-summary">
                  <div className="price-row">
                    <span>Duration:</span>
                    <span>
                      {selectedStartTime && selectedEndTime && (() => {
                        const start = new Date(`1970-01-01T${selectedStartTime}:00`);
                        const end = new Date(`1970-01-01T${selectedEndTime}:00`);
                        const durationHours = (end - start) / (1000 * 60 * 60);
                        return `${durationHours.toFixed(1)} hours`;
                      })()}
                    </span>
                  </div>
                  <div className="price-row">
                    <span>Rate:</span>
                    <span>₹{court.pricePerHour}/hour</span>
                  </div>
                  <div className="price-row total">
                    <span>Total:</span>
                    <span>₹{totalPrice}</span>
                  </div>
                </div>
              )}

              {/* Debug information - remove in production */}
              <div className="debug-info" style={{background: '#f0f0f0', padding: '10px', margin: '10px 0', fontSize: '12px', borderRadius: '4px'}}>
                <strong>Debug Info:</strong><br/>
                Date: {selectedDate || 'Not selected'}<br/>
                Start Time: {selectedStartTime || 'Not selected'}<br/>
                End Time: {selectedEndTime || 'Not selected'}<br/>
                Price Per Hour: ₹{court?.pricePerHour || 'N/A'}<br/>
                Total Price: ₹{totalPrice}<br/>
                Button Disabled: {loading || !selectedDate || !selectedStartTime || !selectedEndTime || totalPrice <= 0 ? 'Yes' : 'No'}
              </div>

              {/* Validation message */}
              {(!selectedDate || !selectedStartTime || !selectedEndTime || totalPrice <= 0) && (
                <div className="validation-message" style={{background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: '6px', padding: '10px', margin: '10px 0', color: '#92400e'}}>
                  <strong>Please complete the following to proceed:</strong>
                  <ul style={{margin: '5px 0 0 20px', padding: 0}}>
                    {!selectedDate && <li>Select a date</li>}
                    {!selectedStartTime && <li>Choose a start time</li>}
                    {!selectedEndTime && <li>Choose an end time</li>}
                    {selectedStartTime && selectedEndTime && totalPrice <= 0 && <li>Ensure end time is after start time</li>}
                  </ul>
                </div>
              )}

              <div className="form-actions">
                <button type="button" onClick={onClose} className="cancel-button" disabled={loading}>
                  Cancel
                </button>
                <Button 
                  type="submit" 
                  loading={loading} 
                  disabled={loading || !selectedDate || !selectedStartTime || !selectedEndTime || totalPrice <= 0}
                >
                  {loading ? 'Processing...' : `Proceed to Payment (₹${totalPrice})`}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
