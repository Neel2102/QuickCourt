import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getUserProfile, updateUserProfile, uploadProfilePicture } from '../../services/userService';
import '../../CSS/Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    profilePic: ''
  });
  const [avatarPreview, setAvatarPreview] = useState('');

  useEffect(() => {
    fetchUserProfile();
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
      <div className="profile-container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Manage your account information and preferences</p>
      </div>

      <div className="profile-content">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="avatar-section">
            <div className="avatar-container">
              {avatarPreview ? (
                <img 
                  src={avatarPreview} 
                  alt="Profile" 
                  className="profile-avatar"
                />
              ) : (
                <div className="avatar-placeholder">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
              {editing && (
                <label className="avatar-upload">
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

          <div className="profile-info">
            <h2>{user?.name || 'User'}</h2>
            <p className="user-email">{user?.email}</p>
            <p className="user-role">Regular User</p>
            {user?.bio && <p className="user-bio">{user.bio}</p>}
          </div>

          <div className="profile-actions">
            {!editing ? (
              <button 
                className="edit-btn"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button 
                  className="save-btn"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  className="cancel-btn"
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
          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>Personal Information</h3>
              
              <div className="form-group">
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

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="disabled-input"
                />
                <small>Email cannot be changed</small>
              </div>

              <div className="form-group">
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

            <div className="form-section">
              <h3>Account Information</h3>
              
              <div className="info-row">
                <span className="info-label">Account Type:</span>
                <span className="info-value">Regular User</span>
              </div>
              
              <div className="info-row">
                <span className="info-label">Member Since:</span>
                <span className="info-value">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              
              <div className="info-row">
                <span className="info-label">Account Status:</span>
                <span className="info-value">
                  <span className="status-active">Active</span>
                </span>
              </div>
            </div>
          </form>
        )}

        {/* Profile Stats */}
        {!editing && (
          <div className="profile-stats">
            <h3>Account Statistics</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{user?.totalBookings || 0}</div>
                <div className="stat-label">Total Bookings</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{user?.completedBookings || 0}</div>
                <div className="stat-label">Completed</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{user?.cancelledBookings || 0}</div>
                <div className="stat-label">Cancelled</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 
