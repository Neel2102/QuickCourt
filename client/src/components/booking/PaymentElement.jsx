import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import Button from '../common/Button.jsx';

const CheckoutForm = ({ bookingId, totalPrice, onPaymentSuccess, onPaymentFailure }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Include bookingId in return URL for server-side confirmation page
        return_url: `${window.location.origin}/payment-success?bookingId=${encodeURIComponent(bookingId)}`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      onPaymentFailure(error.message);
      setLoading(false);
    } else {
      // Success path will redirect to return_url by Stripe
      onPaymentSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="payment-summary">
        <h3>Payment Summary</h3>
        <div className="payment-amount">
          <span>Total Amount:</span>
          <span className="amount">₹{totalPrice}</span>
        </div>
      </div>
      
      <PaymentElement />
      
      <div className="flex justify-end mt-4">
        <Button
          type="submit"
          loading={loading}
          disabled={!stripe || loading}
          fullWidth
        >
          {loading ? 'Processing...' : `Pay ₹${totalPrice}`}
        </Button>
      </div>
      
      {errorMessage && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 p-3 rounded">
          {errorMessage}
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-500">
        <p>🔒 Your payment is secured by Stripe</p>
        <p>You will be redirected to complete your payment</p>
      </div>
    </form>
  );
};

export default CheckoutForm;