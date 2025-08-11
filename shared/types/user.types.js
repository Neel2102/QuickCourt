// User type definitions for the application

// User Roles
export const USER_ROLES = {
  USER: 'User',
  FACILITY_OWNER: 'FacilityOwner',
  ADMIN: 'Admin',
};

// User Status
export const USER_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  SUSPENDED: 'Suspended',
  BANNED: 'Banned',
  PENDING_VERIFICATION: 'Pending Verification',
  VERIFIED: 'Verified',
  UNVERIFIED: 'Unverified',
  DELETED: 'Deleted',
};

// User Verification Status
export const VERIFICATION_STATUS = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
  EXPIRED: 'Expired',
  RESENT: 'Resent',
};

// User Profile Visibility
export const PROFILE_VISIBILITY = {
  PUBLIC: 'Public',
  PRIVATE: 'Private',
  FRIENDS_ONLY: 'Friends Only',
  REGISTERED_USERS: 'Registered Users',
};

// User Preferences
export const USER_PREFERENCES = {
  NOTIFICATIONS: {
    EMAIL: 'email',
    SMS: 'sms',
    PUSH: 'push',
    IN_APP: 'in_app',
  },
  LANGUAGE: {
    ENGLISH: 'en',
    HINDI: 'hi',
    GUJARATI: 'gu',
  },
  THEME: {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system',
  },
  TIMEZONE: {
    IST: 'Asia/Kolkata',
    UTC: 'UTC',
  },
};

// Create User Request
export const createUserRequest = (name, email, password, role = USER_ROLES.USER, profilePic = '', bio = '') => ({
  name,
  email,
  password,
  role,
  profilePic,
  bio,
  phone: '',
  dateOfBirth: '',
  gender: '',
  address: {
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  },
  preferences: {
    notifications: [USER_PREFERENCES.NOTIFICATIONS.EMAIL, USER_PREFERENCES.NOTIFICATIONS.IN_APP],
    language: USER_PREFERENCES.LANGUAGE.ENGLISH,
    theme: USER_PREFERENCES.THEME.SYSTEM,
    timezone: USER_PREFERENCES.TIMEZONE.IST,
  },
  timestamp: new Date().toISOString(),
  termsAccepted: true,
  privacyAccepted: true,
  marketingConsent: false,
});

// Create User Response
export const createUserResponse = (user, verificationToken) => ({
  success: true,
  message: 'User created successfully',
  data: {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.isAdmin ? USER_ROLES.ADMIN : user.isFacilityOwner ? USER_ROLES.FACILITY_OWNER : USER_ROLES.USER,
      isVerified: user.isAccountVerified || false,
      createdAt: user.createdAt,
    },
    verification: {
      token: verificationToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      resent: false,
    },
    nextSteps: [
      'Check your email to verify your account',
      'Complete your profile with additional information',
      'Set your notification preferences',
    ],
  },
  timestamp: new Date().toISOString(),
});

// Update User Request
export const createUpdateUserRequest = (userId, updates) => ({
  userId,
  updates,
  reason: '',
  timestamp: new Date().toISOString(),
  updatedBy: null, // Will be set by server
});

// Update User Response
export const createUpdateUserResponse = (user, changes) => ({
  success: true,
  message: 'User updated successfully',
  data: {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      updatedAt: user.updatedAt,
    },
    changes,
    updatedFields: Object.keys(changes),
  },
  timestamp: new Date().toISOString(),
});

// User Profile Response
export const createUserProfileResponse = (user, stats = {}) => ({
  success: true,
  data: {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic || '',
      bio: user.bio || '',
      phone: user.phone || '',
      dateOfBirth: user.dateOfBirth || '',
      gender: user.gender || '',
      address: user.address || {},
      role: user.isAdmin ? USER_ROLES.ADMIN : user.isFacilityOwner ? USER_ROLES.FACILITY_OWNER : USER_ROLES.USER,
      status: getUserStatus(user),
      isVerified: user.isAccountVerified || false,
      isBanned: user.isBanned || false,
      preferences: user.preferences || {},
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLogin: user.lastLogin || null,
    },
    statistics: {
      totalBookings: stats.totalBookings || 0,
      completedBookings: stats.completedBookings || 0,
      cancelledBookings: stats.cancelledBookings || 0,
      totalSpent: stats.totalSpent || 0,
      averageRating: stats.averageRating || 0,
      totalReviews: stats.totalReviews || 0,
      memberSince: calculateMemberSince(user.createdAt),
    },
    preferences: {
      notifications: user.preferences?.notifications || [USER_PREFERENCES.NOTIFICATIONS.EMAIL],
      language: user.preferences?.language || USER_PREFERENCES.LANGUAGE.ENGLISH,
      theme: user.preferences?.theme || USER_PREFERENCES.THEME.SYSTEM,
      timezone: user.preferences?.timezone || USER_PREFERENCES.TIMEZONE.IST,
    },
  },
  timestamp: new Date().toISOString(),
});

// User List Response
export const createUserListResponse = (users, pagination, filters) => ({
  success: true,
  data: {
    users: users.map(user => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.isAdmin ? USER_ROLES.ADMIN : user.isFacilityOwner ? USER_ROLES.FACILITY_OWNER : USER_ROLES.USER,
      status: getUserStatus(user),
      isVerified: user.isAccountVerified || false,
      isBanned: user.isBanned || false,
      profilePic: user.profilePic || '',
      createdAt: user.createdAt,
      lastLogin: user.lastLogin || null,
    })),
    pagination,
    filters,
    summary: {
      total: pagination.total,
      active: users.filter(u => getUserStatus(u) === USER_STATUS.ACTIVE).length,
      suspended: users.filter(u => getUserStatus(u) === USER_STATUS.SUSPENDED).length,
      banned: users.filter(u => getUserStatus(u) === USER_STATUS.BANNED).length,
      verified: users.filter(u => u.isAccountVerified).length,
      unverified: users.filter(u => !u.isAccountVerified).length,
    },
  },
  timestamp: new Date().toISOString(),
});

// User Authentication Response
export const createUserAuthResponse = (user, accessToken, refreshToken, expiresIn) => ({
  success: true,
  message: 'Authentication successful',
  data: {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.isAdmin ? USER_ROLES.ADMIN : user.isFacilityOwner ? USER_ROLES.FACILITY_OWNER : USER_ROLES.USER,
      profilePic: user.profilePic || '',
      isVerified: user.isAccountVerified || false,
      isBanned: user.isBanned || false,
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

// User Verification Response
export const createUserVerificationResponse = (user, verificationStatus) => ({
  success: true,
  message: 'Email verification successful',
  data: {
    user: {
      _id: user._id,
      email: user.email,
      isVerified: true,
      verifiedAt: new Date().toISOString(),
    },
    verification: {
      status: verificationStatus,
      completedAt: new Date().toISOString(),
    },
  },
  timestamp: new Date().toISOString(),
});

// User Ban Response
export const createUserBanResponse = (user, banReason, banDuration) => ({
  success: true,
  message: 'User banned successfully',
  data: {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      status: USER_STATUS.BANNED,
      bannedAt: new Date().toISOString(),
    },
    ban: {
      reason: banReason,
      duration: banDuration,
      expiresAt: banDuration ? new Date(Date.now() + banDuration * 1000).toISOString() : null,
      isPermanent: !banDuration,
    },
    notifications: [
      'User account has been banned',
      'All active bookings will be cancelled',
      'User will not be able to access the system',
    ],
  },
  timestamp: new Date().toISOString(),
});

// User Unban Response
export const createUserUnbanResponse = (user) => ({
  success: true,
  message: 'User unbanned successfully',
  data: {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      status: USER_STATUS.ACTIVE,
      unbannedAt: new Date().toISOString(),
    },
    notifications: [
      'User account has been restored',
      'User can now access the system',
      'Previous restrictions have been removed',
    ],
  },
  timestamp: new Date().toISOString(),
});

// User Statistics Response
export const createUserStatisticsResponse = (userId, stats, period) => ({
  success: true,
  data: {
    userId,
    period,
    bookings: {
      total: stats.totalBookings || 0,
      confirmed: stats.confirmedBookings || 0,
      completed: stats.completedBookings || 0,
      cancelled: stats.cancelledBookings || 0,
      noShow: stats.noShowBookings || 0,
      upcoming: stats.upcomingBookings || 0,
    },
    financial: {
      totalSpent: stats.totalSpent || 0,
      averageSpending: stats.averageSpending || 0,
      refunds: stats.totalRefunds || 0,
      pendingPayments: stats.pendingPayments || 0,
    },
    activity: {
      lastLogin: stats.lastLogin || null,
      loginCount: stats.loginCount || 0,
      sessionDuration: stats.averageSessionDuration || 0,
      pagesVisited: stats.pagesVisited || 0,
    },
    engagement: {
      reviews: stats.totalReviews || 0,
      averageRating: stats.averageRating || 0,
      reports: stats.totalReports || 0,
      feedback: stats.totalFeedback || 0,
    },
    preferences: {
      favoriteSports: stats.favoriteSports || [],
      preferredVenues: stats.preferredVenues || [],
      bookingTimes: stats.preferredBookingTimes || [],
      notificationUsage: stats.notificationUsage || {},
    },
  },
  timestamp: new Date().toISOString(),
});

// User Search Response
export const createUserSearchResponse = (users, query, filters) => ({
  success: true,
  data: {
    users: users.map(user => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.isAdmin ? USER_ROLES.ADMIN : user.isFacilityOwner ? USER_ROLES.FACILITY_OWNER : USER_ROLES.USER,
      status: getUserStatus(user),
      profilePic: user.profilePic || '',
      isVerified: user.isAccountVerified || false,
    })),
    search: {
      query,
      filters,
      totalResults: users.length,
      searchTime: Date.now(),
    },
  },
  timestamp: new Date().toISOString(),
});

// Helper Functions
export const generateSessionId = () => {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

export const getUserStatus = (user) => {
  if (user.isBanned) return USER_STATUS.BANNED;
  if (user.status) return user.status;
  if (user.isAccountVerified) return USER_STATUS.VERIFIED;
  return USER_STATUS.PENDING_VERIFICATION;
};

export const calculateMemberSince = (createdAt) => {
  const created = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now - created);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 30) {
    return `${diffDays} days`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months !== 1 ? 's' : ''}`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} year${years !== 1 ? 's' : ''}`;
  }
};

export const validateUserRequest = (request) => {
  const errors = [];
  
  if (!request.name) errors.push('Name is required');
  if (!request.email) errors.push('Email is required');
  if (!request.password) errors.push('Password is required');
  
  if (request.name && request.name.length < 2) {
    errors.push('Name must be at least 2 characters long');
  }
  
  if (request.name && request.name.length > 50) {
    errors.push('Name must be less than 50 characters long');
  }
  
  if (request.email && !isValidEmail(request.email)) {
    errors.push('Please enter a valid email address');
  }
  
  if (request.password && request.password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (request.phone && !isValidPhone(request.phone)) {
    errors.push('Please enter a valid phone number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
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
  
  // Sanitize phone number
  if (sanitized.phone) {
    const cleaned = sanitized.phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      sanitized.phone = `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
  }
  
  return sanitized;
};

export const getUserRoleDisplayName = (role) => {
  const roleNames = {
    [USER_ROLES.USER]: 'Sports Enthusiast',
    [USER_ROLES.FACILITY_OWNER]: 'Facility Owner',
    [USER_ROLES.ADMIN]: 'Administrator',
  };
  
  return roleNames[role] || role;
};

export const getUserRoleIcon = (role) => {
  const roleIcons = {
    [USER_ROLES.USER]: '👤',
    [USER_ROLES.FACILITY_OWNER]: '🏟️',
    [USER_ROLES.ADMIN]: '⚙️',
  };
  
  return roleIcons[role] || '👤';
};

export const getUserRoleColor = (role) => {
  const roleColors = {
    [USER_ROLES.USER]: '#3B82F6', // Blue
    [USER_ROLES.FACILITY_OWNER]: '#10B981', // Green
    [USER_ROLES.ADMIN]: '#EF4444', // Red
  };
  
  return roleColors[role] || '#6B7280';
};

export default {
  USER_ROLES,
  USER_STATUS,
  VERIFICATION_STATUS,
  PROFILE_VISIBILITY,
  USER_PREFERENCES,
  createUserRequest,
  createUserResponse,
  createUpdateUserRequest,
  createUpdateUserResponse,
  createUserProfileResponse,
  createUserListResponse,
  createUserAuthResponse,
  createUserVerificationResponse,
  createUserBanResponse,
  createUserUnbanResponse,
  createUserStatisticsResponse,
  createUserSearchResponse,
  generateSessionId,
  getUserStatus,
  calculateMemberSince,
  validateUserRequest,
  isValidEmail,
  isValidPhone,
  sanitizeUserData,
  getUserRoleDisplayName,
  getUserRoleIcon,
  getUserRoleColor,
}; 
