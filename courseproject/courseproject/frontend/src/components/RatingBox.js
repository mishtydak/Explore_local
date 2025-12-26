/**
 * Rating Box Component
 * Allows users to rate a place
 */

import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { addRating } from '../services/placeService';

const RatingBox = ({ place, onRatingUpdate }) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Check if user already rated
  const userRating = place.ratings?.find(
    (r) => r.user?._id === user?._id || r.user === user?._id
  );

  const handleRatingClick = async (rating) => {
    if (!isAuthenticated) {
      setMessage('Please login to rate');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await addRating(place._id, rating);
      setMessage('Rating submitted successfully!');
      setSelectedRating(rating);
      if (onRatingUpdate) {
        onRatingUpdate();
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to submit rating');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ padding: '1rem', background: '#f9f9f9', borderRadius: '8px', margin: '1rem 0' }}>
        <p>Please login to rate this place</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem', background: '#f9f9f9', borderRadius: '8px', margin: '1rem 0' }}>
      <h4>Rate this place:</h4>
      <div className="rating" style={{ fontSize: '2rem', cursor: 'pointer' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= (hoveredRating || selectedRating || userRating?.rating || 0) ? 'star' : 'star empty'}
            onClick={() => handleRatingClick(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            style={{ userSelect: 'none' }}
          >
            ★
          </span>
        ))}
      </div>
      {userRating && (
        <p style={{ marginTop: '0.5rem', color: '#666' }}>
          Your rating: {userRating.rating} stars
        </p>
      )}
      {message && (
        <p style={{ marginTop: '0.5rem', color: message.includes('success') ? '#27ae60' : '#e74c3c' }}>
          {message}
        </p>
      )}
      {loading && <p style={{ marginTop: '0.5rem' }}>Submitting...</p>}
    </div>
  );
};

export default RatingBox;

