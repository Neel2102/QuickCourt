// Storage utilities for localStorage and sessionStorage

// Local Storage utilities
export const localStorage = {
  // Set item in localStorage
  set: (key, value) => {
    try {
      const serializedValue = JSON.stringify(value);
      window.localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error('Error setting localStorage item:', error);
      return false;
    }
  },

  // Get item from localStorage
  get: (key, defaultValue = null) => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error getting localStorage item:', error);
      return defaultValue;
    }
  },

  // Remove item from localStorage
  remove: (key) => {
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing localStorage item:', error);
      return false;
    }
  },

  // Check if item exists in localStorage
  has: (key) => {
    try {
      return window.localStorage.getItem(key) !== null;
    } catch (error) {
      console.error('Error checking localStorage item:', error);
      return false;
    }
  },

  // Get all keys from localStorage
  keys: () => {
    try {
      return Object.keys(window.localStorage);
    } catch (error) {
      console.error('Error getting localStorage keys:', error);
      return [];
    }
  },

  // Clear all localStorage
  clear: () => {
    try {
      window.localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },

  // Get localStorage size
  size: () => {
    try {
      return window.localStorage.length;
    } catch (error) {
      console.error('Error getting localStorage size:', error);
      return 0;
    }
  },

  // Get localStorage usage in bytes
  usage: () => {
    try {
      let total = 0;
      for (const key in window.localStorage) {
        if (window.localStorage.hasOwnProperty(key)) {
          total += window.localStorage[key].length + key.length;
        }
      }
      return total;
    } catch (error) {
      console.error('Error calculating localStorage usage:', error);
      return 0;
    }
  },
};

// Session Storage utilities
export const sessionStorage = {
  // Set item in sessionStorage
  set: (key, value) => {
    try {
      const serializedValue = JSON.stringify(value);
      window.sessionStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error('Error setting sessionStorage item:', error);
      return false;
    }
  },

  // Get item from sessionStorage
  get: (key, defaultValue = null) => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.stringify(item) : defaultValue;
    } catch (error) {
      console.error('Error getting sessionStorage item:', error);
      return defaultValue;
    }
  },

  // Remove item from sessionStorage
  remove: (key) => {
    try {
      window.sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing sessionStorage item:', error);
      return false;
    }
  },

  // Check if item exists in sessionStorage
  has: (key) => {
    try {
      return window.sessionStorage.getItem(key) !== null;
    } catch (error) {
      console.error('Error checking sessionStorage item:', error);
      return false;
    }
  },

  // Get all keys from sessionStorage
  keys: () => {
    try {
      return Object.keys(window.sessionStorage);
    } catch (error) {
      console.error('Error getting sessionStorage keys:', error);
      return [];
    }
  },

  // Clear all sessionStorage
  clear: () => {
    try {
      window.sessionStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
      return false;
    }
  },

  // Get sessionStorage size
  size: () => {
    try {
      return window.sessionStorage.length;
    } catch (error) {
      console.error('Error getting sessionStorage size:', error);
      return 0;
    }
  },
};

// Cookie utilities
export const cookies = {
  // Set cookie
  set: (name, value, options = {}) => {
    try {
      const {
        expires = 7, // days
        path = '/',
        domain = '',
        secure = false,
        sameSite = 'Lax'
      } = options;

      let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

      if (expires) {
        const date = new Date();
        date.setTime(date.getTime() + (expires * 24 * 60 * 60 * 1000));
        cookieString += `; expires=${date.toUTCString()}`;
      }

      if (path) cookieString += `; path=${path}`;
      if (domain) cookieString += `; domain=${domain}`;
      if (secure) cookieString += '; secure';
      if (sameSite) cookieString += `; samesite=${sameSite}`;

      document.cookie = cookieString;
      return true;
    } catch (error) {
      console.error('Error setting cookie:', error);
      return false;
    }
  },

  // Get cookie
  get: (name) => {
    try {
      const nameEQ = encodeURIComponent(name) + '=';
      const ca = document.cookie.split(';');
      
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) {
          return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
      }
      return null;
    } catch (error) {
      console.error('Error getting cookie:', error);
      return null;
    }
  },

  // Remove cookie
  remove: (name, options = {}) => {
    try {
      const { path = '/', domain = '' } = options;
      let cookieString = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      
      if (path) cookieString += `; path=${path}`;
      if (domain) cookieString += `; domain=${domain}`;
      
      document.cookie = cookieString;
      return true;
    } catch (error) {
      console.error('Error removing cookie:', error);
      return false;
    }
  },

  // Check if cookie exists
  has: (name) => {
    return cookies.get(name) !== null;
  },

  // Get all cookies
  getAll: () => {
    try {
      const cookiesObj = {};
      const ca = document.cookie.split(';');
      
      for (let i = 0; i < ca.length; i++) {
        const c = ca[i].trim();
        if (c) {
          const [name, value] = c.split('=');
          if (name && value) {
            cookiesObj[decodeURIComponent(name)] = decodeURIComponent(value);
          }
        }
      }
      
      return cookiesObj;
    } catch (error) {
      console.error('Error getting all cookies:', error);
      return {};
    }
  },
};

// Cache utilities
export const cache = {
  // In-memory cache
  memory: new Map(),

  // Set cache item
  set: (key, value, ttl = 300000) => { // default 5 minutes
    try {
      const item = {
        value,
        timestamp: Date.now(),
        ttl,
      };
      cache.memory.set(key, item);
      return true;
    } catch (error) {
      console.error('Error setting cache item:', error);
      return false;
    }
  },

  // Get cache item
  get: (key) => {
    try {
      const item = cache.memory.get(key);
      if (!item) return null;

      const now = Date.now();
      if (now - item.timestamp > item.ttl) {
        cache.memory.delete(key);
        return null;
      }

      return item.value;
    } catch (error) {
      console.error('Error getting cache item:', error);
      return null;
    }
  },

  // Remove cache item
  remove: (key) => {
    try {
      return cache.memory.delete(key);
    } catch (error) {
      console.error('Error removing cache item:', error);
      return false;
    }
  },

  // Check if cache item exists
  has: (key) => {
    try {
      const item = cache.memory.get(key);
      if (!item) return false;

      const now = Date.now();
      if (now - item.timestamp > item.ttl) {
        cache.memory.delete(key);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking cache item:', error);
      return false;
    }
  },

  // Clear all cache
  clear: () => {
    try {
      cache.memory.clear();
      return true;
    } catch (error) {
      console.error('Error clearing cache:', error);
      return false;
    }
  },

  // Get cache size
  size: () => {
    try {
      return cache.memory.size;
    } catch (error) {
      console.error('Error getting cache size:', error);
      return 0;
    }
  },

  // Clean expired cache items
  cleanup: () => {
    try {
      const now = Date.now();
      let cleanedCount = 0;

      for (const [key, item] of cache.memory.entries()) {
        if (now - item.timestamp > item.ttl) {
          cache.memory.delete(key);
          cleanedCount++;
        }
      }

      return cleanedCount;
    } catch (error) {
      console.error('Error cleaning cache:', error);
      return 0;
    }
  },
};

// Storage event listener
export const addStorageListener = (callback) => {
  try {
    const handleStorageChange = (event) => {
      if (event.storageArea === window.localStorage) {
        callback('localStorage', event.key, event.newValue, event.oldValue);
      } else if (event.storageArea === window.sessionStorage) {
        callback('sessionStorage', event.key, event.newValue, event.oldValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Return cleanup function
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  } catch (error) {
    console.error('Error adding storage listener:', error);
    return () => {};
  }
};

// Export default object with all utilities
export default {
  localStorage,
  sessionStorage,
  cookies,
  cache,
  addStorageListener,
}; 
