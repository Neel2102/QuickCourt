// Common validation functions

// Email validation
export const validateEmail = (email) => {
  if (!email) return { isValid: false, message: 'Email is required' };
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);
  
  return {
    isValid,
    message: isValid ? '' : 'Please enter a valid email address'
  };
};

// Password validation
export const validatePassword = (password, options = {}) => {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = false
  } = options;

  if (!password) return { isValid: false, message: 'Password is required' };
  
  const errors = [];
  
  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }
  
  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    message: errors.join(', '),
    errors
  };
};

// Phone number validation (Indian format)
export const validatePhoneNumber = (phone) => {
  if (!phone) return { isValid: false, message: 'Phone number is required' };
  
  const cleaned = phone.replace(/\D/g, '');
  const phoneRegex = /^[6-9]\d{9}$/;
  const isValid = phoneRegex.test(cleaned);
  
  return {
    isValid,
    message: isValid ? '' : 'Please enter a valid 10-digit phone number starting with 6-9',
    cleaned: isValid ? cleaned : phone
  };
};

// Name validation
export const validateName = (name, options = {}) => {
  const { minLength = 2, maxLength = 50, allowNumbers = false } = options;
  
  if (!name) return { isValid: false, message: 'Name is required' };
  
  const trimmedName = name.trim();
  
  if (trimmedName.length < minLength) {
    return { isValid: false, message: `Name must be at least ${minLength} characters long` };
  }
  
  if (trimmedName.length > maxLength) {
    return { isValid: false, message: `Name must be less than ${maxLength} characters` };
  }
  
  if (!allowNumbers && /\d/.test(trimmedName)) {
    return { isValid: false, message: 'Name cannot contain numbers' };
  }
  
  const nameRegex = /^[a-zA-Z\s]+$/;
  if (!nameRegex.test(trimmedName)) {
    return { isValid: false, message: 'Name can only contain letters and spaces' };
  }
  
  return { isValid: true, message: '', cleaned: trimmedName };
};

// URL validation
export const validateUrl = (url) => {
  if (!url) return { isValid: false, message: 'URL is required' };
  
  try {
    new URL(url);
    return { isValid: true, message: '' };
  } catch {
    return { isValid: false, message: 'Please enter a valid URL' };
  }
};

// Required field validation
export const validateRequired = (value, fieldName = 'Field') => {
  if (value === null || value === undefined) {
    return { isValid: false, message: `${fieldName} is required` };
  }
  
  if (typeof value === 'string' && value.trim().length === 0) {
    return { isValid: false, message: `${fieldName} is required` };
  }
  
  if (Array.isArray(value) && value.length === 0) {
    return { isValid: false, message: `${fieldName} is required` };
  }
  
  return { isValid: true, message: '' };
};

// Length validation
export const validateLength = (value, options = {}) => {
  const { min, max, fieldName = 'Field' } = options;
  
  if (value === null || value === undefined) {
    return { isValid: false, message: `${fieldName} is required` };
  }
  
  const length = typeof value === 'string' ? value.length : value.toString().length;
  
  if (min !== undefined && length < min) {
    return { isValid: false, message: `${fieldName} must be at least ${min} characters long` };
  }
  
  if (max !== undefined && length > max) {
    return { isValid: false, message: `${fieldName} must be less than ${max} characters` };
  }
  
  return { isValid: true, message: '' };
};

// Number validation
export const validateNumber = (value, options = {}) => {
  const { min, max, fieldName = 'Field' } = options;
  
  if (value === null || value === undefined) {
    return { isValid: false, message: `${fieldName} is required` };
  }
  
  const num = parseFloat(value);
  
  if (isNaN(num)) {
    return { isValid: false, message: `${fieldName} must be a valid number` };
  }
  
  if (min !== undefined && num < min) {
    return { isValid: false, message: `${fieldName} must be at least ${min}` };
  }
  
  if (max !== undefined && num > max) {
    return { isValid: false, message: `${fieldName} must be less than or equal to ${max}` };
  }
  
  return { isValid: true, message: '', value: num };
};

// Date validation
export const validateDate = (date, options = {}) => {
  const { minDate, maxDate, fieldName = 'Field' } = options;
  
  if (!date) return { isValid: false, message: `${fieldName} is required` };
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return { isValid: false, message: `${fieldName} must be a valid date` };
  }
  
  if (minDate) {
    const minDateObj = new Date(minDate);
    if (dateObj < minDateObj) {
      return { isValid: false, message: `${fieldName} must be after ${minDateObj.toLocaleDateString()}` };
    }
  }
  
  if (maxDate) {
    const maxDateObj = new Date(maxDate);
    if (dateObj > maxDateObj) {
      return { isValid: false, message: `${fieldName} must be before ${maxDateObj.toLocaleDateString()}` };
    }
  }
  
  return { isValid: true, message: '', value: dateObj };
};

// File validation
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB
    allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'],
    fieldName = 'File'
  } = options;
  
  if (!file) return { isValid: false, message: `${fieldName} is required` };
  
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
    return { isValid: false, message: `${fieldName} size must be less than ${maxSizeMB}MB` };
  }
  
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    const allowedExtensions = allowedTypes.map(type => type.split('/')[1]).join(', ');
    return { isValid: false, message: `${fieldName} type must be: ${allowedExtensions}` };
  }
  
  return { isValid: true, message: '' };
};

// Array validation
export const validateArray = (array, options = {}) => {
  const { minLength, maxLength, fieldName = 'Field' } = options;
  
  if (!Array.isArray(array)) {
    return { isValid: false, message: `${fieldName} must be an array` };
  }
  
  if (minLength !== undefined && array.length < minLength) {
    return { isValid: false, message: `${fieldName} must have at least ${minLength} items` };
  }
  
  if (maxLength !== undefined && array.length > maxLength) {
    return { isValid: false, message: `${fieldName} must have less than ${maxLength} items` };
  }
  
  return { isValid: true, message: '' };
};

// Object validation
export const validateObject = (obj, requiredFields = [], fieldName = 'Object') => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return { isValid: false, message: `${fieldName} must be an object` };
  }
  
  const missingFields = [];
  
  for (const field of requiredFields) {
    if (!obj.hasOwnProperty(field) || obj[field] === null || obj[field] === undefined) {
      missingFields.push(field);
    }
  }
  
  if (missingFields.length > 0) {
    return { 
      isValid: false, 
      message: `${fieldName} is missing required fields: ${missingFields.join(', ')}` 
    };
  }
  
  return { isValid: true, message: '' };
};

// Credit card validation (Luhn algorithm)
export const validateCreditCard = (cardNumber) => {
  if (!cardNumber) return { isValid: false, message: 'Card number is required' };
  
  const cleaned = cardNumber.replace(/\D/g, '');
  
  if (cleaned.length < 13 || cleaned.length > 19) {
    return { isValid: false, message: 'Card number must be between 13 and 19 digits' };
  }
  
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i));
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  const isValid = sum % 10 === 0;
  
  return {
    isValid,
    message: isValid ? '' : 'Invalid card number',
    cleaned: isValid ? cleaned : cardNumber
  };
};

// Form validation helper
export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;
  
  for (const [field, rules] of Object.entries(validationRules)) {
    const value = formData[field];
    const fieldErrors = [];
    
    for (const rule of rules) {
      let validationResult;
      
      switch (rule.type) {
        case 'required':
          validationResult = validateRequired(value, rule.fieldName || field);
          break;
        case 'email':
          validationResult = validateEmail(value);
          break;
        case 'password':
          validationResult = validatePassword(value, rule.options);
          break;
        case 'phone':
          validationResult = validatePhoneNumber(value);
          break;
        case 'name':
          validationResult = validateName(value, rule.options);
          break;
        case 'url':
          validationResult = validateUrl(value);
          break;
        case 'length':
          validationResult = validateLength(value, { ...rule.options, fieldName: rule.fieldName || field });
          break;
        case 'number':
          validationResult = validateNumber(value, { ...rule.options, fieldName: rule.fieldName || field });
          break;
        case 'date':
          validationResult = validateDate(value, { ...rule.options, fieldName: rule.fieldName || field });
          break;
        case 'file':
          validationResult = validateFile(value, { ...rule.options, fieldName: rule.fieldName || field });
          break;
        case 'array':
          validationResult = validateArray(value, { ...rule.options, fieldName: rule.fieldName || field });
          break;
        case 'object':
          validationResult = validateObject(value, rule.requiredFields, rule.fieldName || field);
          break;
        case 'custom':
          validationResult = rule.validator(value, formData);
          break;
        default:
          break;
      }
      
      if (validationResult && !validationResult.isValid) {
        fieldErrors.push(validationResult.message);
        isValid = false;
      }
    }
    
    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors;
    }
  }
  
  return { isValid, errors };
};

export default {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validateName,
  validateUrl,
  validateRequired,
  validateLength,
  validateNumber,
  validateDate,
  validateFile,
  validateArray,
  validateObject,
  validateCreditCard,
  validateForm,
}; 
