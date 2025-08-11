import React from 'react';
import { Calendar, Clock, MapPin, DollarSign, User, Building, X, CheckCircle, AlertCircle } from 'lucide-react';

const BookingCard = ({ booking, onCancel, onViewDetails, showActions = true }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'Cancelled':
        return <X className="w-4 h-4" />;
      case 'Completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const canCancel = () => {
    const bookingDate = new Date(booking.date);
    const now = new Date();
    const timeDiff = bookingDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    // Can cancel if booking is more than 2 hours away
    return booking.status === 'Confirmed' && hoursDiff > 2;
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      {/* Header with Status */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {booking.court?.name || 'Court'}
          </h3>
          <p className="text-sm text-gray-600">
            {booking.venue?.name || 'Venue'}
          </p>
        </div>
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
          {getStatusIcon(booking.status)}
          <span>{booking.status}</span>
        </div>
      </div>

      {/* Booking Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-3">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-700">
            {formatDate(booking.date)}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-700">
            {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-700">
            {booking.venue?.address || 'Address not available'}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-800">
            ${booking.totalPrice}
          </span>
        </div>

        {booking.user && (
          <div className="flex items-center space-x-3">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-700">
              Booked by: {booking.user.name}
            </span>
          </div>
        )}
      </div>

      {/* Sport Type Badge */}
      {booking.court?.sportType && (
        <div className="mb-4">
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
            <Building className="w-3 h-3 mr-1" />
            {booking.court.sportType}
          </span>
        </div>
      )}

      {/* Action Buttons */}
      {showActions && (
        <div className="flex space-x-2 pt-4 border-t border-gray-200">
          <button
            onClick={() => onViewDetails && onViewDetails(booking)}
            className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
          >
            View Details
          </button>
          
          {canCancel() && (
            <button
              onClick={() => onCancel && onCancel(booking._id)}
              className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      )}

      {/* Cancellation Notice */}
      {!canCancel() && booking.status === 'Confirmed' && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-xs text-yellow-700">
            ⚠️ Cancellation must be made at least 2 hours before the booking time.
          </p>
        </div>
      )}
    </div>
  );
};

export default BookingCard; 
