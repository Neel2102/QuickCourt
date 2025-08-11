import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Star, ThumbsUp, MessageSquare, Calendar, User, ChevronDown, Filter } from 'lucide-react';
import { getVenueReviews } from '../../services/reviewService';
import { formatDate } from '../../utils/dateUtils';
import './ReviewList.css';

const ReviewList = ({ venueId, refreshTrigger = 0 }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [ratingDistribution, setRatingDistribution] = useState({});
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [venueId, currentPage, sortBy, refreshTrigger]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await getVenueReviews(venueId, {
        page: currentPage,
        limit: 10,
        sort: sortBy
      });

      if (response.success) {
        setReviews(response.data.reviews);
        setPagination(response.data.pagination);
        setRatingDistribution(response.data.ratingDistribution);
        setAverageRating(response.data.averageRating);
        setTotalReviews(response.data.totalReviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => {
      const isFilled = index < rating;
      return (
        <Star
          key={index}
          className={`w-4 h-4 ${
            isFilled ? 'text-yellow-400' : 'text-gray-300'
          }`}
          fill={isFilled ? 'currentColor' : 'none'}
          stroke="currentColor"
          style={{
            color: isFilled ? '#fbbf24' : '#d1d5db',
            display: 'inline-block'
          }}
        />
      );
    });
  };

  const renderRatingDistribution = () => {
    const maxCount = Math.max(...Object.values(ratingDistribution));
    
    return (
      <div className="rating-distribution">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Rating Breakdown</h4>
        {[5, 4, 3, 2, 1].map(rating => {
          const count = ratingDistribution[rating] || 0;
          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
          
          return (
            <div key={rating} className="rating-bar">
              <div className="rating-label">
                <span className="text-sm">{rating}</span>
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
              </div>
              <div className="rating-progress">
                <div 
                  className="rating-progress-fill"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="rating-count">{count}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="review-list-container">
        <div className="loading-state">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p>Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="review-list-container">
      {/* Reviews Header */}
      <div className="reviews-header">
        <div className="reviews-summary">
          <div className="average-rating">
            <div className="rating-display">
              <span className="rating-number">{averageRating.toFixed(1)}</span>
              <div className="rating-stars">
                {renderStars(Math.round(averageRating))}
              </div>
            </div>
            <p className="rating-text">
              Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
            </p>
          </div>
          
          {totalReviews > 0 && (
            <div className="rating-breakdown">
              {renderRatingDistribution()}
            </div>
          )}
        </div>

        {/* Filters and Sorting */}
        {totalReviews > 0 && (
          <div className="reviews-controls">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="filter-toggle"
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {showFilters && (
              <div className="filters-panel">
                <div className="sort-options">
                  <label className="filter-label">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="sort-select"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="highest">Highest Rating</option>
                    <option value="lowest">Lowest Rating</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="no-reviews">
          <MessageSquare className="w-12 h-12 text-gray-400" />
          <h3>No reviews yet</h3>
          <p>Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review._id} className="review-item">
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="reviewer-avatar">
                    {review.user.profilePic ? (
                      <img 
                        src={review.user.profilePic} 
                        alt={review.user.name}
                        className="avatar-image"
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        <User className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <div className="reviewer-details">
                    <h4 className="reviewer-name">{review.user.name}</h4>
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
              </div>

              {review.comment && (
                <div className="review-content">
                  <p>{review.comment}</p>
                </div>
              )}
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

export default ReviewList;
