import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyBookings, cancelBooking } from '../../services/bookingService';
import { formatDate, formatTime } from '../../utils/dateUtils';
import ReportForm from '../../components/ReportForm';
import '../../CSS/MyBookings.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showReportForm, setShowReportForm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
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
        return 'status-confirmed-mybookings';
      case 'Pending':
        return 'status-pending-mybookings';
      case 'Completed':
        return 'status-completed-mybookings';
      case 'Cancelled':
        return 'status-cancelled-mybookings';
      default:
        return 'status-default-mybookings';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Confirmed':
        return '✅ Confirmed';
      case 'Pending':
        return '⏳ Payment Pending';
      case 'Completed':
        return '🏆 Completed';
      case 'Cancelled':
        return '❌ Cancelled';
      default:
        return status;
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
      <div className="container-mybookings">
        <div className="loading-mybookings">Loading your bookings...</div>
      </div>
    );
  }

  return (
    <div className="container-mybookings">
      <div className="header-mybookings">
        <h1>My Bookings</h1>
        <p>Manage and track all your court bookings</p>
      </div>

      {/* Filters */}
      <div className="filters-section-mybookings">
        <div className="filter-group-mybookings">
          <label>Status:</label>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select-mybookings"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Statuses' : status}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group-mybookings">
          <label>Date:</label>
          <select 
            value={dateFilter} 
            onChange={(e) => setDateFilter(e.target.value)}
            className="filter-select-mybookings"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
        </div>

        <div className="filter-summary-mybookings">
          <span>{filteredBookings.length} booking(s) found</span>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bookings-section-mybookings">
        {filteredBookings.length === 0 ? (
          <div className="no-bookings-mybookings">
            <div className="no-bookings-icon-mybookings">📅</div>
            <h3>No bookings found</h3>
            <p>
              {statusFilter !== 'all' || dateFilter !== 'all' 
                ? 'Try adjusting your filters or '
                : 'Start by booking your first court! '
              }
              <button 
                className="book-now-link-mybookings"
                onClick={() => navigate('/venues')}
              >
                Book Now
              </button>
            </p>
          </div>
        ) : (
          <div className="bookings-grid-mybookings">
            {filteredBookings.map(booking => (
              <div key={booking._id} className="booking-card-mybookings">
                <div className="booking-header-mybookings">
                  <h3>{booking.venue?.name}</h3>
                  <span className={`status-badge-mybookings ${getStatusColor(booking.status)}`}>
                    {getStatusText(booking.status)}
                  </span>
                </div>

                <div className="booking-details-mybookings">
                  <div className="detail-row-mybookings">
                    <span className="detail-label-mybookings">Sport:</span>
                    <span className="detail-value-mybookings">{booking.court?.sportType}</span>
                  </div>
                  <div className="detail-row-mybookings">
                    <span className="detail-label-mybookings">Court:</span>
                    <span className="detail-value-mybookings">{booking.court?.name}</span>
                  </div>
                  <div className="detail-row-mybookings">
                    <span className="detail-label-mybookings">Date:</span>
                    <span className="detail-value-mybookings">{formatDate(booking.date)}</span>
                  </div>
                  <div className="detail-row-mybookings">
                    <span className="detail-label-mybookings">Time:</span>
                    <span className="detail-value-mybookings">
                      {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                    </span>
                  </div>
                  <div className="detail-row-mybookings">
                    <span className="detail-label-mybookings">Price:</span>
                    <span className="detail-value-mybookings">₹{booking.totalPrice}</span>
                  </div>
                </div>

                <div className="booking-actions-mybookings">
                  {canCancel(booking) && (
                    <button
                      className="cancel-btn-mybookings"
                      onClick={() => handleCancelBooking(booking._id)}
                    >
                      Cancel Booking
                    </button>
                  )}
                  <button
                    className="view-venue-btn-mybookings"
                    onClick={() => navigate(`/venue/${booking.venue?._id}`)}
                  >
                    View Venue
                  </button>
                  <button
                    className="report-btn-mybookings"
                    onClick={() => {
                      setSelectedBooking(booking);
                      setShowReportForm(true);
                    }}
                  >
                    🚨 Report Issue
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-mybookings">
        <button 
          className="primary-btn-mybookings"
          onClick={() => navigate('/venues')}
        >
          Book New Court
        </button>
        <button 
          className="secondary-btn-mybookings"
          onClick={() => {
            setStatusFilter('all');
            setDateFilter('all');
          }}
        >
          Clear Filters
        </button>
      </div>

      {/* Report Form Modal */}
      {showReportForm && (
        <ReportForm
          onClose={() => {
            setShowReportForm(false);
            setSelectedBooking(null);
          }}
          onReportSubmitted={(report) => {
            setShowReportForm(false);
            setSelectedBooking(null);
            // Optionally show success message
          }}
          initialData={selectedBooking ? {
            targetType: 'booking',
            targetId: selectedBooking._id,
            reason: `Issue with booking at ${selectedBooking.venue?.name} on ${formatDate(selectedBooking.date)}`
          } : undefined}
        />
      )}
    </div>
  );
};

export default MyBookings;