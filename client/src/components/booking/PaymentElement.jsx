import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import Button from '../common/Button.jsx';

const CheckoutForm = ({ bookingId, onPaymentFailure }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

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
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <PaymentElement />
      <div className="flex justify-end mt-4">
        <Button
          type="submit"
          loading={loading}
          disabled={!stripe || loading}
          fullWidth
        >
          Pay Now
        </Button>
      </div>
      {errorMessage && (
        <div className="mt-2 text-sm text-red-600">{errorMessage}</div>
      )}
    </form>
  );
};

export default CheckoutForm;