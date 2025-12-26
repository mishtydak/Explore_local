/**
 * Upload Place Page
 * Allows users to upload new places
 */

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { createPlace } from '../services/placeService';

const UploadPlace = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'other',
    latitude: '',
    longitude: '',
    address: '',
  });

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  React.useEffect(() => {
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

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleVideoChange = (e) => {
    setVideos(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.name || !formData.description || !formData.latitude || !formData.longitude) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const files = {
        images: images.length > 0 ? images : null,
        videos: videos.length > 0 ? videos : null,
      };

      await createPlace(formData, files);
      setSuccess('Place uploaded successfully!');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        category: 'other',
        latitude: '',
        longitude: '',
        address: '',
      });
      setImages([]);
      setVideos([]);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to upload place');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container">
      <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Upload a Hidden Gem</h2>
        
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-group">
            <label>Place Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter place name"
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe this hidden gem..."
              rows="5"
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select name="category" value={formData.category} onChange={handleChange} required>
              <option value="restaurant">Restaurant</option>
              <option value="cafe">Cafe</option>
              <option value="park">Park</option>
              <option value="museum">Museum</option>
              <option value="beach">Beach</option>
              <option value="mountain">Mountain</option>
              <option value="market">Market</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Latitude *</label>
            <input
              type="number"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              required
              step="any"
              placeholder="e.g., 40.7128"
            />
          </div>

          <div className="form-group">
            <label>Longitude *</label>
            <input
              type="number"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              required
              step="any"
              placeholder="e.g., -74.0060"
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street address (optional)"
            />
          </div>

          <div className="form-group">
            <label>Images (max 10)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
            {images.length > 0 && (
              <p style={{ marginTop: '0.5rem', color: '#666' }}>
                {images.length} image(s) selected
              </p>
            )}
          </div>

          <div className="form-group">
            <label>Videos (max 5)</label>
            <input
              type="file"
              accept="video/*"
              multiple
              onChange={handleVideoChange}
            />
            {videos.length > 0 && (
              <p style={{ marginTop: '0.5rem', color: '#666' }}>
                {videos.length} video(s) selected
              </p>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Uploading...' : 'Upload Place'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPlace;

