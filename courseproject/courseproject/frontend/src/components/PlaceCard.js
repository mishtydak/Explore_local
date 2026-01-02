/**
 * Place Card Component
 * Displays a place in card format
 */

import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { addToWishlist, removeFromWishlist } from '../services/placeService';

const PlaceCard = ({ place, userLocation }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [saved, setSaved] = useState(false);

  if (!place) return null;

  const imageUrl =
    place.images && place.images.length > 0
      ? place.images[0].url || place.images[0]
      : 'https://via.placeholder.com/300x200?text=No+Image';

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      alert('Please login to save places');
      return;
    }

    try {
      if (saved) {
        await removeFromWishlist(place._id);
        setSaved(false);
      } else {
        await addToWishlist(place._id);
        setSaved(true);
      }
    } catch (error) {
      console.error('Wishlist error:', error);
      const message =
         error.response?.data?.message || 'Wishlist action failed';
      alert(message);
    }
  };
  
  // Function to calculate distance between two coordinates (in kilometers)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c;
    return distance;
  };
  
  // Calculate distance if user location is available
  const distance = userLocation && place.latitude && place.longitude
    ? calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        place.latitude,
        place.longitude
      )
    : null;
  
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

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to={`/place/${place._id}`} className="btn btn-primary">
              View Details
            </Link>

            <button
              className="btn btn-secondary"
              onClick={handleWishlist}
            >
              {saved ? '❤️ Saved' : '🤍 Save'}
            </button>
          </div>
        </div>

        <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#999' }}>
          📍 {place.category} • {place.location?.address || 'Location'}
          {distance !== null && (
            <span style={{ display: 'block', marginTop: '0.25rem' }}>
              📍 {distance.toFixed(2)} km away
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;
