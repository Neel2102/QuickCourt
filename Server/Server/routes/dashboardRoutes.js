import express from 'express';
import { protectRoute } from '../middlewares/userAuth.js';
import { roleAuth } from '../middlewares/roleAuth.js';
import * as dashboardController from '../controllers/dashboardController.js';

const dashboardRouter = express.Router();

// Owner Dashboard Stats
dashboardRouter.get('/owner', protectRoute, roleAuth('FacilityOwner'), dashboardController.getOwnerDashboardData);

// Admin Dashboard Stats
dashboardRouter.get('/admin', protectRoute, roleAuth('Admin'), dashboardController.getAdminDashboardData);

export default dashboardRouter;