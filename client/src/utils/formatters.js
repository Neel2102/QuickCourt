import { CURRENCY, DATE_FORMATS } from './constants.js';

// Currency formatting
export const formatCurrency = (amount, currency = CURRENCY.CODE) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'N/A';
  }

  const numAmount = parseFloat(amount);
  
  if (currency === 'INR') {
    return `${CURRENCY.SYMBOL}${numAmount.toLocaleString('en-IN')}`;
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(numAmount);
};

// Number formatting
export const formatNumber = (number, options = {}) => {
  if (number === null || number === undefined || isNaN(number)) {
    return 'N/A';
  }

  const defaultOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  };

  return new Intl.NumberFormat('en-IN', defaultOptions).format(number);
};

// Percentage formatting
export const formatPercentage = (value, total, options = {}) => {
  if (value === null || value === undefined || total === null || total === undefined) {
    return '0%';
  }

  const percentage = (value / total) * 100;
  const defaultOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
    ...options,
  };

  return `${new Intl.NumberFormat('en-IN', defaultOptions).format(percentage)}%`;
};

// Phone number formatting
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return 'N/A';
  
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  
  return phoneNumber;
};

// File size formatting
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Text truncation
export const truncateText = (text, maxLength = 100, suffix = '...') => {
  if (!text || text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength - suffix.length) + suffix;
};

// Capitalize first letter
export const capitalizeFirst = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Title case formatting
export const toTitleCase = (text) => {
  if (!text) return '';
  
  return text.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

// Slug generation
export const generateSlug = (text) => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Credit card masking
export const maskCreditCard = (cardNumber, maskChar = '*') => {
  if (!cardNumber) return '';
  
  const cleaned = cardNumber.replace(/\D/g, '');
  const lastFour = cleaned.slice(-4);
  const masked = maskChar.repeat(Math.max(0, cleaned.length - 4));
  
  return masked + lastFour;
};

// Address formatting
export const formatAddress = (address) => {
  if (!address) return 'N/A';
  
  const parts = [];
  
  if (address.street) parts.push(address.street);
  if (address.city) parts.push(address.city);
  if (address.state) parts.push(address.state);
  if (address.pincode) parts.push(address.pincode);
  
  return parts.length > 0 ? parts.join(', ') : 'N/A';
};

// Rating formatting
export const formatRating = (rating, maxRating = 5) => {
  if (rating === null || rating === undefined || isNaN(rating)) {
    return 'No rating';
  }
  
  const numRating = parseFloat(rating);
  const stars = '⭐'.repeat(Math.floor(numRating));
  const halfStar = numRating % 1 >= 0.5 ? '⭐' : '';
  
  return `${stars}${halfStar} ${numRating.toFixed(1)}/${maxRating}`;
};

// Time formatting
export const formatTime = (time, format = '12h') => {
  if (!time) return 'N/A';
  
  try {
    const [hours, minutes] = time.split(':').map(Number);
    
    if (format === '12h') {
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    } else {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
  } catch (error) {
    return time;
  }
};

// Duration formatting
export const formatDuration = (minutes) => {
  if (!minutes || isNaN(minutes)) return 'N/A';
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) {
    return `${remainingMinutes}m`;
  } else if (remainingMinutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${remainingMinutes}m`;
  }
};

// Social media link formatting
export const formatSocialLink = (platform, username) => {
  if (!platform || !username) return '';
  
  const platforms = {
    facebook: 'https://facebook.com/',
    twitter: 'https://twitter.com/',
    instagram: 'https://instagram.com/',
    linkedin: 'https://linkedin.com/in/',
    youtube: 'https://youtube.com/',
  };
  
  const baseUrl = platforms[platform.toLowerCase()];
  return baseUrl ? baseUrl + username : username;
};

// Email masking
export const maskEmail = (email, maskChar = '*') => {
  if (!email || !email.includes('@')) return email;
  
  const [localPart, domain] = email.split('@');
  const maskedLocal = localPart.charAt(0) + maskChar.repeat(localPart.length - 2) + localPart.charAt(localPart.length - 1);
  
  return `${maskedLocal}@${domain}`;
};

export default {
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatPhoneNumber,
  formatFileSize,
  truncateText,
  capitalizeFirst,
  toTitleCase,
  generateSlug,
  maskCreditCard,
  formatAddress,
  formatRating,
  formatTime,
  formatDuration,
  formatSocialLink,
  maskEmail,
}; 
