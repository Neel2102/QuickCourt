import express from 'express';
import { protectRoute } from '../middlewares/userAuth.js';
import { roleAuth } from '../middlewares/roleAuth.js';
import * as bookingController from '../controllers/bookingController.js';

const bookingRouter = express.Router();

bookingRouter.post('/', protectRoute, bookingController.createBooking);
bookingRouter.get('/mybookings', protectRoute, bookingController.getMyBookings);
bookingRouter.get('/owner', protectRoute, roleAuth('FacilityOwner'), bookingController.getOwnerBookings);
bookingRouter.put('/:id/cancel', protectRoute, bookingController.cancelBooking);

export default bookingRouter; 
