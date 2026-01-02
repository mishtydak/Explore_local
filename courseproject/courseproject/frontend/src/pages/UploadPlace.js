/**
 * Upload Place Page
 * Allows users to upload new places
 */

import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { createPlace } from '../services/placeService';
// Replaced map picker with Nominatim autocomplete search

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
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const searchTimer = React.useRef(null);

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

  const detectMyLocation = async () => {
    setIsDetectingLocation(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setIsDetectingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
        
        // Reverse geocode the coordinates to get address
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          const data = await response.json();
          
          if (data && data.address) {
            const address = data.address;
            
            // Extract city, area, and landmark information
            const city = address.city || address.town || address.village || '';
            const area = address.suburb || address.neighbourhood || address.city_district || '';
            
            setFormData(prev => ({
              ...prev,
              address: `${city}, ${area}`.trim().replace(/, $/, '')
            }));
          }
        } catch (err) {
          console.error('Reverse geocoding failed:', err);
          // Continue without address if geocoding fails
        }
        
        setIsDetectingLocation(false);
      },
      (error) => {
        setError(`Unable to retrieve your location: ${error.message}`);
        setIsDetectingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
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
            <label>Search your area / place / landmark *</label>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={detectMyLocation}
                disabled={isDetectingLocation}
                style={{ padding: '8px 12px', fontSize: '0.9rem' }}
              >
                {isDetectingLocation ? 'Detecting...' : '📍 Detect My Location'}
              </button>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="Search your area / place / landmark"
                value={searchQuery}
                onChange={(e) => {
                  const v = e.target.value;
                  setSearchQuery(v);
                  setSuggestions([]);

                  if (searchTimer.current) clearTimeout(searchTimer.current);

                  if (v && v.length >= 3) {
                    // debounce
                    searchTimer.current = setTimeout(async () => {
                      try {
                        const res = await fetch(
                          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=6&q=${encodeURIComponent(v)}`
                        );
                        const data = await res.json();
                        setSuggestions(Array.isArray(data) ? data : []);
                      } catch (err) {
                        console.error('Nominatim search failed', err);
                      }
                    }, 300);
                  }
                }}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />

              {suggestions.length > 0 && (
                <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0', border: '1px solid #ddd', borderRadius: 4, maxHeight: 220, overflow: 'auto' }}>
                  {suggestions.map((s) => (
                    <li
                      key={s.place_id}
                      style={{ padding: '8px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                      onClick={() => {
                        const lat = parseFloat(s.lat);
                        const lon = parseFloat(s.lon);
                        setLatitude(lat);
                        setLongitude(lon);
                        setFormData(prev => ({ ...prev, address: s.display_name }));
                        setSearchQuery(s.display_name);
                        setSuggestions([]);
                      }}
                    >
                      <div style={{ fontSize: '0.95rem' }}>{s.display_name}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

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