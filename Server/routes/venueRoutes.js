import express from 'express';
import { protectRoute } from '../middlewares/userAuth.js';
import { roleAuth } from '../middlewares/roleAuth.js';
import * as venueController from '../controllers/venueController.js';
import uploadMiddleware from '../middlewares/uploadMiddleware.js';

const venueRoutes = express.Router();

// Public routes
venueRoutes.get('/', venueController.getAllVenues);
venueRoutes.get('/:id', venueController.getVenueDetails);

// Facility Owner routes (requires owner role)
venueRoutes.post(
    '/',
    protectRoute,
    roleAuth('FacilityOwner'),
    uploadMiddleware.array('photos', 5),
    venueController.createVenue
);
venueRoutes.post('/', protectRoute, roleAuth('FacilityOwner'), venueController.createVenue);
venueRoutes.put('/:id', protectRoute, roleAuth('FacilityOwner'), venueController.updateVenue);
venueRoutes.delete('/:id', protectRoute, roleAuth('FacilityOwner'), venueController.deleteVenue);

export default venueRoutes;
