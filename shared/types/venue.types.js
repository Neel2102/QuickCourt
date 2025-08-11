// Venue type definitions and helpers for the application

import { VENUE_STATUS } from '../constants/status.js';
import { SPORT_TYPES } from '../constants/sports.js';
import { isValidObjectId, isObject, isArray, isString, isNumber } from '../utils/common.utils.js';

// Create Venue Request
export const createVenueRequest = (
  name,
  description,
  address,
  sportTypes,
  ownerId,
  amenities = [],
  photos = []
) => ({
  name,
  description,
  address: {
    street: address?.street || '',
    city: address?.city || '',
    state: address?.state || '',
    postalCode: address?.postalCode || '',
  },
  sportTypes: Array.isArray(sportTypes) ? sportTypes : [],
  amenities: Array.isArray(amenities) ? amenities : [],
  photos: Array.isArray(photos) ? photos : [],
  owner: ownerId,
  isApproved: false,
  rating: 0,
  numberOfReviews: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// Create Venue Response
export const createVenueResponse = (venue) => ({
  success: true,
  message: 'Venue created successfully',
  data: {
    venue: {
      _id: venue._id,
      name: venue.name,
      description: venue.description,
      address: venue.address,
      sportTypes: venue.sportTypes || [],
      amenities: venue.amenities || [],
      photos: venue.photos || [],
      owner: venue.owner,
      isApproved: venue.isApproved || false,
      status: getVenueStatus(venue),
      rating: venue.rating || 0,
      numberOfReviews: venue.numberOfReviews || 0,
      createdAt: venue.createdAt,
      updatedAt: venue.updatedAt,
    },
    nextSteps: [
      'Add courts to the venue',
      'Upload venue photos',
      'Configure amenities and details',
      'Submit for approval if required',
    ],
  },
  timestamp: new Date().toISOString(),
});

// Update Venue Request
export const createUpdateVenueRequest = (venueId, updates) => ({
  venueId,
  updates,
  reason: '',
  timestamp: new Date().toISOString(),
  updatedBy: null, // Will be set by server
});

// Update Venue Response
export const createUpdateVenueResponse = (venue, changes) => ({
  success: true,
  message: 'Venue updated successfully',
  data: {
    venue: {
      _id: venue._id,
      name: venue.name,
      isApproved: venue.isApproved,
      status: getVenueStatus(venue),
      updatedAt: venue.updatedAt,
    },
    changes,
    updatedFields: Object.keys(changes || {}),
  },
  timestamp: new Date().toISOString(),
});

// Venue Details Response
export const createVenueDetailsResponse = (venue, courts = [], reviews = [], stats = {}) => ({
  success: true,
  data: {
    venue: {
      _id: venue._id,
      name: venue.name,
      description: venue.description,
      address: venue.address,
      sportTypes: venue.sportTypes || [],
      amenities: venue.amenities || [],
      photos: venue.photos || [],
      owner: venue.owner,
      isApproved: venue.isApproved || false,
      status: getVenueStatus(venue),
      rating: venue.rating || 0,
      numberOfReviews: venue.numberOfReviews || 0,
      createdAt: venue.createdAt,
      updatedAt: venue.updatedAt,
    },
    courts: courts.map((c) => ({
      _id: c._id,
      name: c.name,
      sportType: c.sportType,
      pricePerHour: c.pricePerHour,
      status: c.status,
      isActive: c.isActive,
      photos: c.photos || [],
    })),
    reviews: reviews.map((r) => ({
      _id: r._id,
      user: r.user?._id || r.user,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
    })),
    statistics: {
      totalCourts: courts.length,
      totalReviews: venue.numberOfReviews || reviews.length,
      averageRating: venue.rating || calculateAverageRating(reviews),
      bookingsLast30Days: stats.bookingsLast30Days || 0,
      revenueLast30Days: stats.revenueLast30Days || 0,
      popularSports: stats.popularSports || [],
    },
  },
  timestamp: new Date().toISOString(),
});

// Venue List Response
export const createVenueListResponse = (venues, pagination, filters) => ({
  success: true,
  data: {
    venues: venues.map((v) => ({
      _id: v._id,
      name: v.name,
      description: v.description,
      address: v.address,
      sportTypes: v.sportTypes || [],
      amenities: v.amenities || [],
      photos: v.photos || [],
      isApproved: v.isApproved || false,
      status: getVenueStatus(v),
      rating: v.rating || 0,
      numberOfReviews: v.numberOfReviews || 0,
      createdAt: v.createdAt,
    })),
    pagination,
    filters,
    summary: {
      total: pagination.total,
      approved: venues.filter((v) => v.isApproved).length,
      pending: venues.filter((v) => !v.isApproved).length,
      averageRating: Math.round(
        (venues.reduce((sum, v) => sum + (v.rating || 0), 0) / (venues.length || 1)) * 10
      ) / 10,
    },
  },
  timestamp: new Date().toISOString(),
});

// Venue Statistics Response
export const createVenueStatisticsResponse = (venueId, stats, period) => ({
  success: true,
  data: {
    venueId,
    period,
    courts: {
      total: stats.totalCourts || 0,
      active: stats.activeCourts || 0,
      maintenance: stats.maintenanceCourts || 0,
    },
    bookings: {
      total: stats.totalBookings || 0,
      confirmed: stats.confirmedBookings || 0,
      completed: stats.completedBookings || 0,
      cancelled: stats.cancelledBookings || 0,
      revenue: stats.totalRevenue || 0,
    },
    ratings: {
      average: stats.averageRating || 0,
      total: stats.totalReviews || 0,
      distribution: stats.ratingDistribution || {},
    },
    popular: {
      sports: stats.popularSports || [],
      timeSlots: stats.popularTimeSlots || [],
    },
  },
  timestamp: new Date().toISOString(),
});

// Venue Search Response
export const createVenueSearchResponse = (venues, query, filters) => ({
  success: true,
  data: {
    venues: venues.map((v) => ({
      _id: v._id,
      name: v.name,
      address: v.address,
      sportTypes: v.sportTypes || [],
      photos: v.photos || [],
      rating: v.rating || 0,
      numberOfReviews: v.numberOfReviews || 0,
      status: getVenueStatus(v),
    })),
    search: {
      query,
      filters,
      totalResults: venues.length,
      searchTime: Date.now(),
    },
  },
  timestamp: new Date().toISOString(),
});

// Validation
export const validateVenueRequest = (request) => {
  const errors = [];

  if (!request.name || !isString(request.name) || request.name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters');
  }
  if (!request.description || !isString(request.description) || request.description.trim().length < 10) {
    errors.push('Description is required and must be at least 10 characters');
  }
  if (!request.address || !isObject(request.address)) {
    errors.push('Address is required');
  } else {
    const { street, city, state, postalCode } = request.address;
    if (!street || !city || !state) errors.push('Address street, city and state are required');
    if (!postalCode || !/^\d{6}$/.test(String(postalCode))) errors.push('Postal code must be 6 digits');
  }
  if (!request.sportTypes || !isArray(request.sportTypes) || request.sportTypes.length === 0) {
    errors.push('At least one sport type is required');
  } else {
    const allowed = new Set(Object.values(SPORT_TYPES));
    const invalid = request.sportTypes.filter((s) => !allowed.has(s));
    if (invalid.length > 0) errors.push('Invalid sport types: ' + invalid.join(', '));
  }
  if (!request.owner || !isValidObjectId(request.owner)) {
    errors.push('Owner must be a valid ID');
  }
  if (request.rating !== undefined && !isNumber(request.rating)) {
    errors.push('Rating must be a number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Helpers
export const getVenueStatus = (venue) => {
  if (venue?.isApproved) return VENUE_STATUS.APPROVED;
  if (venue?.isActive) return VENUE_STATUS.ACTIVE; // fallback if present
  return VENUE_STATUS.PENDING;
};

export const calculateAverageRating = (reviews) => {
  const rated = (reviews || []).filter((r) => isNumber(r.rating));
  if (rated.length === 0) return 0;
  const total = rated.reduce((sum, r) => sum + Number(r.rating), 0);
  return Math.round((total / rated.length) * 10) / 10;
};

export const formatVenueAddress = (venue) => {
  const a = venue?.address || {};
  const parts = [a.street, a.city, a.state, a.postalCode].filter(Boolean);
  return parts.join(', ');
};

export const normalizeVenueAddress = (address) => ({
  street: address?.street || '',
  city: address?.city || '',
  state: address?.state || '',
  postalCode: address?.postalCode || address?.pincode || '', // accept pincode alias
});

export default {
  createVenueRequest,
  createVenueResponse,
  createUpdateVenueRequest,
  createUpdateVenueResponse,
  createVenueDetailsResponse,
  createVenueListResponse,
  createVenueStatisticsResponse,
  createVenueSearchResponse,
  validateVenueRequest,
  getVenueStatus,
  calculateAverageRating,
  formatVenueAddress,
  normalizeVenueAddress,
};

 
