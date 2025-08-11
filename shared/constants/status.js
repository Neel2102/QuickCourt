// Status constants for the application

// Booking Status
export const BOOKING_STATUS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',
  NO_SHOW: 'No Show',
  REFUNDED: 'Refunded',
  EXPIRED: 'Expired',
};

// Venue Status
export const VENUE_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  SUSPENDED: 'Suspended',
  MAINTENANCE: 'Maintenance',
  CLOSED: 'Closed',
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
};

// Court Status
export const COURT_STATUS = {
  AVAILABLE: 'Available',
  BOOKED: 'Booked',
  MAINTENANCE: 'Maintenance',
  RESERVED: 'Reserved',
  UNAVAILABLE: 'Unavailable',
  CLOSED: 'Closed',
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
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
  CANCELLED: 'Cancelled',
  REFUNDED: 'Refunded',
  PARTIALLY_REFUNDED: 'Partially Refunded',
  EXPIRED: 'Expired',
};

// Review Status
export const REVIEW_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  HIDDEN: 'Hidden',
  FLAGGED: 'Flagged',
  MODERATED: 'Moderated',
};

// Report Status
export const REPORT_STATUS = {
  PENDING: 'Pending',
  REVIEWED: 'Reviewed',
  RESOLVED: 'Resolved',
  REJECTED: 'Rejected',
  ESCALATED: 'Escalated',
  CLOSED: 'Closed',
};

// Notification Status
export const NOTIFICATION_STATUS = {
  UNREAD: 'Unread',
  READ: 'Read',
  ARCHIVED: 'Archived',
  DELETED: 'Deleted',
};

// Email Status
export const EMAIL_STATUS = {
  PENDING: 'Pending',
  SENT: 'Sent',
  DELIVERED: 'Delivered',
  FAILED: 'Failed',
  BOUNCED: 'Bounced',
  OPENED: 'Opened',
  CLICKED: 'Clicked',
};

// Verification Status
export const VERIFICATION_STATUS = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
  EXPIRED: 'Expired',
  RESENT: 'Resent',
};

// Maintenance Status
export const MAINTENANCE_STATUS = {
  SCHEDULED: 'Scheduled',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  OVERDUE: 'Overdue',
};

// Status Colors (for UI display)
export const STATUS_COLORS = {
  // Booking Status Colors
  [BOOKING_STATUS.PENDING]: '#F59E0B', // Amber
  [BOOKING_STATUS.CONFIRMED]: '#10B981', // Green
  [BOOKING_STATUS.CANCELLED]: '#EF4444', // Red
  [BOOKING_STATUS.COMPLETED]: '#3B82F6', // Blue
  [BOOKING_STATUS.NO_SHOW]: '#6B7280', // Gray
  [BOOKING_STATUS.REFUNDED]: '#8B5CF6', // Purple
  [BOOKING_STATUS.EXPIRED]: '#9CA3AF', // Light Gray
  
  // Venue Status Colors
  [VENUE_STATUS.PENDING]: '#F59E0B', // Amber
  [VENUE_STATUS.APPROVED]: '#10B981', // Green
  [VENUE_STATUS.REJECTED]: '#EF4444', // Red
  [VENUE_STATUS.SUSPENDED]: '#F97316', // Orange
  [VENUE_STATUS.MAINTENANCE]: '#8B5CF6', // Purple
  [VENUE_STATUS.CLOSED]: '#6B7280', // Gray
  [VENUE_STATUS.ACTIVE]: '#10B981', // Green
  [VENUE_STATUS.INACTIVE]: '#9CA3AF', // Light Gray
  
  // Court Status Colors
  [COURT_STATUS.AVAILABLE]: '#10B981', // Green
  [COURT_STATUS.BOOKED]: '#EF4444', // Red
  [COURT_STATUS.MAINTENANCE]: '#F59E0B', // Amber
  [COURT_STATUS.RESERVED]: '#8B5CF6', // Purple
  [COURT_STATUS.UNAVAILABLE]: '#6B7280', // Gray
  [COURT_STATUS.CLOSED]: '#9CA3AF', // Light Gray
  
  // User Status Colors
  [USER_STATUS.ACTIVE]: '#10B981', // Green
  [USER_STATUS.INACTIVE]: '#9CA3AF', // Light Gray
  [USER_STATUS.SUSPENDED]: '#F59E0B', // Amber
  [USER_STATUS.BANNED]: '#EF4444', // Red
  [USER_STATUS.PENDING_VERIFICATION]: '#F59E0B', // Amber
  [USER_STATUS.VERIFIED]: '#10B981', // Green
  [USER_STATUS.UNVERIFIED]: '#6B7280', // Gray
  
  // Payment Status Colors
  [PAYMENT_STATUS.PENDING]: '#F59E0B', // Amber
  [PAYMENT_STATUS.PROCESSING]: '#3B82F6', // Blue
  [PAYMENT_STATUS.COMPLETED]: '#10B981', // Green
  [PAYMENT_STATUS.FAILED]: '#EF4444', // Red
  [PAYMENT_STATUS.CANCELLED]: '#6B7280', // Gray
  [PAYMENT_STATUS.REFUNDED]: '#8B5CF6', // Purple
  [PAYMENT_STATUS.PARTIALLY_REFUNDED]: '#F97316', // Orange
  [PAYMENT_STATUS.EXPIRED]: '#9CA3AF', // Light Gray
  
  // Review Status Colors
  [REVIEW_STATUS.PENDING]: '#F59E0B', // Amber
  [REVIEW_STATUS.APPROVED]: '#10B981', // Green
  [REVIEW_STATUS.REJECTED]: '#EF4444', // Red
  [REVIEW_STATUS.HIDDEN]: '#6B7280', // Gray
  [REVIEW_STATUS.FLAGGED]: '#F97316', // Orange
  [REVIEW_STATUS.MODERATED]: '#8B5CF6', // Purple
  
  // Report Status Colors
  [REPORT_STATUS.PENDING]: '#F59E0B', // Amber
  [REPORT_STATUS.REVIEWED]: '#3B82F6', // Blue
  [REPORT_STATUS.RESOLVED]: '#10B981', // Green
  [REPORT_STATUS.REJECTED]: '#EF4444', // Red
  [REPORT_STATUS.ESCALATED]: '#F97316', // Orange
  [REPORT_STATUS.CLOSED]: '#6B7280', // Gray
  
  // Notification Status Colors
  [NOTIFICATION_STATUS.UNREAD]: '#EF4444', // Red
  [NOTIFICATION_STATUS.READ]: '#10B981', // Green
  [NOTIFICATION_STATUS.ARCHIVED]: '#6B7280', // Gray
  [NOTIFICATION_STATUS.DELETED]: '#9CA3AF', // Light Gray
  
  // Email Status Colors
  [EMAIL_STATUS.PENDING]: '#F59E0B', // Amber
  [EMAIL_STATUS.SENT]: '#3B82F6', // Blue
  [EMAIL_STATUS.DELIVERED]: '#10B981', // Green
  [EMAIL_STATUS.FAILED]: '#EF4444', // Red
  [EMAIL_STATUS.BOUNCED]: '#F97316', // Orange
  [EMAIL_STATUS.OPENED]: '#8B5CF6', // Purple
  [EMAIL_STATUS.CLICKED]: '#06B6D4', // Cyan
  
  // Verification Status Colors
  [VERIFICATION_STATUS.PENDING]: '#F59E0B', // Amber
  [VERIFICATION_STATUS.IN_PROGRESS]: '#3B82F6', // Blue
  [VERIFICATION_STATUS.COMPLETED]: '#10B981', // Green
  [VERIFICATION_STATUS.FAILED]: '#EF4444', // Red
  [VERIFICATION_STATUS.EXPIRED]: '#6B7280', // Gray
  [VERIFICATION_STATUS.RESENT]: '#8B5CF6', // Purple
  
  // Maintenance Status Colors
  [MAINTENANCE_STATUS.SCHEDULED]: '#3B82F6', // Blue
  [MAINTENANCE_STATUS.IN_PROGRESS]: '#F59E0B', // Amber
  [MAINTENANCE_STATUS.COMPLETED]: '#10B981', // Green
  [MAINTENANCE_STATUS.CANCELLED]: '#6B7280', // Gray
  [MAINTENANCE_STATUS.OVERDUE]: '#EF4444', // Red
};

// Status Icons (for UI display)
export const STATUS_ICONS = {
  // Booking Status Icons
  [BOOKING_STATUS.PENDING]: '⏳',
  [BOOKING_STATUS.CONFIRMED]: '✅',
  [BOOKING_STATUS.CANCELLED]: '❌',
  [BOOKING_STATUS.COMPLETED]: '🎯',
  [BOOKING_STATUS.NO_SHOW]: '🚫',
  [BOOKING_STATUS.REFUNDED]: '💰',
  [BOOKING_STATUS.EXPIRED]: '⏰',
  
  // Venue Status Icons
  [VENUE_STATUS.PENDING]: '⏳',
  [VENUE_STATUS.APPROVED]: '✅',
  [VENUE_STATUS.REJECTED]: '❌',
  [VENUE_STATUS.SUSPENDED]: '⚠️',
  [VENUE_STATUS.MAINTENANCE]: '🔧',
  [VENUE_STATUS.CLOSED]: '🚪',
  [VENUE_STATUS.ACTIVE]: '🟢',
  [VENUE_STATUS.INACTIVE]: '⚪',
  
  // Court Status Icons
  [COURT_STATUS.AVAILABLE]: '🟢',
  [COURT_STATUS.BOOKED]: '🔴',
  [COURT_STATUS.MAINTENANCE]: '🔧',
  [COURT_STATUS.RESERVED]: '🟣',
  [COURT_STATUS.UNAVAILABLE]: '⚫',
  [COURT_STATUS.CLOSED]: '🚪',
  
  // User Status Icons
  [USER_STATUS.ACTIVE]: '🟢',
  [USER_STATUS.INACTIVE]: '⚪',
  [USER_STATUS.SUSPENDED]: '⚠️',
  [USER_STATUS.BANNED]: '🚫',
  [USER_STATUS.PENDING_VERIFICATION]: '⏳',
  [USER_STATUS.VERIFIED]: '✅',
  [USER_STATUS.UNVERIFIED]: '❓',
  
  // Payment Status Icons
  [PAYMENT_STATUS.PENDING]: '⏳',
  [PAYMENT_STATUS.PROCESSING]: '🔄',
  [PAYMENT_STATUS.COMPLETED]: '✅',
  [PAYMENT_STATUS.FAILED]: '❌',
  [PAYMENT_STATUS.CANCELLED]: '🚫',
  [PAYMENT_STATUS.REFUNDED]: '💰',
  [PAYMENT_STATUS.PARTIALLY_REFUNDED]: '💸',
  [PAYMENT_STATUS.EXPIRED]: '⏰',
  
  // Review Status Icons
  [REVIEW_STATUS.PENDING]: '⏳',
  [REVIEW_STATUS.APPROVED]: '✅',
  [REVIEW_STATUS.REJECTED]: '❌',
  [REVIEW_STATUS.HIDDEN]: '🙈',
  [REVIEW_STATUS.FLAGGED]: '🚩',
  [REVIEW_STATUS.MODERATED]: '👮',
  
  // Report Status Icons
  [REPORT_STATUS.PENDING]: '⏳',
  [REPORT_STATUS.REVIEWED]: '👀',
  [REPORT_STATUS.RESOLVED]: '✅',
  [REPORT_STATUS.REJECTED]: '❌',
  [REPORT_STATUS.ESCALATED]: '📈',
  [REPORT_STATUS.CLOSED]: '🔒',
  
  // Notification Status Icons
  [NOTIFICATION_STATUS.UNREAD]: '🔴',
  [NOTIFICATION_STATUS.READ]: '🟢',
  [NOTIFICATION_STATUS.ARCHIVED]: '📁',
  [NOTIFICATION_STATUS.DELETED]: '🗑️',
  
  // Email Status Icons
  [EMAIL_STATUS.PENDING]: '⏳',
  [EMAIL_STATUS.SENT]: '📤',
  [EMAIL_STATUS.DELIVERED]: '📨',
  [EMAIL_STATUS.FAILED]: '❌',
  [EMAIL_STATUS.BOUNCED]: '↩️',
  [EMAIL_STATUS.OPENED]: '👁️',
  [EMAIL_STATUS.CLICKED]: '👆',
  
  // Verification Status Icons
  [VERIFICATION_STATUS.PENDING]: '⏳',
  [VERIFICATION_STATUS.IN_PROGRESS]: '🔄',
  [VERIFICATION_STATUS.COMPLETED]: '✅',
  [VERIFICATION_STATUS.FAILED]: '❌',
  [VERIFICATION_STATUS.EXPIRED]: '⏰',
  [VERIFICATION_STATUS.RESENT]: '📤',
  
  // Maintenance Status Icons
  [MAINTENANCE_STATUS.SCHEDULED]: '📅',
  [MAINTENANCE_STATUS.IN_PROGRESS]: '🔧',
  [MAINTENANCE_STATUS.COMPLETED]: '✅',
  [MAINTENANCE_STATUS.CANCELLED]: '🚫',
  [MAINTENANCE_STATUS.OVERDUE]: '⏰',
};

// Status Descriptions
export const STATUS_DESCRIPTIONS = {
  // Booking Status Descriptions
  [BOOKING_STATUS.PENDING]: 'Booking is pending confirmation',
  [BOOKING_STATUS.CONFIRMED]: 'Booking has been confirmed',
  [BOOKING_STATUS.CANCELLED]: 'Booking has been cancelled',
  [BOOKING_STATUS.COMPLETED]: 'Booking has been completed',
  [BOOKING_STATUS.NO_SHOW]: 'User did not show up for the booking',
  [BOOKING_STATUS.REFUNDED]: 'Payment has been refunded',
  [BOOKING_STATUS.EXPIRED]: 'Booking has expired',
  
  // Venue Status Descriptions
  [VENUE_STATUS.PENDING]: 'Venue is pending approval',
  [VENUE_STATUS.APPROVED]: 'Venue has been approved',
  [VENUE_STATUS.REJECTED]: 'Venue has been rejected',
  [VENUE_STATUS.SUSPENDED]: 'Venue has been suspended',
  [VENUE_STATUS.MAINTENANCE]: 'Venue is under maintenance',
  [VENUE_STATUS.CLOSED]: 'Venue is closed',
  [VENUE_STATUS.ACTIVE]: 'Venue is active and operational',
  [VENUE_STATUS.INACTIVE]: 'Venue is inactive',
  
  // Court Status Descriptions
  [COURT_STATUS.AVAILABLE]: 'Court is available for booking',
  [COURT_STATUS.BOOKED]: 'Court is currently booked',
  [COURT_STATUS.MAINTENANCE]: 'Court is under maintenance',
  [COURT_STATUS.RESERVED]: 'Court is reserved',
  [COURT_STATUS.UNAVAILABLE]: 'Court is unavailable',
  [COURT_STATUS.CLOSED]: 'Court is closed',
  
  // User Status Descriptions
  [USER_STATUS.ACTIVE]: 'User account is active',
  [USER_STATUS.INACTIVE]: 'User account is inactive',
  [USER_STATUS.SUSPENDED]: 'User account is suspended',
  [USER_STATUS.BANNED]: 'User account is banned',
  [USER_STATUS.PENDING_VERIFICATION]: 'User account is pending verification',
  [USER_STATUS.VERIFIED]: 'User account is verified',
  [USER_STATUS.UNVERIFIED]: 'User account is not verified',
  
  // Payment Status Descriptions
  [PAYMENT_STATUS.PENDING]: 'Payment is pending',
  [PAYMENT_STATUS.PROCESSING]: 'Payment is being processed',
  [PAYMENT_STATUS.COMPLETED]: 'Payment has been completed',
  [PAYMENT_STATUS.FAILED]: 'Payment has failed',
  [PAYMENT_STATUS.CANCELLED]: 'Payment has been cancelled',
  [PAYMENT_STATUS.REFUNDED]: 'Payment has been refunded',
  [PAYMENT_STATUS.PARTIALLY_REFUNDED]: 'Payment has been partially refunded',
  [PAYMENT_STATUS.EXPIRED]: 'Payment has expired',
  
  // Review Status Descriptions
  [REVIEW_STATUS.PENDING]: 'Review is pending approval',
  [REVIEW_STATUS.APPROVED]: 'Review has been approved',
  [REVIEW_STATUS.REJECTED]: 'Review has been rejected',
  [REVIEW_STATUS.HIDDEN]: 'Review is hidden',
  [REVIEW_STATUS.FLAGGED]: 'Review has been flagged',
  [REVIEW_STATUS.MODERATED]: 'Review has been moderated',
  
  // Report Status Descriptions
  [REPORT_STATUS.PENDING]: 'Report is pending review',
  [REPORT_STATUS.REVIEWED]: 'Report has been reviewed',
  [REPORT_STATUS.RESOLVED]: 'Report has been resolved',
  [REPORT_STATUS.REJECTED]: 'Report has been rejected',
  [REPORT_STATUS.ESCALATED]: 'Report has been escalated',
  [REPORT_STATUS.CLOSED]: 'Report has been closed',
  
  // Notification Status Descriptions
  [NOTIFICATION_STATUS.UNREAD]: 'Notification is unread',
  [NOTIFICATION_STATUS.READ]: 'Notification has been read',
  [NOTIFICATION_STATUS.ARCHIVED]: 'Notification has been archived',
  [NOTIFICATION_STATUS.DELETED]: 'Notification has been deleted',
  
  // Email Status Descriptions
  [EMAIL_STATUS.PENDING]: 'Email is pending',
  [EMAIL_STATUS.SENT]: 'Email has been sent',
  [EMAIL_STATUS.DELIVERED]: 'Email has been delivered',
  [EMAIL_STATUS.FAILED]: 'Email has failed',
  [EMAIL_STATUS.BOUNCED]: 'Email has bounced',
  [EMAIL_STATUS.OPENED]: 'Email has been opened',
  [EMAIL_STATUS.CLICKED]: 'Email link has been clicked',
  
  // Verification Status Descriptions
  [VERIFICATION_STATUS.PENDING]: 'Verification is pending',
  [VERIFICATION_STATUS.IN_PROGRESS]: 'Verification is in progress',
  [VERIFICATION_STATUS.COMPLETED]: 'Verification has been completed',
  [VERIFICATION_STATUS.FAILED]: 'Verification has failed',
  [VERIFICATION_STATUS.EXPIRED]: 'Verification has expired',
  [VERIFICATION_STATUS.RESENT]: 'Verification has been resent',
  
  // Maintenance Status Descriptions
  [MAINTENANCE_STATUS.SCHEDULED]: 'Maintenance is scheduled',
  [MAINTENANCE_STATUS.IN_PROGRESS]: 'Maintenance is in progress',
  [MAINTENANCE_STATUS.COMPLETED]: 'Maintenance has been completed',
  [MAINTENANCE_STATUS.CANCELLED]: 'Maintenance has been cancelled',
  [MAINTENANCE_STATUS.OVERDUE]: 'Maintenance is overdue',
};

// Helper functions
export const getStatusColor = (status) => {
  return STATUS_COLORS[status] || '#6B7280'; // Default gray
};

export const getStatusIcon = (status) => {
  return STATUS_ICONS[status] || '❓'; // Default question mark
};

export const getStatusDescription = (status) => {
  return STATUS_DESCRIPTIONS[status] || 'Unknown status';
};

export const isActiveStatus = (status) => {
  const activeStatuses = [
    BOOKING_STATUS.CONFIRMED,
    VENUE_STATUS.APPROVED,
    VENUE_STATUS.ACTIVE,
    COURT_STATUS.AVAILABLE,
    USER_STATUS.ACTIVE,
    USER_STATUS.VERIFIED,
    PAYMENT_STATUS.COMPLETED,
    REVIEW_STATUS.APPROVED,
  ];
  
  return activeStatuses.includes(status);
};

export const isPendingStatus = (status) => {
  const pendingStatuses = [
    BOOKING_STATUS.PENDING,
    VENUE_STATUS.PENDING,
    USER_STATUS.PENDING_VERIFICATION,
    PAYMENT_STATUS.PENDING,
    REVIEW_STATUS.PENDING,
    REPORT_STATUS.PENDING,
    NOTIFICATION_STATUS.UNREAD,
    EMAIL_STATUS.PENDING,
    VERIFICATION_STATUS.PENDING,
    MAINTENANCE_STATUS.SCHEDULED,
  ];
  
  return pendingStatuses.includes(status);
};

export const isCompletedStatus = (status) => {
  const completedStatuses = [
    BOOKING_STATUS.COMPLETED,
    VENUE_STATUS.APPROVED,
    COURT_STATUS.AVAILABLE,
    USER_STATUS.VERIFIED,
    PAYMENT_STATUS.COMPLETED,
    REVIEW_STATUS.APPROVED,
    REPORT_STATUS.RESOLVED,
    EMAIL_STATUS.DELIVERED,
    VERIFICATION_STATUS.COMPLETED,
    MAINTENANCE_STATUS.COMPLETED,
  ];
  
  return completedStatuses.includes(status);
};

export const isErrorStatus = (status) => {
  const errorStatuses = [
    BOOKING_STATUS.CANCELLED,
    BOOKING_STATUS.NO_SHOW,
    BOOKING_STATUS.EXPIRED,
    VENUE_STATUS.REJECTED,
    VENUE_STATUS.SUSPENDED,
    VENUE_STATUS.CLOSED,
    COURT_STATUS.UNAVAILABLE,
    COURT_STATUS.CLOSED,
    USER_STATUS.SUSPENDED,
    USER_STATUS.BANNED,
    USER_STATUS.UNVERIFIED,
    PAYMENT_STATUS.FAILED,
    PAYMENT_STATUS.CANCELLED,
    PAYMENT_STATUS.EXPIRED,
    REVIEW_STATUS.REJECTED,
    REVIEW_STATUS.HIDDEN,
    REVIEW_STATUS.FLAGGED,
    REPORT_STATUS.REJECTED,
    EMAIL_STATUS.FAILED,
    EMAIL_STATUS.BOUNCED,
    VERIFICATION_STATUS.FAILED,
    VERIFICATION_STATUS.EXPIRED,
    MAINTENANCE_STATUS.OVERDUE,
  ];
  
  return errorStatuses.includes(status);
};

export default {
  BOOKING_STATUS,
  VENUE_STATUS,
  COURT_STATUS,
  USER_STATUS,
  PAYMENT_STATUS,
  REVIEW_STATUS,
  REPORT_STATUS,
  NOTIFICATION_STATUS,
  EMAIL_STATUS,
  VERIFICATION_STATUS,
  MAINTENANCE_STATUS,
  STATUS_COLORS,
  STATUS_ICONS,
  STATUS_DESCRIPTIONS,
  getStatusColor,
  getStatusIcon,
  getStatusDescription,
  isActiveStatus,
  isPendingStatus,
  isCompletedStatus,
  isErrorStatus,
}; 
