/**
 * Place Controller
 * Handles all place-related operations
 */

const Place = require('../models/Place');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const { checkDuplicate } = require('../utils/similarity');
const { uploadToCloudinary, deleteFile } = require('../utils/cloudinary');
const axios = require('axios');

/**
 * @route   POST /api/places
 * @desc    Create a new place
 * @access  Private
 */
const createPlace = async (req, res) => {
  try {
    const { name, description, category, latitude, longitude, address } = req.body;

    // Validation
    if (!name || !description || !category || !latitude || !longitude) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check for duplicates
    const existingPlaces = await Place.find({ isDuplicate: false });
    const duplicateCheck = checkDuplicate(name, description, existingPlaces);

    // Upload images
    const images = [];
    if (req.files && req.files.images) {
      const imageFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      for (const imageFile of imageFiles) {
        try {
          const result = await uploadToCloudinary(
            imageFile.buffer,
            'explore-local/images',
            'image'
          );
          images.push({
            url: result.secure_url,
            publicId: result.public_id,
          });
        } catch (error) {
          console.error('Image upload error:', error);
        }
      }
    }

    // Upload videos
    const videos = [];
    if (req.files && req.files.videos) {
      const videoFiles = Array.isArray(req.files.videos) ? req.files.videos : [req.files.videos];
      for (const videoFile of videoFiles) {
        try {
          const result = await uploadToCloudinary(
            videoFile.buffer,
            'explore-local/videos',
            'video'
          );
          videos.push({
            url: result.secure_url,
            publicId: result.public_id,
          });
        } catch (error) {
          console.error('Video upload error:', error);
        }
      }
    }

    // Create place
    const place = await Place.create({
      name,
      description,
      category,
      location: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        address: address || '',
      },
      images,
      videos,
      uploadedBy: req.user._id,
      uploaderName: req.user.username,
      isDuplicate: duplicateCheck.isDuplicate,
      duplicateOf: duplicateCheck.duplicateOf,
    });

    // Log activity
    await ActivityLog.create({
      user: req.user._id,
      activityType: 'view',
      place: place._id,
      category: category,
    });

    res.status(201).json(place);
  } catch (error) {
    console.error('Create place error:', error);
    res.status(500).json({ message: 'Server error creating place' });
  }
};

/**
 * @route   GET /api/places
 * @desc    Get all places
 * @access  Public
 */
const getAllPlaces = async (req, res) => {
  try {
    const { category, search, latitude, longitude, radius } = req.query;
    let query = { isDuplicate: false };

    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    let places;
    
    // If location parameters are provided, search within radius
    if (latitude && longitude && radius) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      const rad = parseFloat(radius); // in kilometers
      
      // Calculate bounds for approximate search
      const earthRadiusKm = 6371;
      const latRad = (rad / earthRadiusKm) * (180 / Math.PI);
      const lngRad = (rad / earthRadiusKm) * (180 / Math.PI) / Math.cos(lat * Math.PI / 180);
      
      const minLat = lat - latRad;
      const maxLat = lat + latRad;
      const minLng = lng - lngRad;
      const maxLng = lng + lngRad;
      
      // Add location filter to the query
      query['location.latitude'] = { $gte: minLat, $lte: maxLat };
      query['location.longitude'] = { $gte: minLng, $lte: maxLng };
      
      places = await Place.find(query)
        .populate('uploadedBy', 'username')
        .sort({ createdAt: -1 });
      
      // Calculate actual distances and filter more precisely
      places = places.filter(place => {
        const placeLat = place.location.latitude;
        const placeLng = place.location.longitude;
        
        // Calculate distance using haversine formula
        const R = 6371; // Earth's radius in km
        const dLat = (placeLat - lat) * Math.PI / 180;
        const dLon = (placeLng - lng) * Math.PI / 180;
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat * Math.PI / 180) * Math.cos(placeLat * Math.PI / 180) * 
          Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        const distance = R * c;
        
        return distance <= rad;
      });
      
      // Sort by distance
      places.sort((a, b) => {
        const distA = calculateDistance(lat, lng, a.location.latitude, a.location.longitude);
        const distB = calculateDistance(lat, lng, b.location.latitude, b.location.longitude);
        return distA - distB;
      });
    } else {
      // Regular search without location
      places = await Place.find(query)
        .populate('uploadedBy', 'username')
        .sort({ createdAt: -1 });
    }

    res.json(places);
  } catch (error) {
    console.error('Get all places error:', error);
    res.status(500).json({ message: 'Server error fetching places' });
  }
};

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
}

/**
 * @route   GET /api/places/:id
 * @desc    Get single place by ID
 * @access  Public
 */
const getPlaceById = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id)
      .populate('uploadedBy', 'username')
      .populate('ratings.user', 'username')
      .populate('comments.user', 'username');

    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    // Log activity if user is authenticated
    if (req.user) {
      await ActivityLog.create({
        user: req.user._id,
        activityType: 'view',
        place: place._id,
        category: place.category,
      });
    }

    res.json(place);
  } catch (error) {
    console.error('Get place by ID error:', error);
    res.status(500).json({ message: 'Server error fetching place' });
  }
};

/**
 * @route   PUT /api/places/:id
 * @desc    Update a place
 * @access  Private (Owner or Admin)
 */
const updatePlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    // Check if user is owner or admin
    if (place.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this place' });
    }

    const { name, description, category, latitude, longitude, address } = req.body;

    // Update fields
    if (name) place.name = name;
    if (description) place.description = description;
    if (category) place.category = category;
    if (latitude) place.location.latitude = parseFloat(latitude);
    if (longitude) place.location.longitude = parseFloat(longitude);
    if (address !== undefined) place.location.address = address;

    // Handle new image uploads
    if (req.files && req.files.images) {
      const imageFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      for (const imageFile of imageFiles) {
        try {
          const result = await uploadToCloudinary(
            imageFile.buffer,
            'explore-local/images',
            'image'
          );
          place.images.push({
            url: result.secure_url,
            publicId: result.public_id,
          });
        } catch (error) {
          console.error('Image upload error:', error);
        }
      }
    }

    // Handle new video uploads
    if (req.files && req.files.videos) {
      const videoFiles = Array.isArray(req.files.videos) ? req.files.videos : [req.files.videos];
      for (const videoFile of videoFiles) {
        try {
          const result = await uploadToCloudinary(
            videoFile.buffer,
            'explore-local/videos',
            'video'
          );
          place.videos.push({
            url: result.secure_url,
            publicId: result.public_id,
          });
        } catch (error) {
          console.error('Video upload error:', error);
        }
      }
    }

    await place.save();
    res.json(place);
  } catch (error) {
    console.error('Update place error:', error);
    res.status(500).json({ message: 'Server error updating place' });
  }
};

/**
 * @route   DELETE /api/places/:id
 * @desc    Delete a place
 * @access  Private (Owner or Admin)
 */
const deletePlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    // Check if user is owner or admin
    if (place.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this place' });
    }

    // Delete images from Cloudinary
    for (const image of place.images) {
      if (image.publicId) {
        try {
          await deleteFile(image.publicId, 'image');
        } catch (error) {
          console.error('Error deleting image:', error);
        }
      }
    }

    // Delete videos from Cloudinary
    for (const video of place.videos) {
      if (video.publicId) {
        try {
          await deleteFile(video.publicId, 'video');
        } catch (error) {
          console.error('Error deleting video:', error);
        }
      }
    }

    await Place.findByIdAndDelete(req.params.id);
    res.json({ message: 'Place deleted successfully' });
  } catch (error) {
    console.error('Delete place error:', error);
    res.status(500).json({ message: 'Server error deleting place' });
  }
};

/**
 * @route   POST /api/places/:id/rating
 * @desc    Add or update rating for a place
 * @access  Private
 */
const addRating = async (req, res) => {
  try {
    const { rating } = req.body;
    const place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if user already rated
    const existingRatingIndex = place.ratings.findIndex(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (existingRatingIndex !== -1) {
      // Update existing rating
      place.ratings[existingRatingIndex].rating = rating;
    } else {
      // Add new rating
      place.ratings.push({
        user: req.user._id,
        rating: rating,
      });
    }

    await place.save();

    // Log activity
    await ActivityLog.create({
      user: req.user._id,
      activityType: 'rate',
      place: place._id,
      category: place.category,
      metadata: { rating },
    });

    res.json(place);
  } catch (error) {
    console.error('Add rating error:', error);
    res.status(500).json({ message: 'Server error adding rating' });
  }
};

/**
 * @route   POST /api/places/:id/comment
 * @desc    Add comment to a place
 * @access  Private
 */
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    place.comments.push({
      user: req.user._id,
      username: req.user.username,
      text: text.trim(),
    });

    await place.save();

    // Log activity
    await ActivityLog.create({
      user: req.user._id,
      activityType: 'comment',
      place: place._id,
      category: place.category,
    });

    res.json(place);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error adding comment' });
  }
};

/**
 * @route   POST /api/places/:placeId/comment/:commentIndex/reply
 * @desc    Add reply to a comment (Q&A)
 * @access  Private
 */
const addReplyToComment = async (req, res) => {
  try {
    const { placeId, commentIndex } = req.params;
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Reply text is required' });
    }

    const place = await Place.findById(placeId);

    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    const comment = place.comments[commentIndex];

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Push reply
    comment.replies.push({
      user: req.user._id,
      username: req.user.name,
      text: text.trim(),
    });

    await place.save();

    res.json({ message: 'Reply added successfully', place });
  } catch (error) {
    console.error('Add reply error:', error);
    res.status(500).json({ message: 'Server error adding reply' });
  }
};

/**
 * @route   GET /api/places/recommendations
 * @desc    Get recommended places based on user activity
 * @access  Private
 */
const getRecommendations = async (req, res) => {
  try {
    // Get user's preferences and activity
    const user = await User.findById(req.user._id).select('preferences');
    const recentActivities = await ActivityLog.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    // Start with user preferences
    let preferredCategories = user.preferences || [];
    
    // If no preferences, fall back to activity-based categories
    if (preferredCategories.length === 0) {
      if (recentActivities.length === 0) {
        // If no activity, return random highly-rated places
        const places = await Place.find({ isDuplicate: false })
          .limit(6)
          .sort({ averageRating: -1, createdAt: -1 });
        return res.json(places);
      }

      // Get most viewed categories from activity
      const categoryCounts = {};
      recentActivities.forEach((activity) => {
        categoryCounts[activity.category] = (categoryCounts[activity.category] || 0) + 1;
      });

      preferredCategories = Object.keys(categoryCounts)
        .sort((a, b) => categoryCounts[b] - categoryCounts[a])
        .slice(0, 3);
    }

    // Get places in preferred categories
    const recommendedPlaces = await Place.find({
      isDuplicate: false,
      category: { $in: preferredCategories },
    })
      .limit(6)
      .sort({ averageRating: -1 });

    // If we don't have enough places in preferred categories, add some popular places
    if (recommendedPlaces.length < 6) {
      const additionalPlaces = await Place.find({
        isDuplicate: false,
        _id: { $nin: recommendedPlaces.map(p => p._id) },
        category: { $nin: preferredCategories },
      })
        .limit(6 - recommendedPlaces.length)
        .sort({ averageRating: -1 });

      recommendedPlaces.push(...additionalPlaces);
    }

    res.json(recommendedPlaces);
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ message: 'Server error fetching recommendations' });
  }
};

module.exports = {
  createPlace,
  getAllPlaces,
  getPlaceById,
  updatePlace,
  deletePlace,
  addRating,
  addComment,
  addReplyToComment,
  getRecommendations,
};

