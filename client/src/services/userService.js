// Base API URL - adjust this based on your backend configuration
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Get user profile
export const getUserProfile = async () => {
  try {
    const response = await fetch(`${API_BASE}/user/profile`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  try {
    const response = await fetch(`${API_BASE}/user/profile`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileData)
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to update profile');
    }
    return data.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Change password
export const changePassword = async (passwordData) => {
  try {
    const response = await fetch(`${API_BASE}/user/change-password`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(passwordData)
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to change password');
    }
    return data.data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

// Upload profile picture
export const uploadProfilePicture = async (file) => {
  try {
    const formData = new FormData();
    formData.append('profilePic', file);

    const response = await fetch(`${API_BASE}/user/upload-picture`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to upload profile picture');
    }
    return data.data;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw error;
  }
};

// Delete account
export const deleteAccount = async (password) => {
  try {
    const response = await fetch(`${API_BASE}/user/delete-account`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password })
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to delete account');
    }
    return data.data;
  } catch (error) {
    console.error('Error deleting account:', error);
    throw error;
  }
};

// Get user statistics
export const getUserStats = async () => {
  try {
    const response = await fetch(`${API_BASE}/user/stats`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error;
  }
};

// Get user activity
export const getUserActivity = async (period = 'month') => {
  try {
    const response = await fetch(`${API_BASE}/user/activity?period=${period}`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching user activity:', error);
    throw error;
  }
};

// Get user preferences
export const getUserPreferences = async () => {
  try {
    const response = await fetch(`${API_BASE}/user/preferences`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    throw error;
  }
};

// Update user preferences
export const updateUserPreferences = async (preferences) => {
  try {
    const response = await fetch(`${API_BASE}/user/preferences`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(preferences)
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to update preferences');
    }
    return data.data;
  } catch (error) {
    console.error('Error updating user preferences:', error);
    throw error;
  }
};

// Get user notifications
export const getUserNotifications = async () => {
  try {
    const response = await fetch(`${API_BASE}/user/notifications`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    throw error;
  }
};

// Mark notification as read
export const markNotificationRead = async (notificationId) => {
  try {
    const response = await fetch(`${API_BASE}/user/notifications/${notificationId}/read`, {
      method: 'PUT',
      credentials: 'include'
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to mark notification as read');
    }
    return data.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Get user by ID (for admins)
export const getUserById = async (userId) => {
  try {
    const response = await fetch(`${API_BASE}/admin/users/${userId}`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
};

// Search users (for admins)
export const searchUsers = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });

    const response = await fetch(`${API_BASE}/admin/users/search?${queryParams}`, {
      credentials: 'include'
    });
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};

// Export user data (for admins)
export const exportUserData = async (filters = {}, format = 'csv') => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });
    queryParams.append('format', format);

    const response = await fetch(`${API_BASE}/admin/users/export?${queryParams}`, {
      credentials: 'include'
    });
    
    if (format === 'csv') {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users_${new Date().toISOString().split('T')[0]}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
      return true;
    } else {
      const data = await response.json();
      return data.success ? data.data : null;
    }
  } catch (error) {
    console.error('Error exporting user data:', error);
    throw error;
  }
}; 
