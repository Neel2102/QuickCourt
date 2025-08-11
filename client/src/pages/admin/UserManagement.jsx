import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { getAllUsers, banUser, getUserDetails, exportData } from '../../services/adminService';
import '../../CSS/AdminPanel.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  const roles = ['all', 'User', 'FacilityOwner', 'Admin'];
  const statuses = ['all', 'active', 'banned'];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users
      .filter(u => (roleFilter === 'all' ? true : roleOf(u) === roleFilter))
      .filter(u => (statusFilter === 'all' ? true : (u.isBanned ? 'banned' : 'active') === statusFilter))
      .filter(u => search ? (u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())) : true);
  }, [users, search, roleFilter, statusFilter]);

  const roleOf = (u) => {
    if (u.isAdmin) return 'Admin';
    if (u.isFacilityOwner) return 'FacilityOwner';
    return 'User';
  };

  const handleBanToggle = async (user) => {
    try {
      await banUser(user._id, !user.isBanned, 'Admin action');
      toast.success(`${!user.isBanned ? 'Banned' : 'Unbanned'} ${user.name || 'user'}`);
      await fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update user status');
    }
  };

  const openUserDetails = async (user) => {
    setSelectedUser(user);
    try {
      const details = await getUserDetails(user._id);
      setUserDetails(details);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch user details');
    }
  };

  if (loading) {
    return <div className="admin-panel-container"><div className="loading">Loading users...</div></div>;
  }

  return (
    <div className="admin-panel-container">
      <div className="page-header">
        <h1>User Management</h1>
        <p>Manage all users and facility owners</p>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-row">
          <input
            type="text"
            className="search-input"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="filter-select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            {roles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button className="primary-btn" onClick={() => exportData('users', 'csv')}>Export CSV</button>
        </div>
        <div className="filter-summary">
          <span>{filteredUsers.length} user(s) found</span>
          {(search || roleFilter !== 'all' || statusFilter !== 'all') && (
            <button className="clear-filters-btn" onClick={() => { setSearch(''); setRoleFilter('all'); setStatusFilter('all'); }}>Clear</button>
          )}
        </div>
      </div>

      {/* Users table */}
      <div className="admin-table">
        <div className="table-header">
          <div>Name</div>
          <div>Email</div>
          <div>Role</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        <div className="table-body">
          {filteredUsers.map(u => (
            <div key={u._id} className="table-row" onClick={() => openUserDetails(u)}>
              <div>{u.name || '-'}</div>
              <div>{u.email || '-'}</div>
              <div><span className={`tag ${roleOf(u).toLowerCase()}`}>{roleOf(u)}</span></div>
              <div><span className={`tag ${u.isBanned ? 'banned' : 'active'}`}>{u.isBanned ? 'Banned' : 'Active'}</span></div>
              <div>
                <button className={`small-btn ${u.isBanned ? 'unban' : 'ban'}`} onClick={(e) => { e.stopPropagation(); handleBanToggle(u);} }>
                  {u.isBanned ? 'Unban' : 'Ban'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Side panel: user details */}
      {selectedUser && userDetails && (
        <div className="side-panel">
          <div className="panel-header">
            <h3>{selectedUser.name}</h3>
            <button className="close-btn" onClick={() => { setSelectedUser(null); setUserDetails(null); }}>✕</button>
          </div>
          <div className="panel-content">
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Role:</strong> {roleOf(selectedUser)}</p>
            <p><strong>Status:</strong> {selectedUser.isBanned ? 'Banned' : 'Active'}</p>

            <h4>Booking History</h4>
            <div className="list">
              {userDetails.bookings?.length ? userDetails.bookings.map(b => (
                <div key={b._id} className="list-item">
                  <div><strong>Venue:</strong> {b.venue?.name}</div>
                  <div><strong>Court:</strong> {b.court?.name} ({b.court?.sportType})</div>
                  <div><strong>Date:</strong> {new Date(b.date).toLocaleDateString()}</div>
                  <div><strong>Status:</strong> {b.status}</div>
                </div>
              )) : <div className="muted">No bookings</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement; 
