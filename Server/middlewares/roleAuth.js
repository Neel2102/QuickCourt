import userModel from "../models/userModel.js";

export const roleAuth = (requiredRole) => {
    return async (req, res, next) => {
        try {
            // Prefer user from protectRoute
            let user = req.user || null;

            // Fallback: if not available, use id from body (for legacy flows)
            if (!user && req.body && req.body.userId) {
                user = await userModel.findById(req.body.userId);
            }

            if (!user) {
                return res.status(401).json({ success: false, message: 'Not authenticated' });
            }

            let userRole = 'User';
            if (user.isAdmin) {
                userRole = 'Admin';
            } else if (user.isFacilityOwner) {
                userRole = 'FacilityOwner';
            }

            if (userRole === requiredRole || user.isAdmin) {
                next();
            } else {
                return res.status(403).json({ success: false, message: 'Access denied: You do not have the required role.' });
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Authentication error' });
        }
    };
};