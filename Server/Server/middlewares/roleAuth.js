import userModel from "../models/userModel.js";

export const roleAuth = (requiredRole) => {
    return async (req, res, next) => {
        try {
            const { userId } = req.body;
            const user = await userModel.findById(userId);

            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            let userRole = null;
            if (user.isAdmin) {
                userRole = 'Admin';
            } else if (user.isFacilityOwner) {
                userRole = 'FacilityOwner';
            } else {
                userRole = 'User';
            }

            if (userRole === requiredRole || user.isAdmin) {
                // Admins can access all routes
                next();
            } else {
                return res.status(403).json({ success: false, message: 'Access denied: You do not have the required role.' });
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Authentication error' });
        }
    };
};