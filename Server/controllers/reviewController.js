import reviewModel from '../models/reviewModel.js';
import venueModel from '../models/venueModel.js';
import bookingModel from '../models/bookingModel.js';
import { validateWithSchema, reviewSchema } from '../../shared/utils/validation.schemas.js';

// Create a new review
export const createReview = async (req, res) => {
    try {
        const { venueId, rating, comment } = req.body;
        const userId = req.user._id;

        console.log('Creating review:', { venueId, rating, comment, userId });

        // Validate input - convert userId to string for validation
        const validation = validateWithSchema({
            venueId,
            userId: userId.toString(),
            rating: Number(rating),
            comment
        }, reviewSchema);
        if (!validation.isValid) {
            console.log('Validation errors:', validation.errors);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validation.errors
            });
        }

        // Check if venue exists
        const venue = await venueModel.findById(venueId);
        if (!venue) {
            return res.status(404).json({ success: false, message: 'Venue not found' });
        }

        // Check if user has a confirmed or completed booking at this venue
        const validBooking = await bookingModel.findOne({
            user: userId,
            venue: venueId,
            status: { $in: ['Confirmed', 'Completed'] }
        });

        if (!validBooking) {
            return res.status(403).json({
                success: false,
                message: 'You can only review venues where you have a confirmed booking'
            });
        }

        // Check if user has already reviewed this venue
        const existingReview = await reviewModel.findOne({
            user: userId,
            venue: venueId
        });

        if (existingReview) {
            return res.status(409).json({ 
                success: false, 
                message: 'You have already reviewed this venue' 
            });
        }

        // Create the review
        const newReview = new reviewModel({
            user: userId,
            venue: venueId,
            rating: Number(rating),
            comment: comment?.trim()
        });

        await newReview.save();

        // Update venue rating and review count
        await updateVenueRating(venueId);

        // Populate user data for response
        const populatedReview = await reviewModel.findById(newReview._id)
            .populate('user', 'name profilePic')
            .populate('venue', 'name');

        console.log('Review created successfully:', populatedReview._id);

        res.status(201).json({
            success: true,
            message: 'Review created successfully',
            data: populatedReview
        });
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to create review', 
            error: error.message 
        });
    }
};

// Get reviews for a venue
export const getVenueReviews = async (req, res) => {
    try {
        const { venueId } = req.params;
        const { page = 1, limit = 10, sort = 'newest' } = req.query;

        console.log('Fetching reviews for venue:', venueId);

        // Check if venue exists
        const venue = await venueModel.findById(venueId);
        if (!venue) {
            return res.status(404).json({ success: false, message: 'Venue not found' });
        }

        // Set up sorting
        let sortOption = { createdAt: -1 }; // newest first by default
        if (sort === 'oldest') sortOption = { createdAt: 1 };
        if (sort === 'highest') sortOption = { rating: -1 };
        if (sort === 'lowest') sortOption = { rating: 1 };

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Get reviews with pagination
        const reviews = await reviewModel.find({ venue: venueId })
            .populate('user', 'name profilePic')
            .sort(sortOption)
            .skip(skip)
            .limit(Number(limit));

        // Get total count for pagination
        const totalReviews = await reviewModel.countDocuments({ venue: venueId });

        // Calculate rating statistics
        const ratingStats = await reviewModel.aggregate([
            { $match: { venue: venueId } },
            {
                $group: {
                    _id: '$rating',
                    count: { $sum: 1 }
                }
            }
        ]);

        const ratingDistribution = {
            1: 0, 2: 0, 3: 0, 4: 0, 5: 0
        };
        ratingStats.forEach(stat => {
            ratingDistribution[stat._id] = stat.count;
        });

        res.json({
            success: true,
            data: {
                reviews,
                pagination: {
                    currentPage: Number(page),
                    totalPages: Math.ceil(totalReviews / limit),
                    totalReviews,
                    hasNext: skip + reviews.length < totalReviews,
                    hasPrev: page > 1
                },
                ratingDistribution,
                averageRating: venue.rating,
                totalReviews: venue.numberOfReviews
            }
        });
    } catch (error) {
        console.error('Error fetching venue reviews:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch reviews', 
            error: error.message 
        });
    }
};

// Get user's reviews
export const getUserReviews = async (req, res) => {
    try {
        const userId = req.user._id;
        const { page = 1, limit = 10 } = req.query;

        console.log('Fetching reviews for user:', userId);

        const skip = (page - 1) * limit;

        const reviews = await reviewModel.find({ user: userId })
            .populate('venue', 'name photos')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const totalReviews = await reviewModel.countDocuments({ user: userId });

        res.json({
            success: true,
            data: {
                reviews,
                pagination: {
                    currentPage: Number(page),
                    totalPages: Math.ceil(totalReviews / limit),
                    totalReviews,
                    hasNext: skip + reviews.length < totalReviews,
                    hasPrev: page > 1
                }
            }
        });
    } catch (error) {
        console.error('Error fetching user reviews:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch user reviews', 
            error: error.message 
        });
    }
};

// Update a review
export const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user._id;

        console.log('Updating review:', { id, rating, comment, userId });

        // Find the review
        const review = await reviewModel.findById(id);
        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        // Check if user owns the review
        if (review.user.toString() !== userId.toString()) {
            return res.status(403).json({ 
                success: false, 
                message: 'You can only update your own reviews' 
            });
        }

        // Validate input
        const validation = validateWithSchema({ rating, comment }, {
            rating: reviewSchema.rating,
            comment: reviewSchema.comment
        });
        if (!validation.isValid) {
            return res.status(400).json({ 
                success: false, 
                message: 'Validation failed', 
                errors: validation.errors 
            });
        }

        // Update the review
        review.rating = Number(rating);
        review.comment = comment?.trim();
        await review.save();

        // Update venue rating
        await updateVenueRating(review.venue);

        // Populate and return updated review
        const updatedReview = await reviewModel.findById(id)
            .populate('user', 'name profilePic')
            .populate('venue', 'name');

        res.json({
            success: true,
            message: 'Review updated successfully',
            data: updatedReview
        });
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update review', 
            error: error.message 
        });
    }
};

// Delete a review
export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        console.log('Deleting review:', { id, userId });

        // Find the review
        const review = await reviewModel.findById(id);
        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        // Check if user owns the review or is admin
        if (review.user.toString() !== userId.toString() && !req.user.isAdmin) {
            return res.status(403).json({ 
                success: false, 
                message: 'You can only delete your own reviews' 
            });
        }

        const venueId = review.venue;

        // Delete the review
        await reviewModel.findByIdAndDelete(id);

        // Update venue rating
        await updateVenueRating(venueId);

        res.json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to delete review', 
            error: error.message 
        });
    }
};

// Check if user can review a venue
export const checkReviewEligibility = async (req, res) => {
    try {
        const { venueId } = req.params;
        const userId = req.user._id;

        console.log('Checking review eligibility:', { venueId, userId });

        // Check if venue exists
        const venue = await venueModel.findById(venueId);
        if (!venue) {
            return res.status(404).json({ success: false, message: 'Venue not found' });
        }

        // Check if user has a confirmed or completed booking at this venue
        const validBooking = await bookingModel.findOne({
            user: userId,
            venue: venueId,
            status: { $in: ['Confirmed', 'Completed'] }
        });

        // Check if user has already reviewed this venue
        const existingReview = await reviewModel.findOne({
            user: userId,
            venue: venueId
        });

        res.json({
            success: true,
            data: {
                canReview: !!validBooking && !existingReview,
                hasBooking: !!validBooking,
                hasReviewed: !!existingReview,
                existingReview: existingReview
            }
        });
    } catch (error) {
        console.error('Error checking review eligibility:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check review eligibility',
            error: error.message
        });
    }
};

// Helper function to update venue rating
const updateVenueRating = async (venueId) => {
    try {
        const reviews = await reviewModel.find({ venue: venueId });

        if (reviews.length === 0) {
            await venueModel.findByIdAndUpdate(venueId, {
                rating: 0,
                numberOfReviews: 0
            });
            return;
        }

        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = Math.round((totalRating / reviews.length) * 10) / 10; // Round to 1 decimal

        await venueModel.findByIdAndUpdate(venueId, {
            rating: averageRating,
            numberOfReviews: reviews.length
        });

        console.log(`Updated venue ${venueId} rating: ${averageRating} (${reviews.length} reviews)`);
    } catch (error) {
        console.error('Error updating venue rating:', error);
    }
};
