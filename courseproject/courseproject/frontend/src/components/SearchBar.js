/**
 * Search Bar Component
 * Search and filter places with real-time search
 */

import React, { useState, useEffect } from 'react';

const SearchBar = ({ onSearch, onCategoryChange, searchTerm, category }) => {
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [localCategory, setLocalCategory] = useState('all');

  // Update local state when parent props change
  useEffect(() => {
    setLocalSearchTerm(searchTerm || '');
  }, [searchTerm]);

  useEffect(() => {
    setLocalCategory(category || 'all');
  }, [category]);

  // Debounced search to avoid too many API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(localSearchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [localSearchTerm, onSearch]);

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setLocalCategory(newCategory);
    onCategoryChange(newCategory);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
  };

  const handleSearchClick = () => {
    onSearch(localSearchTerm);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch(localSearchTerm);
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
          onKeyPress={handleKeyPress}
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