import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getUserProfile, updateUserProfile, uploadProfilePicture } from '../../services/userService';
import { getMyBookings } from '../../services/bookingService';
import { formatDate, formatTime } from '../../utils/dateUtils';
import '../../CSS/Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [recentBookings, setRecentBookings] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    profilePic: ''
  });
  const [avatarPreview, setAvatarPreview] = useState('');

  useEffect(() => {
    fetchUserProfile();
    fetchRecentBookings();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const data = await getUserProfile();
      setUser(data);
      setFormData({
        name: data.name || '',
        email: data.email || '',
        bio: data.bio || '',
        profilePic: data.profilePic || ''
      });
      setAvatarPreview(data.profilePic || '');
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentBookings = async () => {
    try {
      const data = await getMyBookings();
      // Get only the 3 most recent confirmed bookings
      const confirmedBookings = data
        .filter(booking => booking.status === 'Confirmed')
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);
      setRecentBookings(confirmedBookings);
    } catch (error) {
      console.error('Error fetching recent bookings:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }

      try {
        setLoading(true);
        // Upload the file directly
        const updatedUser = await uploadProfilePicture(file);

        // Update local state
        setUser(updatedUser);
        setFormData(prev => ({
          ...prev,
          profilePic: updatedUser.profilePic
        }));
        setAvatarPreview(updatedUser.profilePic);

        toast.success('Profile picture updated successfully!');
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        toast.error('Failed to upload profile picture');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    try {
      setLoading(true);
      // Only update name and bio, not profile picture (handled separately)
      const updateData = {
        name: formData.name,
        bio: formData.bio
      };
      await updateUserProfile(updateData);
      await fetchUserProfile(); // Refresh data
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || '',
      profilePic: user?.profilePic || ''
    });
    setAvatarPreview(user?.profilePic || '');
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="profile-container-profile">
        <div className="loading-profile">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-container-profile">
      {/* <div className="page-header-profile">
        <h1>My Profile</h1>
        <p>Manage your account information and preferences</p>
      </div> */}

      <div className="profile-content-profile">
        {/* Profile Header */}
        <div className="profile-header-profile">
          <div className="avatar-section-profile">
            <div className="avatar-container-profile">
              {avatarPreview ? (
                <img 
                  src={avatarPreview} 
                  alt="Profile" 
                  className="profile-avatar-profile"
                />
              ) : (
                <div className="avatar-placeholder-profile">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
              {editing && (
                <label className="avatar-upload-profile">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                  />
                  <span>📷</span>
                </label>
              )}
            </div>
          </div>

          <div className="profile-info-profile">
            <h2>{user?.name || 'User'}</h2>
            <p className="user-email-profile">{user?.email}</p>
            <p className="user-role-profile">Regular User</p>
            {user?.bio && <p className="user-bio-profile">{user.bio}</p>}
          </div>

          <div className="profile-actions-profile">
            {!editing ? (
              <button 
                className="btn-profile edit-btn-profile"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </button>
            ) : (
              <div className="edit-actions-profile">
                <button 
                  className="btn-profile save-btn-profile"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  className="btn-profile cancel-btn-profile"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Form */}
        {editing && (
          <form className="profile-form-profile" onSubmit={handleSubmit}>
            <div className="form-section-profile">
              <h3>Personal Information</h3>
              
              <div className="form-group-profile">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group-profile">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="disabled-input-profile"
                />
                <small>Email cannot be changed</small>
              </div>

              <div className="form-group-profile">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself..."
                  rows="4"
                  maxLength="200"
                />
                <small>{formData.bio.length}/200 characters</small>
              </div>
            </div>

            <div className="form-section-profile">
              <h3>Account Information</h3>
              
              <div className="info-row-profile">
                <span className="info-label-profile">Account Type:</span>
                <span className="info-value-profile">Regular User</span>
              </div>
              
              <div className="info-row-profile">
                <span className="info-label-profile">Member Since:</span>
                <span className="info-value-profile">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              
              <div className="info-row-profile">
                <span className="info-label-profile">Account Status:</span>
                <span className="info-value-profile">
                  <span className="status-active-profile">Active</span>
                </span>
              </div>
            </div>
          </form>
        )}

        {/* Profile Stats */}
        {!editing && (
          <div className="profile-stats-profile">
            <h3>Account Statistics</h3>
            <div className="stats-grid-profile">
              <div className="stat-card-profile">
                <div className="stat-number-profile">{user?.totalBookings || 0}</div>
                <div className="stat-label-profile">Total Bookings</div>
              </div>
              <div className="stat-card-profile">
                <div className="stat-number-profile">{user?.completedBookings || 0}</div>
                <div className="stat-label-profile">Completed</div>
              </div>
              <div className="stat-card-profile">
                <div className="stat-number-profile">{user?.cancelledBookings || 0}</div>
                <div className="stat-label-profile">Cancelled</div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Bookings */}
        {!editing && recentBookings.length > 0 && (
          <div className="recent-bookings-profile">
            <h3>Recent Bookings</h3>
            <div className="bookings-list-profile">
              {recentBookings.map(booking => (
                <div key={booking._id} className="booking-item-profile">
                  <div className="booking-header-profile">
                    <h4>{booking.venue?.name}</h4>
                    <span className="booking-status-profile confirmed-profile">Confirmed</span>
                  </div>
                  <div className="booking-details-profile">
                    <p><strong>Court:</strong> {booking.court?.name} ({booking.court?.sportType})</p>
                    <p><strong>Date:</strong> {formatDate(booking.date)}</p>
                    <p><strong>Time:</strong> {formatTime(booking.startTime)} - {formatTime(booking.endTime)}</p>
                    <p><strong>Amount:</strong> ₹{booking.totalPrice}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="view-all-bookings-profile">
              <button 
                className="btn-profile view-all-btn-profile"
                onClick={() => window.location.href = '/user-dashboard/my-bookings'}
              >
                View All Bookings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;