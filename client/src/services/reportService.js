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
