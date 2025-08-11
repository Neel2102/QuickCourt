import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getOwnerBookings, updateBooking } from '../../services/bookingService';
import { getOwnerVenues } from '../../services/venueService';
import { formatDate, formatTime } from '../../utils/dateUtils';
import '../../CSS/BookingOverview.css';

const BookingOverview = () => {
  const [bookings, setBookings] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVenue, setSelectedVenue] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const statuses = ['all', 'Confirmed', 'Completed', 'Cancelled'];
  const dateFilters = ['all', 'today', 'tomorrow', 'upcoming', 'past'];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [selectedVenue, statusFilter, dateFilter, searchTerm, bookings]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookingsData, venuesData] = await Promise.all([
        getOwnerBookings(),
        getOwnerVenues()
      ]);
      setBookings(bookingsData);
      setVenues(venuesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = bookings;

    // Venue filter
    if (selectedVenue !== 'all') {
      filtered = filtered.filter(booking => 
        booking.venue._id === selectedVenue || booking.venue === selectedVenue
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Date filter
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

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.court?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.venue?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateBooking(bookingId, { status: newStatus });
      toast.success(`Booking status updated to ${newStatus}`);
      await fetchData(); // Refresh data
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
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

  const getFilteredBookings = () => {
    return filterBookings();
  };

  const getBookingStats = () => {
    const filtered = getFilteredBookings();
    const total = filtered.length;
    const confirmed = filtered.filter(b => b.status === 'Confirmed').length;
    const completed = filtered.filter(b => b.status === 'Completed').length;
    const cancelled = filtered.filter(b => b.status === 'Cancelled').length;
    const revenue = filtered
      .filter(b => b.status === 'Completed')
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    return { total, confirmed, completed, cancelled, revenue };
  };

  if (loading) {
    return (
      <div className="booking-overview-container">
        <div className="loading">Loading bookings...</div>
      </div>
    );
  }

  const filteredBookings = getFilteredBookings();
  const stats = getBookingStats();

  return (
    <div className="booking-overview-container">
      <div className="page-header">
        <h1>Booking Overview</h1>
        <p>Manage and track all bookings for your venues</p>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-row">
          <div className="filter-group">
            <label>Venue:</label>
            <select 
              value={selectedVenue} 
              onChange={(e) => setSelectedVenue(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Venues</option>
              {venues.map(venue => (
                <option key={venue._id} value={venue._id}>
                  {venue.name}
                </option>
              ))}
            </select>
          </div>

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
              {dateFilters.map(filter => (
                <option key={filter} value={filter}>
                  {filter === 'all' ? 'All Dates' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="search-row">
          <input
            type="text"
            placeholder="Search by user name, court, or venue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-summary">
          <span>{filteredBookings.length} booking(s) found</span>
          {(selectedVenue !== 'all' || statusFilter !== 'all' || dateFilter !== 'all' || searchTerm) && (
            <button 
              className="clear-filters-btn"
              onClick={() => {
                setSelectedVenue('all');
                setStatusFilter('all');
                setDateFilter('all');
                setSearchTerm('');
              }}
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Bookings</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.confirmed}</div>
            <div className="stat-label">Confirmed</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.completed}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.cancelled}</div>
            <div className="stat-label">Cancelled</div>
          </div>
          <div className="stat-card revenue">
            <div className="stat-number">₹{stats.revenue}</div>
            <div className="stat-label">Total Revenue</div>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bookings-section">
        <h2>Bookings</h2>
        
        {filteredBookings.length === 0 ? (
          <div className="no-bookings">
            <div className="no-bookings-icon">📅</div>
            <h3>No bookings found</h3>
            <p>
              {selectedVenue !== 'all' || statusFilter !== 'all' || dateFilter !== 'all' || searchTerm
                ? 'Try adjusting your filters'
                : 'No bookings have been made yet'
              }
            </p>
          </div>
        ) : (
          <div className="bookings-list">
            {filteredBookings.map(booking => (
              <div key={booking._id} className="booking-item">
                <div className="booking-header">
                  <div className="booking-user">
                    <h3>{booking.user?.name || 'Unknown User'}</h3>
                    <p className="user-email">{booking.user?.email || 'No email'}</p>
                  </div>
                  <span className={`status-badge ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="booking-details">
                  <div className="detail-row">
                    <span className="detail-label">Venue:</span>
                    <span className="detail-value">{booking.venue?.name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Court:</span>
                    <span className="detail-value">
                      {booking.court?.name} ({booking.court?.sportType})
                    </span>
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
                  {booking.status === 'Confirmed' && (
                    <>
                      <button
                        className="complete-btn"
                        onClick={() => handleStatusChange(booking._id, 'Completed')}
                      >
                        Mark Complete
                      </button>
                      <button
                        className="cancel-btn"
                        onClick={() => handleStatusChange(booking._id, 'Cancelled')}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {booking.status === 'Completed' && (
                    <span className="completed-badge">✓ Completed</span>
                  )}
                  {booking.status === 'Cancelled' && (
                    <span className="cancelled-badge">✗ Cancelled</span>
                  )}
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
          onClick={() => window.print()}
        >
          Print Report
        </button>
        <button 
          className="secondary-btn"
          onClick={() => {
            setSelectedVenue('all');
            setStatusFilter('all');
            setDateFilter('all');
            setSearchTerm('');
          }}
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default BookingOverview; 
