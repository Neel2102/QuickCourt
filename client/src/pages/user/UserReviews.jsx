import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Star, MessageSquare, Edit, Trash2, Calendar, MapPin } from 'lucide-react';
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

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isFilled = starValue <= rating;

      return (
        <button
          key={index}
          type="button"
          onClick={interactive ? () => onRatingChange(starValue) : undefined}
          className={`star ${interactive ? 'interactive' : ''} ${isFilled ? 'filled' : ''}`}
          disabled={!interactive}
          style={{
            background: 'none',
            border: 'none',
            padding: '2px',
            cursor: interactive ? 'pointer' : 'default',
            color: isFilled ? '#fbbf24' : '#d1d5db'
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
      <div className="user-reviews-container">
        <div className="loading-state">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p>Loading your reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-reviews-container">
      <div className="page-header">
        <div className="header-content">
          <MessageSquare className="w-6 h-6" />
          <div>
            <h1>My Reviews</h1>
            <p>Manage your venue reviews and ratings</p>
          </div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="no-reviews">
          <MessageSquare className="w-12 h-12 text-gray-400" />
          <h3>No reviews yet</h3>
          <p>You haven't written any reviews yet. Complete a booking and share your experience!</p>
        </div>
      ) : (
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review._id} className="review-card">
              <div className="review-header">
                <div className="venue-info">
                  <div className="venue-image">
                    {review.venue.photos && review.venue.photos.length > 0 ? (
                      <img 
                        src={review.venue.photos[0]} 
                        alt={review.venue.name}
                        className="venue-thumbnail"
                      />
                    ) : (
                      <div className="venue-placeholder">
                        <MapPin className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="venue-details">
                    <h3>{review.venue.name}</h3>
                    <div className="review-meta">
                      <div className="review-rating">
                        {renderStars(review.rating)}
                      </div>
                      <span className="review-date">
                        <Calendar className="w-3 h-3" />
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="review-actions">
                  <button
                    onClick={() => handleEditReview(review)}
                    className="action-btn edit-btn"
                    title="Edit review"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="action-btn delete-btn"
                    title="Delete review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="review-content">
                {editingReview === review._id ? (
                  <div className="edit-form">
                    <div className="form-group">
                      <label>Rating:</label>
                      <div className="rating-input">
                        {renderStars(
                          editFormData.rating, 
                          true, 
                          (rating) => setEditFormData(prev => ({ ...prev, rating }))
                        )}
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label>Comment:</label>
                      <textarea
                        value={editFormData.comment}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, comment: e.target.value }))}
                        rows={4}
                        maxLength={500}
                        className="comment-input"
                        placeholder="Share your experience..."
                      />
                      <small>{editFormData.comment.length}/500 characters</small>
                    </div>
                    
                    <div className="form-actions">
                      <button
                        onClick={() => handleUpdateReview(review._id)}
                        className="save-btn"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="cancel-btn"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="review-text">
                    <p>{review.comment}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!pagination.hasPrev}
            className="pagination-btn"
          >
            Previous
          </button>
          
          <div className="pagination-info">
            Page {pagination.currentPage} of {pagination.totalPages}
          </div>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!pagination.hasNext}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default UserReviews;
