import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

// Simple wrapper component for providers (for future testing setup)
export const ProvidersWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
    <ToastContainer />
  </BrowserRouter>
);

// Mock user for testing
export const mockUser = {
  _id: 'test-user-id',
  name: 'Test User',
  email: 'test@example.com',
  isAdmin: false,
  isFacilityOwner: false,
  profilePic: '',
  bio: 'Test bio',
};

// Mock admin user
export const mockAdminUser = {
  ...mockUser,
  _id: 'test-admin-id',
  name: 'Test Admin',
  email: 'admin@example.com',
  isAdmin: true,
  isFacilityOwner: false,
};

// Mock facility owner user
export const mockFacilityOwner = {
  ...mockUser,
  _id: 'test-owner-id',
  name: 'Test Owner',
  email: 'owner@example.com',
  isAdmin: false,
  isFacilityOwner: true,
};

// Mock venue data
export const mockVenue = {
  _id: 'test-venue-id',
  name: 'Test Sports Complex',
  description: 'A great place for sports',
  address: {
    street: '123 Sports St',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
  },
  sportTypes: ['Badminton', 'Tennis'],
  amenities: ['Parking', 'Shower', 'Equipment'],
  photos: ['https://example.com/photo1.jpg'],
  owner: 'test-owner-id',
  isApproved: true,
  rating: 4.5,
  numberOfReviews: 10,
  courts: [
    {
      _id: 'test-court-1',
      name: 'Court 1',
      sportType: 'Badminton',
      pricePerHour: 500,
      operatingHours: {
        start: '06:00',
        end: '23:00',
      },
    },
  ],
};

// Mock booking data
export const mockBooking = {
  _id: 'test-booking-id',
  user: 'test-user-id',
  venue: 'test-venue-id',
  court: 'test-court-1',
  date: '2024-01-15',
  startTime: '10:00',
  endTime: '11:00',
  totalPrice: 500,
  status: 'Confirmed',
  createdAt: '2024-01-10T10:00:00.000Z',
};

// Mock report data
export const mockReport = {
  _id: 'test-report-id',
  reporter: {
    _id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
  },
  targetType: 'user',
  targetId: 'test-target-id',
  reason: 'Inappropriate behavior',
  actionNote: 'User was being rude in chat',
  status: 'open',
  createdAt: '2024-01-10T10:00:00.000Z',
  updatedAt: '2024-01-10T10:00:00.000Z',
};

// Mock API responses
export const mockApiResponse = (data, success = true, message = '') => ({
  success,
  data,
  message,
});

// Mock API error
export const mockApiError = (message = 'API Error', status = 500) => ({
  success: false,
  message,
  status,
});

// Simple mock data for development/testing
export const createMockFetch = (response) => {
  return () => Promise.resolve({
    ok: response.success !== false,
    status: response.status || 200,
    json: async () => response,
  });
};

// Simple storage mock for development
export const createMockStorage = () => {
  const store = {};

  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value;
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach(key => delete store[key]);
    },
  };
};



// Test data generators
export const generateTestVenues = (count = 5) => {
  return Array.from({ length: count }, (_, index) => ({
    ...mockVenue,
    _id: `venue-${index + 1}`,
    name: `Test Venue ${index + 1}`,
    rating: 3.5 + (index * 0.2),
    numberOfReviews: 5 + (index * 2),
  }));
};

export const generateTestBookings = (count = 5) => {
  return Array.from({ length: count }, (_, index) => ({
    ...mockBooking,
    _id: `booking-${index + 1}`,
    date: new Date(Date.now() + (index * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
    status: ['Confirmed', 'Pending', 'Completed', 'Cancelled'][index % 4],
  }));
};

export const generateTestUsers = (count = 5) => {
  return Array.from({ length: count }, (_, index) => ({
    ...mockUser,
    _id: `user-${index + 1}`,
    name: `Test User ${index + 1}`,
    email: `user${index + 1}@example.com`,
  }));
};

export const generateTestReports = (count = 5) => {
  const statuses = ['open', 'in_review', 'resolved'];
  const types = ['user', 'venue', 'booking'];
  const reasons = [
    'Inappropriate behavior',
    'Spam or fake content',
    'Harassment',
    'Violation of terms',
    'Technical issue'
  ];

  return Array.from({ length: count }, (_, index) => ({
    ...mockReport,
    _id: `report-${index + 1}`,
    targetType: types[index % types.length],
    targetId: `target-${index + 1}`,
    reason: reasons[index % reasons.length],
    status: statuses[index % statuses.length],
    actionNote: index % 2 === 0 ? `Additional note for report ${index + 1}` : '',
    createdAt: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toISOString(),
  }));
};



// Export all utilities
export default {
  ProvidersWrapper,
  mockUser,
  mockAdminUser,
  mockFacilityOwner,
  mockVenue,
  mockBooking,
  mockReport,
  mockApiResponse,
  mockApiError,
  createMockFetch,
  createMockStorage,
  generateTestVenues,
  generateTestBookings,
  generateTestUsers,
  generateTestReports,
};
