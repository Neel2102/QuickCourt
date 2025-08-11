// Validation schemas and helpers shared across client and server
// These are lightweight, dependency-free validators that operate on plain objects

import { USER_ROLES } from '../constants/roles.js';
import { SPORT_TYPES } from '../constants/sports.js';
import { BOOKING_STATUS, PAYMENT_STATUS } from '../constants/status.js';
import { isValidObjectId, isString, isNumber, isArray, isObject, isNil } from './common.utils.js';

// Primitive validators
const required = (value) => !isNil(value) && !(typeof value === 'string' && value.trim() === '');
const isEmail = (value) => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const minLength = (value, min) => isString(value) && value.trim().length >= min;
const maxLength = (value, max) => isString(value) && value.trim().length <= max;
const inEnum = (value, allowed) => allowed.includes(value);
const isPositive = (value) => isNumber(value) && value > 0;
const isNonNegative = (value) => isNumber(value) && value >= 0;
const isTimeHHMM = (value) => typeof value === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
const isDateISO = (value) => {
  const d = new Date(value);
  return !Number.isNaN(d.getTime());
};

// Schema runner
export const validateWithSchema = (data, schema) => {
  const errors = {};
  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];
    for (const rule of rules) {
      const { check, message } = rule;
      let ok = true;
      try {
        ok = check(value, data);
      } catch (_) {
        ok = false;
      }
      if (!ok) {
        if (!errors[field]) errors[field] = [];
        errors[field].push(message);
      }
    }
  }
  return { isValid: Object.keys(errors).length === 0, errors };
};

// Common schemas
export const userRegistrationSchema = {
  name: [
    { check: (v) => required(v), message: 'Name is required' },
    { check: (v) => minLength(v, 2), message: 'Name must be at least 2 characters' },
    { check: (v) => maxLength(v, 50), message: 'Name must be at most 50 characters' },
  ],
  email: [
    { check: (v) => required(v), message: 'Email is required' },
    { check: (v) => isEmail(v), message: 'Email must be valid' },
  ],
  password: [
    { check: (v) => required(v), message: 'Password is required' },
    { check: (v) => isString(v) && v.length >= 8, message: 'Password must be at least 8 characters' },
  ],
  role: [
    { check: (v) => required(v), message: 'Role is required' },
    { check: (v) => inEnum(v, Object.values(USER_ROLES)), message: 'Invalid role' },
  ],
};

export const loginSchema = {
  email: [
    { check: (v) => required(v), message: 'Email is required' },
    { check: (v) => isEmail(v), message: 'Email must be valid' },
  ],
  password: [{ check: (v) => required(v), message: 'Password is required' }],
};

export const venueSchema = {
  name: [
    { check: (v) => required(v), message: 'Venue name is required' },
    { check: (v) => minLength(v, 2), message: 'Venue name must be at least 2 characters' },
  ],
  address: [{ check: (v) => isObject(v), message: 'Address must be an object' }],
  'address.city': [{ check: (_, d) => required(d?.address?.city), message: 'City is required' }],
  'address.state': [{ check: (_, d) => required(d?.address?.state), message: 'State is required' }],
  'address.pincode': [
    { check: (_, d) => required(d?.address?.pincode), message: 'Pincode is required' },
    { check: (_, d) => /^\d{6}$/.test(String(d?.address?.pincode || '')), message: 'Pincode must be 6 digits' },
  ],
  contact: [{ check: (v) => isObject(v), message: 'Contact must be an object' }],
  'contact.email': [
    { check: (_, d) => isNil(d?.contact?.email) || isEmail(d?.contact?.email), message: 'Contact email must be valid' },
  ],
  'contact.phone': [
    { check: (_, d) => isNil(d?.contact?.phone) || /^[6-9]\d{9}$/.test(String(d?.contact?.phone || '').replace(/\D/g, '')), message: 'Contact phone must be valid' },
  ],
  operatingHours: [{ check: (v) => isObject(v), message: 'Operating hours must be an object' }],
  'operatingHours.start': [
    { check: (_, d) => isTimeHHMM(d?.operatingHours?.start), message: 'Start time must be HH:MM' },
  ],
  'operatingHours.end': [
    { check: (_, d) => isTimeHHMM(d?.operatingHours?.end), message: 'End time must be HH:MM' },
  ],
};

export const courtSchema = {
  venueId: [
    { check: (v) => required(v), message: 'Venue ID is required' },
    { check: (v) => isValidObjectId(v), message: 'Venue ID must be a valid ObjectId' },
  ],
  name: [
    { check: (v) => required(v), message: 'Court name is required' },
    { check: (v) => minLength(v, 2), message: 'Court name must be at least 2 characters' },
  ],
  sportType: [
    { check: (v) => required(v), message: 'Sport type is required' },
    { check: (v) => inEnum(v, Object.values(SPORT_TYPES)), message: 'Invalid sport type' },
  ],
  pricePerHour: [
    { check: (v) => isPositive(Number(v)), message: 'Price per hour must be > 0' },
  ],
  operatingHours: [{ check: (v) => isObject(v), message: 'Operating hours must be an object' }],
  'operatingHours.start': [
    { check: (_, d) => isTimeHHMM(d?.operatingHours?.start), message: 'Start time must be HH:MM' },
  ],
  'operatingHours.end': [
    { check: (_, d) => isTimeHHMM(d?.operatingHours?.end), message: 'End time must be HH:MM' },
  ],
};

export const bookingSchema = {
  venueId: [
    { check: (v) => required(v), message: 'Venue ID is required' },
    { check: (v) => isValidObjectId(v), message: 'Venue ID must be a valid ObjectId' },
  ],
  courtId: [
    { check: (v) => required(v), message: 'Court ID is required' },
    { check: (v) => isValidObjectId(v), message: 'Court ID must be a valid ObjectId' },
  ],
  userId: [
    { check: (v) => required(v), message: 'User ID is required' },
    { check: (v) => isValidObjectId(v), message: 'User ID must be a valid ObjectId' },
  ],
  date: [
    { check: (v) => required(v), message: 'Date is required' },
    { check: (v) => isDateISO(v), message: 'Date must be valid' },
  ],
  startTime: [
    { check: (v) => required(v), message: 'Start time is required' },
    { check: (v) => isTimeHHMM(v), message: 'Start time must be HH:MM' },
  ],
  endTime: [
    { check: (v) => required(v), message: 'End time is required' },
    { check: (v) => isTimeHHMM(v), message: 'End time must be HH:MM' },
    {
      check: (_, d) => {
        if (!isTimeHHMM(d.startTime) || !isTimeHHMM(d.endTime)) return false;
        const s = d.startTime.split(':').map(Number);
        const e = d.endTime.split(':').map(Number);
        const sMin = s[0] * 60 + s[1];
        const eMin = e[0] * 60 + e[1];
        return eMin > sMin;
      },
      message: 'End time must be after start time',
    },
  ],
  additionalServices: [
    { check: (v) => isNil(v) || isArray(v), message: 'Additional services must be an array' },
  ],
  status: [
    { check: (v) => isNil(v) || inEnum(v, Object.values(BOOKING_STATUS)), message: 'Invalid booking status' },
  ],
  paymentStatus: [
    { check: (v) => isNil(v) || inEnum(v, Object.values(PAYMENT_STATUS)), message: 'Invalid payment status' },
  ],
};

export const reviewSchema = {
  venueId: [
    { check: (v) => required(v), message: 'Venue ID is required' },
    { check: (v) => isValidObjectId(v), message: 'Venue ID must be valid' },
  ],
  userId: [
    { check: (v) => required(v), message: 'User ID is required' },
    { check: (v) => isValidObjectId(v), message: 'User ID must be valid' },
  ],
  rating: [
    { check: (v) => isNumber(Number(v)), message: 'Rating must be a number' },
    { check: (v) => Number(v) >= 1 && Number(v) <= 5, message: 'Rating must be between 1 and 5' },
  ],
  comment: [
    { check: (v) => isNil(v) || isString(v), message: 'Comment must be a string' },
    { check: (v) => isNil(v) || maxLength(v, 500), message: 'Comment must be at most 500 characters' },
  ],
};

// Utility to expand dot-path schema keys so validateWithSchema can resolve nested fields
export const expandDotPathSchema = (schema) => {
  const expanded = {};
  for (const [key, rules] of Object.entries(schema)) {
    if (!key.includes('.')) {
      expanded[key] = rules;
      continue;
    }
    // Wrap to access nested path within check
    expanded[key] = rules.map((r) => ({
      message: r.message,
      check: (_, data) => r.check(undefined, data),
    }));
  }
  return expanded;
};

export default {
  validateWithSchema,
  userRegistrationSchema,
  loginSchema,
  venueSchema,
  courtSchema,
  bookingSchema,
  reviewSchema,
  expandDotPathSchema,
};

 
