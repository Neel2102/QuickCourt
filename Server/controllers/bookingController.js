import bookingModel from '../models/bookingModel.js';
import courtModel from '../models/courtModel.js';
import venueModel from '../models/venueModel.js';

// Create a new booking
export const createBooking = async (req, res) => {
    try {
        const { venueId, courtId, date, startTime, endTime, totalPrice } = req.body;
        const userId = req.user._id;

        // Check for court availability
        const existingBookings = await bookingModel.find({
            court: courtId,
            date: date,
            startTime: startTime,
            endTime: endTime,
            status: 'Confirmed'
        });

        if (existingBookings.length > 0) {
            return res.status(409).json({ success: false, message: 'This time slot is already booked.' });
        }

        const newBooking = new bookingModel({
            user: userId,
            venue: venueId,
            court: courtId,
            date,
            startTime,
            endTime,
            totalPrice,
        });

        await newBooking.save();
        res.status(201).json({ success: true, message: 'Booking confirmed successfully', booking: newBooking });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create booking', error: error.message });
    }
};

// Get all bookings for the logged-in user
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

// Cancel a booking
export const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await bookingModel.findById(id);

        if (!booking || booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized to cancel this booking' });
        }

        booking.status = 'Cancelled';
        await booking.save();
        res.json({ success: true, message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to cancel booking', error: error.message });
    }
}; 
