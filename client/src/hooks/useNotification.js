import { useCallback } from 'react';
import { toast } from 'react-toastify';

export const useNotification = () => {
  // Success notification
  const showSuccess = useCallback((message, options = {}) => {
    toast.success(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });
  }, []);

  // Error notification
  const showError = useCallback((message, options = {}) => {
    toast.error(message, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });
  }, []);

  // Warning notification
  const showWarning = useCallback((message, options = {}) => {
    toast.warning(message, {
      position: 'top-right',
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });
  }, []);

  // Info notification
  const showInfo = useCallback((message, options = {}) => {
    toast.info(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });
  }, []);

  // Loading notification
  const showLoading = useCallback((message = 'Loading...', options = {}) => {
    return toast.loading(message, {
      position: 'top-right',
      closeOnClick: false,
      pauseOnHover: true,
      draggable: false,
      ...options,
    });
  }, []);

  // Update notification (for loading states)
  const updateNotification = useCallback((toastId, message, type = 'success', options = {}) => {
    toast.update(toastId, {
      render: message,
      type: type,
      isLoading: false,
      autoClose: type === 'error' ? 5000 : 3000,
      ...options,
    });
  }, []);

  // Dismiss notification
  const dismissNotification = useCallback((toastId) => {
    toast.dismiss(toastId);
  }, []);

  // Dismiss all notifications
  const dismissAll = useCallback(() => {
    toast.dismiss();
  }, []);

  // Custom notification with specific configuration
  const showCustom = useCallback((message, type = 'default', options = {}) => {
    toast(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      type: type,
      ...options,
    });
  }, []);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    updateNotification,
    dismissNotification,
    dismissAll,
    showCustom,
  };
};

export default useNotification; 
