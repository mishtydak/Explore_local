/**
 * Place Card Component
 * Displays a place in card format
 */

import React from 'react';
import { Link } from 'react-router-dom';

const PlaceCard = ({ place }) => {
  if (!place) return null;
  const imageUrl =
    place.images && place.images.length > 0
      ? place.images[0] // <- use the string URL directly
      : 'https://via.placeholder.com/300x200?text=No+Image';

  return (
    <div className="card">
      <img src={imageUrl} alt={place.name} className="card-image" />
      <div className="card-content">
        <h3 className="card-title">{place.name}</h3>
        <p className="card-description">{place.description}</p>
        <div className="card-footer">
          <div>
            <span className="rating">
              {'★'.repeat(Math.floor(place.averageRating || 0))}
              {'☆'.repeat(5 - Math.floor(place.averageRating || 0))}
            </span>
            <span style={{ marginLeft: '0.5rem', color: '#666' }}>
              ({place.totalRatings || 0})
            </span>
          </div>
          <Link to={`/place/${place._id}`} className="btn btn-primary">
            View Details
          </Link>
        </div>
        <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#999' }}>
          📍 {place.category} • {place.location?.address || 'Location'}
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;
