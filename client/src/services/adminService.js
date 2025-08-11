// Base API URL - adjust this based on your backend configuration
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Get admin dashboard data
export const getAdminDashboardData = async () => {
  try {
    const response = await fetch(`${API_BASE}/dashboard/admin`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching admin dashboard data:', error);
    throw error;
  }
};

// Get pending facilities for approval
export const getPendingFacilities = async () => {
  try {
    const response = await fetch(`${API_BASE}/admin/facilities/pending`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching pending facilities:', error);
    throw error;
  }
};

// Get all users for management
export const getAllUsers = async () => {
  try {
    const response = await fetch(`${API_BASE}/admin/users`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};

// Approve or reject a facility
export const approveFacility = async (facilityId, approved, comment = '') => {
  try {
    const response = await fetch(`${API_BASE}/admin/facilities/${facilityId}/approve`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ approved, comment })
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to update facility approval');
    }
    return data.data;
  } catch (error) {
    console.error('Error updating facility approval:', error);
    throw error;
  }
};

// Ban or unban a user
export const banUser = async (userId, banned, reason = '') => {
  try {
    const response = await fetch(`${API_BASE}/admin/users/${userId}/ban`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ banned, reason })
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to update user ban status');
    }
    return data.data;
  } catch (error) {
    console.error('Error updating user ban status:', error);
    throw error;
  }
};

// Get user details and booking history
export const getUserDetails = async (userId) => {
  try {
    const response = await fetch(`${API_BASE}/admin/users/${userId}`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};

// Get facility details for admin review
export const getFacilityDetails = async (facilityId) => {
  try {
    const response = await fetch(`${API_BASE}/admin/facilities/${facilityId}`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching facility details:', error);
    throw error;
  }
};

// Get system statistics
export const getSystemStats = async () => {
  try {
    const response = await fetch(`${API_BASE}/admin/stats`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching system stats:', error);
    throw error;
  }
};

// Get reports and moderation data
export const getReports = async (type = 'all', status = 'all') => {
  try {
    const response = await fetch(`${API_BASE}/admin/reports?type=${type}&status=${status}`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
};

// Update report status
export const updateReportStatus = async (reportId, status, action = '') => {
  try {
    const response = await fetch(`${API_BASE}/admin/reports/${reportId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status, action })
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to update report status');
    }
    return data.data;
  } catch (error) {
    console.error('Error updating report status:', error);
    throw error;
  }
};

// Get analytics data for admin dashboard
export const getAdminAnalytics = async (period = 'month') => {
  try {
    const response = await fetch(`${API_BASE}/admin/analytics?period=${period}`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching admin analytics:', error);
    throw error;
  }
};

// Export data (users, facilities, bookings)
export const exportData = async (type, format = 'csv') => {
  try {
    const response = await fetch(`${API_BASE}/admin/export?type=${type}&format=${format}`, {
      credentials: 'include'
    });
    
    if (format === 'csv') {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_${new Date().toISOString().split('T')[0]}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
      return true;
    } else {
      const data = await response.json();
      return data.success ? data.data : null;
    }
  } catch (error) {
    console.error('Error exporting data:', error);
    throw error;
  }
}; 
