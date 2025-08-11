import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { createBooking, cancelBooking, getMyBookings } from '../services/bookingService';

export const useBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user's bookings
  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMyBookings();
      setBookings(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch bookings');
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new booking
  const bookCourt = useCallback(async (bookingData) => {
    try {
      setLoading(true);
      setError(null);
      const newBooking = await createBooking(bookingData);
      setBookings(prev => [newBooking, ...prev]);
      toast.success('Booking created successfully!');
      return newBooking;
    } catch (err) {
      setError(err.message || 'Failed to create booking');
      toast.error('Failed to create booking');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Cancel a booking
  const cancelUserBooking = useCallback(async (bookingId) => {
    try {
      setLoading(true);
      setError(null);
      await cancelBooking(bookingId);
      setBookings(prev => prev.filter(booking => booking._id !== bookingId));
      toast.success('Booking cancelled successfully');
    } catch (err) {
      setError(err.message || 'Failed to cancel booking');
      toast.error('Failed to cancel booking');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get upcoming bookings
  const getUpcomingBookings = useCallback(() => {
    const now = new Date();
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      return bookingDate >= now && booking.status !== 'Cancelled';
    });
  }, [bookings]);

  // Get past bookings
  const getPastBookings = useCallback(() => {
    const now = new Date();
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      return bookingDate < now || booking.status === 'Cancelled';
    });
  }, [bookings]);

  // Get bookings by status
  const getBookingsByStatus = useCallback((status) => {
    return bookings.filter(booking => booking.status === status);
  }, [bookings]);

  // Get bookings by date range
  const getBookingsByDateRange = useCallback((startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      return bookingDate >= start && bookingDate <= end;
    });
  }, [bookings]);

  // Clear error
  const clearError = useCallback(() => setError(null), []);

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    bookCourt,
    cancelUserBooking,
    getUpcomingBookings,
    getPastBookings,
    getBookingsByStatus,
    getBookingsByDateRange,
    clearError,
  };
};

export default useBooking; 
