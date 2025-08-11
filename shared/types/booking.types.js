// Booking type definitions for the application

// Booking Status
export const BOOKING_STATUS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',
  NO_SHOW: 'No Show',
  REFUNDED: 'Refunded',
  EXPIRED: 'Expired',
  RESCHEDULED: 'Rescheduled',
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

// Booking Type
export const BOOKING_TYPE = {
  SINGLE: 'Single',
  RECURRING: 'Recurring',
  GROUP: 'Group',
  TOURNAMENT: 'Tournament',
  EVENT: 'Event',
};

// Duration Units
export const DURATION_UNITS = {
  MINUTES: 'minutes',
  HOURS: 'hours',
  DAYS: 'days',
};

// Create Booking Request
export const createBookingRequest = (venueId, courtId, date, startTime, endTime, userId, additionalServices = []) => ({
  venueId,
  courtId,
  date,
  startTime,
  endTime,
  userId,
  additionalServices,
  specialRequests: '',
  emergencyContact: null,
  timestamp: new Date().toISOString(),
  metadata: {
    source: 'web',
    userAgent: navigator?.userAgent || 'Unknown',
    ipAddress: '127.0.0.1', // Will be set by server
  },
});

// Create Booking Response
export const createBookingResponse = (booking, paymentIntent) => ({
  success: true,
  message: 'Booking created successfully',
  data: {
    booking: {
      _id: booking._id,
      bookingNumber: generateBookingNumber(),
      venue: {
        _id: booking.venue._id,
        name: booking.venue.name,
        address: booking.venue.address,
      },
      court: {
        _id: booking.court._id,
        name: booking.court.name,
        sportType: booking.court.sportType,
      },
      user: {
        _id: booking.user._id,
        name: booking.user.name,
        email: booking.user.email,
      },
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      duration: calculateDuration(booking.startTime, booking.endTime),
      totalPrice: booking.totalPrice,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    },
    payment: {
      intentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
    },
    nextSteps: [
      'Complete payment to confirm your booking',
      'Check your email for booking confirmation',
      'Arrive 10 minutes before your scheduled time',
    ],
  },
  timestamp: new Date().toISOString(),
});

// Update Booking Request
export const createUpdateBookingRequest = (bookingId, updates) => ({
  bookingId,
  updates,
  reason: '',
  timestamp: new Date().toISOString(),
  requestedBy: null, // Will be set by server
});

// Update Booking Response
export const createUpdateBookingResponse = (booking, changes) => ({
  success: true,
  message: 'Booking updated successfully',
  data: {
    booking: {
      _id: booking._id,
      bookingNumber: booking.bookingNumber,
      status: booking.status,
      updatedAt: booking.updatedAt,
    },
    changes,
    updatedFields: Object.keys(changes),
  },
  timestamp: new Date().toISOString(),
});

// Cancel Booking Request
export const createCancelBookingRequest = (bookingId, reason = '', refundRequested = false) => ({
  bookingId,
  reason,
  refundRequested,
  timestamp: new Date().toISOString(),
  requestedBy: null, // Will be set by server
});

// Cancel Booking Response
export const createCancelBookingResponse = (booking, refundAmount) => ({
  success: true,
  message: 'Booking cancelled successfully',
  data: {
    booking: {
      _id: booking._id,
      bookingNumber: booking.bookingNumber,
      status: booking.status,
      cancelledAt: new Date().toISOString(),
    },
    refund: {
      amount: refundAmount,
      processed: refundAmount > 0,
      estimatedProcessingTime: '3-5 business days',
    },
    cancellationPolicy: {
      noticeRequired: '24 hours',
      refundPercentage: '100%',
      applicable: true,
    },
  },
  timestamp: new Date().toISOString(),
});

// Booking Details Response
export const createBookingDetailsResponse = (booking, venue, court, user) => ({
  success: true,
  data: {
    booking: {
      _id: booking._id,
      bookingNumber: booking.bookingNumber,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      duration: calculateDuration(booking.startTime, booking.endTime),
      totalPrice: booking.totalPrice,
      additionalServices: booking.additionalServices || [],
      specialRequests: booking.specialRequests || '',
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      cancelledAt: booking.cancelledAt,
      completedAt: booking.completedAt,
    },
    venue: {
      _id: venue._id,
      name: venue.name,
      description: venue.description,
      address: venue.address,
      photos: venue.photos || [],
      amenities: venue.amenities || [],
      contact: {
        phone: venue.contact?.phone || '',
        email: venue.contact?.email || '',
      },
      operatingHours: venue.operatingHours || {},
    },
    court: {
      _id: court._id,
      name: court.name,
      sportType: court.sportType,
      surface: court.surface || '',
      dimensions: court.dimensions || {},
      equipment: court.equipment || [],
      rules: court.rules || [],
    },
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      profilePic: user.profilePic || '',
    },
    policies: {
      cancellation: {
        noticeRequired: '24 hours',
        refundPercentage: '100%',
        applicable: true,
      },
      rescheduling: {
        allowed: true,
        noticeRequired: '2 hours',
        maxReschedules: 2,
      },
      lateArrival: {
        gracePeriod: '10 minutes',
        penalty: 'Booking may be cancelled',
      },
    },
  },
  timestamp: new Date().toISOString(),
});

// Booking List Response
export const createBookingListResponse = (bookings, pagination, filters) => ({
  success: true,
  data: {
    bookings: bookings.map(booking => ({
      _id: booking._id,
      bookingNumber: booking.bookingNumber,
      venue: {
        _id: booking.venue._id,
        name: booking.venue.name,
        address: booking.venue.address,
      },
      court: {
        _id: booking.court._id,
        name: booking.court.name,
        sportType: booking.court.sportType,
      },
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      duration: calculateDuration(booking.startTime, booking.endTime),
      totalPrice: booking.totalPrice,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      createdAt: booking.createdAt,
    })),
    pagination,
    filters,
    summary: {
      total: pagination.total,
      confirmed: bookings.filter(b => b.status === BOOKING_STATUS.CONFIRMED).length,
      pending: bookings.filter(b => b.status === BOOKING_STATUS.PENDING).length,
      completed: bookings.filter(b => b.status === BOOKING_STATUS.COMPLETED).length,
      cancelled: bookings.filter(b => b.status === BOOKING_STATUS.CANCELLED).length,
    },
  },
  timestamp: new Date().toISOString(),
});

// Booking Statistics Response
export const createBookingStatisticsResponse = (stats, period) => ({
  success: true,
  data: {
    period,
    totalBookings: stats.totalBookings,
    totalRevenue: stats.totalRevenue,
    averageBookingValue: stats.averageBookingValue,
    completionRate: stats.completionRate,
    cancellationRate: stats.cancellationRate,
    popularSports: stats.popularSports || [],
    peakHours: stats.peakHours || [],
    venuePerformance: stats.venuePerformance || [],
    trends: {
      daily: stats.trends?.daily || [],
      weekly: stats.trends?.weekly || [],
      monthly: stats.trends?.monthly || [],
    },
  },
  timestamp: new Date().toISOString(),
});

// Booking Conflict Response
export const createBookingConflictResponse = (conflicts, suggestedAlternatives) => ({
  success: false,
  message: 'Booking time conflicts with existing bookings',
  error: {
    code: 'BOOKING_CONFLICT',
    conflicts,
    suggestedAlternatives,
  },
  timestamp: new Date().toISOString(),
});

// Booking Validation Request
export const createBookingValidationRequest = (venueId, courtId, date, startTime, endTime) => ({
  venueId,
  courtId,
  date,
  startTime,
  endTime,
  timestamp: new Date().toISOString(),
});

// Booking Validation Response
export const createBookingValidationResponse = (isValid, conflicts, availability, pricing) => ({
  success: true,
  data: {
    isValid,
    conflicts: conflicts || [],
    availability: availability || {},
    pricing: pricing || {},
    validationRules: {
      minDuration: 60, // minutes
      maxDuration: 480, // minutes (8 hours)
      advanceBooking: 30, // days
      sameDayBooking: true,
      maxBookingsPerDay: 3,
    },
  },
  timestamp: new Date().toISOString(),
});

// Recurring Booking Request
export const createRecurringBookingRequest = (venueId, courtId, startDate, endDate, startTime, endTime, daysOfWeek, userId) => ({
  venueId,
  courtId,
  startDate,
  endDate,
  startTime,
  endTime,
  daysOfWeek, // Array of day numbers (0-6, Sunday-Saturday)
  userId,
  totalOccurrences: calculateTotalOccurrences(startDate, endDate, daysOfWeek),
  timestamp: new Date().toISOString(),
});

// Group Booking Request
export const createGroupBookingRequest = (venueId, courtIds, date, startTime, endTime, userId, participants, groupName) => ({
  venueId,
  courtIds, // Array of court IDs
  date,
  startTime,
  endTime,
  userId,
  participants: participants || [],
  groupName,
  specialRequirements: '',
  timestamp: new Date().toISOString(),
});

// Helper Functions
export const generateBookingNumber = () => {
  const prefix = 'BK';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

export const calculateDuration = (startTime, endTime) => {
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  const diffMs = end - start;
  return Math.round(diffMs / (1000 * 60)); // Return duration in minutes
};

export const calculateTotalOccurrences = (startDate, endDate, daysOfWeek) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let count = 0;
  const current = new Date(start);
  
  while (current <= end) {
    if (daysOfWeek.includes(current.getDay())) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
};

export const isBookingConflict = (existingBookings, newStartTime, newEndTime, date) => {
  const newStart = new Date(`${date}T${newStartTime}`);
  const newEnd = new Date(`${date}T${newEndTime}`);
  
  return existingBookings.some(booking => {
    if (booking.date !== date) return false;
    
    const existingStart = new Date(`${date}T${booking.startTime}`);
    const existingEnd = new Date(`${date}T${booking.endTime}`);
    
    return (newStart < existingEnd && newEnd > existingStart);
  });
};

export const getAvailableTimeSlots = (operatingHours, existingBookings, date, duration = 60) => {
  const slots = [];
  const startHour = parseInt(operatingHours.start.split(':')[0]);
  const endHour = parseInt(operatingHours.end.split(':')[0]);
  
  for (let hour = startHour; hour < endHour; hour++) {
    const startTime = `${hour.toString().padStart(2, '0')}:00`;
    const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
    
    if (!isBookingConflict(existingBookings, startTime, endTime, date)) {
      slots.push({
        startTime,
        endTime,
        available: true,
      });
    }
  }
  
  return slots;
};

export const calculateBookingPrice = (basePrice, duration, additionalServices = []) => {
  const durationHours = duration / 60;
  let totalPrice = basePrice * durationHours;
  
  additionalServices.forEach(service => {
    totalPrice += service.price || 0;
  });
  
  return Math.round(totalPrice * 100) / 100; // Round to 2 decimal places
};

export const validateBookingRequest = (request) => {
  const errors = [];
  
  if (!request.venueId) errors.push('Venue ID is required');
  if (!request.courtId) errors.push('Court ID is required');
  if (!request.date) errors.push('Date is required');
  if (!request.startTime) errors.push('Start time is required');
  if (!request.endTime) errors.push('End time is required');
  if (!request.userId) errors.push('User ID is required');
  
  if (request.date && request.startTime && request.endTime) {
    const start = new Date(`${request.date}T${request.startTime}`);
    const end = new Date(`${request.date}T${request.endTime}`);
    
    if (start >= end) {
      errors.push('End time must be after start time');
    }
    
    if (start < new Date()) {
      errors.push('Cannot book for past dates/times');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export default {
  BOOKING_STATUS,
  PAYMENT_STATUS,
  BOOKING_TYPE,
  DURATION_UNITS,
  createBookingRequest,
  createBookingResponse,
  createUpdateBookingRequest,
  createUpdateBookingResponse,
  createCancelBookingRequest,
  createCancelBookingResponse,
  createBookingDetailsResponse,
  createBookingListResponse,
  createBookingStatisticsResponse,
  createBookingConflictResponse,
  createBookingValidationRequest,
  createBookingValidationResponse,
  createRecurringBookingRequest,
  createGroupBookingRequest,
  generateBookingNumber,
  calculateDuration,
  calculateTotalOccurrences,
  isBookingConflict,
  getAvailableTimeSlots,
  calculateBookingPrice,
  validateBookingRequest,
}; 
