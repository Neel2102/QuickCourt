import { apiCall } from './api.js';

// Base API URL - adjust this based on your backend configuration
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// User Dashboard Services
export const getUserDashboardData = async () => {
  try {
    const userId = localStorage.getItem('userId');
    const [userData, bookingsData, venuesData] = await Promise.all([
      fetch(`${API_BASE}/user/data?userId=${userId}`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      }),
      fetch(`${API_BASE}/bookings/mybookings`, {
        credentials: 'include'
      }),
      fetch(`${API_BASE}/venues`, {
        credentials: 'include'
      })
    ]);

    const user = await userData.json();
    const bookings = await bookingsData.json();
    const venues = await venuesData.json();

    return {
      user: user.success ? user.userData : null,
      bookings: bookings.success ? bookings.data : [],
      venues: venues.success ? venues.data : []
    };
  } catch (error) {
    console.error('Error fetching user dashboard data:', error);
    throw error;
  }
};

// Facility Owner Dashboard Services
export const getOwnerDashboardData = async () => {
  try {
    const response = await fetch(`${API_BASE}/dashboard/owner`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching owner dashboard data:', error);
    throw error;
  }
};

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

export const getOwnerBookings = async () => {
  try {
    const response = await fetch(`${API_BASE}/bookings/owner`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching owner bookings:', error);
    throw error;
  }
};

// Admin Dashboard Services
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

export const approveFacility = async (facilityId, approved) => {
  try {
    const response = await fetch(`${API_BASE}/admin/facilities/${facilityId}/approve`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved })
    });
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error approving facility:', error);
    throw error;
  }
};

export const banUser = async (userId, banned) => {
  try {
    const response = await fetch(`${API_BASE}/admin/users/${userId}/ban`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ banned })
    });
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error banning user:', error);
    throw error;
  }
};

// Generic API call helper
export const apiCall = async (endpoint, options = {}) => {
  const defaultOptions = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...defaultOptions,
    ...options
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}; 
