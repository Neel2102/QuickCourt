import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

// Custom render function that includes providers
export const renderWithProviders = (ui, options = {}) => {
  const {
    route = '/',
    ...renderOptions
  } = options;

  window.history.pushState({}, 'Test page', route);

  const Wrapper = ({ children }) => (
    <BrowserRouter>
      {children}
      <ToastContainer />
    </BrowserRouter>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

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

// Mock fetch function
export const mockFetch = (response) => {
  return jest.fn().mockResolvedValue({
    ok: response.success !== false,
    status: response.status || 200,
    json: async () => response,
  });
};

// Mock localStorage
export const mockLocalStorage = () => {
  const store = {};
  
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
  };
};

// Mock sessionStorage
export const mockSessionStorage = () => {
  const store = {};
  
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
  };
};

// Mock window.matchMedia
export const mockMatchMedia = (matches = true) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

// Mock IntersectionObserver
export const mockIntersectionObserver = () => {
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mockIntersectionObserver;
};

// Mock ResizeObserver
export const mockResizeObserver = () => {
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
};

// Mock scrollTo
export const mockScrollTo = () => {
  window.scrollTo = jest.fn();
};

// Mock console methods
export const mockConsole = () => {
  const originalConsole = { ...console };
  
  beforeEach(() => {
    console.log = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
    console.info = jest.fn();
  });
  
  afterEach(() => {
    console.log = originalConsole.log;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
    console.info = originalConsole.info;
  });
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

// Custom matchers for testing
export const customMatchers = {
  toHaveBeenCalledWithMatch: (mock, expected) => {
    const calls = mock.mock.calls;
    const pass = calls.some(call => {
      try {
        expect(call).toEqual(expect.arrayContaining([expected]));
        return true;
      } catch {
        return false;
      }
    });
    
    if (pass) {
      return {
        message: () => `Expected mock to have been called with ${JSON.stringify(expected)}`,
        pass: true,
      };
    } else {
      return {
        message: () => `Expected mock to have been called with ${JSON.stringify(expected)}, but it was called with ${JSON.stringify(calls)}`,
        pass: false,
      };
    }
  },
};

// Setup function for common test configuration
export const setupTests = () => {
  beforeAll(() => {
    mockMatchMedia();
    mockIntersectionObserver();
    mockResizeObserver();
    mockScrollTo();
  });
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  afterEach(() => {
    jest.resetAllMocks();
  });
};

// Export all utilities
export default {
  renderWithProviders,
  mockUser,
  mockAdminUser,
  mockFacilityOwner,
  mockVenue,
  mockBooking,
  mockApiResponse,
  mockApiError,
  mockFetch,
  mockLocalStorage,
  mockSessionStorage,
  mockMatchMedia,
  mockIntersectionObserver,
  mockResizeObserver,
  mockScrollTo,
  mockConsole,
  generateTestVenues,
  generateTestBookings,
  generateTestUsers,
  customMatchers,
  setupTests,
}; 
