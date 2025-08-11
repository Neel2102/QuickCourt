import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Star, MessageSquare, Edit, Trash2, Calendar, MapPin, Heart } from 'lucide-react';
import { getUserReviews, updateReview, deleteReview } from '../../services/reviewService';
import { formatDate } from '../../utils/dateUtils';
import '../../CSS/UserReviews.css';

const UserReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [editingReview, setEditingReview] = useState(null);
  const [editFormData, setEditFormData] = useState({ rating: 0, comment: '' });
  const [likedReviews, setLikedReviews] = useState(new Set());

  useEffect(() => {
    fetchUserReviews();
  }, [currentPage]);

  const fetchUserReviews = async () => {
    try {
      setLoading(true);
      const response = await getUserReviews({ page: currentPage, limit: 10 });
      
      if (response.success) {
        setReviews(response.data.reviews);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      toast.error('Failed to load your reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review._id);
    setEditFormData({
      rating: review.rating,
      comment: review.comment
    });
  };

  const handleUpdateReview = async (reviewId) => {
    try {
      if (editFormData.rating === 0) {
        toast.error('Please select a rating');
        return;
      }

      if (!editFormData.comment.trim()) {
        toast.error('Please enter a comment');
        return;
      }

      const response = await updateReview(reviewId, editFormData);
      
      if (response.success) {
        toast.success('Review updated successfully');
        setEditingReview(null);
        fetchUserReviews(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating review:', error);
      toast.error(error.message || 'Failed to update review');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      const response = await deleteReview(reviewId);
      
      if (response.success) {
        toast.success('Review deleted successfully');
        fetchUserReviews(); // Refresh the list
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error(error.message || 'Failed to delete review');
    }
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setEditFormData({ rating: 0, comment: '' });
  };

  const handleLikeReview = (reviewId) => {
    setLikedReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isFilled = starValue <= rating;

      return (
        <button
          key={index}
          type="button"
          onClick={interactive ? () => onRatingChange(starValue) : undefined}
          className={`star-review ${interactive ? 'interactive' : ''} ${isFilled ? 'filled' : ''}`}
          disabled={!interactive}
          style={{
            background: 'none',
            border: 'none',
            padding: '2px',
            cursor: interactive ? 'pointer' : 'default',
            color: isFilled ? '#9ca3af' : '#9e9e9e'
          }}
        >
          <Star
            className="w-4 h-4"
            fill={isFilled ? 'currentColor' : 'none'}
            stroke="currentColor"
          />
        </button>
      );
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="user-reviews-container-review">
        <div className="loading-state-review">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-color"></div>
          <p>Loading your reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-reviews-container-review">
      <div className="page-header-review">
        <div className="header-content-review">
          <MessageSquare className="w-6 h-6" />
          <div>
            <h1>My Reviews</h1>
            <p>Manage your venue reviews and ratings</p>
          </div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="no-reviews-review">
          <MessageSquare className="w-12 h-12 text-gray-400" />
          <h3>No reviews yet</h3>
          <p>You haven't written any reviews yet. Complete a booking and share your experience!</p>
        </div>
      ) : (
        <div className="reviews-list-review">
          {reviews.map((review) => (
            <div key={review._id} className="review-card-review">
              <div className="review-header-review">
                <div className="venue-info-review">
                  <div className="venue-image-review">
                    {review.venue.photos && review.venue.photos.length > 0 ? (
                      <img 
                        src={review.venue.photos[0]} 
                        alt={review.venue.name}
                        className="venue-thumbnail-review"
                      />
                    ) : (
                      <div className="venue-placeholder-review">
                        <MapPin className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="venue-details-review">
                    <h3>{review.venue.name}</h3>
                    <div className="review-meta-review">
                      <div className="review-rating-review">
                        {renderStars(review.rating)}
                      </div>
                      <span className="review-date-review">
                        <Calendar className="w-3 h-3" />
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="review-actions-review">
                  <button
                    onClick={() => handleEditReview(review)}
                    className="action-btn-review edit-btn-review"
                    title="Edit review"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="action-btn-review delete-btn-review"
                    title="Delete review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="review-content-review">
                {editingReview === review._id ? (
                  <div className="edit-form-review">
                    <div className="form-group-review">
                      <label>Rating:</label>
                      <div className="rating-input-review">
                        {renderStars(
                          editFormData.rating, 
                          true, 
                          (rating) => setEditFormData(prev => ({ ...prev, rating }))
                        )}
                      </div>
                    </div>
                    
                    <div className="form-group-review">
                      <label>Comment:</label>
                      <textarea
                        value={editFormData.comment}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, comment: e.target.value }))}
                        rows={4}
                        maxLength={500}
                        className="comment-input-review"
                        placeholder="Share your experience..."
                      />
                      <small>{editFormData.comment.length}/500 characters</small>
                    </div>
                    
                    <div className="form-actions-review">
                      <button
                        onClick={() => handleUpdateReview(review._id)}
                        className="save-btn-review"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="cancel-btn-review"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="review-text-review">
                      <p>{review.comment}</p>
                    </div>
                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleLikeReview(review._id)}
                        className={`like-btn-review ${likedReviews.has(review._id) ? 'liked' : ''}`}
                      >
                        <Heart 
                          className="w-4 h-4" 
                          fill={likedReviews.has(review._id) ? 'currentColor' : 'none'}
                        />
                        <span>{likedReviews.has(review._id) ? 'Liked' : 'Like'}</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="pagination-review">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!pagination.hasPrev}
            className="pagination-btn-review"
          >
            Previous
          </button>
          
          <div className="pagination-info-review">
            Page {pagination.currentPage} of {pagination.totalPages}
          </div>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!pagination.hasNext}
            className="pagination-btn-review"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default UserReviews;