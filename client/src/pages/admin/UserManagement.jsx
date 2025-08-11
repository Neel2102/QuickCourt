import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { getAllUsers, banUser, getUserDetails, exportData } from '../../services/adminService';
import '../../CSS/UserManagement.css';

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
    return <div className="admin-panel-container"><div className="loading-userManagement">Loading users...</div></div>;
  }

  return (
    <div className="admin-panel-container">
      <div className="page-header-userManagement">
        <h1 className="page-title-userManagement">User Management</h1>
        <p className="page-subtitle-userManagement">Manage all users and facility owners</p>
      </div>

      {/* Filters */}
      <div className="filters-section-userManagement">
        <div className="filter-row-userManagement">
          <input
            type="text"
            className="search-input-userManagement"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="filter-select-userManagement" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            {roles.map(r => <option key={r} value={r}>{r === 'all' ? 'All Roles' : r}</option>)}
          </select>
          <select className="filter-select-userManagement" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            {statuses.map(s => <option key={s} value={s}>{s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <button className="export-btn-userManagement" onClick={() => exportData('users', 'csv')}>Export CSV</button>
        </div>
        <div className="filter-summary-userManagement">
          <span className="results-count-userManagement">{filteredUsers.length} user(s) found</span>
          {(search || roleFilter !== 'all' || statusFilter !== 'all') && (
            <button className="clear-filters-btn-userManagement" onClick={() => { setSearch(''); setRoleFilter('all'); setStatusFilter('all'); }}>Clear Filters</button>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="table-container-userManagement">
        <table className="users-table-userManagement">
          <thead className="table-header-userManagement">
            <tr>
              <th className="table-th-userManagement">Name</th>
              <th className="table-th-userManagement">Email</th>
              <th className="table-th-userManagement">Role</th>
              <th className="table-th-userManagement">Status</th>
              <th className="table-th-userManagement">Actions</th>
            </tr>
          </thead>
          <tbody className="table-body-userManagement">
            {filteredUsers.map(u => (
              <tr key={u._id} className="table-row-userManagement">
                <td className="table-td-userManagement name-cell-userManagement">
                  <div className="user-info-cell-userManagement">
                    <div className="user-avatar-small-userManagement">
                      {(u.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <span className="user-name-text-userManagement">{u.name || '-'}</span>
                  </div>
                </td>
                <td className="table-td-userManagement">{u.email || '-'}</td>
                <td className="table-td-userManagement">
                  <span className={`role-badge-userManagement ${roleOf(u).toLowerCase()}-role-userManagement`}>
                    {roleOf(u)}
                  </span>
                </td>
                <td className="table-td-userManagement">
                  <span className={`status-badge-userManagement ${u.isBanned ? 'banned' : 'active'}-status-userManagement`}>
                    {u.isBanned ? 'Banned' : 'Active'}
                  </span>
                </td>
                <td className="table-td-userManagement actions-cell-userManagement">
                  <button 
                    className={`action-button-userManagement ${u.isBanned ? 'unban' : 'ban'}-action-userManagement`}
                    onClick={() => handleBanToggle(u)}
                  >
                    {u.isBanned ? 'Unban' : 'Ban'}
                  </button>
                  <button 
                    className="action-button-userManagement view-action-userManagement"
                    onClick={() => openUserDetails(u)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="empty-state-userManagement">
            <p>No users found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Side panel: user details */}
      {selectedUser && userDetails && (
        <div className="side-panel-userManagement">
          <div className="side-panel-overlay-userManagement" onClick={() => { setSelectedUser(null); setUserDetails(null); }}></div>
          <div className="side-panel-content-userManagement">
            <div className="panel-header-userManagement">
              <h3 className="panel-title-userManagement">{selectedUser.name}</h3>
              <button className="close-btn-userManagement" onClick={() => { setSelectedUser(null); setUserDetails(null); }}>✕</button>
            </div>
            <div className="panel-content-userManagement">
              <div className="user-details-userManagement">
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Role:</strong> {roleOf(selectedUser)}</p>
                <p><strong>Status:</strong> {selectedUser.isBanned ? 'Banned' : 'Active'}</p>
              </div>

              <h4 className="section-title-userManagement">Booking History</h4>
              <div className="booking-list-userManagement">
                {userDetails.bookings?.length ? userDetails.bookings.map(b => (
                  <div key={b._id} className="booking-item-userManagement">
                    <div><strong>Venue:</strong> {b.venue?.name}</div>
                    <div><strong>Court:</strong> {b.court?.name} ({b.court?.sportType})</div>
                    <div><strong>Date:</strong> {new Date(b.date).toLocaleDateString()}</div>
                    <div><strong>Status:</strong> {b.status}</div>
                  </div>
                )) : <div className="no-bookings-userManagement">No bookings</div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;