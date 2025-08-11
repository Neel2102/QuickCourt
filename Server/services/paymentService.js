// This is a simulated payment service. In a real application, you would
// integrate with a service like Stripe or PayPal.

export const simulatePayment = async (bookingId, amount) => {
    try {
        // Simulate a successful payment
        const isSuccessful = Math.random() > 0.1; // 90% chance of success

        if (isSuccessful) {
            console.log(`Payment simulation successful for booking ${bookingId} with amount ${amount}`);
            // In a real scenario, you'd handle the webhook from the payment provider here.
            return { success: true, message: 'Payment confirmed' };
        } else {
            console.log(`Payment simulation failed for booking ${bookingId}`);
            return { success: false, message: 'Payment failed' };
        }
    } catch (error) {
        console.error('Payment simulation error:', error);
        return { success: false, message: 'An error occurred during payment simulation' };
    }
};