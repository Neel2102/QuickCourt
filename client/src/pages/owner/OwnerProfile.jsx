import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getUserProfile, updateUserProfile, uploadProfilePicture } from '../../services/userService';
import '../../CSS/Profile.css';

const OwnerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    email: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profileData = await getUserProfile();
      setProfile(profileData);
      setFormData({
        name: profileData?.name || '',
        bio: profileData?.bio || '',
        email: profileData?.email || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    try {
      setSaving(true);
      await updateUserProfile(formData);
      toast.success('Profile updated successfully!');
      setEditing(false);
      await fetchProfile(); // Refresh profile data
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('File size must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    try {
      setLoading(true);
      await uploadProfilePicture(file);
      toast.success('Profile picture updated successfully!');
      await fetchProfile(); // Refresh profile data
    } catch (error) {
      console.error('Error uploading picture:', error);
      toast.error('Failed to upload profile picture');
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePicture = async () => {
    try {
      setLoading(true);
      await updateUserProfile({ profilePic: null });
      toast.success('Profile picture removed successfully!');
      await fetchProfile(); // Refresh profile data
    } catch (error) {
      console.error('Error removing picture:', error);
      toast.error('Failed to remove profile picture');
    } finally {
      setLoading(false);
    }
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
      <div className="profile-header">
        <h1>Owner Profile</h1>
        <p>Manage your facility owner profile and settings</p>
      </div>

      <div className="profile-content">
        {/* Profile Picture Section */}
        <div className="profile-picture-section">
          {profile?.profilePic ? (
            <img 
              src={profile.profilePic} 
              alt="Profile" 
              className="profile-picture"
            />
          ) : (
            <div className="profile-picture-placeholder">
              👤
            </div>
          )}
          
          <input
            type="file"
            id="picture-upload"
            accept="image/*"
            onChange={handlePictureUpload}
            style={{ display: 'none' }}
          />
          
          <div>
            <label htmlFor="picture-upload" className="upload-picture-btn">
              {profile?.profilePic ? 'Change Picture' : 'Upload Picture'}
            </label>
            
            {profile?.profilePic && (
              <button 
                className="remove-picture-btn"
                onClick={handleRemovePicture}
              >
                Remove Picture
              </button>
            )}
          </div>
        </div>

        {/* Profile Form Section */}
        <div className="profile-form-section">
          <form onSubmit={handleSubmit} className="profile-form">
            <h3>Profile Information</h3>
            
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!editing}
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
                disabled={true} // Email cannot be changed
                style={{ backgroundColor: '#f3f4f6' }}
              />
              <small style={{ color: '#6b7280', fontSize: '0.8rem' }}>
                Email cannot be changed for security reasons
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                disabled={!editing}
                placeholder="Tell us about yourself and your facilities..."
              />
            </div>

            {editing ? (
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="save-btn"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setEditing(false);
                    setFormData({
                      name: profile?.name || '',
                      bio: profile?.bio || '',
                      email: profile?.email || ''
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="form-actions">
                <button 
                  type="button" 
                  className="save-btn"
                  onClick={() => setEditing(true)}
                >
                  Edit Profile
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Profile Statistics */}
      <div className="profile-stats">
        <div className="stat-card">
          <div className="stat-number">{profile?.facilities?.length || 0}</div>
          <div className="stat-label">Total Facilities</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{profile?.courts?.length || 0}</div>
          <div className="stat-label">Total Courts</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{profile?.totalBookings || 0}</div>
          <div className="stat-label">Total Bookings</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{profile?.totalEarnings || 0}</div>
          <div className="stat-label">Total Earnings (₹)</div>
        </div>
      </div>

      {/* Additional Actions */}
      <div className="profile-actions">
        <h3>Account Actions</h3>
        <div className="action-buttons">
          <button className="change-password-btn">
            Change Password
          </button>
          <button className="delete-account-btn">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerProfile; 
