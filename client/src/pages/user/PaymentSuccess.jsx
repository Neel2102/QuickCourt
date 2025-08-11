import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from '../../components/common/Loading';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'failure'
  const [message, setMessage] = useState('Verifying your payment...');

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
        const response = await fetch('/api/bookings/confirm-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ paymentIntentId, bookingId }),
        });
        const data = await response.json();

        if (data.success) {
          setStatus('success');
          setMessage('Payment successful! Your booking is confirmed.');
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
    return <Loading text={message} />;
  }

  return (
    <div className="payment-result-container">
      {status === 'success' ? (
        <>
          <h1 className="text-green-600">✅ Success</h1>
          <p>{message}</p>
          <button onClick={() => navigate('/user-dashboard/my-bookings')}>View My Bookings</button>
        </>
      ) : (
        <>
          <h1 className="text-red-600">❌ Payment Failed</h1>
          <p>{message}</p>
          <button onClick={() => navigate('/venues')}>Try Booking Again</button>
        </>
      )}
    </div>
  );
};

export default PaymentSuccess;