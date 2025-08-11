import express from 'express';
import { protectRoute } from '../middlewares/userAuth.js';
import { roleAuth } from '../middlewares/roleAuth.js';
import * as adminController from '../controllers/adminController.js';

const adminRouter = express.Router();

adminRouter.get('/dashboard', protectRoute, roleAuth('Admin'), adminController.getAdminDashboardStats);

// Venues/Facilities
adminRouter.get('/venues/pending', protectRoute, roleAuth('Admin'), adminController.getPendingVenues);
adminRouter.put('/venues/:id/approve', protectRoute, roleAuth('Admin'), adminController.approveVenue);
adminRouter.put('/venues/:id/reject', protectRoute, roleAuth('Admin'), adminController.rejectVenue);

// Aliases to match frontend service expectations
adminRouter.get('/facilities/pending', protectRoute, roleAuth('Admin'), adminController.getPendingVenues);
adminRouter.get('/facilities/:id', protectRoute, roleAuth('Admin'), adminController.getFacilityDetails);
adminRouter.put('/facilities/:id/approve', protectRoute, roleAuth('Admin'), adminController.approveFacilityByBody);

// Users
adminRouter.get('/users', protectRoute, roleAuth('Admin'), adminController.getAllUsers);
adminRouter.get('/users/:id', protectRoute, roleAuth('Admin'), adminController.getUserById);
adminRouter.put('/users/:id/ban', protectRoute, roleAuth('Admin'), adminController.banUser);

// Reports & Analytics
adminRouter.get('/reports', protectRoute, roleAuth('Admin'), adminController.getReports);
adminRouter.put('/reports/:id', protectRoute, roleAuth('Admin'), adminController.updateReportStatus);
adminRouter.get('/analytics', protectRoute, roleAuth('Admin'), adminController.getAdminAnalytics);
adminRouter.get('/stats', protectRoute, roleAuth('Admin'), adminController.getSystemStats);

// Export
adminRouter.get('/export', protectRoute, roleAuth('Admin'), adminController.exportData);

export default adminRouter; 
