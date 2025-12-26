/**
 * Search Bar Component
 * Search and filter places
 */

import React, { useState } from 'react';

const SearchBar = ({ onSearch, onCategoryChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
    onCategoryChange(newCategory);
  };

  return (
    <form className="search-bar" onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Search places..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select value={category} onChange={handleCategoryChange}>
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
      <button type="submit" className="btn btn-primary">
        Search
      </button>
    </form>
  );
};

export default SearchBar;

