import React, { useMemo, useState, useEffect } from 'react';
import './BookingModal.css';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './PaymentElement.jsx';
import Button from '../common/Button.jsx';
import { toast } from 'react-toastify';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const BookingModal = ({ court, venue, onClose }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStartTime, setSelectedStartTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [clientSecret, setClientSecret] = useState(null);
  const [bookingId, setBookingId] = useState(null);

  const timeSlots = useMemo(() => {
    if (!court?.operatingHours?.start || !court?.operatingHours?.end) return [];
    const slots = [];
    const startHour = parseInt(court.operatingHours.start.split(':')[0]);
    const endHour = parseInt(court.operatingHours.end.split(':')[0]);
    for (let hour = startHour; hour < endHour; hour++) {
      const timeString = `${hour.toString().padStart(2, '0')}:00`;
      slots.push(timeString);
    }
    return slots;
  }, [court]);

  useEffect(() => {
    if (selectedStartTime && selectedEndTime) {
      const start = new Date(`1970/01/01T${selectedStartTime}:00Z`);
      const end = new Date(`1970/01/01T${selectedEndTime}:00Z`);
      const durationHours = (end - start) / (1000 * 60 * 60);
      if (durationHours > 0) {
        setTotalPrice(durationHours * court.pricePerHour);
      } else {
        setTotalPrice(0);
      }
    } else {
      setTotalPrice(0);
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
              <CheckoutForm bookingId={bookingId} onPaymentFailure={handlePaymentFailure} />
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
                  <select id="startTime" value={selectedStartTime} onChange={(e) => setSelectedStartTime(e.target.value)} required>
                    <option value="">Select start time</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="endTime">End Time</label>
                  <select id="endTime" value={selectedEndTime} onChange={(e) => setSelectedEndTime(e.target.value)} required>
                    <option value="">Select end time</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              {totalPrice > 0 && (
                <div className="price-summary">
                  <div className="price-row">
                    <span>Duration:</span>
                    <span>
                      {selectedStartTime && selectedEndTime && `${(
                        (new Date(`1970/01/01T${selectedEndTime}:00Z`) - new Date(`1970/01/01T${selectedStartTime}:00Z`)) /
                        (1000 * 60 * 60)
                      ).toFixed(1)} hours`}
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

              <div className="form-actions">
                <button type="button" onClick={onClose} className="cancel-button" disabled={loading}>
                  Cancel
                </button>
                <Button type="submit" loading={loading} disabled={loading || totalPrice === 0}>
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
