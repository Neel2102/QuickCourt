import bookingModel from '../models/bookingModel.js';
import courtModel from '../models/courtModel.js';
import { processPayment } from './paymentService.js';
import { sendBookingConfirmationEmail } from './emailService.js';

export const createNewBooking = async ({ userId, courtId, date, startTime, endTime }) => {
    // Step 1: Check for existing booking conflicts
    // Correct logic for time overlap: new.start < existing.end AND new.end > existing.start
    const conflictingBookings = await bookingModel.find({
        court: courtId,
        date: new Date(date), // Ensure date is a Date object
        $or: [
            {
                // Check for bookings that start before the new one ends and end after the new one starts
                $and: [
                    { startTime: { $lt: endTime } },
                    { endTime: { $gt: startTime } }
                ]
            },
            {
                // Check for bookings that are exactly the same
                $and: [
                    { startTime: { $eq: startTime } },
                    { endTime: { $eq: endTime } }
                ]
            }
        ],
        status: 'Confirmed'
    });

    if (conflictingBookings.length > 0) {
        return { success: false, message: 'Time slot is not available.' };
    }
    
    // Step 2: Calculate price and create booking record
    const court = await courtModel.findById(courtId);
    if (!court) {
        return { success: false, message: 'Court not found.' };
    }

    const start = new Date(`1970/01/01T${startTime}:00Z`);
    const end = new Date(`1970/01/01T${endTime}:00Z`);
    const durationHours = (end - start) / (1000 * 60 * 60);

    const totalPrice = durationHours * court.pricePerHour;
    
    const newBooking = new bookingModel({
        user: userId,
        venue: court.venue,
        court: courtId,
        date: new Date(date),
        startTime,
        endTime,
        totalPrice,
    });
    
    await newBooking.save();

    // Step 3: Process payment
    const paymentResult = await processPayment({
        bookingId: newBooking._id,
        totalPrice,
    });

    if (!paymentResult.success) {
        newBooking.status = 'Cancelled';
        await newBooking.save();
        return { success: false, message: 'Payment failed. Booking cancelled.' };
    }

    // Step 4: Update booking status and send confirmation email
    newBooking.status = 'Confirmed';
    await newBooking.save();

    // The user's email is needed for the email service
    const user = await userModel.findById(userId);

    sendBookingConfirmationEmail(user.email, {
        venueName: 'Venue Name Placeholder', // You need to populate this
        courtName: court.name,
        date: newBooking.date.toISOString().split('T')[0],
        startTime: newBooking.startTime,
        endTime: newBooking.endTime,
        totalPrice: newBooking.totalPrice,
    });

    return { success: true, message: 'Booking created and confirmed.', booking: newBooking };
};

// ... other service functions (cancelUserBooking) remain the same