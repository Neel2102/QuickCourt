import express from 'express';
import { protectRoute } from '../middlewares/userAuth.js';
import { roleAuth } from '../middlewares/roleAuth.js';
import * as bookingController from '../controllers/bookingController.js';

const bookingRouter = express.Router();

bookingRouter.post('/', protectRoute, bookingController.createBooking);
bookingRouter.post('/confirm-payment', protectRoute, bookingController.confirmPayment);
bookingRouter.post('/webhook', express.raw({ type: 'application/json' }), bookingController.handleStripeWebhook);
bookingRouter.get('/mybookings', protectRoute, bookingController.getMyBookings);
bookingRouter.get('/owner', protectRoute, roleAuth('FacilityOwner'), bookingController.getOwnerBookings);
bookingRouter.put('/:id/cancel', protectRoute, bookingController.cancelBooking);
// update booking (owners/admins would call via UI; authorization can be extended as needed)
bookingRouter.put('/:id', protectRoute, bookingController.updateBooking);
bookingRouter.put('/:id/complete', protectRoute, roleAuth(['Admin', 'FacilityOwner']), bookingController.updateBooking);

export default bookingRouter; 
