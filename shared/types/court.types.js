// Court type definitions for the application

// Court Status
export const COURT_STATUS = {
  AVAILABLE: 'Available',
  BOOKED: 'Booked',
  MAINTENANCE: 'Maintenance',
  RESERVED: 'Reserved',
  UNAVAILABLE: 'Unavailable',
  CLOSED: 'Closed',
  INACTIVE: 'Inactive',
};

// Court Surface Types
export const COURT_SURFACE_TYPES = {
  HARD_COURT: 'Hard Court',
  CLAY_COURT: 'Clay Court',
  GRASS_COURT: 'Grass Court',
  CARPET_COURT: 'Carpet Court',
  ARTIFICIAL_TURF: 'Artificial Turf',
  SYNTHETIC: 'Synthetic',
  WOODEN: 'Wooden',
  CONCRETE: 'Concrete',
  ASPHALT: 'Asphalt',
  OTHER: 'Other',
};

// Court Equipment
export const COURT_EQUIPMENT = {
  NET: 'Net',
  POSTS: 'Posts',
  MARKINGS: 'Markings',
  LIGHTING: 'Lighting',
  SCOREBOARD: 'Scoreboard',
  BENCHES: 'Benches',
  WATER_COOLER: 'Water Cooler',
  FIRST_AID_KIT: 'First Aid Kit',
  EQUIPMENT_RACK: 'Equipment Rack',
  STORAGE_LOCKER: 'Storage Locker',
};

// Court Rules
export const COURT_RULES = {
  NO_SMOKING: 'No Smoking',
  NO_FOOD: 'No Food',
  NO_DRINKS: 'No Drinks',
  PROPER_ATTIRE: 'Proper Attire',
  NO_CLEATS: 'No Cleats',
  RESPECT_EQUIPMENT: 'Respect Equipment',
  CLEAN_UP: 'Clean Up After Use',
  TIME_LIMIT: 'Respect Time Limits',
  NO_PETS: 'No Pets',
  QUIET_HOURS: 'Quiet Hours',
};

// Create Court Request
export const createCourtRequest = (venueId, name, sportType, pricePerHour, operatingHours, surface = '', dimensions = {}, equipment = [], rules = []) => ({
  venueId,
  name,
  sportType,
  pricePerHour,
  operatingHours,
  surface,
  dimensions,
  equipment,
  rules,
  description: '',
  photos: [],
  isActive: true,
  timestamp: new Date().toISOString(),
  metadata: {
    createdBy: null, // Will be set by server
    source: 'web',
    version: '1.0',
  },
});

// Create Court Response
export const createCourtResponse = (court) => ({
  success: true,
  message: 'Court created successfully',
  data: {
    court: {
      _id: court._id,
      name: court.name,
      sportType: court.sportType,
      pricePerHour: court.pricePerHour,
      surface: court.surface,
      status: court.status || COURT_STATUS.AVAILABLE,
      isActive: court.isActive,
      createdAt: court.createdAt,
      updatedAt: court.updatedAt,
    },
    nextSteps: [
      'Set up time slots for the court',
      'Configure pricing rules if needed',
      'Add photos and additional details',
      'Set operating hours and availability',
    ],
  },
  timestamp: new Date().toISOString(),
});

// Update Court Request
export const createUpdateCourtRequest = (courtId, updates) => ({
  courtId,
  updates,
  reason: '',
  timestamp: new Date().toISOString(),
  updatedBy: null, // Will be set by server
});

// Update Court Response
export const createUpdateCourtResponse = (court, changes) => ({
  success: true,
  message: 'Court updated successfully',
  data: {
    court: {
      _id: court._id,
      name: court.name,
      status: court.status,
      updatedAt: court.updatedAt,
    },
    changes,
    updatedFields: Object.keys(changes),
  },
  timestamp: new Date().toISOString(),
});

// Court Details Response
export const createCourtDetailsResponse = (court, venue, timeSlots = [], bookings = []) => ({
  success: true,
  data: {
    court: {
      _id: court._id,
      name: court.name,
      sportType: court.sportType,
      pricePerHour: court.pricePerHour,
      surface: court.surface,
      dimensions: court.dimensions || {},
      equipment: court.equipment || [],
      rules: court.rules || [],
      description: court.description || '',
      photos: court.photos || [],
      status: court.status,
      isActive: court.isActive,
      operatingHours: court.operatingHours || {},
      createdAt: court.createdAt,
      updatedAt: court.updatedAt,
    },
    venue: {
      _id: venue._id,
      name: venue.name,
      address: venue.address,
      contact: venue.contact || {},
      amenities: venue.amenities || [],
    },
    availability: {
      today: getTodayAvailability(timeSlots, bookings),
      thisWeek: getWeekAvailability(timeSlots, bookings),
      nextWeek: getNextWeekAvailability(timeSlots, bookings),
    },
    pricing: {
      basePrice: court.pricePerHour,
      currency: 'INR',
      discounts: getCourtDiscounts(court),
      specialRates: getSpecialRates(court),
    },
    statistics: {
      totalBookings: bookings.length,
      averageRating: calculateAverageRating(bookings),
      utilizationRate: calculateUtilizationRate(timeSlots, bookings),
      popularTimeSlots: getPopularTimeSlots(bookings),
    },
  },
  timestamp: new Date().toISOString(),
});

// Court List Response
export const createCourtListResponse = (courts, pagination, filters) => ({
  success: true,
  data: {
    courts: courts.map(court => ({
      _id: court._id,
      name: court.name,
      sportType: court.sportType,
      pricePerHour: court.pricePerHour,
      surface: court.surface,
      status: court.status,
      isActive: court.isActive,
      venue: {
        _id: court.venue._id,
        name: court.venue.name,
        address: court.venue.address,
      },
      photos: court.photos || [],
      rating: court.rating || 0,
      numberOfReviews: court.numberOfReviews || 0,
    })),
    pagination,
    filters,
    summary: {
      total: pagination.total,
      available: courts.filter(c => c.status === COURT_STATUS.AVAILABLE).length,
      booked: courts.filter(c => c.status === COURT_STATUS.BOOKED).length,
      maintenance: courts.filter(c => c.status === COURT_STATUS.MAINTENANCE).length,
      inactive: courts.filter(c => !c.isActive).length,
    },
  },
  timestamp: new Date().toISOString(),
});

// Court Availability Response
export const createCourtAvailabilityResponse = (courtId, date, timeSlots, existingBookings) => ({
  success: true,
  data: {
    courtId,
    date,
    timeSlots: timeSlots.map(slot => ({
      startTime: slot.startTime,
      endTime: slot.endTime,
      isAvailable: !isTimeSlotBooked(slot, existingBookings),
      price: slot.price,
      duration: slot.duration,
    })),
    summary: {
      totalSlots: timeSlots.length,
      availableSlots: timeSlots.filter(slot => !isTimeSlotBooked(slot, existingBookings)).length,
      bookedSlots: timeSlots.filter(slot => isTimeSlotBooked(slot, existingBookings)).length,
      priceRange: {
        min: Math.min(...timeSlots.map(slot => slot.price)),
        max: Math.max(...timeSlots.map(slot => slot.price)),
      },
    },
    operatingHours: {
      start: '06:00',
      end: '23:00',
      timezone: 'Asia/Kolkata',
    },
  },
  timestamp: new Date().toISOString(),
});

// Court Pricing Response
export const createCourtPricingResponse = (court, pricingRules) => ({
  success: true,
  data: {
    court: {
      _id: court._id,
      name: court.name,
      basePrice: court.pricePerHour,
    },
    pricing: {
      basePrice: court.pricePerHour,
      currency: 'INR',
      perHour: true,
      rules: pricingRules || [],
      discounts: getCourtDiscounts(court),
      specialRates: getSpecialRates(court),
      peakHours: {
        start: '18:00',
        end: '22:00',
        multiplier: 1.2,
      },
      offPeakHours: {
        start: '06:00',
        end: '10:00',
        multiplier: 0.8,
      },
    },
    bookingOptions: {
      minDuration: 60, // minutes
      maxDuration: 480, // minutes (8 hours)
      timeSlotInterval: 60, // minutes
      advanceBooking: 30, // days
      sameDayBooking: true,
    },
  },
  timestamp: new Date().toISOString(),
});

// Court Maintenance Request
export const createCourtMaintenanceRequest = (courtId, startDate, endDate, reason, description = '') => ({
  courtId,
  startDate,
  endDate,
  reason,
  description,
  priority: 'medium', // low, medium, high, urgent
  estimatedCost: 0,
  assignedTo: null,
  timestamp: new Date().toISOString(),
  requestedBy: null, // Will be set by server
});

// Court Maintenance Response
export const createCourtMaintenanceResponse = (maintenance) => ({
  success: true,
  message: 'Maintenance scheduled successfully',
  data: {
    maintenance: {
      _id: maintenance._id,
      courtId: maintenance.courtId,
      startDate: maintenance.startDate,
      endDate: maintenance.endDate,
      reason: maintenance.reason,
      status: 'scheduled',
      createdAt: maintenance.createdAt,
    },
    affectedBookings: [], // Will be populated by server
    notifications: [
      'Court will be unavailable during maintenance period',
      'Existing bookings will be automatically cancelled',
      'Refunds will be processed for affected bookings',
    ],
  },
  timestamp: new Date().toISOString(),
});

// Court Statistics Response
export const createCourtStatisticsResponse = (courtId, stats, period) => ({
  success: true,
  data: {
    courtId,
    period,
    bookings: {
      total: stats.totalBookings || 0,
      confirmed: stats.confirmedBookings || 0,
      completed: stats.completedBookings || 0,
      cancelled: stats.cancelledBookings || 0,
      noShow: stats.noShowBookings || 0,
    },
    revenue: {
      total: stats.totalRevenue || 0,
      average: stats.averageRevenue || 0,
      trend: stats.revenueTrend || 'stable',
    },
    utilization: {
      rate: stats.utilizationRate || 0,
      peakHours: stats.peakHours || [],
      offPeakHours: stats.offPeakHours || [],
    },
    ratings: {
      average: stats.averageRating || 0,
      total: stats.totalRatings || 0,
      distribution: stats.ratingDistribution || {},
    },
    performance: {
      uptime: stats.uptime || 0,
      maintenanceHours: stats.maintenanceHours || 0,
      issues: stats.issues || [],
    },
  },
  timestamp: new Date().toISOString(),
});

// Helper Functions
export const isTimeSlotBooked = (timeSlot, existingBookings) => {
  return existingBookings.some(booking => {
    if (booking.date !== timeSlot.date) return false;
    
    const slotStart = new Date(`2000-01-01T${timeSlot.startTime}`);
    const slotEnd = new Date(`2000-01-01T${timeSlot.endTime}`);
    const bookingStart = new Date(`2000-01-01T${booking.startTime}`);
    const bookingEnd = new Date(`2000-01-01T${booking.endTime}`);
    
    return (slotStart < bookingEnd && slotEnd > bookingStart);
  });
};

export const getTodayAvailability = (timeSlots, bookings) => {
  const today = new Date().toISOString().split('T')[0];
  return timeSlots
    .filter(slot => slot.date === today)
    .map(slot => ({
      ...slot,
      isAvailable: !isTimeSlotBooked(slot, bookings),
    }));
};

export const getWeekAvailability = (timeSlots, bookings) => {
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  
  return timeSlots
    .filter(slot => {
      const slotDate = new Date(slot.date);
      return slotDate >= weekStart && slotDate <= weekEnd;
    })
    .map(slot => ({
      ...slot,
      isAvailable: !isTimeSlotBooked(slot, bookings),
    }));
};

export const getNextWeekAvailability = (timeSlots, bookings) => {
  const today = new Date();
  const nextWeekStart = new Date(today);
  nextWeekStart.setDate(today.getDate() + (7 - today.getDay()));
  
  const nextWeekEnd = new Date(nextWeekStart);
  nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
  
  return timeSlots
    .filter(slot => {
      const slotDate = new Date(slot.date);
      return slotDate >= nextWeekStart && slotDate <= nextWeekEnd;
    })
    .map(slot => ({
      ...slot,
      isAvailable: !isTimeSlotBooked(slot, bookings),
    }));
};

export const getCourtDiscounts = (court) => {
  return [
    {
      type: 'early_bird',
      description: 'Early Bird Discount (6 AM - 10 AM)',
      percentage: 20,
      applicable: true,
    },
    {
      type: 'bulk_booking',
      description: 'Bulk Booking Discount (3+ hours)',
      percentage: 15,
      applicable: true,
    },
    {
      type: 'weekday',
      description: 'Weekday Discount (Monday - Thursday)',
      percentage: 10,
      applicable: true,
    },
  ];
};

export const getSpecialRates = (court) => {
  return [
    {
      type: 'peak_hours',
      description: 'Peak Hours (6 PM - 10 PM)',
      multiplier: 1.2,
      applicable: true,
    },
    {
      type: 'weekend',
      description: 'Weekend Rates (Friday - Sunday)',
      multiplier: 1.1,
      applicable: true,
    },
    {
      type: 'holiday',
      description: 'Holiday Rates',
      multiplier: 1.3,
      applicable: true,
    },
  ];
};

export const calculateAverageRating = (bookings) => {
  const ratedBookings = bookings.filter(booking => booking.rating);
  if (ratedBookings.length === 0) return 0;
  
  const totalRating = ratedBookings.reduce((sum, booking) => sum + booking.rating, 0);
  return Math.round((totalRating / ratedBookings.length) * 10) / 10;
};

export const calculateUtilizationRate = (timeSlots, bookings) => {
  if (timeSlots.length === 0) return 0;
  
  const bookedSlots = timeSlots.filter(slot => isTimeSlotBooked(slot, bookings));
  return Math.round((bookedSlots.length / timeSlots.length) * 100);
};

export const getPopularTimeSlots = (bookings) => {
  const timeSlotCounts = {};
  
  bookings.forEach(booking => {
    const timeSlot = `${booking.startTime}-${booking.endTime}`;
    timeSlotCounts[timeSlot] = (timeSlotCounts[timeSlot] || 0) + 1;
  });
  
  return Object.entries(timeSlotCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([timeSlot, count]) => ({
      timeSlot,
      count,
    }));
};

export const validateCourtRequest = (request) => {
  const errors = [];
  
  if (!request.venueId) errors.push('Venue ID is required');
  if (!request.name) errors.push('Court name is required');
  if (!request.sportType) errors.push('Sport type is required');
  if (!request.pricePerHour) errors.push('Price per hour is required');
  if (!request.operatingHours) errors.push('Operating hours are required');
  
  if (request.pricePerHour && request.pricePerHour <= 0) {
    errors.push('Price per hour must be greater than 0');
  }
  
  if (request.name && request.name.length < 2) {
    errors.push('Court name must be at least 2 characters long');
  }
  
  if (request.name && request.name.length > 50) {
    errors.push('Court name must be less than 50 characters long');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export default {
  COURT_STATUS,
  COURT_SURFACE_TYPES,
  COURT_EQUIPMENT,
  COURT_RULES,
  createCourtRequest,
  createCourtResponse,
  createUpdateCourtRequest,
  createUpdateCourtResponse,
  createCourtDetailsResponse,
  createCourtListResponse,
  createCourtAvailabilityResponse,
  createCourtPricingResponse,
  createCourtMaintenanceRequest,
  createCourtMaintenanceResponse,
  createCourtStatisticsResponse,
  isTimeSlotBooked,
  getTodayAvailability,
  getWeekAvailability,
  getNextWeekAvailability,
  getCourtDiscounts,
  getSpecialRates,
  calculateAverageRating,
  calculateUtilizationRate,
  getPopularTimeSlots,
  validateCourtRequest,
}; 
