import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getAdminAnalytics, getAdminDashboardData } from '../../services/adminService';
import '../../CSS/Analytics.css';

const AdminAnalytics = () => {
  const [period, setPeriod] = useState('month');
  const [trends, setTrends] = useState([]);
  const [bySport, setBySport] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [period]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [analytics, dashboard] = await Promise.all([
        getAdminAnalytics(period),
        getAdminDashboardData(),
      ]);
      setTrends(analytics?.trends || []);
      setBySport(analytics?.bySport || []);
      setStats(dashboard);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="analytics-container"><div className="loading">Loading analytics...</div></div>;

  return (
    <div className="analytics-container">
      <div className="page-header">
        <h1>Admin Analytics</h1>
        <p>Platform-wide trends and insights</p>
        <div className="period-selector">
          <label>Time Period:</label>
          <select className="period-select" value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="quarter">Quarter</option>
            <option value="year">Year</option>
          </select>
        </div>
      </div>

      {/* Metrics */}
      <div className="metrics-section">
        <div className="metrics-grid">
          <div className="metric-card"><div className="metric-icon">👥</div><div className="metric-content"><div className="metric-number">{stats?.totalUsers || 0}</div><div className="metric-label">Users</div></div></div>
          <div className="metric-card"><div className="metric-icon">🏢</div><div className="metric-content"><div className="metric-number">{stats?.totalFacilityOwners || 0}</div><div className="metric-label">Facility Owners</div></div></div>
          <div className="metric-card"><div className="metric-icon">📅</div><div className="metric-content"><div className="metric-number">{stats?.totalBookings || 0}</div><div className="metric-label">Bookings</div></div></div>
          <div className="metric-card"><div className="metric-icon">🎾</div><div className="metric-content"><div className="metric-number">{stats?.totalActiveCourts || 0}</div><div className="metric-label">Active Courts</div></div></div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-row">
          <div className="chart-card">
            <h3>Bookings Over Time</h3>
            <div className="chart-container">
              {trends.length ? (
                <div className="bar-chart">
                  {trends.map((t, idx) => (
                    <div key={idx} className="bar-group">
                      <div className="bar" style={{ height: `${(t.bookings / Math.max(...trends.map(x => x.bookings))) * 200}px` }}>
                        <span className="bar-value">{t.bookings}</span>
                      </div>
                      <span className="bar-label">{t._id}</span>
                    </div>
                  ))}
                </div>
              ) : <div className="no-data">No data</div>}
            </div>
          </div>

          <div className="chart-card">
            <h3>Revenue Over Time</h3>
            <div className="chart-container">
              {trends.length ? (
                <div className="bar-chart">
                  {trends.map((t, idx) => (
                    <div key={idx} className="bar-group">
                      <div className="bar" style={{ height: `${(t.revenue / Math.max(...trends.map(x => x.revenue))) * 200 || 0}px` }}>
                        <span className="bar-value">₹{t.revenue}</span>
                      </div>
                      <span className="bar-label">{t._id}</span>
                    </div>
                  ))}
                </div>
              ) : <div className="no-data">No data</div>}
            </div>
          </div>
        </div>

        <div className="chart-row">
          <div className="chart-card full-width">
            <h3>Most Active Sports</h3>
            <div className="chart-container">
              {bySport.length ? (
                <div className="status-chart">
                  {bySport.map((s, idx) => (
                    <div key={idx} className="status-bar">
                      <div className="status-info"><span className="status-name">{s._id}</span><span className="status-count">{s.count} bookings</span></div>
                      <div className="status-progress"><div className="progress-fill" style={{ width: `${(s.count / Math.max(...bySport.map(x => x.count))) * 100}%`, backgroundColor: '#43b97f' }}></div></div>
                      <span className="status-percentage">{s.count}</span>
                    </div>
                  ))}
                </div>
              ) : <div className="no-data">No data</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics; 
