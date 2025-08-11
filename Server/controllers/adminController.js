import userModel from '../models/userModel.js';
import venueModel from '../models/venueModel.js';
import bookingModel from '../models/bookingModel.js';
import mongoose from 'mongoose';

let reportModel;
try {
  // optional import if exists
  const mod = await import('../models/reportModel.js');
  reportModel = mod.default;
} catch (_) {
  // ignore if model does not exist; routes using it will handle gracefully
}

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

// Reject a venue registration
export const rejectVenue = async (req, res) => {
    try {
        const { id } = req.params;
        const venue = await venueModel.findByIdAndDelete(id);

        if (!venue) {
            return res.status(404).json({ success: false, message: 'Venue not found' });
        }

        res.json({ success: true, message: 'Venue rejected and removed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to reject venue', error: error.message });
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
        res.json({ success: true, message: `User ban status toggled.`, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to ban user', error: error.message });
    }
}; 

// New: Admin – get single user details with booking history
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const bookings = await bookingModel
      .find({ user: id })
      .populate('venue', 'name')
      .populate('court', 'name sportType')
      .sort({ date: -1 });

    res.json({ success: true, data: { user, bookings } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch user details', error: error.message });
  }
};

// New: Admin – get facility details
export const getFacilityDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const venue = await venueModel.findById(id).populate('owner', 'name email');
    if (!venue) return res.status(404).json({ success: false, message: 'Facility not found' });
    res.json({ success: true, data: venue });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch facility details', error: error.message });
  }
};

// New: Admin – system stats
export const getSystemStats = async (_req, res) => {
  try {
    const totalUsers = await userModel.countDocuments({ isAdmin: false, isFacilityOwner: false });
    const totalFacilityOwners = await userModel.countDocuments({ isFacilityOwner: true });
    const totalBookings = await bookingModel.countDocuments();
    const totalVenues = await venueModel.countDocuments();
    const pendingVenues = await venueModel.countDocuments({ isApproved: false });

    res.json({ success: true, data: { totalUsers, totalFacilityOwners, totalBookings, totalVenues, pendingVenues } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch system stats', error: error.message });
  }
};

// New: Admin – analytics over time
export const getAdminAnalytics = async (req, res) => {
  try {
    const { period = 'month' } = req.query;

    // Group bookings by date
    const results = await bookingModel.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          bookings: { $sum: 1 },
          revenue: { $sum: { $ifNull: ['$totalPrice', 0] } },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 30 },
    ]);

    const bySport = await bookingModel.aggregate([
      {
        $lookup: { from: 'courts', localField: 'court', foreignField: '_id', as: 'court' },
      },
      { $unwind: '$court' },
      {
        $group: {
          _id: '$court.sportType',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({ success: true, data: { period, trends: results, bySport } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch admin analytics', error: error.message });
  }
};

// New: Admin – reports list
export const getReports = async (req, res) => {
  try {
    if (!reportModel) return res.json({ success: true, data: [] });
    const { type = 'all', status = 'all' } = req.query;
    const query = {};
    if (type !== 'all') query.targetType = type;
    if (status !== 'all') query.status = status;
    const reports = await reportModel.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch reports', error: error.message });
  }
};

// New: Admin – update report status
export const updateReportStatus = async (req, res) => {
  try {
    if (!reportModel) return res.status(400).json({ success: false, message: 'Reports not supported' });
    const { id } = req.params;
    const { status, action = '' } = req.body;
    const updated = await reportModel.findByIdAndUpdate(
      id,
      { status, actionNote: action },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Report not found' });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update report', error: error.message });
  }
};

// New: Admin – approve facility with body (alias to approveVenue)
export const approveFacilityByBody = async (req, res) => {
  try {
    const { id } = req.params;
    const { approved = true } = req.body;
    const venue = await venueModel.findByIdAndUpdate(id, { isApproved: !!approved }, { new: true });
    if (!venue) return res.status(404).json({ success: false, message: 'Facility not found' });
    res.json({ success: true, data: venue });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update facility', error: error.message });
  }
};

// New: Admin – export data in CSV
export const exportData = async (req, res) => {
  try {
    const { type = 'users', format = 'csv' } = req.query;

    let rows = [];
    if (type === 'users') {
      const users = await userModel.find({}).lean();
      rows = users.map(u => ({ id: u._id, name: u.name, email: u.email, isAdmin: u.isAdmin, isFacilityOwner: u.isFacilityOwner }));
    } else if (type === 'venues') {
      const venues = await venueModel.find({}).lean();
      rows = venues.map(v => ({ id: v._id, name: v.name, approved: v.isApproved }));
    } else if (type === 'bookings') {
      const bookings = await bookingModel.find({}).lean();
      rows = bookings.map(b => ({ id: b._id, user: b.user?.toString(), venue: b.venue?.toString(), court: b.court?.toString(), date: b.date, status: b.status, totalPrice: b.totalPrice }));
    }

    if (format === 'csv') {
      if (!rows.length) return res.end('');
      const headers = Object.keys(rows[0]);
      const csv = [headers.join(','), ...rows.map(r => headers.map(h => JSON.stringify(r[h] ?? '')).join(','))].join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${type}.csv"`);
      return res.status(200).end(csv);
    }

    return res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to export data', error: error.message });
  }
};
