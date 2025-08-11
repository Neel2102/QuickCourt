// Base API service with common HTTP methods
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Common headers for API requests
const getHeaders = () => ({
  'Content-Type': 'application/json',
});

// Generic API call function
export const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      credentials: 'include',
      headers: getHeaders(),
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// GET request
export const apiGet = (endpoint) => apiCall(endpoint, { method: 'GET' });

// POST request
export const apiPost = (endpoint, body) => apiCall(endpoint, {
  method: 'POST',
  body: JSON.stringify(body),
});

// PUT request
export const apiPut = (endpoint, body) => apiCall(endpoint, {
  method: 'PUT',
  body: JSON.stringify(body),
});

// DELETE request
export const apiDelete = (endpoint) => apiCall(endpoint, { method: 'DELETE' });

// PATCH request
export const apiPatch = (endpoint, body) => apiCall(endpoint, {
  method: 'PATCH',
  body: JSON.stringify(body),
});

// File upload
export const apiUpload = async (endpoint, formData) => {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      credentials: 'include',
      body: formData, // Don't set Content-Type for multipart/form-data
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('File upload failed:', error);
    throw error;
  }
};

export default {
  apiCall,
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  apiPatch,
  apiUpload,
}; 
