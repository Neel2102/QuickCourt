import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Star, MessageSquare, Send } from 'lucide-react';
import { createReview } from '../../services/reviewService';

const ReviewForm = ({ venueId, onSubmit, loading = false, onSuccess }) => {
  const [formData, setFormData] = useState({
    rating: 0,
    comment: ''
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Review form submission started:', { venueId, formData });

    if (formData.rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!formData.comment.trim()) {
      toast.error('Please enter a review comment');
      return;
    }

    if (formData.comment.length < 10) {
      toast.error('Review comment must be at least 10 characters long');
      return;
    }

    setIsSubmitting(true);
    try {
      const reviewData = {
        venueId,
        rating: formData.rating,
        comment: formData.comment.trim()
      };

      console.log('Sending review data:', reviewData);
      const result = await createReview(reviewData);
      console.log('Review creation result:', result);

      toast.success('Review submitted successfully!');

      // Reset form after successful submission
      setFormData({
        rating: 0,
        comment: ''
      });

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(result.data);
      }

      // Call onSubmit callback if provided (for backward compatibility)
      if (onSubmit) {
        onSubmit(result.data);
      }
    } catch (error) {
      console.error('Review submission error:', error);
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isFilled = starValue <= (hoveredRating || formData.rating);
      
      return (
        <button
          key={index}
          type="button"
          onClick={() => handleRatingChange(starValue)}
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
          className={`star-button transition-colors ${
            isFilled ? 'star-filled' : 'star-empty'
          } hover:star-hover`}
          disabled={loading || isSubmitting}
          style={{
            background: 'none',
            border: 'none',
            padding: '4px',
            cursor: loading || isSubmitting ? 'not-allowed' : 'pointer',
            color: isFilled ? '#fbbf24' : '#d1d5db'
          }}
        >
          <Star
            className="w-8 h-8"
            fill={isFilled ? 'currentColor' : 'none'}
            stroke="currentColor"
          />
        </button>
      );
    });
  };

  const getRatingText = () => {
    const rating = hoveredRating || formData.rating;
    switch (rating) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return 'Select Rating';
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <MessageSquare className="mr-2" size={24} />
        Write a Review
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Your Rating *
          </label>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-1">
              {renderStars()}
            </div>
            <span className="text-lg font-medium text-gray-700">
              {getRatingText()}
            </span>
          </div>
        </div>



        {/* Review Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Review Comment *
          </label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
            rows={5}
            maxLength={500}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Share your detailed experience about the venue, facilities, service, etc..."
            required
            disabled={loading || isSubmitting}
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.comment.length}/500 characters (minimum 10)
          </p>
        </div>

        {/* Review Guidelines */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Review Guidelines:</h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Be honest and constructive in your feedback</li>
            <li>• Focus on your personal experience</li>
            <li>• Mention specific aspects like facilities, service, cleanliness</li>
            <li>• Avoid offensive or inappropriate language</li>
            <li>• Reviews help other users make informed decisions</li>
          </ul>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || isSubmitting || formData.rating === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2" size={16} />
                Submit Review
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm; 
