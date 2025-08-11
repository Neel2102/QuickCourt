import express from 'express';
import { protectRoute } from '../middlewares/userAuth.js';
import * as bookingController from '../controllers/bookingController.js';

const bookingRouter = express.Router();

bookingRouter.post('/', protectRoute, bookingController.createBooking);
bookingRouter.get('/mybookings', protectRoute, bookingController.getMyBookings);
bookingRouter.put('/:id/cancel', protectRoute, bookingController.cancelBooking);

export default bookingRouter; 
