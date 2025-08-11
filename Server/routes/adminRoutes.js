import express from 'express';
import { protectRoute } from '../middlewares/userAuth.js';
import { roleAuth } from '../middlewares/roleAuth.js';
import * as adminController from '../controllers/adminController.js';

const adminRouter = express.Router();

adminRouter.get('/dashboard', protectRoute, roleAuth('Admin'), adminController.getAdminDashboardStats);
adminRouter.get('/venues/pending', protectRoute, roleAuth('Admin'), adminController.getPendingVenues);
adminRouter.put('/venues/:id/approve', protectRoute, roleAuth('Admin'), adminController.approveVenue);
adminRouter.put('/venues/:id/reject', protectRoute, roleAuth('Admin'), adminController.rejectVenue);
adminRouter.get('/users', protectRoute, roleAuth('Admin'), adminController.getAllUsers);
adminRouter.put('/users/:id/ban', protectRoute, roleAuth('Admin'), adminController.banUser);

export default adminRouter; 
