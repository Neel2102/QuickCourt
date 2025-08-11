import express from 'express';
import { protectRoute } from '../middlewares/userAuth.js';
import { roleAuth } from '../middlewares/roleAuth.js';
import * as reportController from '../controllers/reportController.js';

const reportRouter = express.Router();

// Public routes - any authenticated user can file a report
reportRouter.post('/', protectRoute, reportController.createReport);

// User can view their own reports
reportRouter.get('/my-reports', protectRoute, reportController.getMyReports);

// User can view details of their own report
reportRouter.get('/:id', protectRoute, reportController.getReportDetails);

// User can update their own report (only if status is 'open')
reportRouter.put('/:id', protectRoute, reportController.updateReport);

// User can delete their own report (only if status is 'open')
reportRouter.delete('/:id', protectRoute, reportController.deleteReport);

export default reportRouter;
