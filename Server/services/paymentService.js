import Stripe from 'stripe';
import dotenv from 'dotenv';
import { PAYMENT_STATUS } from '../../shared/constants/status.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async ({ amount, currency = 'inr', bookingId }) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe expects amount in cents/paise
            currency,
            metadata: { bookingId: bookingId.toString() },
            automatic_payment_methods: { enabled: true },
        });

        return {
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            status: PAYMENT_STATUS.PENDING,
            message: 'Payment intent created successfully.',
        };
    } catch (error) {
        console.error('Stripe payment intent creation failed:', error);
        return {
            success: false,
            status: PAYMENT_STATUS.FAILED,
            message: error.message || 'Failed to create payment intent.',
        };
    }
};

export const verifyPaymentIntent = async (paymentIntentId) => {
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            return {
                success: true,
                status: PAYMENT_STATUS.COMPLETED,
                message: 'Payment was successful.',
            };
        } else {
            return {
                success: false,
                status: PAYMENT_STATUS.FAILED,
                message: `Payment status is: ${paymentIntent.status}.`,
            };
        }
    } catch (error) {
        console.error('Stripe payment intent verification failed:', error);
        return {
            success: false,
            status: PAYMENT_STATUS.FAILED,
            message: error.message || 'Failed to verify payment intent.',
        };
    }
};