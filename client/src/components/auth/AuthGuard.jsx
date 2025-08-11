import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDashboardRoute, shouldRedirectAuthenticated } from '../../utils/authUtils';

/**
 * AuthGuard component that prevents authenticated users from accessing auth pages
 * and ensures proper redirects based on authentication state
 */
const AuthGuard = ({ children, redirectIfAuthenticated = false }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      const currentPath = location.pathname;
      
      // If user is authenticated and trying to access auth pages, redirect to dashboard
      if (isAuthenticated && user && redirectIfAuthenticated) {
        const dashboardRoute = getDashboardRoute(user.role);
        navigate(dashboardRoute, { replace: true });
        return;
      }
      
      // If user is authenticated and on landing page, redirect to dashboard
      if (isAuthenticated && user && shouldRedirectAuthenticated(currentPath)) {
        const dashboardRoute = getDashboardRoute(user.role);
        navigate(dashboardRoute, { replace: true });
        return;
      }
    }
  }, [isAuthenticated, user, loading, location.pathname, navigate, redirectIfAuthenticated]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If authenticated and should redirect, don't render children (redirect will happen)
  if (isAuthenticated && user && redirectIfAuthenticated) {
    return null;
  }

  // Render children
  return children;
};

export default AuthGuard;
