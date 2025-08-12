const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

// File a new report
export const fileReport = async (reportData) => {
  try {
    const response = await fetch(`${API_BASE}/reports`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reportData)
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to file report');
    }

    return data.data;
  } catch (error) {
    console.error('Error filing report:', error);
    throw error;
  }
};

// Get reports filed by the current user
export const getMyReports = async (status = 'all', targetType = 'all') => {
  try {
    const queryParams = new URLSearchParams();
    if (status !== 'all') queryParams.append('status', status);
    if (targetType !== 'all') queryParams.append('targetType', targetType);

    const response = await fetch(`${API_BASE}/reports/my-reports?${queryParams}`, {
      credentials: 'include'
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch reports');
    }

    return data.data;
  } catch (error) {
    console.error('Error fetching my reports:', error);
    throw error;
  }
};

// Get details of a specific report
export const getReportDetails = async (reportId) => {
  try {
    const response = await fetch(`${API_BASE}/reports/${reportId}`, {
      credentials: 'include'
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch report details');
    }

    return data.data;
  } catch (error) {
    console.error('Error fetching report details:', error);
    throw error;
  }
};

// Update a report
export const updateReport = async (reportId, updateData) => {
  try {
    const response = await fetch(`${API_BASE}/reports/${reportId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to update report');
    }

    return data.data;
  } catch (error) {
    console.error('Error updating report:', error);
    throw error;
  }
};

// Delete a report
export const deleteReport = async (reportId) => {
  try {
    const response = await fetch(`${API_BASE}/reports/${reportId}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to delete report');
    }

    return true;
  } catch (error) {
    console.error('Error deleting report:', error);
    throw error;
  }
};

// Get report statistics for user dashboard
export const getReportStats = async () => {
  try {
    const reports = await getMyReports();

    const stats = {
      total: reports.length,
      open: reports.filter(r => r.status === 'open').length,
      inReview: reports.filter(r => r.status === 'in_review').length,
      resolved: reports.filter(r => r.status === 'resolved').length,
      byType: {
        user: reports.filter(r => r.targetType === 'user').length,
        venue: reports.filter(r => r.targetType === 'venue').length,
        booking: reports.filter(r => r.targetType === 'booking').length
      }
    };

    return stats;
  } catch (error) {
    console.error('Error calculating report stats:', error);
    throw error;
  }
};

// Check if user can edit a report (only open reports can be edited)
export const canEditReport = (report) => {
  return report && report.status === 'open';
};

// Check if user can delete a report (only open reports can be deleted)
export const canDeleteReport = (report) => {
  return report && report.status === 'open';
};

// Format report status for display
export const formatReportStatus = (status) => {
  const statusMap = {
    'open': 'Open',
    'in_review': 'In Review',
    'resolved': 'Resolved'
  };
  return statusMap[status] || status;
};

// Format report type for display
export const formatReportType = (type) => {
  const typeMap = {
    'user': 'User',
    'venue': 'Venue',
    'booking': 'Booking'
  };
  return typeMap[type] || type;
};

// Get status color class for styling
export const getStatusColorClass = (status) => {
  const colorMap = {
    'open': 'status-open',
    'in_review': 'status-in_review',
    'resolved': 'status-resolved'
  };
  return colorMap[status] || 'status-default';
};
