import express from 'express';
import { protectRoute } from '../middlewares/userAuth.js';
import { roleAuth } from '../middlewares/roleAuth.js';
import * as venueController from '../controllers/venueController.js';
import uploadMiddleware from '../middlewares/uploadMiddleware.js';

const venueRoutes = express.Router();

// Debug middleware to log all venue route requests
venueRoutes.use((req, res, next) => {
  console.log(`=== VENUE ROUTE DEBUG ===`);
  console.log(`${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('Files:', req.files);
  console.log('User:', req.user);
  next();
});

// Public routes
venueRoutes.get('/', venueController.getAllVenues);

// Test route to check if basic venue creation works without file upload
venueRoutes.post('/test', protectRoute, roleAuth('FacilityOwner'), (req, res) => {
  console.log('=== TEST VENUE ROUTE ===');
  console.log('Body:', req.body);
  console.log('User:', req.user);
  res.json({ success: true, message: 'Test route working', data: req.body });
});

// Facility Owner routes (requires owner role) — keep before dynamic ':id'
venueRoutes.get('/owner', protectRoute, roleAuth('FacilityOwner'), venueController.getOwnerVenues);
venueRoutes.post(
    '/',
    protectRoute,
    roleAuth('FacilityOwner'),
    uploadMiddleware.array('photos', 5),
    venueController.createVenue
);
venueRoutes.put('/:id', protectRoute, roleAuth('FacilityOwner'), venueController.updateVenue);
venueRoutes.delete('/:id', protectRoute, roleAuth('FacilityOwner'), venueController.deleteVenue);

// Dynamic route last
venueRoutes.get('/:id', venueController.getVenueDetails);

export default venueRoutes;
