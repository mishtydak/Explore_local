/**
 * Search Bar Component
 * Search and filter places with real-time search
 */

import React, { useState, useEffect } from 'react';

const SearchBar = ({ onSearch, onLocationSearch, onCategoryChange, searchTerm, category }) => {
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [localCategory, setLocalCategory] = useState('all');

  // Update local state when parent props change
  useEffect(() => {
    setLocalSearchTerm(searchTerm || '');
  }, [searchTerm]);

  useEffect(() => {
    setLocalCategory(category || 'all');
  }, [category]);

  // Function to geocode location name to coordinates
  const geocodeLocation = async (locationName) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon)
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding failed:', error);
      return null;
    }
  };

  // Auto-search disabled. Searches run only on Enter or Search button to avoid refreshing while typing.

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setLocalCategory(newCategory);
    onCategoryChange(newCategory);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
  };

  const handleSearchClick = async () => {
    const term = localSearchTerm.trim();
    if (!term) {
      onSearch('');
      return;
    }

    const location = await geocodeLocation(term);
    if (location && onLocationSearch) {
      onLocationSearch(location);
    } else {
      onSearch(term);
    }
  };

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      await handleSearchClick();
    }
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search places..."
          value={localSearchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <select value={localCategory} onChange={handleCategoryChange}>
          <option value="all">All Categories</option>
          <option value="restaurant">Restaurant</option>
          <option value="cafe">Cafe</option>
          <option value="park">Park</option>
          <option value="museum">Museum</option>
          <option value="beach">Beach</option>
          <option value="mountain">Mountain</option>
          <option value="market">Market</option>
          <option value="other">Other</option>
        </select>
        <button 
          type="button" 
          className="btn btn-primary"
          onClick={handleSearchClick}
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;