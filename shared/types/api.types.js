// API type definitions for the application

// Base API Response Types
export const API_RESPONSE_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Generic API Response
export const createApiResponse = (data, message = '', status = API_RESPONSE_STATUS.SUCCESS) => ({
  success: status === API_RESPONSE_STATUS.SUCCESS,
  status,
  message,
  data,
  timestamp: new Date().toISOString(),
});

// Generic API Error Response
export const createApiErrorResponse = (message, errorCode = 'UNKNOWN_ERROR', statusCode = 500, details = null) => ({
  success: false,
  status: API_RESPONSE_STATUS.ERROR,
  message,
  errorCode,
  statusCode,
  details,
  timestamp: new Date().toISOString(),
});

// Pagination Types
export const PAGINATION_TYPES = {
  OFFSET: 'offset',
  CURSOR: 'cursor',
  KEYSET: 'keyset',
};

// Pagination Response
export const createPaginationResponse = (data, page, limit, total, totalPages) => ({
  success: true,
  data,
  pagination: {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  },
  timestamp: new Date().toISOString(),
});

// API Endpoint Types
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY_EMAIL: '/auth/verify-email',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  
  // User Management
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    DELETE_PROFILE: '/user/profile',
    UPLOAD_AVATAR: '/user/avatar',
    CHANGE_PASSWORD: '/user/change-password',
    NOTIFICATIONS: '/user/notifications',
    PREFERENCES: '/user/preferences',
  },
  
  // Venue Management
  VENUE: {
    LIST: '/venues',
    CREATE: '/venues',
    DETAILS: '/venues/:id',
    UPDATE: '/venues/:id',
    DELETE: '/venues/:id',
    APPROVE: '/venues/:id/approve',
    REJECT: '/venues/:id/reject',
    SUSPEND: '/venues/:id/suspend',
    PHOTOS: '/venues/:id/photos',
    AMENITIES: '/venues/:id/amenities',
    REVIEWS: '/venues/:id/reviews',
    SEARCH: '/venues/search',
    FILTER: '/venues/filter',
  },
  
  // Court Management
  COURT: {
    LIST: '/courts',
    CREATE: '/courts',
    DETAILS: '/courts/:id',
    UPDATE: '/courts/:id',
    DELETE: '/courts/:id',
    BY_VENUE: '/courts/venue/:venueId',
    AVAILABILITY: '/courts/:id/availability',
    PRICING: '/courts/:id/pricing',
    SCHEDULE: '/courts/:id/schedule',
  },
  
  // Booking Management
  BOOKING: {
    LIST: '/bookings',
    CREATE: '/bookings',
    DETAILS: '/bookings/:id',
    UPDATE: '/bookings/:id',
    CANCEL: '/bookings/:id/cancel',
    MY_BOOKINGS: '/bookings/my-bookings',
    OWNER_BOOKINGS: '/bookings/owner',
    STATUS: '/bookings/:id/status',
    PAYMENT: '/bookings/:id/payment',
    REFUND: '/bookings/:id/refund',
  },
  
  // Time Slot Management
  TIME_SLOT: {
    LIST: '/time-slots',
    CREATE: '/time-slots',
    UPDATE: '/time-slots/:id',
    DELETE: '/time-slots/:id',
    BY_COURT: '/time-slots/court/:courtId',
    BY_DATE: '/time-slots/date/:date',
    AVAILABILITY: '/time-slots/availability',
    BLOCK: '/time-slots/:id/block',
    UNBLOCK: '/time-slots/:id/unblock',
  },
  
  // Review Management
  REVIEW: {
    LIST: '/reviews',
    CREATE: '/reviews',
    DETAILS: '/reviews/:id',
    UPDATE: '/reviews/:id',
    DELETE: '/reviews/:id',
    BY_VENUE: '/reviews/venue/:venueId',
    BY_USER: '/reviews/user/:userId',
    APPROVE: '/reviews/:id/approve',
    REJECT: '/reviews/:id/reject',
    FLAG: '/reviews/:id/flag',
  },
  
  // Report Management
  REPORT: {
    LIST: '/reports',
    CREATE: '/reports',
    DETAILS: '/reports/:id',
    UPDATE: '/reports/:id',
    STATUS: '/reports/:id/status',
    BY_TYPE: '/reports/type/:type',
    BY_STATUS: '/reports/status/:status',
    ESCALATE: '/reports/:id/escalate',
    RESOLVE: '/reports/:id/resolve',
  },
  
  // Admin Management
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    USER_DETAILS: '/admin/users/:id',
    BAN_USER: '/admin/users/:id/ban',
    UNBAN_USER: '/admin/users/:id/unban',
    VENUES: '/admin/venues',
    VENUE_DETAILS: '/admin/venues/:id',
    APPROVE_VENUE: '/admin/venues/:id/approve',
    REJECT_VENUE: '/admin/venues/:id/reject',
    SUSPEND_VENUE: '/admin/venues/:id/suspend',
    REPORTS: '/admin/reports',
    REPORT_DETAILS: '/admin/reports/:id',
    ANALYTICS: '/admin/analytics',
    SYSTEM_STATS: '/admin/system-stats',
    EXPORT_DATA: '/admin/export',
  },
  
  // Dashboard
  DASHBOARD: {
    USER: '/dashboard/user',
    OWNER: '/dashboard/owner',
    ADMIN: '/dashboard/admin',
    ANALYTICS: '/dashboard/analytics',
    STATS: '/dashboard/stats',
    REPORTS: '/dashboard/reports',
  },
  
  // Payment
  PAYMENT: {
    PROCESS: '/payment/process',
    VERIFY: '/payment/verify',
    REFUND: '/payment/refund',
    HISTORY: '/payment/history',
    METHODS: '/payment/methods',
    SETTINGS: '/payment/settings',
  },
  
  // Notification
  NOTIFICATION: {
    LIST: '/notifications',
    MARK_READ: '/notifications/:id/read',
    MARK_ALL_READ: '/notifications/read-all',
    DELETE: '/notifications/:id',
    PREFERENCES: '/notifications/preferences',
    SEND: '/notifications/send',
  },
  
  // File Upload
  UPLOAD: {
    IMAGE: '/upload/image',
    DOCUMENT: '/upload/document',
    AVATAR: '/upload/avatar',
    VENUE_PHOTO: '/upload/venue-photo',
    COURT_PHOTO: '/upload/court-photo',
  },
  
  // Search
  SEARCH: {
    VENUES: '/search/venues',
    COURTS: '/search/courts',
    USERS: '/search/users',
    GLOBAL: '/search/global',
    SUGGESTIONS: '/search/suggestions',
  },
};

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  HEAD: 'HEAD',
  OPTIONS: 'OPTIONS',
};

// API Request Headers
export const API_HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  ACCEPT: 'Accept',
  USER_AGENT: 'User-Agent',
  CACHE_CONTROL: 'Cache-Control',
  X_REQUESTED_WITH: 'X-Requested-With',
  X_API_KEY: 'X-API-Key',
  X_CLIENT_VERSION: 'X-Client-Version',
  X_PLATFORM: 'X-Platform',
};

// Content Types
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  FORM_URLENCODED: 'application/x-www-form-urlencoded',
  TEXT: 'text/plain',
  HTML: 'text/html',
  XML: 'application/xml',
};

// API Response Codes
export const API_RESPONSE_CODES = {
  // Success Codes
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  
  // Client Error Codes
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  
  // Server Error Codes
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

// API Error Codes
export const API_ERROR_CODES = {
  // Authentication Errors
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  ACCOUNT_NOT_VERIFIED: 'ACCOUNT_NOT_VERIFIED',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  
  // Validation Errors
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  REQUIRED_FIELD_MISSING: 'REQUIRED_FIELD_MISSING',
  INVALID_FORMAT: 'INVALID_FORMAT',
  FIELD_TOO_LONG: 'FIELD_TOO_LONG',
  FIELD_TOO_SHORT: 'FIELD_TOO_SHORT',
  INVALID_VALUE: 'INVALID_VALUE',
  
  // Resource Errors
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS: 'RESOURCE_ALREADY_EXISTS',
  RESOURCE_IN_USE: 'RESOURCE_IN_USE',
  RESOURCE_DELETED: 'RESOURCE_DELETED',
  RESOURCE_UNAVAILABLE: 'RESOURCE_UNAVAILABLE',
  
  // Business Logic Errors
  BOOKING_CONFLICT: 'BOOKING_CONFLICT',
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  VENUE_NOT_APPROVED: 'VENUE_NOT_APPROVED',
  COURT_NOT_AVAILABLE: 'COURT_NOT_AVAILABLE',
  TIME_SLOT_BOOKED: 'TIME_SLOT_BOOKED',
  
  // System Errors
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  FILE_UPLOAD_ERROR: 'FILE_UPLOAD_ERROR',
  EMAIL_SEND_ERROR: 'EMAIL_SEND_ERROR',
  PAYMENT_GATEWAY_ERROR: 'PAYMENT_GATEWAY_ERROR',
  
  // Network Errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  CONNECTION_ERROR: 'CONNECTION_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  
  // Unknown Error
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

// API Request Configuration
export const API_REQUEST_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  MAX_FILES: 5,
};

// API Response Metadata
export const createApiMetadata = (requestId, userId, timestamp, version = '1.0.0') => ({
  requestId,
  userId,
  timestamp,
  version,
  server: process.env.SERVER_NAME || 'QuickCourt API',
  environment: process.env.NODE_ENV || 'development',
});

// API Rate Limiting
export const RATE_LIMIT_CONFIG = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100, // 100 requests per window
  MESSAGE: 'Too many requests from this IP, please try again later.',
  HEADERS: {
    'X-RateLimit-Limit': '100',
    'X-RateLimit-Remaining': '99',
    'X-RateLimit-Reset': '15 minutes',
  },
};

// API Caching
export const CACHE_CONFIG = {
  TTL: 5 * 60, // 5 minutes in seconds
  MAX_KEYS: 1000,
  CHECK_PERIOD: 60, // 1 minute
  CLEANUP_INTERVAL: 10 * 60, // 10 minutes
};

// API Logging
export const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
  TRACE: 'trace',
};

// API Security
export const SECURITY_CONFIG = {
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRES_IN: '24h',
  REFRESH_TOKEN_EXPIRES_IN: '7d',
  PASSWORD_SALT_ROUNDS: 12,
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
};

export default {
  API_RESPONSE_STATUS,
  createApiResponse,
  createApiErrorResponse,
  PAGINATION_TYPES,
  createPaginationResponse,
  API_ENDPOINTS,
  HTTP_METHODS,
  API_HEADERS,
  CONTENT_TYPES,
  API_RESPONSE_CODES,
  API_ERROR_CODES,
  API_REQUEST_CONFIG,
  createApiMetadata,
  RATE_LIMIT_CONFIG,
  CACHE_CONFIG,
  LOG_LEVELS,
  SECURITY_CONFIG,
}; 
