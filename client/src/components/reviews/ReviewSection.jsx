import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Star, MessageSquare, Plus, X } from 'lucide-react';
import ReviewForm from '../forms/ReviewForm';
import ReviewList from './ReviewList';
import { getUserProfile } from '../../services/userService';
import { checkReviewEligibility as checkEligibilityAPI } from '../../services/reviewService';
import './ReviewSection.css';

const ReviewSection = ({ venueId, venueName }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    checkUserEligibility();
  }, [venueId]);

  const checkUserEligibility = async () => {
    const timeoutId = setTimeout(() => {
      console.log('Eligibility check timeout - setting loading to false');
      setLoading(false);
      // If timeout, allow review for logged in users (fallback)
      if (user) {
        setCanReview(true);
        setHasReviewed(false);
      }
    }, 5000); // 5 second timeout

    try {
      setLoading(true);
      console.log('Starting eligibility check for venue:', venueId);

      // Get user profile first
      const userProfile = await getUserProfile();
      console.log('User profile:', userProfile ? 'Found' : 'Not found');
      setUser(userProfile);

      if (!userProfile) {
        console.log('No user profile found, user not logged in');
        setCanReview(false);
        setHasReviewed(false);
        clearTimeout(timeoutId);
        return;
      }

      // Check review eligibility using the new API endpoint
      console.log('Calling eligibility API for venue:', venueId);

      try {
        const eligibilityResponse = await checkEligibilityAPI(venueId);
        console.log('Eligibility API response:', eligibilityResponse);

        if (eligibilityResponse.success) {
          const { canReview, hasBooking, hasReviewed, debug } = eligibilityResponse.data;
          setCanReview(canReview);
          setHasReviewed(hasReviewed);

          console.log('Review eligibility result:', {
            canReview,
            hasBooking,
            hasReviewed,
            debug
          });
        } else {
          console.log('Eligibility check failed:', eligibilityResponse.message);
          // Fallback: allow logged in users to review
          setCanReview(true);
          setHasReviewed(false);
        }
      } catch (apiError) {
        console.error('API call failed, using fallback:', apiError);
        // Fallback: allow logged in users to review
        setCanReview(true);
        setHasReviewed(false);
      }

    } catch (error) {
      console.error('Error checking review eligibility:', error);
      // If user is not logged in or there's an error, they can't review
      setCanReview(false);
      setHasReviewed(false);

      // Only set user to null if it's an authentication error
      if (error.message && error.message.includes('Not Authorized')) {
        setUser(null);
      }
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
      console.log('Eligibility check completed');
    }
  };

  const handleReviewSuccess = (newReview) => {
    setShowReviewForm(false);
    setHasReviewed(true);
    setRefreshTrigger(prev => prev + 1); // Trigger review list refresh
    toast.success('Thank you for your review!');
  };

  const renderReviewButton = () => {
    if (loading) {
      return (
        <div className="review-button-loading">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span>Checking eligibility...</span>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="review-login-prompt">
          <MessageSquare className="w-5 h-5" />
          <span>Please log in to write a review</span>
        </div>
      );
    }

    if (!canReview) {
      return (
        <div className="review-not-eligible">
          <MessageSquare className="w-5 h-5" />
          <span>You need a confirmed booking to write a review</span>
        </div>
      );
    }

    if (hasReviewed) {
      return (
        <div className="review-already-submitted">
          <Star className="w-5 h-5 text-yellow-400" />
          <span>You have already reviewed this venue</span>
        </div>
      );
    }

    return (
      <button
        onClick={() => setShowReviewForm(true)}
        className="write-review-btn"
      >
        <Plus className="w-5 h-5" />
        Write a Review
      </button>
    );
  };

  return (
    <div className="review-section">
      <div className="review-section-header">
        <div className="section-title">
          <MessageSquare className="w-6 h-6" />
          <h2>Reviews & Ratings</h2>
        </div>
        
        <div className="review-actions">
          {renderReviewButton()}
        </div>
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="review-form-modal">
          <div className="modal-backdrop" onClick={() => setShowReviewForm(false)} />
          <div className="modal-content">
            <div className="modal-header">
              <h3>Write a Review for {venueName}</h3>
              <button
                onClick={() => setShowReviewForm(false)}
                className="modal-close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="modal-body">
              <ReviewForm
                venueId={venueId}
                onSuccess={handleReviewSuccess}
                loading={false}
              />
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <ReviewList 
        venueId={venueId} 
        refreshTrigger={refreshTrigger}
      />
    </div>
  );
};

export default ReviewSection;
