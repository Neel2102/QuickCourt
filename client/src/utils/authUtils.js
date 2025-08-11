// Authentication utility functions

/**
 * Get the appropriate dashboard route based on user role
 * @param {string} role - User role (User, FacilityOwner, Admin)
 * @returns {string} Dashboard route path
 */
export const getDashboardRoute = (role) => {
  switch (role) {
    case 'User':
      return '/user-dashboard';
    case 'FacilityOwner':
      return '/facility-dashboard';
    case 'Admin':
      return '/admin-dashboard';
    default:
      return '/user-dashboard';
  }
};

/**
 * Check if a route should redirect authenticated users
 * @param {string} pathname - Current route pathname
 * @returns {boolean} True if route should redirect authenticated users
 */
export const shouldRedirectAuthenticated = (pathname) => {
  const authRoutes = ['/', '/login', '/register', '/reset-password'];
  return authRoutes.includes(pathname);
};

/**
 * Get user-friendly role name
 * @param {string} role - User role
 * @returns {string} Formatted role name
 */
export const getRoleDisplayName = (role) => {
  switch (role) {
    case 'User':
      return 'User';
    case 'FacilityOwner':
      return 'Facility Owner';
    case 'Admin':
      return 'Administrator';
    default:
      return 'User';
  }
};

/**
 * Check if user has permission to access a route
 * @param {string} userRole - User's role
 * @param {string} requiredRole - Required role for the route
 * @param {Array} allowedRoles - Array of allowed roles for the route
 * @returns {boolean} True if user has permission
 */
export const hasRoutePermission = (userRole, requiredRole = null, allowedRoles = null) => {
  if (requiredRole && userRole !== requiredRole) {
    return false;
  }
  
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return false;
  }
  
  return true;
};

/**
 * Get default redirect path after login based on intended destination
 * @param {string} from - Intended destination path
 * @param {string} userRole - User's role
 * @returns {string} Redirect path
 */
export const getLoginRedirectPath = (from, userRole) => {
  // If coming from a protected route that's not auth-related, go there
  if (from && !shouldRedirectAuthenticated(from)) {
    return from;
  }
  
  // Otherwise, go to appropriate dashboard
  return getDashboardRoute(userRole);
};
