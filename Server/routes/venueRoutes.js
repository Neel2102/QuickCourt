 import express from 'express';
import { protectRoute } from '../middlewares/userAuth.js';
import { roleAuth } from '../middlewares/roleAuth.js';
import * as venueController from '../controllers/venueController.js';

const venueRouter = express.Router();

// Public routes
venueRouter.get('/', venueController.getAllVenues);
venueRouter.get('/:id', venueController.getVenueDetails);

// Facility Owner routes (requires owner role)
venueRouter.post('/', protectRoute, roleAuth('FacilityOwner'), venueController.createVenue);
venueRouter.put('/:id', protectRoute, roleAuth('FacilityOwner'), venueController.updateVenue);
venueRouter.delete('/:id', protectRoute, roleAuth('FacilityOwner'), venueController.deleteVenue);

export default venueRouter;
