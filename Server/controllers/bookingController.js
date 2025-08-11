import bookingModel from '../models/bookingModel.js';
import courtModel from '../models/courtModel.js';
import venueModel from '../models/venueModel.js';
import userModel from '../models/userModel.js';
import { createPaymentIntent, verifyPaymentIntent } from '../services/paymentService.js';
import { sendBookingConfirmationEmail } from '../services/emailService.js';

export const createBooking = async (req, res) => {
    try {
        const { courtId, date, startTime, endTime } = req.body;
        const userId = req.user._id;

        // 1. Check for court availability
        const conflictingBookings = await bookingModel.find({
            court: courtId,
            date: new Date(date),
            $or: [{
                $and: [{ startTime: { $lt: endTime } }, { endTime: { $gt: startTime } }]
            }, {
                $and: [{ startTime: { $eq: startTime } }, { endTime: { $eq: endTime } }]
            }],
            status: 'Confirmed'
        });
        if (conflictingBookings.length > 0) {
            return res.status(409).json({ success: false, message: 'This time slot is already booked.' });
        }

        // 2. Calculate price
        const court = await courtModel.findById(courtId);
        if (!court) {
            return res.status(404).json({ success: false, message: 'Court not found.' });
        }
        const start = new Date(`1970/01/01T${startTime}:00Z`);
        const end = new Date(`1970/01/01T${endTime}:00Z`);
        const durationHours = (end - start) / (1000 * 60 * 60);
        const totalPrice = durationHours * court.pricePerHour;

        // 3. Create a temporary booking record (pending payment)
        const newBooking = new bookingModel({
            user: userId,
            venue: court.venue,
            court: courtId,
            date: new Date(date),
            startTime,
            endTime,
            totalPrice,
            status: 'Pending',
        });
        await newBooking.save();

        // 4. Create Stripe Payment Intent
        const paymentIntentResult = await createPaymentIntent({
            amount: totalPrice,
            bookingId: newBooking._id,
        });

        if (!paymentIntentResult.success) {
            // Delete the temporary booking if payment intent fails
            await bookingModel.findByIdAndDelete(newBooking._id);
            return res.status(500).json({ success: false, message: paymentIntentResult.message });
        }

        // 5. Update booking with payment intent ID and return client secret to frontend
        await bookingModel.findByIdAndUpdate(
            newBooking._id,
            { paymentIntentId: paymentIntentResult.paymentIntentId },
            { new: true }
        );

        return res.status(201).json({
            success: true,
            message: 'Booking created, proceed to payment.',
            booking: newBooking,
            clientSecret: paymentIntentResult.clientSecret,
            paymentIntentId: paymentIntentResult.paymentIntentId,
        });
    } catch (error) {
        console.error('Booking creation error:', error);
        return res.status(500).json({ success: false, message: 'Failed to create booking.', error: error.message });
    }
};

export const confirmPayment = async (req, res) => {
    try {
        const { paymentIntentId, bookingId } = req.body;
        const result = await verifyPaymentIntent(paymentIntentId);

        if (!result.success) {
            return res.status(400).json(result);
        }

        const booking = await bookingModel.findByIdAndUpdate(
            bookingId,
            { status: 'Confirmed' },
            { new: true }
        ).populate('court');

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found.' });
        }
        
        // Optionally send a confirmation email here
        const user = await userModel.findById(booking.user);
        const venue = await venueModel.findById(booking.venue);
        sendBookingConfirmationEmail(user.email, {
            venueName: venue.name,
            courtName: booking.court.name,
            date: booking.date,
            startTime: booking.startTime,
            endTime: booking.endTime,
            totalPrice: booking.totalPrice,
        });

        res.json({ success: true, message: 'Booking confirmed and paid.', booking });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to confirm payment.', error: error.message });
    }
};

export const getMyBookings = async (req, res) => {
    try {
        const userId = req.user._id;
        const bookings = await bookingModel.find({ user: userId })
            .populate('venue', 'name')
            .populate('court', 'name sportType');
        res.json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch bookings', error: error.message });
    }
};

export const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const booking = await bookingModel.findById(id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found.' });
        }

        // Authorization check
        if (booking.user.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized to cancel this booking.' });
        }

        const updatedBooking = await bookingModel.findByIdAndUpdate(id, { status: 'Cancelled' }, { new: true });

        res.json({ success: true, message: 'Booking cancelled successfully.', data: updatedBooking });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to cancel booking', error: error.message });
    }
};

// Get bookings for facility owner's venues
export const getOwnerBookings = async (req, res) => {
    try {
        const ownerId = req.user._id;

        const venues = await venueModel.find({ owner: ownerId });
        const venueIds = venues.map(venue => venue._id);

        const bookings = await bookingModel.find({ venue: { $in: venueIds } })
            .populate('user', 'name email')
            .populate('venue', 'name')
            .populate('court', 'name sportType')
            .sort({ date: -1, startTime: -1 });

        res.json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch owner bookings', error: error.message });
    }
};

// Admin/Owner: update a booking (e.g., status)
export const updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const update = req.body;
        const updated = await bookingModel.findByIdAndUpdate(id, update, { new: true });
        if (!updated) return res.status(404).json({ success: false, message: 'Booking not found' });
        res.json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update booking', error: error.message });
    }
};
