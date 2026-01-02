/**
 * Preferences Page
 * Allows users to select their favorite place categories
 */

import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { updateUserPreferences } from '../services/placeService';

const Preferences = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const categories = [
    'restaurant',
    'cafe',
    'park',
    'museum',
    'beach',
    'mountain',
    'market',
    'temple',
    'other'
  ];

  const handlePreferenceSelect = (category) => {
    if (selectedPreferences.includes(category)) {
      // Remove if already selected
      setSelectedPreferences(selectedPreferences.filter(pref => pref !== category));
    } else if (selectedPreferences.length < 3) {
      // Add if less than 3 selected
      setSelectedPreferences([...selectedPreferences, category]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update user preferences in the backend
      const response = await updateUserPreferences(user._id, { preferences: selectedPreferences });
      
      // Update user context with new preferences
      updateUser({ ...user, preferences: selectedPreferences });
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating preferences:', error);
      alert('Error saving preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If user already has preferences, redirect to dashboard
  useEffect(() => {
    if (user && user.preferences && user.preferences.length > 0) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
  <div className="preferences-container">
    <div className="preferences-card">
      <h2 className="title">Choose Your Interests</h2>
      <p className="subtitle">Select up to 3 place categories you're most interested in</p>

      <form onSubmit={handleSubmit}>
        <div className="preferences-grid">
          {categories.map((category) => (
            <div
              key={category}
              className={`preference-option ${selectedPreferences.includes(category) ? 'selected' : ''}`}
              onClick={() => handlePreferenceSelect(category)}
            >
              <span className="preference-name">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </span>

              {selectedPreferences.includes(category) && (
                <span className="selected-checkmark">✓</span>
              )}
            </div>
          ))}
        </div>

        <div className="preferences-selection-count">
          Selected: {selectedPreferences.length}/3
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={selectedPreferences.length === 0 || loading}
        >
          {loading ? 'Saving…' : 'Save Preferences'}
        </button>
      </form>
    </div>
  </div>
);

};

export default Preferences;