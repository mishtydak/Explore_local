/**
 * User Dashboard Page
 * Shows user's wishlist and activity
 */

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getWishlist, removeFromWishlist } from '../services/placeService';
import PlaceCard from '../components/PlaceCard';

const UserDashboard = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadWishlist();
    // Get user's location to calculate distances
    getUserLocation();
  }, [isAuthenticated, navigate]);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const data = await getWishlist();
      setWishlist(data);
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get user's current location for distance calculation
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
      },
      (error) => {
        console.error('Error getting location:', error.message);
        // User may have denied location access; that's fine
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const handleRemoveFromWishlist = async (placeId) => {
    try {
      await removeFromWishlist(placeId);
      loadWishlist();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to remove from wishlist');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.username}!</h1>
        <p>Manage your wishlist and explore hidden gems</p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <Link to="/upload" className="btn btn-primary">
          Upload New Place
        </Link>
      </div>

      <div>
        <h2>My Wishlist ({wishlist.length})</h2>
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading wishlist...</p>
          </div>
        ) : wishlist.length > 0 ? (
          <div className="places-grid">
            {wishlist.map((place) => (
              <div key={place._id}>
                <PlaceCard place={place} userLocation={userLocation} />
                <button
                  onClick={() => handleRemoveFromWishlist(place._id)}
                  className="btn btn-danger"
                  style={{ width: '100%', marginTop: '0.5rem' }}
                >
                  Remove from Wishlist
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
            Your wishlist is empty. Start exploring and add places to your wishlist!
          </p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;

