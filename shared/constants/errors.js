// Error constants for the application

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
};

// Error Messages
export const ERROR_MESSAGES = {
  // Authentication Errors
  AUTHENTICATION_FAILED: 'Authentication failed. Please log in again.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  ACCOUNT_NOT_VERIFIED: 'Please verify your account before logging in.',
  ACCOUNT_LOCKED: 'Your account has been locked. Please contact support.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  INSUFFICIENT_PERMISSIONS: 'You do not have permission to perform this action.',
  
  // User Errors
  USER_NOT_FOUND: 'User not found.',
  USER_ALREADY_EXISTS: 'User with this email already exists.',
  INVALID_USER_DATA: 'Invalid user data provided.',
  USER_UPDATE_FAILED: 'Failed to update user information.',
  USER_DELETE_FAILED: 'Failed to delete user.',
  USER_BANNED: 'This user account has been banned.',
  
  // Venue Errors
  VENUE_NOT_FOUND: 'Venue not found.',
  VENUE_ALREADY_EXISTS: 'A venue with this name already exists.',
  VENUE_NOT_APPROVED: 'This venue is pending approval.',
  VENUE_SUSPENDED: 'This venue has been suspended.',
  INVALID_VENUE_DATA: 'Invalid venue data provided.',
  VENUE_UPDATE_FAILED: 'Failed to update venue information.',
  VENUE_DELETE_FAILED: 'Failed to delete venue.',
  
  // Court Errors
  COURT_NOT_FOUND: 'Court not found.',
  COURT_ALREADY_EXISTS: 'A court with this name already exists in this venue.',
  INVALID_COURT_DATA: 'Invalid court data provided.',
  COURT_UPDATE_FAILED: 'Failed to update court information.',
  COURT_DELETE_FAILED: 'Failed to delete court.',
  
  // Booking Errors
  BOOKING_NOT_FOUND: 'Booking not found.',
  BOOKING_ALREADY_EXISTS: 'This time slot is already booked.',
  INVALID_BOOKING_DATA: 'Invalid booking data provided.',
  BOOKING_UPDATE_FAILED: 'Failed to update booking.',
  BOOKING_CANCELLATION_FAILED: 'Failed to cancel booking.',
  BOOKING_PAST_DATE: 'Cannot book for past dates.',
  BOOKING_OUTSIDE_HOURS: 'Booking time is outside venue operating hours.',
  INSUFFICIENT_TIME: 'Minimum booking duration is 1 hour.',
  
  // Payment Errors
  PAYMENT_FAILED: 'Payment processing failed.',
  INSUFFICIENT_FUNDS: 'Insufficient funds for this transaction.',
  PAYMENT_METHOD_INVALID: 'Invalid payment method.',
  TRANSACTION_DECLINED: 'Transaction was declined.',
  PAYMENT_TIMEOUT: 'Payment request timed out.',
  
  // File Upload Errors
  FILE_TOO_LARGE: 'File size exceeds the maximum limit.',
  INVALID_FILE_TYPE: 'Invalid file type. Please upload a supported format.',
  FILE_UPLOAD_FAILED: 'File upload failed. Please try again.',
  TOO_MANY_FILES: 'Too many files uploaded. Please reduce the number.',
  
  // Validation Errors
  VALIDATION_FAILED: 'Please check your input and try again.',
  REQUIRED_FIELD_MISSING: 'This field is required.',
  INVALID_EMAIL_FORMAT: 'Please enter a valid email address.',
  INVALID_PHONE_FORMAT: 'Please enter a valid phone number.',
  PASSWORD_TOO_WEAK: 'Password does not meet security requirements.',
  INVALID_DATE_FORMAT: 'Please enter a valid date.',
  INVALID_TIME_FORMAT: 'Please enter a valid time.',
  
  // Network Errors
  NETWORK_ERROR: 'Network error. Please check your connection.',
  REQUEST_TIMEOUT: 'Request timed out. Please try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  SERVICE_UNAVAILABLE: 'Service is temporarily unavailable.',
  
  // General Errors
  UNKNOWN_ERROR: 'An unexpected error occurred.',
  OPERATION_FAILED: 'Operation failed. Please try again.',
  DATA_NOT_FOUND: 'Requested data not found.',
  INVALID_REQUEST: 'Invalid request.',
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later.',
};

// Error Types
export const ERROR_TYPES = {
  VALIDATION: 'VALIDATION_ERROR',
  AUTHENTICATION: 'AUTHENTICATION_ERROR',
  AUTHORIZATION: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND_ERROR',
  CONFLICT: 'CONFLICT_ERROR',
  NETWORK: 'NETWORK_ERROR',
  SERVER: 'SERVER_ERROR',
  CLIENT: 'CLIENT_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR',
};

// Error Categories
export const ERROR_CATEGORIES = {
  USER_INPUT: 'USER_INPUT',
  SYSTEM: 'SYSTEM',
  EXTERNAL: 'EXTERNAL',
  BUSINESS_LOGIC: 'BUSINESS_LOGIC',
};

// Error Severity Levels
export const ERROR_SEVERITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
};

// Error Response Structure
export const createErrorResponse = (message, type = ERROR_TYPES.UNKNOWN, status = HTTP_STATUS.INTERNAL_SERVER_ERROR, details = null) => ({
  success: false,
  error: {
    message,
    type,
    status,
    timestamp: new Date().toISOString(),
    details,
  },
});

// Validation Error Response
export const createValidationErrorResponse = (errors, message = 'Validation failed') => ({
  success: false,
  error: {
    message,
    type: ERROR_TYPES.VALIDATION,
    status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
    timestamp: new Date().toISOString(),
    details: {
      validationErrors: errors,
    },
  },
});

// Authentication Error Response
export const createAuthErrorResponse = (message = ERROR_MESSAGES.AUTHENTICATION_FAILED) => ({
  success: false,
  error: {
    message,
    type: ERROR_TYPES.AUTHENTICATION,
    status: HTTP_STATUS.UNAUTHORIZED,
    timestamp: new Date().toISOString(),
  },
});

// Authorization Error Response
export const createAuthzErrorResponse = (message = ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS) => ({
  success: false,
  error: {
    message,
    type: ERROR_TYPES.AUTHORIZATION,
    status: HTTP_STATUS.FORBIDDEN,
    timestamp: new Date().toISOString(),
  },
});

// Not Found Error Response
export const createNotFoundErrorResponse = (resource = 'Resource') => ({
  success: false,
  error: {
    message: `${resource} not found.`,
    type: ERROR_TYPES.NOT_FOUND,
    status: HTTP_STATUS.NOT_FOUND,
    timestamp: new Date().toISOString(),
  },
});

// Conflict Error Response
export const createConflictErrorResponse = (message = 'Resource conflict occurred') => ({
  success: false,
  error: {
    message,
    type: ERROR_TYPES.CONFLICT,
    status: HTTP_STATUS.CONFLICT,
    timestamp: new Date().toISOString(),
  },
});

// Server Error Response
export const createServerErrorResponse = (message = ERROR_MESSAGES.SERVER_ERROR) => ({
  success: false,
  error: {
    message,
    type: ERROR_TYPES.SERVER,
    status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    timestamp: new Date().toISOString(),
  },
});

export default {
  HTTP_STATUS,
  ERROR_MESSAGES,
  ERROR_TYPES,
  ERROR_CATEGORIES,
  ERROR_SEVERITY,
  createErrorResponse,
  createValidationErrorResponse,
  createAuthErrorResponse,
  createAuthzErrorResponse,
  createNotFoundErrorResponse,
  createConflictErrorResponse,
  createServerErrorResponse,
}; 
