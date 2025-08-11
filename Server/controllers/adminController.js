import userModel from '../models/userModel.js';
import venueModel from '../models/venueModel.js';
import bookingModel from '../models/bookingModel.js';

// Get global dashboard stats for Admin
export const getAdminDashboardStats = async (req, res) => {
    try {
        const totalUsers = await userModel.countDocuments({ isFacilityOwner: false, isAdmin: false });
        const totalFacilityOwners = await userModel.countDocuments({ isFacilityOwner: true });
        const totalBookings = await bookingModel.countDocuments();
        const totalActiveCourts = await venueModel.aggregate([
            { $match: { isApproved: true } },
            { $lookup: { from: 'courts', localField: '_id', foreignField: 'venue', as: 'courts' } },
            { $unwind: '$courts' },
            { $count: 'total' }
        ]);

        res.json({
            success: true,
            data: {
                totalUsers,
                totalFacilityOwners,
                totalBookings,
                totalActiveCourts: totalActiveCourts[0]?.total || 0,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats', error: error.message });
    }
};

// Get list of pending venue registrations
export const getPendingVenues = async (req, res) => {
    try {
        const venues = await venueModel.find({ isApproved: false }).populate('owner', 'fullName email');
        res.json({ success: true, data: venues });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch pending venues', error: error.message });
    }
};

// Approve a pending venue
export const approveVenue = async (req, res) => {
    try {
        const { id } = req.params;
        const venue = await venueModel.findByIdAndUpdate(id, { isApproved: true }, { new: true });
        if (!venue) {
            return res.status(404).json({ success: false, message: 'Venue not found' });
        }
        res.json({ success: true, message: 'Venue approved successfully', venue });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to approve venue', error: error.message });
    }
};

// Get all users and facility owners
export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({});
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch users', error: error.message });
    }
};

// Ban/unban a user
export const banUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        user.isBanned = !user.isBanned; // Toggle ban status
        await user.save();
        res.json({ success: true, message: `User ban status toggled.`, user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to ban user', error: error.message });
    }
}; 
