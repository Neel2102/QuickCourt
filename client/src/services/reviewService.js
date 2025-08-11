// Base API URL
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Create a new review
export const createReview = async (reviewData) => {
  try {
    console.log('Review service: Creating review with data:', reviewData);
    console.log('Review service: API endpoint:', `${API_BASE}/reviews`);

    const response = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(reviewData),
    });

    console.log('Review service: Response status:', response.status);
    const data = await response.json();
    console.log('Review service: Response data:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create review');
    }

    return data;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

// Get reviews for a venue
export const getVenueReviews = async (venueId, options = {}) => {
  try {
    const { page = 1, limit = 10, sort = 'newest' } = options;
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sort
    });

    const response = await fetch(`${API_BASE}/reviews/venue/${venueId}?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch reviews');
    }

    return data;
  } catch (error) {
    console.error('Error fetching venue reviews:', error);
    throw error;
  }
};

// Get user's reviews
export const getUserReviews = async (options = {}) => {
  try {
    const { page = 1, limit = 10 } = options;
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    const response = await fetch(`${API_BASE}/reviews/my-reviews?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch user reviews');
    }

    return data;
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    throw error;
  }
};

// Update a review
export const updateReview = async (reviewId, reviewData) => {
  try {
    const response = await fetch(`${API_BASE}/reviews/${reviewId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(reviewData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update review');
    }

    return data;
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
};

// Delete a review
export const deleteReview = async (reviewId) => {
  try {
    const response = await fetch(`${API_BASE}/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete review');
    }

    return data;
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

// Check if user can review a venue
export const checkReviewEligibility = async (venueId) => {
  try {
    const response = await fetch(`${API_BASE}/reviews/check-eligibility/${venueId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to check review eligibility');
    }

    return data;
  } catch (error) {
    console.error('Error checking review eligibility:', error);
    throw error;
  }
};
