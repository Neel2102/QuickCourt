// Base API URL - adjust this based on your backend configuration
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Get all courts (for users)
export const getCourts = async () => {
  try {
    const response = await fetch(`${API_BASE}/courts`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching courts:', error);
    throw error;
  }
};

// Get court by ID
export const getCourtById = async (courtId) => {
  try {
    const response = await fetch(`${API_BASE}/courts/${courtId}`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching court:', error);
    throw error;
  }
};

// Get courts by venue ID
export const getCourtsByVenue = async (venueId) => {
  try {
    const response = await fetch(`${API_BASE}/courts/${venueId}`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching courts by venue:', error);
    throw error;
  }
};

// Get courts owned by the current user (for facility owners)
export const getOwnerCourts = async () => {
  try {
    const response = await fetch(`${API_BASE}/courts/owner`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching owner courts:', error);
    throw error;
  }
};

// Get courts by venue ID for owner (for facility owners)
export const getOwnerCourtsByVenue = async (venueId) => {
  try {
    const response = await fetch(`${API_BASE}/courts/owner/${venueId}`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching owner courts by venue:', error);
    throw error;
  }
};

// Create new court (for facility owners)
export const createCourt = async (courtData) => {
  try {
    const response = await fetch(`${API_BASE}/courts`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(courtData)
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to create court');
    }
    return data.data;
  } catch (error) {
    console.error('Error creating court:', error);
    throw error;
  }
};

// Update court (for facility owners)
export const updateCourt = async (courtId, courtData) => {
  try {
    const response = await fetch(`${API_BASE}/courts/${courtId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(courtData)
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to update court');
    }
    return data.data;
  } catch (error) {
    console.error('Error updating court:', error);
    throw error;
  }
};

// Delete court (for facility owners)
export const deleteCourt = async (courtId) => {
  try {
    const response = await fetch(`${API_BASE}/courts/${courtId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to delete court');
    }
    return data.data;
  } catch (error) {
    console.error('Error deleting court:', error);
    throw error;
  }
};

// Get available time slots for a court
export const getCourtTimeSlots = async (courtId, date) => {
  try {
    const response = await fetch(`${API_BASE}/courts/${courtId}/timeslots?date=${date}`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching court time slots:', error);
    throw error;
  }
};

// Get courts by sport type
export const getCourtsBySport = async (sportType) => {
  try {
    const response = await fetch(`${API_BASE}/courts/sport/${sportType}`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching courts by sport:', error);
    throw error;
  }
};

// Search courts with filters
export const searchCourts = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });

    const response = await fetch(`${API_BASE}/courts/search?${queryParams}`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error searching courts:', error);
    throw error;
  }
};

// Get court availability for a date range
export const getCourtAvailability = async (courtId, startDate, endDate) => {
  try {
    const response = await fetch(`${API_BASE}/courts/${courtId}/availability`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ startDate, endDate })
    });
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching court availability:', error);
    throw error;
  }
};

// Update court operating hours
export const updateCourtHours = async (courtId, operatingHours) => {
  try {
    const response = await fetch(`${API_BASE}/courts/${courtId}/hours`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ operatingHours })
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to update court hours');
    }
    return data.data;
  } catch (error) {
    console.error('Error updating court hours:', error);
    throw error;
  }
};

// Get court statistics
export const getCourtStats = async (courtId, period = 'month') => {
  try {
    const response = await fetch(`${API_BASE}/courts/${courtId}/stats?period=${period}`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching court stats:', error);
    throw error;
  }
};
