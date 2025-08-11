// Authentication type definitions for the application

// User Roles
export const USER_ROLES = {
  USER: 'User',
  FACILITY_OWNER: 'FacilityOwner',
  ADMIN: 'Admin',
};

// Authentication Status
export const AUTH_STATUS = {
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',
  PENDING: 'pending',
  EXPIRED: 'expired',
  LOCKED: 'locked',
  SUSPENDED: 'suspended',
};

// Token Types
export const TOKEN_TYPES = {
  ACCESS: 'access',
  REFRESH: 'refresh',
  VERIFICATION: 'verification',
  RESET_PASSWORD: 'reset_password',
  INVITE: 'invite',
};

// Token Status
export const TOKEN_STATUS = {
  VALID: 'valid',
  EXPIRED: 'expired',
  REVOKED: 'revoked',
  BLACKLISTED: 'blacklisted',
  INVALID: 'invalid',
};

// Login Request
export const createLoginRequest = (email, password, rememberMe = false) => ({
  email,
  password,
  rememberMe,
  timestamp: new Date().toISOString(),
  deviceInfo: {
    userAgent: navigator?.userAgent || 'Unknown',
    platform: navigator?.platform || 'Unknown',
    language: navigator?.language || 'en',
  },
});

// Login Response
export const createLoginResponse = (user, accessToken, refreshToken, expiresIn) => ({
  success: true,
  message: 'Login successful',
  data: {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.isAdmin ? USER_ROLES.ADMIN : user.isFacilityOwner ? USER_ROLES.FACILITY_OWNER : USER_ROLES.USER,
      profilePic: user.profilePic || '',
      bio: user.bio || '',
      isVerified: user.isAccountVerified || false,
      isBanned: user.isBanned || false,
      createdAt: user.createdAt,
      lastLogin: new Date().toISOString(),
    },
    tokens: {
      accessToken,
      refreshToken,
      expiresIn,
      tokenType: 'Bearer',
    },
    session: {
      id: generateSessionId(),
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
    },
  },
  timestamp: new Date().toISOString(),
});

// Registration Request
export const createRegistrationRequest = (name, email, password, role = USER_ROLES.USER, profilePic = '') => ({
  name,
  email,
  password,
  role,
  profilePic,
  timestamp: new Date().toISOString(),
  termsAccepted: true,
  privacyAccepted: true,
  marketingConsent: false,
});

// Registration Response
export const createRegistrationResponse = (user, verificationToken) => ({
  success: true,
  message: 'Registration successful. Please check your email to verify your account.',
  data: {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.isAdmin ? USER_ROLES.ADMIN : user.isFacilityOwner ? USER_ROLES.FACILITY_OWNER : USER_ROLES.USER,
      isVerified: false,
      createdAt: user.createdAt,
    },
    verification: {
      token: verificationToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      resent: false,
    },
  },
  timestamp: new Date().toISOString(),
});

// Password Reset Request
export const createPasswordResetRequest = (email) => ({
  email,
  timestamp: new Date().toISOString(),
  ipAddress: '127.0.0.1', // Will be set by server
  userAgent: navigator?.userAgent || 'Unknown',
});

// Password Reset Response
export const createPasswordResetResponse = (resetToken, expiresAt) => ({
  success: true,
  message: 'Password reset email sent successfully.',
  data: {
    resetToken,
    expiresAt,
    resent: false,
  },
  timestamp: new Date().toISOString(),
});

// Password Change Request
export const createPasswordChangeRequest = (currentPassword, newPassword, confirmPassword) => ({
  currentPassword,
  newPassword,
  confirmPassword,
  timestamp: new Date().toISOString(),
});

// Password Change Response
export const createPasswordChangeResponse = (message = 'Password changed successfully') => ({
  success: true,
  message,
  data: {
    changedAt: new Date().toISOString(),
    requiresReauth: true,
  },
  timestamp: new Date().toISOString(),
});

// Email Verification Request
export const createEmailVerificationRequest = (token) => ({
  token,
  timestamp: new Date().toISOString(),
});

// Email Verification Response
export const createEmailVerificationResponse = (user) => ({
  success: true,
  message: 'Email verified successfully.',
  data: {
    user: {
      _id: user._id,
      email: user.email,
      isVerified: true,
      verifiedAt: new Date().toISOString(),
    },
  },
  timestamp: new Date().toISOString(),
});

// Logout Request
export const createLogoutRequest = (refreshToken) => ({
  refreshToken,
  timestamp: new Date().toISOString(),
  reason: 'user_logout',
});

// Logout Response
export const createLogoutResponse = (message = 'Logged out successfully') => ({
  success: true,
  message,
  data: {
    loggedOutAt: new Date().toISOString(),
    sessionEnded: true,
  },
  timestamp: new Date().toISOString(),
});

// Token Refresh Request
export const createTokenRefreshRequest = (refreshToken) => ({
  refreshToken,
  timestamp: new Date().toISOString(),
});

// Token Refresh Response
export const createTokenRefreshResponse = (accessToken, refreshToken, expiresIn) => ({
  success: true,
  message: 'Token refreshed successfully',
  data: {
    tokens: {
      accessToken,
      refreshToken,
      expiresIn,
      tokenType: 'Bearer',
    },
    refreshedAt: new Date().toISOString(),
  },
  timestamp: new Date().toISOString(),
});

// Authentication Error Response
export const createAuthErrorResponse = (message, errorCode, statusCode = 401) => ({
  success: false,
  message,
  error: {
    code: errorCode,
    statusCode,
    timestamp: new Date().toISOString(),
  },
});

// User Session
export const createUserSession = (user, sessionId, expiresAt) => ({
  id: sessionId,
  userId: user._id,
  userEmail: user.email,
  userRole: user.isAdmin ? USER_ROLES.ADMIN : user.isFacilityOwner ? USER_ROLES.FACILITY_OWNER : USER_ROLES.USER,
  createdAt: new Date().toISOString(),
  expiresAt,
  lastActivity: new Date().toISOString(),
  isActive: true,
  deviceInfo: {
    userAgent: navigator?.userAgent || 'Unknown',
    platform: navigator?.platform || 'Unknown',
    ipAddress: '127.0.0.1', // Will be set by server
  },
});

// Authentication State
export const createAuthState = (user = null, token = null, isAuthenticated = false) => ({
  user,
  token,
  isAuthenticated,
  isLoading: false,
  error: null,
  lastUpdated: new Date().toISOString(),
});

// Permission Check
export const createPermissionCheck = (userRole, requiredRole, resource, action) => ({
  userRole,
  requiredRole,
  resource,
  action,
  hasPermission: checkPermission(userRole, requiredRole),
  timestamp: new Date().toISOString(),
});

// Security Headers
export const AUTH_HEADERS = {
  AUTHORIZATION: 'Authorization',
  X_AUTH_TOKEN: 'X-Auth-Token',
  X_REFRESH_TOKEN: 'X-Refresh-Token',
  X_CLIENT_ID: 'X-Client-ID',
  X_CLIENT_VERSION: 'X-Client-Version',
  X_PLATFORM: 'X-Platform',
  X_DEVICE_ID: 'X-Device-ID',
};

// Authentication Configuration
export const AUTH_CONFIG = {
  // Token Configuration
  ACCESS_TOKEN_EXPIRY: 15 * 60, // 15 minutes in seconds
  REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60, // 7 days in seconds
  VERIFICATION_TOKEN_EXPIRY: 24 * 60 * 60, // 24 hours in seconds
  RESET_TOKEN_EXPIRY: 1 * 60 * 60, // 1 hour in seconds
  
  // Session Configuration
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes in milliseconds
  MAX_SESSIONS_PER_USER: 5,
  SESSION_CLEANUP_INTERVAL: 10 * 60 * 1000, // 10 minutes in milliseconds
  
  // Security Configuration
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIRE_UPPERCASE: true,
  PASSWORD_REQUIRE_LOWERCASE: true,
  PASSWORD_REQUIRE_NUMBERS: true,
  PASSWORD_REQUIRE_SPECIAL_CHARS: false,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes in milliseconds
  
  // Rate Limiting
  LOGIN_RATE_LIMIT: 5, // 5 attempts per 15 minutes
  REGISTRATION_RATE_LIMIT: 3, // 3 attempts per hour
  PASSWORD_RESET_RATE_LIMIT: 3, // 3 attempts per hour
  VERIFICATION_RATE_LIMIT: 5, // 5 attempts per hour
  
  // Validation
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  
  // OAuth Configuration
  OAUTH_PROVIDERS: {
    GOOGLE: 'google',
    FACEBOOK: 'facebook',
    GITHUB: 'github',
    LINKEDIN: 'linkedin',
  },
  
  // Multi-Factor Authentication
  MFA_ENABLED: false,
  MFA_METHODS: {
    SMS: 'sms',
    EMAIL: 'email',
    AUTHENTICATOR: 'authenticator',
    HARDWARE_KEY: 'hardware_key',
  },
};

// Helper Functions
export const generateSessionId = () => {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

export const checkPermission = (userRole, requiredRole) => {
  const roleHierarchy = {
    [USER_ROLES.USER]: 1,
    [USER_ROLES.FACILITY_OWNER]: 2,
    [USER_ROLES.ADMIN]: 3,
  };
  
  const userLevel = roleHierarchy[userRole] || 0;
  const requiredLevel = roleHierarchy[requiredRole] || 0;
  
  return userLevel >= requiredLevel;
};

export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < AUTH_CONFIG.PASSWORD_MIN_LENGTH) {
    errors.push(`Password must be at least ${AUTH_CONFIG.PASSWORD_MIN_LENGTH} characters long`);
  }
  
  if (AUTH_CONFIG.PASSWORD_REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (AUTH_CONFIG.PASSWORD_REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (AUTH_CONFIG.PASSWORD_REQUIRE_NUMBERS && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (AUTH_CONFIG.PASSWORD_REQUIRE_SPECIAL_CHARS && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateEmail = (email) => {
  return AUTH_CONFIG.EMAIL_REGEX.test(email);
};

export const validateName = (name) => {
  if (!name || name.length < AUTH_CONFIG.NAME_MIN_LENGTH || name.length > AUTH_CONFIG.NAME_MAX_LENGTH) {
    return false;
  }
  
  // Only allow letters, spaces, and common punctuation
  const nameRegex = /^[a-zA-Z\s\-'\.]+$/;
  return nameRegex.test(name);
};

export const sanitizeUserData = (userData) => {
  const sanitized = { ...userData };
  
  // Remove sensitive fields
  delete sanitized.password;
  delete sanitized.verifyOtp;
  delete sanitized.verifyOtpexpireAt;
  delete sanitized.resetOtp;
  delete sanitized.resetOtpExpireAt;
  
  // Sanitize email (mask part of it)
  if (sanitized.email) {
    const [localPart, domain] = sanitized.email.split('@');
    const maskedLocal = localPart.charAt(0) + '*'.repeat(localPart.length - 2) + localPart.charAt(localPart.length - 1);
    sanitized.email = `${maskedLocal}@${domain}`;
  }
  
  return sanitized;
};

export default {
  USER_ROLES,
  AUTH_STATUS,
  TOKEN_TYPES,
  TOKEN_STATUS,
  createLoginRequest,
  createLoginResponse,
  createRegistrationRequest,
  createRegistrationResponse,
  createPasswordResetRequest,
  createPasswordResetResponse,
  createPasswordChangeRequest,
  createPasswordChangeResponse,
  createEmailVerificationRequest,
  createEmailVerificationResponse,
  createLogoutRequest,
  createLogoutResponse,
  createTokenRefreshRequest,
  createTokenRefreshResponse,
  createAuthErrorResponse,
  createUserSession,
  createAuthState,
  createPermissionCheck,
  AUTH_HEADERS,
  AUTH_CONFIG,
  generateSessionId,
  checkPermission,
  validatePassword,
  validateEmail,
  validateName,
  sanitizeUserData,
}; 
