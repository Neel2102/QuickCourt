// Base API URL - adjust this based on your backend configuration
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get all venues (for users)
export const getVenues = async () => {
  try {
    const response = await fetch(`${API_BASE}/venues`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching venues:', error);
    throw error;
  }
};

// Get venue by ID
export const getVenueById = async (venueId) => {
  try {
    const response = await fetch(`${API_BASE}/venues/${venueId}`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching venue:', error);
    throw error;
  }
};

// Get venues owned by the current user (for facility owners)
export const getOwnerVenues = async () => {
  try {
    const response = await fetch(`${API_BASE}/venues/owner`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching owner venues:', error);
    throw error;
  }
};

// Create new venue (for facility owners)
export const createVenue = async (venueData) => {
  try {
    const response = await fetch(`${API_BASE}/venues`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(venueData)
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to create venue');
    }
    return data.data;
  } catch (error) {
    console.error('Error creating venue:', error);
    throw error;
  }
};

// Update venue (for facility owners)
export const updateVenue = async (venueId, venueData) => {
  try {
    const response = await fetch(`${API_BASE}/venues/${venueId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(venueData)
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to update venue');
    }
    return data.data;
  } catch (error) {
    console.error('Error updating venue:', error);
    throw error;
  }
};

// Delete venue (for facility owners)
export const deleteVenue = async (venueId) => {
  try {
    const response = await fetch(`${API_BASE}/venues/${venueId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to delete venue');
    }
    return data.data;
  } catch (error) {
    console.error('Error deleting venue:', error);
    throw error;
  }
};

// Search venues with filters
export const searchVenues = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });

    const response = await fetch(`${API_BASE}/venues/search?${queryParams}`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error searching venues:', error);
    throw error;
  }
};

// Get popular venues
export const getPopularVenues = async (limit = 6) => {
  try {
    const response = await fetch(`${API_BASE}/venues/popular?limit=${limit}`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching popular venues:', error);
    throw error;
  }
};

// Get venues by sport type
export const getVenuesBySport = async (sportType) => {
  try {
    const response = await fetch(`${API_BASE}/venues/sport/${sportType}`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching venues by sport:', error);
    throw error;
  }
}; 
