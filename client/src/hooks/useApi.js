import { useState, useCallback } from 'react';
import { apiCall } from '../services/api';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (endpoint, options = {}) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall(endpoint, options);
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback((endpoint) => execute(endpoint, { method: 'GET' }), [execute]);
  const post = useCallback((endpoint, body) => execute(endpoint, { method: 'POST', body: JSON.stringify(body) }), [execute]);
  const put = useCallback((endpoint, body) => execute(endpoint, { method: 'PUT', body: JSON.stringify(body) }), [execute]);
  const del = useCallback((endpoint) => execute(endpoint, { method: 'DELETE' }), [execute]);
  const patch = useCallback((endpoint, body) => execute(endpoint, { method: 'PATCH', body: JSON.stringify(body) }), [execute]);

  const clearError = useCallback(() => setError(null), []);

  return {
    loading,
    error,
    execute,
    get,
    post,
    put,
    delete: del,
    patch,
    clearError,
  };
};

export default useApi; 
