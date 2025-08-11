import * as bookingService from '../services/bookingService.js';
import bookingModel from '../models/bookingModel.js';

export const createBooking = async (req, res) => {
    try {
        const { courtId, date, startTime, endTime } = req.body;
        const userId = req.user._id;

        const result = await bookingService.createNewBooking({ userId, courtId, date, startTime, endTime });
        
        if (result.success) {
            res.status(201).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create booking', error: error.message });
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
        const result = await bookingService.cancelUserBooking(id, userId);

        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to cancel booking', error: error.message });
    }
};

// Get bookings for facility owner's venues
export const getOwnerBookings = async (req, res) => {
    try {
        const ownerId = req.user._id;

        // First get all venues owned by this user
        const venueModel = (await import('../models/venueModel.js')).default;
        const venues = await venueModel.find({ owner: ownerId });
        const venueIds = venues.map(venue => venue._id);

        // Then get all bookings for these venues
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