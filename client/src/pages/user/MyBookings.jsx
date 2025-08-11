import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyBookings, cancelBooking } from '../../services/bookingService';
import { formatDate, formatTime } from '../../utils/dateUtils';
import '../../CSS/MyBookings.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const navigate = useNavigate();

  const statuses = ['all', 'Confirmed', 'Completed', 'Cancelled'];

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [statusFilter, dateFilter, bookings]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getMyBookings();
      setBookings(data);
      setFilteredBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = bookings;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    if (dateFilter !== 'all') {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(booking => {
            const bookingDate = new Date(booking.date);
            return bookingDate.toDateString() === today.toDateString();
          });
          break;
        case 'tomorrow':
          filtered = filtered.filter(booking => {
            const bookingDate = new Date(booking.date);
            return bookingDate.toDateString() === tomorrow.toDateString();
          });
          break;
        case 'upcoming':
          filtered = filtered.filter(booking => {
            const bookingDate = new Date(booking.date);
            return bookingDate > today;
          });
          break;
        case 'past':
          filtered = filtered.filter(booking => {
            const bookingDate = new Date(booking.date);
            return bookingDate < today;
          });
          break;
        default:
          break;
      }
    }

    setFilteredBookings(filtered);
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await cancelBooking(bookingId);
        // Refresh bookings after cancellation
        fetchBookings();
      } catch (error) {
        console.error('Error cancelling booking:', error);
        alert('Failed to cancel booking. Please try again.');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'status-confirmed';
      case 'Completed':
        return 'status-completed';
      case 'Cancelled':
        return 'status-cancelled';
      default:
        return 'status-default';
    }
  };

  const canCancel = (booking) => {
    const bookingDate = new Date(booking.date);
    const now = new Date();
    const hoursDiff = (bookingDate - now) / (1000 * 60 * 60);
    return booking.status === 'Confirmed' && hoursDiff > 2; // Can cancel if more than 2 hours before
  };

  if (loading) {
    return (
      <div className="my-bookings-container">
        <div className="loading">Loading your bookings...</div>
      </div>
    );
  }

  return (
    <div className="my-bookings-container">
      <div className="page-header">
        <h1>My Bookings</h1>
        <p>Manage and track all your court bookings</p>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Status:</label>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Statuses' : status}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Date:</label>
          <select 
            value={dateFilter} 
            onChange={(e) => setDateFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
        </div>

        <div className="filter-summary">
          <span>{filteredBookings.length} booking(s) found</span>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bookings-section">
        {filteredBookings.length === 0 ? (
          <div className="no-bookings">
            <div className="no-bookings-icon">📅</div>
            <h3>No bookings found</h3>
            <p>
              {statusFilter !== 'all' || dateFilter !== 'all' 
                ? 'Try adjusting your filters or '
                : 'Start by booking your first court! '
              }
              <button 
                className="book-now-link"
                onClick={() => navigate('/venues')}
              >
                Book Now
              </button>
            </p>
          </div>
        ) : (
          <div className="bookings-grid">
            {filteredBookings.map(booking => (
              <div key={booking._id} className="booking-card">
                <div className="booking-header">
                  <h3>{booking.venue?.name}</h3>
                  <span className={`status-badge ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="booking-details">
                  <div className="detail-row">
                    <span className="detail-label">Sport:</span>
                    <span className="detail-value">{booking.court?.sportType}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Court:</span>
                    <span className="detail-value">{booking.court?.name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">{formatDate(booking.date)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Time:</span>
                    <span className="detail-value">
                      {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Price:</span>
                    <span className="detail-value">₹{booking.totalPrice}</span>
                  </div>
                </div>

                <div className="booking-actions">
                  {canCancel(booking) && (
                    <button
                      className="cancel-btn"
                      onClick={() => handleCancelBooking(booking._id)}
                    >
                      Cancel Booking
                    </button>
                  )}
                  <button
                    className="view-venue-btn"
                    onClick={() => navigate(`/venue/${booking.venue?._id}`)}
                  >
                    View Venue
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button 
          className="primary-btn"
          onClick={() => navigate('/venues')}
        >
          Book New Court
        </button>
        <button 
          className="secondary-btn"
          onClick={() => {
            setStatusFilter('all');
            setDateFilter('all');
          }}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default MyBookings; 
