import express from 'express';
import { protectRoute } from '../middlewares/userAuth.js';
import { roleAuth } from '../middlewares/roleAuth.js';
import * as courtController from '../controllers/courtController.js';

const courtRouter = express.Router();

// Public routes
courtRouter.get('/:venueId', courtController.getCourtsByVenue);

// Facility Owner routes (requires owner role)
courtRouter.post('/', protectRoute, roleAuth('FacilityOwner'), courtController.createCourt);
courtRouter.get('/owner', protectRoute, roleAuth('FacilityOwner'), courtController.getOwnerCourts);
courtRouter.get('/owner/:venueId', protectRoute, roleAuth('FacilityOwner'), courtController.getCourtsByVenue);
courtRouter.put('/:id', protectRoute, roleAuth('FacilityOwner'), courtController.updateCourt);
courtRouter.delete('/:id', protectRoute, roleAuth('FacilityOwner'), courtController.deleteCourt);

export default courtRouter;
