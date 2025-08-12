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
        return_url: `${window.location.origin}/booking-success?bookingId=${encodeURIComponent(bookingId)}`,
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
      <PaymentElement />
      
      <div className="payment-button-container">
        <Button
          type="submit"
          variant="payment"
          loading={loading}
          disabled={!stripe || loading}
          fullWidth
        >
          {loading ? 'Processing...' : `Pay ₹${totalPrice}`}
        </Button>
      </div>
      
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}
      
      <div className="payment-info">
        <p>🔒 Your payment is secured by Stripe</p>
        <p>You will be redirected to complete your payment</p>
      </div>

      {/* Test Card Information */}
      <div className="test-card-info">
        <h4>💳 Test Card Numbers</h4>
        <div className="test-cards">
          <p><strong>Visa:</strong> 4242 4242 4242 4242</p>
          <p><strong>Mastercard:</strong> 5555 5555 5555 4444</p>
          <p><strong>Expiry:</strong> Any future date (e.g., 12/34)</p>
          <p><strong>CVC:</strong> Any 3-4 digits (e.g., 123)</p>
        </div>
      </div>
    </form>
  );
};

export default CheckoutForm;