/**
 * Home Page
 * Displays all places with search and filter functionality
 */

import React, { useState, useEffect } from 'react';
import { getPlaces, getRecommendations } from '../services/placeService';
import PlaceCard from '../components/PlaceCard';
import SearchBar from '../components/SearchBar';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const [places, setPlaces] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    loadPlaces();
    if (isAuthenticated) {
      loadRecommendations();
    }
  }, [category, searchTerm, isAuthenticated]); // Added searchTerm to dependency array

  const loadPlaces = async () => {
    try {
      setLoading(true);
      const data = await getPlaces(category, searchTerm);
      setPlaces(data);
    } catch (error) {
      console.error('Error loading places:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendations = async () => {
    try {
      const data = await getRecommendations();
      setRecommendations(data);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading places...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center', margin: '2rem 0' }}>
        🌍 Discover Hidden Gems
      </h1>

      <SearchBar 
        onSearch={handleSearch} 
        onCategoryChange={handleCategoryChange} 
        searchTerm={searchTerm}
        category={category}
      />

      <div style={{ marginTop: '3rem' }}>
        <h2>{category === 'all' ? 'All Places' : `${category.charAt(0).toUpperCase() + category.slice(1)} Places`}</h2>
        {places.length > 0 ? (
          <div className="places-grid">
            {places.map((place) => (
              <PlaceCard key={place._id} place={place} />
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
            No places found. Be the first to upload a hidden gem!
          </p>
        )}
        {isAuthenticated && recommendations.length > 0 && (
        <div style={{ marginTop: '3rem' }}>
          <h2>Recommended for You</h2>
          <div className="places-grid">
            {recommendations.map((place) => (
              <PlaceCard key={place._id} place={place} />
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Home;