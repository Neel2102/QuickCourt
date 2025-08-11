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

      {/* Test Card Information */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">💳 Test Card Numbers</h4>
        <div className="text-xs text-blue-700 space-y-1">
          <p><strong>Visa:</strong> 4242 4242 4242 4242</p>
          <p><strong>Mastercard:</strong> 5555 5555 5555 4444</p>
          <p><strong>American Express:</strong> 3782 822463 10005</p>
          <p><strong>Expiry:</strong> Any future date (e.g., 12/34)</p>
          <p><strong>CVC:</strong> Any 3-4 digits (e.g., 123)</p>
          <p><strong>ZIP:</strong> Any 5 digits (e.g., 12345)</p>
        </div>
      </div>
    </form>
  );
};

export default CheckoutForm;