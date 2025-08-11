// Base API URL - adjust this based on your backend configuration
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

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

// Create new venue (multipart/form-data for images)
export const createVenue = async (venueData) => {
  // venueData: { name, description, address: {street, city, state, postalCode}, sportTypes:[], amenities:[], images: File[]|base64[] }
  try {
    console.log('=== FRONTEND CREATE VENUE DEBUG ===');
    console.log('Venue data received:', venueData);

    const form = new FormData();
    form.append('name', venueData.name);
    form.append('description', venueData.description || '');
    form.append('address', JSON.stringify(venueData.address || {}));
    form.append('sportTypes', JSON.stringify(venueData.sportTypes || []));
    form.append('amenities', JSON.stringify(venueData.amenities || []));

    console.log('Form data being sent:');
    console.log('- name:', venueData.name);
    console.log('- description:', venueData.description);
    console.log('- address:', JSON.stringify(venueData.address));
    console.log('- sportTypes:', JSON.stringify(venueData.sportTypes));
    console.log('- amenities:', JSON.stringify(venueData.amenities));

    // Photos: accepts File list or base64 strings
    const photos = venueData.photos || venueData.images || [];
    console.log('Photos to upload:', photos);
    if (Array.isArray(photos)) {
      photos.forEach((img, index) => {
        if (img instanceof File) {
          console.log(`Adding photo ${index}:`, img.name, img.size);
          form.append('photos', img);
        } else if (typeof img === 'string') {
          // Convert base64 to Blob
          const blob = dataURLToBlob(img);
          console.log(`Adding base64 photo ${index}:`, blob.size);
          form.append('photos', blob, `photo_${Date.now()}.png`);
        }
      });
    }

    console.log('Sending request to:', `${API_BASE}/venues`);
    const res = await fetch(`${API_BASE}/venues`, {
      method: 'POST',
      credentials: 'include',
      body: form,
    });

    console.log('Response status:', res.status);
    console.log('Response headers:', Object.fromEntries(res.headers.entries()));

    if (!res.ok) {
      const errorText = await res.text();
      console.log('Error response text:', errorText);
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }

    const data = await res.json();
    console.log('Response data:', data);

    if (!data.success) throw new Error(data.message || 'Failed to create venue');
    return data.venue;
  } catch (error) {
    console.error('Error creating venue:', error);
    throw error;
  }
};

// helper: base64 dataURL to Blob
const dataURLToBlob = (dataURL) => {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new Blob([u8arr], { type: mime });
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
