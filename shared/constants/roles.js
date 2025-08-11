// Role constants for the application

// User Roles
export const USER_ROLES = {
  USER: 'User',
  FACILITY_OWNER: 'FacilityOwner',
  ADMIN: 'Admin',
};

// Role Hierarchy (for permission checking)
export const ROLE_HIERARCHY = {
  [USER_ROLES.USER]: 1,
  [USER_ROLES.FACILITY_OWNER]: 2,
  [USER_ROLES.ADMIN]: 3,
};

// Role Descriptions
export const ROLE_DESCRIPTIONS = {
  [USER_ROLES.USER]: 'Regular user who can book courts and manage their profile',
  [USER_ROLES.FACILITY_OWNER]: 'Owner of sports facilities who can manage venues and courts',
  [USER_ROLES.ADMIN]: 'System administrator with full access to all features',
};

// Role Permissions
export const ROLE_PERMISSIONS = {
  [USER_ROLES.USER]: {
    // Profile Management
    VIEW_OWN_PROFILE: true,
    EDIT_OWN_PROFILE: true,
    DELETE_OWN_PROFILE: false,
    
    // Venue Access
    VIEW_VENUES: true,
    VIEW_VENUE_DETAILS: true,
    SEARCH_VENUES: true,
    FILTER_VENUES: true,
    
    // Booking Management
    CREATE_BOOKING: true,
    VIEW_OWN_BOOKINGS: true,
    EDIT_OWN_BOOKINGS: false,
    CANCEL_OWN_BOOKINGS: true,
    
    // Reviews
    CREATE_REVIEW: true,
    EDIT_OWN_REVIEW: true,
    DELETE_OWN_REVIEW: true,
    
    // Reports
    CREATE_REPORT: true,
    VIEW_OWN_REPORTS: true,
    
    // Notifications
    RECEIVE_NOTIFICATIONS: true,
    MANAGE_NOTIFICATION_PREFERENCES: true,
  },
  
  [USER_ROLES.FACILITY_OWNER]: {
    // Inherit all user permissions
    ...USER_ROLES.USER,
    
    // Venue Management
    CREATE_VENUE: true,
    EDIT_OWN_VENUES: true,
    DELETE_OWN_VENUES: true,
    MANAGE_VENUE_PHOTOS: true,
    MANAGE_VENUE_AMENITIES: true,
    
    // Court Management
    CREATE_COURT: true,
    EDIT_OWN_COURTS: true,
    DELETE_OWN_COURTS: true,
    MANAGE_COURT_PRICING: true,
    MANAGE_COURT_SCHEDULE: true,
    
    // Time Slot Management
    MANAGE_TIME_SLOTS: true,
    BLOCK_TIME_SLOTS: true,
    SET_AVAILABILITY: true,
    
    // Booking Management
    VIEW_VENUE_BOOKINGS: true,
    MANAGE_BOOKING_STATUS: true,
    CANCEL_ANY_BOOKING: true,
    
    // Analytics
    VIEW_VENUE_ANALYTICS: true,
    VIEW_BOOKING_REPORTS: true,
    VIEW_REVENUE_REPORTS: true,
    
    // Staff Management
    MANAGE_STAFF: false, // Future feature
    ASSIGN_ROLES: false, // Future feature
  },
  
  [USER_ROLES.ADMIN]: {
    // Inherit all permissions
    ...USER_ROLES.USER,
    ...USER_ROLES.FACILITY_OWNER,
    
    // User Management
    VIEW_ALL_USERS: true,
    EDIT_ANY_USER: true,
    DELETE_ANY_USER: true,
    BAN_USER: true,
    UNBAN_USER: true,
    CHANGE_USER_ROLE: true,
    
    // Venue Management
    VIEW_ALL_VENUES: true,
    EDIT_ANY_VENUE: true,
    DELETE_ANY_VENUE: true,
    APPROVE_VENUE: true,
    REJECT_VENUE: true,
    SUSPEND_VENUE: true,
    
    // System Management
    VIEW_SYSTEM_ANALYTICS: true,
    VIEW_SYSTEM_REPORTS: true,
    MANAGE_SYSTEM_SETTINGS: true,
    VIEW_SYSTEM_LOGS: true,
    
    // Content Moderation
    MODERATE_REVIEWS: true,
    MODERATE_REPORTS: true,
    TAKE_MODERATION_ACTION: true,
    
    // Financial Management
    VIEW_FINANCIAL_REPORTS: true,
    MANAGE_PAYMENT_SETTINGS: true,
    VIEW_TRANSACTION_HISTORY: true,
    
    // Support
    ACCESS_SUPPORT_TOOLS: true,
    MANAGE_SUPPORT_TICKETS: true,
    PROVIDE_SUPPORT: true,
  },
};

// Permission Categories
export const PERMISSION_CATEGORIES = {
  PROFILE: 'Profile Management',
  VENUE: 'Venue Management',
  COURT: 'Court Management',
  BOOKING: 'Booking Management',
  REVIEW: 'Review Management',
  REPORT: 'Report Management',
  ANALYTICS: 'Analytics & Reports',
  SYSTEM: 'System Administration',
  MODERATION: 'Content Moderation',
  FINANCIAL: 'Financial Management',
  SUPPORT: 'Support & Help',
};

// Check if user has permission
export const hasPermission = (userRole, permission) => {
  if (!userRole || !permission) return false;
  
  const permissions = ROLE_PERMISSIONS[userRole];
  if (!permissions) return false;
  
  return permissions[permission] === true;
};

// Check if user has role or higher
export const hasRoleOrHigher = (userRole, requiredRole) => {
  if (!userRole || !requiredRole) return false;
  
  const userLevel = ROLE_HIERARCHY[userRole];
  const requiredLevel = ROLE_HIERARCHY[requiredRole];
  
  if (userLevel === undefined || requiredLevel === undefined) return false;
  
  return userLevel >= requiredLevel;
};

// Get all permissions for a role
export const getRolePermissions = (role) => {
  return ROLE_PERMISSIONS[role] || {};
};

// Get all users who can perform an action
export const getRolesWithPermission = (permission) => {
  const roles = [];
  
  for (const [role, permissions] of Object.entries(ROLE_PERMISSIONS)) {
    if (permissions[permission]) {
      roles.push(role);
    }
  }
  
  return roles;
};

// Role-based route access
export const ROUTE_ACCESS = {
  // Public routes (no authentication required)
  PUBLIC: [],
  
  // User routes (authenticated users)
  USER: [USER_ROLES.USER, USER_ROLES.FACILITY_OWNER, USER_ROLES.ADMIN],
  
  // Facility owner routes
  FACILITY_OWNER: [USER_ROLES.FACILITY_OWNER, USER_ROLES.ADMIN],
  
  // Admin routes
  ADMIN: [USER_ROLES.ADMIN],
};

// Check if user can access route
export const canAccessRoute = (userRole, routeAccess) => {
  if (!userRole || !routeAccess) return false;
  
  if (routeAccess === 'PUBLIC') return true;
  
  const allowedRoles = ROUTE_ACCESS[routeAccess];
  if (!allowedRoles) return false;
  
  return allowedRoles.includes(userRole);
};

// Role display names
export const ROLE_DISPLAY_NAMES = {
  [USER_ROLES.USER]: 'Sports Enthusiast',
  [USER_ROLES.FACILITY_OWNER]: 'Facility Owner',
  [USER_ROLES.ADMIN]: 'Administrator',
};

// Role icons (for UI display)
export const ROLE_ICONS = {
  [USER_ROLES.USER]: '👤',
  [USER_ROLES.FACILITY_OWNER]: '🏟️',
  [USER_ROLES.ADMIN]: '⚙️',
};

// Role colors (for UI display)
export const ROLE_COLORS = {
  [USER_ROLES.USER]: '#3B82F6', // Blue
  [USER_ROLES.FACILITY_OWNER]: '#10B981', // Green
  [USER_ROLES.ADMIN]: '#EF4444', // Red
};

export default {
  USER_ROLES,
  ROLE_HIERARCHY,
  ROLE_DESCRIPTIONS,
  ROLE_PERMISSIONS,
  PERMISSION_CATEGORIES,
  ROUTE_ACCESS,
  ROLE_DISPLAY_NAMES,
  ROLE_ICONS,
  ROLE_COLORS,
  hasPermission,
  hasRoleOrHigher,
  getRolePermissions,
  getRolesWithPermission,
  canAccessRoute,
}; 
