// Common, isomorphic utilities usable in both client and server

// Type checks
export const isDefined = (value) => value !== undefined && value !== null;
export const isNil = (value) => value === undefined || value === null;
export const isString = (value) => typeof value === 'string' || value instanceof String;
export const isNumber = (value) => typeof value === 'number' && Number.isFinite(value);
export const isBoolean = (value) => typeof value === 'boolean';
export const isArray = (value) => Array.isArray(value);
export const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
export const isDate = (value) => value instanceof Date && !Number.isNaN(value.getTime());

// Environment detection
export const isBrowserRuntime = () => typeof window !== 'undefined' && typeof document !== 'undefined';
export const isNodeRuntime = () => typeof process !== 'undefined' && !!(process.versions && process.versions.node);

// Safe JSON helpers
export const safeJsonParse = (input, fallback = null) => {
  try {
    return { ok: true, value: JSON.parse(input), error: null };
  } catch (error) {
    return { ok: false, value: fallback, error };
  }
};

export const safeJsonStringify = (input, fallback = '') => {
  try {
    return { ok: true, value: JSON.stringify(input), error: null };
  } catch (error) {
    return { ok: false, value: fallback, error };
  }
};

// String helpers
export const sanitizeString = (value) => (isString(value) ? value.replace(/\s+/g, ' ').trim() : value);
export const toSlug = (text) =>
  isString(text)
    ? text
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
    : '';

// Object helpers
export const deepClone = (obj) => {
  if (!isObject(obj) && !isArray(obj)) return obj;
  if (isDate(obj)) return new Date(obj.getTime());
  if (isArray(obj)) return obj.map((item) => deepClone(item));
  const cloned = {};
  for (const key of Object.keys(obj)) cloned[key] = deepClone(obj[key]);
  return cloned;
};

export const deepMerge = (target, source) => {
  if (!isObject(target) || !isObject(source)) return source;
  const output = { ...target };
  for (const key of Object.keys(source)) {
    const sourceValue = source[key];
    const targetValue = output[key];
    if (isObject(sourceValue)) {
      output[key] = deepMerge(isObject(targetValue) ? targetValue : {}, sourceValue);
    } else if (isArray(sourceValue)) {
      output[key] = isArray(targetValue) ? [...targetValue, ...sourceValue] : [...sourceValue];
    } else {
      output[key] = sourceValue;
    }
  }
  return output;
};

export const pick = (obj, keys) => {
  if (!isObject(obj)) return {};
  const result = {};
  for (const key of keys || []) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) result[key] = obj[key];
  }
  return result;
};

export const omit = (obj, keys) => {
  if (!isObject(obj)) return {};
  const keySet = new Set(keys || []);
  const result = {};
  for (const [k, v] of Object.entries(obj)) if (!keySet.has(k)) result[k] = v;
  return result;
};

export const isEmpty = (value) => {
  if (isNil(value)) return true;
  if (isString(value)) return value.trim().length === 0;
  if (isArray(value)) return value.length === 0;
  if (isObject(value)) return Object.keys(value).length === 0;
  return false;
};

// Numbers
export const clampNumber = (num, min, max) => {
  const n = Number(num);
  if (!Number.isFinite(n)) return min;
  return Math.min(Math.max(n, min), max);
};

export const toBooleanStrict = (value) => {
  if (isBoolean(value)) return value;
  if (isString(value)) {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes', 'y'].includes(normalized)) return true;
    if (['false', '0', 'no', 'n'].includes(normalized)) return false;
  }
  if (isNumber(value)) return value === 1;
  return false;
};

// Async helpers
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const retry = async (fn, options = {}) => {
  const { attempts = 3, delayMs = 500, backoffFactor = 2, onRetry = null } = options;
  let lastError = null;
  let currentDelay = delayMs;
  for (let i = 0; i < attempts; i++) {
    try {
      // eslint-disable-next-line no-await-in-loop
      return await fn();
    } catch (error) {
      lastError = error;
      if (typeof onRetry === 'function') onRetry({ attempt: i + 1, error });
      if (i < attempts - 1) {
        // eslint-disable-next-line no-await-in-loop
        await sleep(currentDelay);
        currentDelay *= backoffFactor;
      }
    }
  }
  throw lastError;
};

// ID generators (safe in both runtimes)
export const generateId = (length = 12) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  return result;
};

export const generateUUID = () => {
  // Prefer native if available
  try {
    // @ts-ignore runtime check only
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      // @ts-ignore
      return crypto.randomUUID();
    }
  } catch (_) {
    // ignore
  }
  // Fallback RFC4122 v4-ish
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Pagination helpers
export const normalizePagination = (page, limit, maxLimit = 100) => {
  const normalizedPage = Math.max(1, parseInt(page, 10) || 1);
  const normalizedLimit = clampNumber(parseInt(limit, 10) || 10, 1, maxLimit);
  const offset = (normalizedPage - 1) * normalizedLimit;
  return { page: normalizedPage, limit: normalizedLimit, offset };
};

export const buildPaginationMeta = ({ page, limit, total }) => {
  const totalPages = Math.max(1, Math.ceil((total || 0) / (limit || 1)));
  return {
    page,
    limit,
    total: total || 0,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

// Date helpers
export const toISODateString = (date) => {
  const d = isDate(date) ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString();
};

export const isValidDate = (value) => {
  const d = isDate(value) ? value : new Date(value);
  return !Number.isNaN(d.getTime());
};

// Error helpers
export const createError = (message, { code = 'UNKNOWN_ERROR', status = 500, details = null } = {}) => {
  const error = new Error(message);
  // @ts-ignore attach custom fields
  error.code = code;
  // @ts-ignore attach custom fields
  error.status = status;
  // @ts-ignore attach custom fields
  error.details = details;
  return error;
};

export const normalizeError = (err) => {
  if (!err) return { message: 'Unknown error', code: 'UNKNOWN_ERROR', status: 500, details: null };
  const message = err.message || String(err);
  const code = err.code || 'UNKNOWN_ERROR';
  const status = err.status || 500;
  const details = err.details || null;
  return { message, code, status, details };
};

export const isValidObjectId = (value) => isString(value) && /^[a-fA-F0-9]{24}$/.test(value);

export default {
  // Types
  isDefined,
  isNil,
  isString,
  isNumber,
  isBoolean,
  isArray,
  isObject,
  isDate,
  // Runtime
  isBrowserRuntime,
  isNodeRuntime,
  // JSON
  safeJsonParse,
  safeJsonStringify,
  // Strings
  sanitizeString,
  toSlug,
  // Objects
  deepClone,
  deepMerge,
  pick,
  omit,
  isEmpty,
  // Numbers
  clampNumber,
  toBooleanStrict,
  // Async
  sleep,
  retry,
  // IDs
  generateId,
  generateUUID,
  // Pagination
  normalizePagination,
  buildPaginationMeta,
  // Dates
  toISODateString,
  isValidDate,
  // Errors
  createError,
  normalizeError,
  isValidObjectId,
};

 
