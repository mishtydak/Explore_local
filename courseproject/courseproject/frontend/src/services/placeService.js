/**
 * Place Service
 * API calls for place-related operations
 */

import api from './api';

// Get all places
export const getPlaces = async (category = 'all', search = '') => {
  const params = {};
  if (category !== 'all') params.category = category;
  if (search) params.search = search;
  
  const response = await api.get('/places', { params });
  return response.data;
};

// Get single place
export const getPlace = async (id) => {
  const response = await api.get(`/places/${id}`);
  return response.data;
};

// Create place
export const createPlace = async (placeData, files) => {
  const formData = new FormData();
  
  // Add text fields
  Object.keys(placeData).forEach((key) => {
    formData.append(key, placeData[key]);
  });
  
  // Add images
  if (files.images) {
    Array.from(files.images).forEach((image) => {
      formData.append('images', image);
    });
  }
  
  // Add videos
  if (files.videos) {
    Array.from(files.videos).forEach((video) => {
      formData.append('videos', video);
    });
  }
  
  const response = await api.post('/places', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Update place
export const updatePlace = async (id, placeData, files) => {
  const formData = new FormData();
  
  // Add text fields
  Object.keys(placeData).forEach((key) => {
    formData.append(key, placeData[key]);
  });
  
  // Add images
  if (files?.images) {
    Array.from(files.images).forEach((image) => {
      formData.append('images', image);
    });
  }
  
  // Add videos
  if (files?.videos) {
    Array.from(files.videos).forEach((video) => {
      formData.append('videos', video);
    });
  }
  
  const response = await api.put(`/places/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Delete place
export const deletePlace = async (id) => {
  const response = await api.delete(`/places/${id}`);
  return response.data;
};

// Add rating
export const addRating = async (placeId, rating) => {
  const response = await api.post(`/places/${placeId}/rating`, { rating });
  return response.data;
};

// Add comment
export const addComment = async (placeId, text) => {
  const response = await api.post(`/places/${placeId}/comment`, { text });
  return response.data;
};

// Add reply to a comment (Q&A)
export const addReply = async (placeId, commentIndex, text) => {
  const response = await api.post(
    `/places/${placeId}/comment/${commentIndex}/reply`,
    { text }
  );
  return response.data;
};

// Get recommendations
export const getRecommendations = async () => {
  const response = await api.get('/places/recommendations');
  return response.data;
};

// Wishlist operations
export const getWishlist = async () => {
  const response = await api.get('/wishlist');
  return response.data;
};

export const addToWishlist = async (placeId) => {
  const response = await api.post(`/wishlist/${placeId}`);
  return response.data;
};

export const removeFromWishlist = async (placeId) => {
  const response = await api.delete(`/wishlist/${placeId}`);
  return response.data;
};

// Admin operations
export const getAdminStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const updateUserRole = async (userId, role) => {
  const response = await api.put(`/admin/users/${userId}/role`, { role });
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
};

export const getDuplicates = async () => {
  const response = await api.get('/admin/places/duplicates');
  return response.data;
};

// Update user preferences
export const updateUserPreferences = async (userId, preferencesData) => {
  const response = await api.put(`/auth/users/${userId}/preferences`, preferencesData);
  return response.data;
};

