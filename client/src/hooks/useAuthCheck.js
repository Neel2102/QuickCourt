import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook to check authentication status on route changes
 * This ensures the auth state is always up-to-date when navigating
 */
export const useAuthCheck = () => {
  const location = useLocation();
  const { checkAuthStatus, loading } = useAuth();

  useEffect(() => {
    // Check auth status whenever the route changes
    if (!loading) {
      checkAuthStatus();
    }
  }, [location.pathname, checkAuthStatus, loading]);
};

export default useAuthCheck;
