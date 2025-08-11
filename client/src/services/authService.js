// Base API URL - adjust this based on your backend configuration
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Login user
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Login failed');
    }
    return data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

// Register user
export const register = async (userData) => {
  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Registration failed');
    }
    return data;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

// Logout user
export const logout = async () => {
  try {
    const response = await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
};

// Check if user is authenticated
export const isAuthenticated = async () => {
  try {
    const response = await fetch(`${API_BASE}/auth/is-authenticated`, {
      method: 'POST',
      credentials: 'include'
    });
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

// Send verification OTP
export const sendVerifyOtp = async () => {
  try {
    const response = await fetch(`${API_BASE}/auth/send-verify-otp`, {
      method: 'POST',
      credentials: 'include'
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to send verification OTP');
    }
    return data;
  } catch (error) {
    console.error('Error sending verification OTP:', error);
    throw error;
  }
};

// Verify email with OTP
export const verifyEmail = async (otp) => {
  try {
    const response = await fetch(`${API_BASE}/auth/verify-email`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ otp })
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Email verification failed');
    }
    return data;
  } catch (error) {
    console.error('Error verifying email:', error);
    throw error;
  }
};

// Send reset password OTP
export const sendResetOtp = async (email) => {
  try {
    const response = await fetch(`${API_BASE}/auth/send-reset-otp`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to send reset OTP');
    }
    return data;
  } catch (error) {
    console.error('Error sending reset OTP:', error);
    throw error;
  }
};

// Reset password with OTP
export const resetPassword = async (email, otp, password) => {
  try {
    const response = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, otp, password })
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Password reset failed');
    }
    return data;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};