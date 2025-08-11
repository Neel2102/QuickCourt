// Application Constants

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

// User Roles
export const USER_ROLES = {
  USER: 'User',
  FACILITY_OWNER: 'FacilityOwner',
  ADMIN: 'Admin',
};

// Booking Status
export const BOOKING_STATUS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',
  NO_SHOW: 'No Show',
};

// Venue Status
export const VENUE_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  SUSPENDED: 'Suspended',
};

// Sport Types
export const SPORT_TYPES = [
  'Badminton',
  'Tennis',
  'Football',
  'Cricket',
  'Basketball',
  'Volleyball',
  'Table Tennis',
  'Squash',
  'Swimming',
  'Gym',
  'Yoga',
  'Dance',
  'Martial Arts',
  'Other',
];

// Time Slots
export const TIME_SLOTS = {
  START_TIME: '06:00',
  END_TIME: '23:00',
  DURATION: 60, // minutes
  INTERVALS: [60, 90, 120], // available durations in minutes
};

// Price Ranges
export const PRICE_RANGES = {
  LOW: { label: 'Low (≤₹500)', value: 'low', max: 500 },
  MEDIUM: { label: 'Medium (₹501-₹1000)', value: 'medium', min: 501, max: 1000 },
  HIGH: { label: 'High (>₹1000)', value: 'high', min: 1001 },
};

// Rating Categories
export const RATING_CATEGORIES = {
  EXCELLENT: { label: 'Excellent', value: 'excellent', min: 4.5 },
  GOOD: { label: 'Good', value: 'good', min: 4.0, max: 4.4 },
  AVERAGE: { label: 'Average', value: 'average', min: 3.0, max: 3.9 },
  POOR: { label: 'Poor', value: 'poor', max: 2.9 },
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
  MAX_PAGE_SIZE: 100,
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
  MAX_FILES: 5,
  IMAGE_DIMENSIONS: {
    MIN_WIDTH: 300,
    MIN_HEIGHT: 200,
    MAX_WIDTH: 1920,
    MAX_HEIGHT: 1080,
  },
};

// Validation Rules
export const VALIDATION = {
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: false,
  },
  PHONE: {
    PATTERN: /^[6-9]\d{9}$/, // Indian mobile number
    MIN_LENGTH: 10,
    MAX_LENGTH: 10,
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
};

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  LOADING: 'loading',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
  PREFERENCES: 'preferences',
};

// Theme Configuration
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

// Language Options
export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
];

// Currency
export const CURRENCY = {
  SYMBOL: '₹',
  CODE: 'INR',
  NAME: 'Indian Rupee',
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'DD MMM YYYY',
  INPUT: 'YYYY-MM-DD',
  TIME: 'HH:mm',
  DATETIME: 'DD MMM YYYY, HH:mm',
  RELATIVE: 'relative', // for relative time like "2 hours ago"
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied. You don\'t have permission.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: 'Profile updated successfully!',
  BOOKING_CREATED: 'Booking created successfully!',
  BOOKING_CANCELLED: 'Booking cancelled successfully!',
  VENUE_CREATED: 'Venue created successfully!',
  VENUE_UPDATED: 'Venue updated successfully!',
  VENUE_DELETED: 'Venue deleted successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!',
  LOGIN_SUCCESS: 'Welcome back!',
  LOGOUT_SUCCESS: 'Logged out successfully!',
};

// Route Paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  USER_DASHBOARD: '/user-dashboard',
  FACILITY_DASHBOARD: '/facility-dashboard',
  ADMIN_DASHBOARD: '/admin-dashboard',
  VENUES: '/venues',
  VENUE_DETAILS: '/venue/:id',
  BOOKING: '/booking',
  PROFILE: '/profile',
  ABOUT: '/about',
  CONTACT: '/contact',
  HELP: '/help',
  PRIVACY: '/privacy',
  TERMS: '/terms',
};

export default {
  API_CONFIG,
  USER_ROLES,
  BOOKING_STATUS,
  VENUE_STATUS,
  SPORT_TYPES,
  TIME_SLOTS,
  PRICE_RANGES,
  RATING_CATEGORIES,
  PAGINATION,
  FILE_UPLOAD,
  VALIDATION,
  NOTIFICATION_TYPES,
  STORAGE_KEYS,
  THEMES,
  LANGUAGES,
  CURRENCY,
  DATE_FORMATS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ROUTES,
}; 
