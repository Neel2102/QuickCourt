import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getOwnerDashboardData } from '../../services/dashboardService';
import { getOwnerBookings } from '../../services/bookingService';
import { formatDate } from '../../utils/dateUtils';
import '../../CSS/Analytics.css';

const Analytics = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedVenue, setSelectedVenue] = useState('all');

  const periods = ['week', 'month', 'quarter', 'year'];

  useEffect(() => {
    fetchData();
  }, [selectedPeriod]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dashboardDataResult, bookingsData] = await Promise.all([
        getOwnerDashboardData(),
        getOwnerBookings()
      ]);
      setDashboardData(dashboardDataResult);
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const getRevenueData = () => {
    if (!bookings.length) return [];
    
    const revenueByDate = {};
    bookings.forEach(booking => {
      if (booking.status === 'Completed') {
        const date = formatDate(booking.date);
        revenueByDate[date] = (revenueByDate[date] || 0) + (booking.totalPrice || 0);
      }
    });
    
    return Object.entries(revenueByDate)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .slice(-7); // Last 7 entries
  };

  const getBookingTrends = () => {
    if (!bookings.length) return [];
    
    const bookingsByDate = {};
    bookings.forEach(booking => {
      const date = formatDate(booking.date);
      bookingsByDate[date] = (bookingsByDate[date] || 0) + 1;
    });
    
    return Object.entries(bookingsByDate)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .slice(-7); // Last 7 entries
  };

  const getSportDistribution = () => {
    if (!bookings.length) return [];
    
    const sportCounts = {};
    bookings.forEach(booking => {
      const sport = booking.court?.sportType || 'Unknown';
      sportCounts[sport] = (sportCounts[sport] || 0) + 1;
    });
    
    return Object.entries(sportCounts).map(([sport, count]) => ({
      sport,
      count,
      percentage: Math.round((count / bookings.length) * 100)
    }));
  };

  const getPeakHours = () => {
    if (!bookings.length) return [];
    
    const hourCounts = {};
    bookings.forEach(booking => {
      const hour = parseInt(booking.startTime?.split(':')[0]) || 0;
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    return Object.entries(hourCounts)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([hour, count]) => ({
        hour: `${hour}:00`,
        count
      }));
  };

  const getStatusDistribution = () => {
    if (!bookings.length) return [];
    
    const statusCounts = {};
    bookings.forEach(booking => {
      const status = booking.status || 'Unknown';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      percentage: Math.round((count / bookings.length) * 100)
    }));
  };

  if (loading) {
    return (
      <div className="analytics-container">
        <div className="loading">Loading analytics...</div>
      </div>
    );
  }

  const revenueData = getRevenueData();
  const bookingTrends = getBookingTrends();
  const sportDistribution = getSportDistribution();
  const peakHours = getPeakHours();
  const statusDistribution = getStatusDistribution();

  return (
    <div className="analytics-container">
      <div className="page-header">
        <h1>Analytics Dashboard</h1>
        <p>Comprehensive insights into your facility performance</p>
        
        <div className="period-selector">
          <label>Time Period:</label>
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="period-select"
          >
            {periods.map(period => (
              <option key={period} value={period}>
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-section">
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon">📊</div>
            <div className="metric-content">
              <div className="metric-number">{dashboardData?.totalBookings || 0}</div>
              <div className="metric-label">Total Bookings</div>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon">💰</div>
            <div className="metric-content">
              <div className="metric-number">₹{dashboardData?.totalEarnings || 0}</div>
              <div className="metric-label">Total Earnings</div>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon">🏟️</div>
            <div className="metric-content">
              <div className="metric-number">{dashboardData?.activeCourts || 0}</div>
              <div className="metric-label">Active Courts</div>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-icon">📈</div>
            <div className="metric-content">
              <div className="metric-number">{dashboardData?.bookingTrends?.growth || 0}%</div>
              <div className="metric-label">Growth Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-row">
          {/* Revenue Chart */}
          <div className="chart-card">
            <h3>Revenue Trends</h3>
            <div className="chart-container">
              {revenueData.length > 0 ? (
                <div className="bar-chart">
                  {revenueData.map(([date, revenue], index) => (
                    <div key={index} className="bar-group">
                      <div className="bar" style={{ height: `${(revenue / Math.max(...revenueData.map(([, r]) => r))) * 200}px` }}>
                        <span className="bar-value">₹{revenue}</span>
                      </div>
                      <span className="bar-label">{date}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data">No revenue data available</div>
              )}
            </div>
          </div>

          {/* Booking Trends Chart */}
          <div className="chart-card">
            <h3>Booking Trends</h3>
            <div className="chart-container">
              {bookingTrends.length > 0 ? (
                <div className="line-chart">
                  {bookingTrends.map(([date, count], index) => (
                    <div key={index} className="line-point">
                      <div className="point" style={{ left: `${(index / (bookingTrends.length - 1)) * 100}%` }}>
                        <span className="point-value">{count}</span>
                      </div>
                      <span className="point-label">{date}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data">No booking data available</div>
              )}
            </div>
          </div>
        </div>

        <div className="chart-row">
          {/* Sport Distribution */}
          <div className="chart-card">
            <h3>Sport Distribution</h3>
            <div className="chart-container">
              {sportDistribution.length > 0 ? (
                <div className="pie-chart">
                  {sportDistribution.map((item, index) => (
                    <div key={index} className="pie-segment">
                      <div className="segment-info">
                        <span className="sport-name">{item.sport}</span>
                        <span className="sport-count">{item.count} ({item.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data">No sport data available</div>
              )}
            </div>
          </div>

          {/* Peak Hours */}
          <div className="chart-card">
            <h3>Peak Booking Hours</h3>
            <div className="chart-container">
              {peakHours.length > 0 ? (
                <div className="heatmap-chart">
                  {peakHours.map((item, index) => (
                    <div key={index} className="heatmap-cell">
                      <span className="hour-label">{item.hour}</span>
                      <div className="intensity" style={{ opacity: item.count / Math.max(...peakHours.map(h => h.count)) }}>
                        {item.count}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data">No time data available</div>
              )}
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="chart-row">
          <div className="chart-card full-width">
            <h3>Booking Status Distribution</h3>
            <div className="chart-container">
              {statusDistribution.length > 0 ? (
                <div className="status-chart">
                  {statusDistribution.map((item, index) => (
                    <div key={index} className="status-bar">
                      <div className="status-info">
                        <span className="status-name">{item.status}</span>
                        <span className="status-count">{item.count} bookings</span>
                      </div>
                      <div className="status-progress">
                        <div 
                          className="progress-fill" 
                          style={{ 
                            width: `${item.percentage}%`,
                            backgroundColor: item.status === 'Completed' ? '#10b981' : 
                                           item.status === 'Confirmed' ? '#3b82f6' : 
                                           item.status === 'Cancelled' ? '#ef4444' : '#6b7280'
                          }}
                        ></div>
                      </div>
                      <span className="status-percentage">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data">No status data available</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="insights-section">
        <h3>Key Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon">💡</div>
            <h4>Best Performing Sport</h4>
            <p>
              {sportDistribution.length > 0 
                ? `${sportDistribution[0]?.sport} is your most popular sport with ${sportDistribution[0]?.count} bookings`
                : 'No sport data available yet'
              }
            </p>
          </div>
          
          <div className="insight-card">
            <div className="insight-icon">⏰</div>
            <h4>Peak Hours</h4>
            <p>
              {peakHours.length > 0 
                ? `Your busiest time is ${peakHours.reduce((max, item) => item.count > max.count ? item : max).hour} with ${peakHours.reduce((max, item) => item.count > max.count ? item : max).count} bookings`
                : 'No time data available yet'
              }
            </p>
          </div>
          
          <div className="insight-card">
            <div className="insight-icon">📅</div>
            <h4>Completion Rate</h4>
            <p>
              {statusDistribution.length > 0 
                ? `${Math.round((statusDistribution.find(s => s.status === 'Completed')?.count || 0) / bookings.length * 100)}% of bookings are completed successfully`
                : 'No completion data available yet'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 
