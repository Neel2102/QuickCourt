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