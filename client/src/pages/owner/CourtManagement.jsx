import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getOwnerCourts, createCourt, updateCourt, deleteCourt } from '../../services/courtService';
import { getOwnerVenues } from '../../services/venueService';
import '../../CSS/CourtManagement.css';

const CourtManagement = () => {
  const [courts, setCourts] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourt, setEditingCourt] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    sportType: '',
    pricePerHour: '',
    operatingHours: {
      start: '08:00',
      end: '22:00'
    },
    venue: ''
  });

  const sportTypes = ['Tennis', 'Badminton', 'Football', 'Cricket', 'Basketball', 'Volleyball'];
  const timeSlots = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
    '20:00', '21:00', '22:00', '23:00'
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [courtsData, venuesData] = await Promise.all([
        getOwnerCourts(),
        getOwnerVenues()
      ]);
      setCourts(courtsData);
      setVenues(venuesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load courts');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Court name is required');
      return;
    }
    if (!formData.sportType) {
      toast.error('Please select a sport type');
      return;
    }
    if (!formData.pricePerHour || formData.pricePerHour <= 0) {
      toast.error('Please enter a valid price per hour');
      return;
    }
    if (!formData.venue) {
      toast.error('Please select a venue');
      return;
    }
    if (formData.operatingHours.start >= formData.operatingHours.end) {
      toast.error('End time must be after start time');
      return;
    }

    try {
      setLoading(true);
      if (editingCourt) {
        await updateCourt(editingCourt._id, formData);
        toast.success('Court updated successfully!');
      } else {
        await createCourt(formData);
        toast.success('Court created successfully!');
      }
      
      await fetchData();
      resetForm();
    } catch (error) {
      console.error('Error saving court:', error);
      toast.error('Failed to save court');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (court) => {
    setEditingCourt(court);
    setFormData({
      name: court.name,
      sportType: court.sportType,
      pricePerHour: court.pricePerHour,
      operatingHours: { ...court.operatingHours },
      venue: court.venue._id || court.venue
    });
    setShowForm(true);
  };

  const handleDelete = async (courtId) => {
    if (window.confirm('Are you sure you want to delete this court? This action cannot be undone.')) {
      try {
        await deleteCourt(courtId);
        toast.success('Court deleted successfully!');
        await fetchData();
      } catch (error) {
        console.error('Error deleting court:', error);
        toast.error('Failed to delete court');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      sportType: '',
      pricePerHour: '',
      operatingHours: {
        start: '08:00',
        end: '22:00'
      },
      venue: ''
    });
    setEditingCourt(null);
    setShowForm(false);
  };

  const getVenueName = (venueId) => {
    const venue = venues.find(v => v._id === venueId);
    return venue ? venue.name : 'Unknown Venue';
  };

  const getCourtStats = (court) => {
    const totalBookings = court.bookings?.length || 0;
    const today = new Date();
    const todayBookings = court.bookings?.filter(booking => {
      const bookingDate = new Date(booking.date);
      return bookingDate.toDateString() === today.toDateString();
    }).length || 0;
    
    return { totalBookings, todayBookings };
  };

  if (loading) {
    return (
      <div className="court-management-container">
        <div className="loading">Loading courts...</div>
      </div>
    );
  }

  return (
    <div className="court-management-container">
      <div className="page-header">
        <h1>Court Management</h1>
        <p>Manage individual courts within your venues</p>
        <button 
          className="add-court-btn"
          onClick={() => setShowForm(true)}
        >
          + Add New Court
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="court-form-section">
          <div className="form-header">
            <h2>{editingCourt ? 'Edit Court' : 'Add New Court'}</h2>
            <button 
              className="close-btn"
              onClick={resetForm}
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="court-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Court Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter court name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="sportType">Sport Type *</label>
                <select
                  id="sportType"
                  name="sportType"
                  value={formData.sportType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Sport Type</option>
                  {sportTypes.map(sport => (
                    <option key={sport} value={sport}>{sport}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="venue">Venue *</label>
                <select
                  id="venue"
                  name="venue"
                  value={formData.venue}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Venue</option>
                  {venues.map(venue => (
                    <option key={venue._id} value={venue._id}>
                      {venue.name} - {venue.address.city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="pricePerHour">Price per Hour (₹) *</label>
                <input
                  type="number"
                  id="pricePerHour"
                  name="pricePerHour"
                  value={formData.pricePerHour}
                  onChange={handleInputChange}
                  placeholder="Enter price per hour"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Operating Hours</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="startTime">Start Time</label>
                  <select
                    id="startTime"
                    name="operatingHours.start"
                    value={formData.operatingHours.start}
                    onChange={handleInputChange}
                  >
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="endTime">End Time</label>
                  <select
                    id="endTime"
                    name="operatingHours.end"
                    value={formData.operatingHours.end}
                    onChange={handleInputChange}
                  >
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? 'Saving...' : (editingCourt ? 'Update Court' : 'Create Court')}
              </button>
              <button 
                type="button" 
                className="cancel-btn"
                onClick={resetForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Courts List */}
      <div className="courts-section">
        <h2>Your Courts</h2>
        
        {courts.length === 0 ? (
          <div className="no-courts">
            <div className="no-courts-icon">🎾</div>
            <h3>No courts yet</h3>
            <p>Start by adding your first court!</p>
            <button 
              className="add-first-btn"
              onClick={() => setShowForm(true)}
            >
              Add Your First Court
            </button>
          </div>
        ) : (
          <div className="courts-grid">
            {courts.map(court => {
              const stats = getCourtStats(court);
              return (
                <div key={court._id} className="court-card">
                  <div className="court-header">
                    <h3>{court.name}</h3>
                    <span className={`sport-badge ${court.sportType.toLowerCase()}`}>
                      {court.sportType}
                    </span>
                  </div>

                  <div className="court-info">
                    <p className="court-venue">
                      🏟️ {getVenueName(court.venue)}
                    </p>
                    <p className="court-price">
                      💰 ₹{court.pricePerHour}/hour
                    </p>
                    <p className="court-hours">
                      ⏰ {court.operatingHours.start} - {court.operatingHours.end}
                    </p>
                  </div>

                  <div className="court-stats">
                    <div className="stat">
                      <span className="stat-number">{stats.totalBookings}</span>
                      <span className="stat-label">Total Bookings</span>
                    </div>
                    <div className="stat">
                      <span className="stat-number">{stats.todayBookings}</span>
                      <span className="stat-label">Today</span>
                    </div>
                  </div>

                  <div className="court-actions">
                    <button 
                      className="edit-btn"
                      onClick={() => handleEdit(court)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(court._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="stats-section">
        <h3>Court Statistics</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{courts.length}</div>
            <div className="stat-label">Total Courts</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {courts.reduce((sum, court) => sum + (court.bookings?.length || 0), 0)}
            </div>
            <div className="stat-label">Total Bookings</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {courts.filter(court => court.operatingHours.start <= '08:00').length}
            </div>
            <div className="stat-label">Early Morning Courts</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {courts.filter(court => court.operatingHours.end >= '22:00').length}
            </div>
            <div className="stat-label">Late Night Courts</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourtManagement; 
