import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getOwnerVenues, createVenue, updateVenue, deleteVenue } from '../../services/venueService';
import { getOwnerCourts } from '../../services/courtService';
import '../../CSS/FacilityManagement.css';

const FacilityManagement = () => {
  const [venues, setVenues] = useState([]);
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: ''
    },
    sportTypes: [],
    amenities: [],
    photos: []
  });

  const sportOptions = ['Tennis', 'Badminton', 'Football', 'Cricket', 'Basketball', 'Volleyball'];
  const amenityOptions = [
    'Parking', 'Shower Facilities', 'Equipment Rental', 'Pro Shop', 'Café', 
    'Lockers', 'WiFi', 'Air Conditioning', 'First Aid', 'Security'
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [venuesData, courtsData] = await Promise.all([
        getOwnerVenues(),
        getOwnerCourts()
      ]);
      setVenues(venuesData);
      setCourts(courtsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load facilities');
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

  const handleSportTypeChange = (sport) => {
    setFormData(prev => ({
      ...prev,
      sportTypes: prev.sportTypes.includes(sport)
        ? prev.sportTypes.filter(s => s !== sport)
        : [...prev.sportTypes, sport]
    }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length !== files.length) {
      toast.error('Please select only image files');
      return;
    }

    const readers = validFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(photos => {
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...photos]
      }));
    });
  };

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Facility name is required');
      return;
    }
    if (formData.sportTypes.length === 0) {
      toast.error('Please select at least one sport type');
      return;
    }
    if (!formData.address.street || !formData.address.city) {
      toast.error('Address information is required');
      return;
    }

    try {
      setLoading(true);
      if (editingVenue) {
        await updateVenue(editingVenue._id, formData);
        toast.success('Facility updated successfully!');
      } else {
        await createVenue(formData);
        toast.success('Facility created successfully!');
      }
      
      await fetchData();
      resetForm();
    } catch (error) {
      console.error('Error saving facility:', error);
      toast.error('Failed to save facility');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (venue) => {
    setEditingVenue(venue);
    setFormData({
      name: venue.name,
      description: venue.description,
      address: { ...venue.address },
      sportTypes: [...venue.sportTypes],
      amenities: [...venue.amenities],
      photos: [...venue.photos]
    });
    setShowForm(true);
  };

  const handleDelete = async (venueId) => {
    if (window.confirm('Are you sure you want to delete this facility? This action cannot be undone.')) {
      try {
        await deleteVenue(venueId);
        toast.success('Facility deleted successfully!');
        await fetchData();
      } catch (error) {
        console.error('Error deleting facility:', error);
        toast.error('Failed to delete facility');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: ''
      },
      sportTypes: [],
      amenities: [],
      photos: []
    });
    setEditingVenue(null);
    setShowForm(false);
  };

  const getVenueStats = (venueId) => {
    const venueCourts = courts.filter(court => court.venue === venueId);
    const totalCourts = venueCourts.length;
    const totalBookings = venueCourts.reduce((sum, court) => sum + (court.bookings?.length || 0), 0);
    
    return { totalCourts, totalBookings };
  };

  if (loading) {
    return (
      <div className="facility-management-container">
        <div className="loading">Loading facilities...</div>
      </div>
    );
  }

  return (
    <div className="facility-management-container">
      <div className="page-header">
        <h1>Facility Management</h1>
        <p>Manage your sports facilities and venues</p>
        <button 
          className="add-facility-btn"
          onClick={() => setShowForm(true)}
        >
          + Add New Facility
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="facility-form-section">
          <div className="form-header">
            <h2>{editingVenue ? 'Edit Facility' : 'Add New Facility'}</h2>
            <button 
              className="close-btn"
              onClick={resetForm}
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="facility-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Facility Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter facility name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your facility..."
                  rows="3"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Address Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="street">Street Address *</label>
                  <input
                    type="text"
                    id="street"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    placeholder="Enter street address"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleInputChange}
                    placeholder="Enter city"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <input
                    type="text"
                    id="state"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleInputChange}
                    placeholder="Enter state"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="postalCode">Postal Code</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="address.postalCode"
                    value={formData.address.postalCode}
                    onChange={handleInputChange}
                    placeholder="Enter postal code"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Sports & Amenities</h3>
              <div className="form-group">
                <label>Sport Types *</label>
                <div className="checkbox-grid">
                  {sportOptions.map(sport => (
                    <label key={sport} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.sportTypes.includes(sport)}
                        onChange={() => handleSportTypeChange(sport)}
                      />
                      <span>{sport}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Amenities</label>
                <div className="checkbox-grid">
                  {amenityOptions.map(amenity => (
                    <label key={amenity} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleAmenityChange(amenity)}
                      />
                      <span>{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Photos</h3>
              <div className="form-group">
                <label htmlFor="photos">Upload Photos</label>
                <input
                  type="file"
                  id="photos"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
                <small>You can select multiple images. Max 5MB each.</small>
              </div>

              {formData.photos.length > 0 && (
                <div className="photo-preview">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="photo-item">
                      <img src={photo} alt={`Preview ${index + 1}`} />
                      <button
                        type="button"
                        className="remove-photo"
                        onClick={() => removePhoto(index)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? 'Saving...' : (editingVenue ? 'Update Facility' : 'Create Facility')}
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

      {/* Facilities List */}
      <div className="facilities-section">
        <h2>Your Facilities</h2>
        
        {venues.length === 0 ? (
          <div className="no-facilities">
            <div className="no-facilities-icon">🏟️</div>
            <h3>No facilities yet</h3>
            <p>Start by adding your first sports facility!</p>
            <button 
              className="add-first-btn"
              onClick={() => setShowForm(true)}
            >
              Add Your First Facility
            </button>
          </div>
        ) : (
          <div className="facilities-grid">
            {venues.map(venue => {
              const stats = getVenueStats(venue._id);
              return (
                <div key={venue._id} className="facility-card">
                  <div className="facility-header">
                    <h3>{venue.name}</h3>
                    <span className={`status-badge ${venue.isApproved ? 'approved' : 'pending'}`}>
                      {venue.isApproved ? 'Approved' : 'Pending Approval'}
                    </span>
                  </div>

                  <div className="facility-photos">
                    {venue.photos && venue.photos.length > 0 ? (
                      <img 
                        src={venue.photos[0]} 
                        alt={venue.name}
                        className="facility-photo"
                      />
                    ) : (
                      <div className="no-photo">📷</div>
                    )}
                  </div>

                  <div className="facility-info">
                    <p className="facility-description">{venue.description}</p>
                    <p className="facility-location">
                      📍 {venue.address.street}, {venue.address.city}
                    </p>
                    <p className="facility-sports">
                      🏃 {venue.sportTypes.join(', ')}
                    </p>
                  </div>

                  <div className="facility-stats">
                    <div className="stat">
                      <span className="stat-number">{stats.totalCourts}</span>
                      <span className="stat-label">Courts</span>
                    </div>
                    <div className="stat">
                      <span className="stat-number">{stats.totalBookings}</span>
                      <span className="stat-label">Bookings</span>
                    </div>
                    <div className="stat">
                      <span className="stat-number">⭐ {venue.rating || 0}</span>
                      <span className="stat-label">Rating</span>
                    </div>
                  </div>

                  <div className="facility-actions">
                    <button 
                      className="edit-btn"
                      onClick={() => handleEdit(venue)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(venue._id)}
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
    </div>
  );
};

export default FacilityManagement; 
