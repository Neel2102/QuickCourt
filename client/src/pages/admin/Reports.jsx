import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { getReports, updateReportStatus } from '../../services/adminService';
import '../../CSS/AdminPanel.css';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const types = ['all', 'user', 'venue', 'booking'];
  const statuses = ['all', 'open', 'in_review', 'resolved'];

  useEffect(() => {
    fetchReports();
  }, [typeFilter, statusFilter]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await getReports(typeFilter, statusFilter);
      setReports(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return reports.filter(r => search ? (r.reason?.toLowerCase().includes(search.toLowerCase()) || r.actionNote?.toLowerCase().includes(search.toLowerCase())) : true);
  }, [reports, search]);

  const setStatus = async (id, status) => {
    try {
      await updateReportStatus(id, status);
      toast.success('Report updated');
      fetchReports();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update report');
    }
  };

  if (loading) return <div className="admin-panel-container"><div className="loading">Loading reports...</div></div>;

  return (
    <div className="admin-panel-container">
      <div className="page-header">
        <h1>Reports & Moderation</h1>
        <p>Review and take action on submitted reports</p>
      </div>

      <div className="filters-section">
        <div className="filter-row">
          <select className="filter-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <input className="search-input" placeholder="Search reason or notes..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="filter-summary"><span>{filtered.length} report(s)</span></div>
      </div>

      <div className="admin-table">
        <div className="table-header">
          <div>Type</div>
          <div>Reason</div>
          <div>Status</div>
          <div>Created</div>
          <div>Actions</div>
        </div>
        <div className="table-body">
          {filtered.map(r => (
            <div className="table-row" key={r._id}>
              <div>{r.targetType}</div>
              <div className="truncate" title={r.reason}>{r.reason || '-'}</div>
              <div><span className={`tag ${r.status}`}>{r.status}</span></div>
              <div>{new Date(r.createdAt).toLocaleString()}</div>
              <div className="row-actions">
                {r.status !== 'open' && <button className="small-btn" onClick={() => setStatus(r._id, 'open')}>Reopen</button>}
                {r.status !== 'in_review' && <button className="small-btn" onClick={() => setStatus(r._id, 'in_review')}>In Review</button>}
                {r.status !== 'resolved' && <button className="small-btn complete" onClick={() => setStatus(r._id, 'resolved')}>Resolve</button>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports; 
