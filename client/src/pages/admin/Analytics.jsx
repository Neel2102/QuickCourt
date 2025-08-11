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

  if (loading) return <div className="analytics-container"><div className="loading-analytics">Loading analytics...</div></div>;

  return (
    <div className="analytics-container">
      <div className="page-header-analytics">
        <h1>Admin Analytics</h1>
        <p>Platform-wide trends and insights</p>
        <div className="period-selector-analytics">
          <label>Time Period:</label>
          <select className="period-select-analytics" value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="quarter">Quarter</option>
            <option value="year">Year</option>
          </select>
        </div>
      </div>

      {/* Metrics */}
      <div className="metrics-section-analytics">
        <div className="metrics-grid-analytics">
          <div className="metric-card-analytics"><div className="metric-icon-analytics">👥</div><div className="metric-content-analytics"><div className="metric-number-analytics">{stats?.totalUsers || 0}</div><div className="metric-label-analytics">Users</div></div></div>
          <div className="metric-card-analytics"><div className="metric-icon-analytics">🏢</div><div className="metric-content-analytics"><div className="metric-number-analytics">{stats?.totalFacilityOwners || 0}</div><div className="metric-label-analytics">Facility Owners</div></div></div>
          <div className="metric-card-analytics"><div className="metric-icon-analytics">📅</div><div className="metric-content-analytics"><div className="metric-number-analytics">{stats?.totalBookings || 0}</div><div className="metric-label-analytics">Bookings</div></div></div>
          <div className="metric-card-analytics"><div className="metric-icon-analytics">🎾</div><div className="metric-content-analytics"><div className="metric-number-analytics">{stats?.totalActiveCourts || 0}</div><div className="metric-label-analytics">Active Courts</div></div></div>
        </div>
      </div>

      <div className="charts-section-analytics">
        <div className="chart-row-analytics">
          <div className="chart-card-analytics">
            <h3>Bookings Over Time</h3>
            <div className="chart-container-analytics">
              {trends.length ? (
                <div className="bar-chart-analytics">
                  {trends.map((t, idx) => (
                    <div key={idx} className="bar-group-analytics">
                      <div className="bar-analytics" style={{ height: `${(t.bookings / Math.max(...trends.map(x => x.bookings))) * 200}px` }}>
                        <span className="bar-value-analytics">{t.bookings}</span>
                      </div>
                      <span className="bar-label-analytics">{t._id}</span>
                    </div>
                  ))}
                </div>
              ) : <div className="no-data-analytics">No data</div>}
            </div>
          </div>

          <div className="chart-card-analytics">
            <h3>Revenue Over Time</h3>
            <div className="chart-container-analytics">
              {trends.length ? (
                <div className="bar-chart-analytics">
                  {trends.map((t, idx) => (
                    <div key={idx} className="bar-group-analytics">
                      <div className="bar-analytics" style={{ height: `${(t.revenue / Math.max(...trends.map(x => x.revenue))) * 200 || 0}px` }}>
                        <span className="bar-value-analytics">₹{t.revenue}</span>
                      </div>
                      <span className="bar-label-analytics">{t._id}</span>
                    </div>
                  ))}
                </div>
              ) : <div className="no-data-analytics">No data</div>}
            </div>
          </div>
        </div>

        <div className="chart-row-analytics">
          <div className="chart-card-analytics full-width-analytics">
            <h3>Most Active Sports</h3>
            <div className="chart-container-analytics">
              {bySport.length ? (
                <div className="status-chart-analytics">
                  {bySport.map((s, idx) => (
                    <div key={idx} className="status-bar-analytics">
                      <div className="status-info-analytics"><span className="status-name-analytics">{s._id}</span><span className="status-count-analytics">{s.count} bookings</span></div>
                      <div className="status-progress-analytics"><div className="progress-fill-analytics" style={{ width: `${(s.count / Math.max(...bySport.map(x => x.count))) * 100}%`, backgroundColor: 'var(--accent-color)' }}></div></div>
                      <span className="status-percentage-analytics">{s.count}</span>
                    </div>
                  ))}
                </div>
              ) : <div className="no-data-analytics">No data</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;