/**
 * Place Details Page
 * Shows detailed information about a place
 */

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPlace, deletePlace } from '../services/placeService';
import WeatherWidget from '../components/WeatherWidget';
import MapEmbed from '../components/MapEmbed';
import RatingBox from '../components/RatingBox';
import CommentBox from '../components/CommentBox';
import { AuthContext } from '../context/AuthContext';

const PlaceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useContext(AuthContext);

  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPlace();
  }, [id]);

  const loadPlace = async () => {
    try {
      setLoading(true);
      const data = await getPlace(id);
      setPlace(data);
    } catch (error) {
      console.error('Error loading place:', error);
      setError('Place not found');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this place?')) {
      return;
    }

    try {
      await deletePlace(id);
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete place');
    }
  };

  const isOwner =
    place &&
    user &&
    (place.uploadedBy?._id === user._id ||
      place.uploadedBy === user._id ||
      place.uploadedBy?.toString() === user._id?.toString());

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading place details...</p>
        </div>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>{error || 'Place not found'}</p>
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Use first image as a main one if needed (can also be used for SEO/preview)
  const mainImageSrc =
    place.images && place.images.length > 0
      ? place.images[0]
      : 'https://via.placeholder.com/800x400?text=No+Image';

  return (
    <div className="container">
      <div style={{ maxWidth: '1000px', margin: '2rem auto' }}>
        <Link to="/" className="btn btn-secondary" style={{ marginBottom: '1rem' }}>
          ← Back to Home
        </Link>

        {(isOwner || isAdmin) && (
          <div style={{ marginBottom: '1rem' }}>
            <button onClick={handleDelete} className="btn btn-danger">
              Delete Place
            </button>
          </div>
        )}

        <div className="card" style={{ marginBottom: '2rem' }}>
          {place.images && place.images.length > 0 && (
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', padding: '1rem' }}>
              {place.images.map((imageUrl, index) => (
                <img
                  key={index}
                  src={imageUrl} // imageUrl is a string URL
                  alt={`${place.name} ${index + 1}`}
                  style={{ maxHeight: '400px', borderRadius: '8px' }}
                />
              ))}
            </div>
          )}

          {/* If you want at least one image always, you could instead render mainImageSrc unconditionally */}

          <div className="card-content">
            <h1 className="card-title">{place.name}</h1>
            <div style={{ marginBottom: '1rem', color: '#666' }}>
              <span>📍 {place.category}</span>
              {place.location?.address && (
                <span style={{ marginLeft: '1rem' }}>• {place.location.address}</span>
              )}
            </div>
            <div className="rating" style={{ marginBottom: '1rem' }}>
              {'★'.repeat(Math.floor(place.averageRating || 0))}
              {'☆'.repeat(5 - Math.floor(place.averageRating || 0))}
              <span style={{ marginLeft: '0.5rem' }}>
                {place.averageRating || 0} ({place.totalRatings || 0} ratings)
              </span>
            </div>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1rem' }}>
              {place.description}
            </p>
            <p style={{ color: '#999', fontSize: '0.9rem' }}>
              Uploaded by {place.uploaderName || place.uploadedBy?.username || 'Unknown'}
            </p>
          </div>
        </div>

        {place.videos && place.videos.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h3>Videos</h3>
            {place.videos.map((videoUrl, index) => (
              <video
                key={index}
                src={videoUrl} // videoUrl is a string URL
                controls
                style={{
                  width: '100%',
                  maxHeight: '500px',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                }}
              />
            ))}
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            marginBottom: '2rem',
          }}
        >
          <div>
            <WeatherWidget
              latitude={place.location?.latitude}
              longitude={place.location?.longitude}
            />
          </div>
          <div>
            <h3>Location</h3>
            <MapEmbed
              latitude={place.location?.latitude}
              longitude={place.location?.longitude}
              name={place.name}
            />
          </div>
        </div>

        <RatingBox place={place} onRatingUpdate={loadPlace} />

        <CommentBox place={place} onCommentUpdate={loadPlace} />
      </div>
    </div>
  );
};

export default PlaceDetails;
