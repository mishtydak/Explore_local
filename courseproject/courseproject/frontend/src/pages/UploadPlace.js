/**
 * Upload Place Page
 * Allows users to upload new places
 */

import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { createPlace } from '../services/placeService';
import LeafletMapPicker from '../components/LeafletMapPicker';

const UploadPlace = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'other',
    address: '',
  });

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.description || !latitude || !longitude) {
      setError('Please fill all required fields and select a location on map');
      return;
    }

    setLoading(true);

    try {
      const files = {
        images: images.length > 0 ? images : null,
        videos: videos.length > 0 ? videos : null,
      };

      await createPlace(
        {
          ...formData,
          latitude,
          longitude,
        },
        files
      );

      setSuccess('Place uploaded successfully!');

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to upload place');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="container">
      <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          Upload a Hidden Gem
        </h2>

        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-group">
            <label>Place Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              required
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="restaurant">Restaurant</option>
              <option value="cafe">Cafe</option>
              <option value="park">Park</option>
              <option value="museum">Museum</option>
              <option value="beach">Beach</option>
              <option value="mountain">Mountain</option>
              <option value="market">Market</option>
              <option value="temple">Temple</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Select Location on Map *</label>

            <LeafletMapPicker
              onSelect={(lat, lng) => {
                setLatitude(lat);
                setLongitude(lng);
              }}
            />

            {latitude && longitude && (
              <p style={{ marginTop: '0.5rem', color: '#666' }}>
                Selected: {latitude.toFixed(5)}, {longitude.toFixed(5)}
              </p>
            )}
          </div>

          <div className="form-group">
            <label>Address (optional)</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setImages([...e.target.files])}
            />
          </div>

          <div className="form-group">
            <label>Videos</label>
            <input
              type="file"
              accept="video/*"
              multiple
              onChange={(e) => setVideos([...e.target.files])}
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Uploading...' : 'Upload Place'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPlace;
