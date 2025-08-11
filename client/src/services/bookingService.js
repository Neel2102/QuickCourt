// Base API URL - adjust this based on your backend configuration
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Get user's bookings
export const getMyBookings = async () => {
  try {
    const response = await fetch(`${API_BASE}/bookings/mybookings`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching my bookings:', error);
    throw error;
  }
};

// Get booking by ID
export const getBookingById = async (bookingId) => {
  try {
    const response = await fetch(`${API_BASE}/bookings/${bookingId}`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching booking:', error);
    throw error;
  }
};

// Create new booking
export const createBooking = async (bookingData) => {
  try {
    const response = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookingData)
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to create booking');
    }
    return data.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

// Update booking
export const updateBooking = async (bookingId, bookingData) => {
  try {
    const response = await fetch(`${API_BASE}/bookings/${bookingId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookingData)
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to update booking');
    }
    return data.data;
  } catch (error) {
    console.error('Error updating booking:', error);
    throw error;
  }
};

// Cancel booking
export const cancelBooking = async (bookingId) => {
  try {
    const response = await fetch(`${API_BASE}/bookings/${bookingId}/cancel`, {
      method: 'PUT',
      credentials: 'include'
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to cancel booking');
    }
    return data.data;
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw error;
  }
};

// Delete booking
export const deleteBooking = async (bookingId) => {
  try {
    const response = await fetch(`${API_BASE}/bookings/${bookingId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to delete booking');
    }
    return data.data;
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw error;
  }
};

// Get owner's bookings (for facility owners)
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

// Get venue bookings - NOT IMPLEMENTED IN BACKEND YET
// export const getVenueBookings = async (venueId, date = null) => {
//   try {
//     const url = date
//       ? `${API_BASE}/bookings/venue/${venueId}?date=${date}`
//       : `${API_BASE}/bookings/venue/${venueId}`;
//
//     const response = await fetch(url, {
//       credentials: 'include'
//     });
//     const data = await response.json();
//     return data.success ? data.data : [];
//   } catch (error) {
//     console.error('Error fetching venue bookings:', error);
//     throw error;
//   }
// };

// Get court bookings - NOT IMPLEMENTED IN BACKEND YET
// export const getCourtBookings = async (courtId, date = null) => {
//   try {
//     const url = date
//       ? `${API_BASE}/bookings/court/${courtId}?date=${date}`
//       : `${API_BASE}/bookings/court/${courtId}`;
//
//     const response = await fetch(url, {
//       credentials: 'include'
//     });
//     const data = await response.json();
//     return data.success ? data.data : [];
//   } catch (error) {
//     console.error('Error fetching court bookings:', error);
//     throw error;
//   }
// };

// Check court availability - NOT IMPLEMENTED IN BACKEND YET
// export const checkCourtAvailability = async (courtId, date, startTime, endTime) => {
//   try {
//     const response = await fetch(`${API_BASE}/bookings/availability`, {
//       method: 'POST',
//       credentials: 'include',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         courtId,
//         date,
//         startTime,
//         endTime
//       })
//     });
//     const data = await response.json();
//     return data.success ? data.data : null;
//   } catch (error) {
//     console.error('Error checking court availability:', error);
//     throw error;
//   }
// };

// Get booking statistics
export const getBookingStats = async (period = 'month', userId = null) => {
  try {
    const url = userId 
      ? `${API_BASE}/bookings/stats?period=${period}&userId=${userId}`
      : `${API_BASE}/bookings/stats?period=${period}`;
    
    const response = await fetch(url, {
      credentials: 'include'
    });
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching booking stats:', error);
    throw error;
  }
};

// Search bookings with filters
export const searchBookings = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });

    const response = await fetch(`${API_BASE}/bookings/search?${queryParams}`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error searching bookings:', error);
    throw error;
  }
};

// Get upcoming bookings
export const getUpcomingBookings = async (limit = 10) => {
  try {
    const response = await fetch(`${API_BASE}/bookings/upcoming?limit=${limit}`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching upcoming bookings:', error);
    throw error;
  }
};

// Get past bookings
export const getPastBookings = async (limit = 10) => {
  try {
    const response = await fetch(`${API_BASE}/bookings/past?limit=${limit}`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching past bookings:', error);
    throw error;
  }
};

// Export bookings (for admins/owners)
export const exportBookings = async (filters = {}, format = 'csv') => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });
    queryParams.append('format', format);

    const response = await fetch(`${API_BASE}/bookings/export?${queryParams}`, {
      credentials: 'include'
    });
    
    if (format === 'csv') {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bookings_${new Date().toISOString().split('T')[0]}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
      return true;
    } else {
      const data = await response.json();
      return data.success ? data.data : null;
    }
  } catch (error) {
    console.error('Error exporting bookings:', error);
    throw error;
  }
}; 
