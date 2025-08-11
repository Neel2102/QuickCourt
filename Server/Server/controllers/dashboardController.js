import venueModel from '../models/venueModel.js';
import bookingModel from '../models/bookingModel.js';
import userModel from '../models/userModel.js';
import courtModel from '../models/courtModel.js';

// Get data for Facility Owner Dashboard
export const getOwnerDashboardData = async (req, res) => {
    try {
        const ownerId = req.user._id;

        // Find all venues owned by the user
        const venues = await venueModel.find({ owner: ownerId });
        const venueIds = venues.map(venue => venue._id);

        // Calculate total bookings
        const totalBookings = await bookingModel.countDocuments({ venue: { $in: venueIds } });

        // Calculate total earnings (simulated)
        const earningsPipeline = [
            { $match: { venue: { $in: venueIds }, status: 'Confirmed' } },
            { $group: { _id: null, totalEarnings: { $sum: '$totalPrice' } } }
        ];
        const earningsResult = await bookingModel.aggregate(earningsPipeline);
        const totalEarnings = earningsResult.length > 0 ? earningsResult[0].totalEarnings : 0;

        // Get active courts
        const activeCourts = await courtModel.countDocuments({ venue: { $in: venueIds } });

        // Get booking trends (e.g., daily)
        const bookingTrendPipeline = [
            { $match: { venue: { $in: venueIds }, status: 'Confirmed' } },
            { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ];
        const bookingTrends = await bookingModel.aggregate(bookingTrendPipeline);

        res.json({
            success: true,
            data: {
                totalBookings,
                activeCourts,
                totalEarnings,
                bookingTrends,
                // Add more data for charts here, e.g., peak booking hours
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch owner dashboard data', error: error.message });
    }
};

// Get data for Admin Dashboard
export const getAdminDashboardData = async (req, res) => {
    try {
        const totalUsers = await userModel.countDocuments({ isFacilityOwner: false });
        const totalFacilityOwners = await userModel.countDocuments({ isFacilityOwner: true });
        const totalBookings = await bookingModel.countDocuments({});
        const totalActiveCourts = await courtModel.countDocuments({});

        // Calculate other global stats and trends here...

        res.json({
            success: true,
            data: {
                totalUsers,
                totalFacilityOwners,
                totalBookings,
                totalActiveCourts,
                // Add more admin-specific data (e.g., facility approval trend, user registration trend)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch admin dashboard data', error: error.message });
    }
};