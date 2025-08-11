import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { getAdminDashboardData, getOwnerDashboardData } from '../services/dashboardService';

export const useDashboard = (userRole) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch dashboard data based on user role
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data;
      if (userRole === 'Admin') {
        data = await getAdminDashboardData();
      } else if (userRole === 'FacilityOwner') {
        data = await getOwnerDashboardData();
      } else {
        throw new Error('Invalid user role for dashboard');
      }
      
      setDashboardData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [userRole]);

  // Refresh dashboard data
  const refreshDashboard = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Get specific metric from dashboard data
  const getMetric = useCallback((metricName) => {
    if (!dashboardData) return null;
    return dashboardData[metricName];
  }, [dashboardData]);

  // Get all metrics as an object
  const getMetrics = useCallback(() => {
    if (!dashboardData) return {};
    
    const metrics = {};
    Object.keys(dashboardData).forEach(key => {
      if (typeof dashboardData[key] === 'number' || typeof dashboardData[key] === 'string') {
        metrics[key] = dashboardData[key];
      }
    });
    
    return metrics;
  }, [dashboardData]);

  // Get chart data for specific chart type
  const getChartData = useCallback((chartType) => {
    if (!dashboardData) return null;
    
    switch (chartType) {
      case 'bookings':
        return dashboardData.bookingTrends || [];
      case 'revenue':
        return dashboardData.revenueTrends || [];
      case 'sports':
        return dashboardData.sportDistribution || [];
      case 'peakHours':
        return dashboardData.peakHours || [];
      default:
        return null;
    }
  }, [dashboardData]);

  // Clear error
  const clearError = useCallback(() => setError(null), []);

  // Check if dashboard data is available
  const hasData = useCallback(() => {
    return dashboardData !== null && Object.keys(dashboardData).length > 0;
  }, [dashboardData]);

  return {
    dashboardData,
    loading,
    error,
    fetchDashboardData,
    refreshDashboard,
    getMetric,
    getMetrics,
    getChartData,
    clearError,
    hasData,
  };
};

export default useDashboard; 
