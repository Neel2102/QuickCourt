import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from '../../components/common/Loading';
import '../../CSS/PaymentSuccess.css';

// Base API URL
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'failure'
  const [message, setMessage] = useState('Verifying your payment...');
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    const paymentIntentId = searchParams.get('payment_intent');
    const bookingId = searchParams.get('bookingId');
    
    if (!paymentIntentId || !bookingId) {
      setStatus('failure');
      setMessage('Invalid payment details. Please contact support.');
      return;
    }

    const confirmPayment = async () => {
      try {
        const response = await fetch(`${API_BASE}/bookings/confirm-payment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ paymentIntentId, bookingId }),
        });
        const data = await response.json();

        if (data.success) {
          setStatus('success');
          setMessage('Payment successful! Your booking is confirmed.');
          setBookingDetails(data.booking);
          toast.success('Your booking is confirmed!', { autoClose: 5000 });
        } else {
          setStatus('failure');
          setMessage(data.message || 'Payment failed. Your booking has been canceled.');
          toast.error(data.message || 'Payment failed.', { autoClose: 5000 });
        }
      } catch (error) {
        console.error('Error confirming payment:', error);
        setStatus('failure');
        setMessage('A server error occurred. Please contact support.');
        toast.error('A server error occurred.', { autoClose: 5000 });
      }
    };
    
    confirmPayment();
  }, [searchParams]);

  if (status === 'verifying') {
    return (
      <div className="payment-verifying">
        <Loading text={message} />
      </div>
    );
  }

  return (
    <div className="payment-result-container">
      {status === 'success' ? (
        <div className="success-content">
          <div className="success-icon">✅</div>
          <h1 className="success-title">Payment Successful!</h1>
          <p className="success-message">{message}</p>
          
          {bookingDetails && (
            <div className="booking-summary">
              <h3>Booking Details</h3>
              <div className="booking-info">
                <div className="info-row">
                  <span>Venue:</span>
                  <span>{bookingDetails.venue?.name || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span>Court:</span>
                  <span>{bookingDetails.court?.name || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span>Date:</span>
                  <span>{new Date(bookingDetails.date).toLocaleDateString()}</span>
                </div>
                <div className="info-row">
                  <span>Time:</span>
                  <span>{bookingDetails.startTime} - {bookingDetails.endTime}</span>
                </div>
                <div className="info-row">
                  <span>Amount:</span>
                  <span>₹{bookingDetails.totalPrice}</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="action-buttons">
            <button 
              className="primary-btn"
              onClick={() => navigate('/user-dashboard/my-bookings')}
            >
              View My Bookings
            </button>
            <button 
              className="secondary-btn"
              onClick={() => navigate('/venues')}
            >
              Book Another Court
            </button>
          </div>
          
          <div className="email-notice">
            <p>📧 A confirmation email has been sent to your registered email address.</p>
          </div>
        </div>
      ) : (
        <div className="failure-content">
          <div className="failure-icon">❌</div>
          <h1 className="failure-title">Payment Failed</h1>
          <p className="failure-message">{message}</p>
          
          <div className="action-buttons">
            <button 
              className="primary-btn"
              onClick={() => navigate('/venues')}
            >
              Try Booking Again
            </button>
            <button 
              className="secondary-btn"
              onClick={() => navigate('/user-dashboard')}
            >
              Go to Dashboard
            </button>
          </div>
          
          <div className="support-notice">
            <p>If you continue to experience issues, please contact our support team.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;