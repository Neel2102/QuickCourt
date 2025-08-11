import express from 'express';
import { protectRoute } from '../middlewares/userAuth.js';
import { roleAuth } from '../middlewares/roleAuth.js';
import * as reviewController from '../controllers/reviewController.js';

const reviewRouter = express.Router();

// Public routes
reviewRouter.get('/venue/:venueId', reviewController.getVenueReviews);

// Protected routes (require authentication)
reviewRouter.post('/', protectRoute, reviewController.createReview);
reviewRouter.get('/my-reviews', protectRoute, reviewController.getUserReviews);
reviewRouter.get('/check-eligibility/:venueId', protectRoute, reviewController.checkReviewEligibility);
reviewRouter.put('/:id', protectRoute, reviewController.updateReview);
reviewRouter.delete('/:id', protectRoute, reviewController.deleteReview);

export default reviewRouter;
