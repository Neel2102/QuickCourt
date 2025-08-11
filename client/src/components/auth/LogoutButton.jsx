import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut } from 'lucide-react';

const LogoutButton = ({ className = '', showIcon = true, children }) => {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    
    // Show confirmation dialog
    const confirmed = window.confirm('Are you sure you want to logout?');
    
    if (confirmed) {
      try {
        await logout();
      } catch (error) {
        console.error('Logout error:', error);
        setIsLoggingOut(false);
      }
    } else {
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`logout-button ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.75rem 1rem',
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
        border: 'none',
        borderRadius: '0.5rem',
        color: 'white',
        cursor: isLoggingOut ? 'not-allowed' : 'pointer',
        fontSize: '0.9rem',
        fontWeight: '500',
        transition: 'all 0.3s ease',
        opacity: isLoggingOut ? 0.7 : 1,
        ...(!isLoggingOut && {
          ':hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(255, 107, 107, 0.4)'
          }
        })
      }}
      onMouseOver={(e) => {
        if (!isLoggingOut) {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 6px 20px rgba(255, 107, 107, 0.4)';
        }
      }}
      onMouseOut={(e) => {
        if (!isLoggingOut) {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = 'none';
        }
      }}
    >
      {showIcon && <LogOut size={18} />}
      {children || (isLoggingOut ? 'Logging out...' : 'Logout')}
    </button>
  );
};

export default LogoutButton;
