import reportModel from '../models/reportModel.js';
import userModel from '../models/userModel.js';
import venueModel from '../models/venueModel.js';
import bookingModel from '../models/bookingModel.js';

// Create a new report
export const createReport = async (req, res) => {
    try {
        const { targetType, targetId, reason, actionNote } = req.body;
        const reporterId = req.user.id;

        // Validate required fields
        if (!targetType || !targetId || !reason) {
            return res.status(400).json({
                success: false,
                message: 'targetType, targetId, and reason are required'
            });
        }

        // Validate targetType
        if (!['user', 'venue', 'booking'].includes(targetType)) {
            return res.status(400).json({
                success: false,
                message: 'targetType must be user, venue, or booking'
            });
        }

        // Validate target exists
        let targetExists = false;
        switch (targetType) {
            case 'user':
                targetExists = await userModel.findById(targetId);
                break;
            case 'venue':
                targetExists = await venueModel.findById(targetId);
                break;
            case 'booking':
                targetExists = await bookingModel.findById(targetId);
                break;
        }

        if (!targetExists) {
            return res.status(404).json({
                success: false,
                message: `${targetType} not found`
            });
        }

        // Prevent users from reporting themselves
        if (targetType === 'user' && targetId === reporterId) {
            return res.status(400).json({
                success: false,
                message: 'You cannot report yourself'
            });
        }



        // Create the report
        const report = new reportModel({
            reporter: reporterId,
            targetType,
            targetId,
            reason,
            actionNote: actionNote || '',
            status: 'open' // All reports start as open
        });

        await report.save();

        // Populate reporter name for response
        await report.populate('reporter', 'name email');

        res.status(201).json({
            success: true,
            message: 'Report filed successfully',
            data: report
        });

    } catch (error) {
        console.error('Error creating report:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create report',
            error: error.message
        });
    }
};

// Get reports filed by the current user
export const getMyReports = async (req, res) => {
    try {
        const userId = req.user.id;
        const { status, targetType } = req.query;

        const query = { reporter: userId };
        
        if (status && status !== 'all') {
            query.status = status;
        }
        
        if (targetType && targetType !== 'all') {
            query.targetType = targetType;
        }

        const reports = await reportModel.find(query)
            .populate('reporter', 'name email')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: reports
        });

    } catch (error) {
        console.error('Error fetching user reports:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch reports',
            error: error.message
        });
    }
};

// Get details of a specific report (only if user owns it)
export const getReportDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const report = await reportModel.findById(id)
            .populate('reporter', 'name email');

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Report not found'
            });
        }

        // Check if user owns this report
        if (report.reporter._id.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only view your own reports.'
            });
        }

        res.json({
            success: true,
            data: report
        });

    } catch (error) {
        console.error('Error fetching report details:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch report details',
            error: error.message
        });
    }
};

// Update a report (only if user owns it and status is 'open')
export const updateReport = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { reason, actionNote } = req.body;

        const report = await reportModel.findById(id);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Report not found'
            });
        }

        // Check if user owns this report
        if (report.reporter.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only update your own reports.'
            });
        }

        // Check if report can be updated (only open reports)
        if (report.status !== 'open') {
            return res.status(400).json({
                success: false,
                message: 'Only open reports can be updated'
            });
        }

        // Update allowed fields
        if (reason) report.reason = reason;
        if (actionNote !== undefined) report.actionNote = actionNote;

        await report.save();

        await report.populate('reporter', 'name email');

        res.json({
            success: true,
            message: 'Report updated successfully',
            data: report
        });

    } catch (error) {
        console.error('Error updating report:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update report',
            error: error.message
        });
    }
};

// Delete a report (only if user owns it and status is 'open')
export const deleteReport = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const report = await reportModel.findById(id);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Report not found'
            });
        }

        // Check if user owns this report
        if (report.reporter.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only delete your own reports.'
            });
        }

        // Check if report can be deleted (only open reports)
        if (report.status !== 'open') {
            return res.status(400).json({
                success: false,
                message: 'Only open reports can be deleted'
            });
        }

        await reportModel.findByIdAndDelete(id);

        res.json({
            success: true,
            message: 'Report deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting report:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete report',
            error: error.message
        });
    }
};
