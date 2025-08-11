import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getUserProfile, updateUserProfile, uploadProfilePicture } from '../../services/userService';
import '../../CSS/Profile.css';

const AdminProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', bio: '' });

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getUserProfile();
      setProfile(data);
      setFormData({ name: data?.name || '', email: data?.email || '', bio: data?.bio || '' });
    } catch (e) {
      toast.error('Failed to load profile');
    } finally { setLoading(false); }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateUserProfile({ name: formData.name, bio: formData.bio });
      toast.success('Profile updated');
      setEditing(false);
      fetchProfile();
    } catch (e) {
      toast.error('Failed to update');
    } finally { setSaving(false); }
  };

  const onUpload = async (file) => {
    try {
      setLoading(true);
      await uploadProfilePicture(file);
      toast.success('Picture updated');
      fetchProfile();
    } catch { toast.error('Upload failed'); } finally { setLoading(false); }
  };

  if (loading) return <div className="profile-container"><div className="loading">Loading...</div></div>;

  return (
    <div className="profile-container">
      <div className="profile-header"><h1>Admin Profile</h1><p>Manage your admin account</p></div>
      <div className="profile-content">
        <div className="profile-picture-section">
          {profile?.profilePic ? <img className="profile-picture" src={profile.profilePic} alt="Admin"/> : <div className="profile-picture-placeholder">👤</div>}
          <input id="admin-pic" type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => e.target.files[0] && onUpload(e.target.files[0])} />
          <label className="upload-picture-btn" htmlFor="admin-pic">{profile?.profilePic ? 'Change Picture' : 'Upload Picture'}</label>
        </div>
        <div className="profile-form-section">
          <form onSubmit={handleSubmit} className="profile-form">
            <h3>Profile Information</h3>
            <div className="form-group"><label>Name</label><input name="name" value={formData.name} onChange={handleChange} disabled={!editing} /></div>
            <div className="form-group"><label>Email</label><input name="email" value={formData.email} disabled style={{ backgroundColor: '#f3f4f6' }} /></div>
            <div className="form-group"><label>Bio</label><textarea name="bio" value={formData.bio} onChange={handleChange} disabled={!editing} /></div>
            {editing ? (
              <div className="form-actions"><button className="save-btn" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button><button className="cancel-btn" type="button" onClick={() => { setEditing(false); setFormData({ name: profile.name, email: profile.email, bio: profile.bio }); }}>Cancel</button></div>
            ) : (
              <div className="form-actions"><button className="save-btn" type="button" onClick={() => setEditing(true)}>Edit Profile</button></div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile; 
