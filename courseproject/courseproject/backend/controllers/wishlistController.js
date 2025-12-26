/**
 * Wishlist Controller
 * Handles user wishlist operations
 */

const User = require('../models/User');
const Place = require('../models/Place');
const ActivityLog = require('../models/ActivityLog');

/**
 * @route   GET /api/wishlist
 * @desc    Get user's wishlist
 * @access  Private
 */
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json(user.wishlist);
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ message: 'Server error fetching wishlist' });
  }
};

/**
 * @route   POST /api/wishlist/:placeId
 * @desc    Add place to wishlist
 * @access  Private
 */
const addToWishlist = async (req, res) => {
  try {
    const { placeId } = req.params;
    const user = await User.findById(req.user._id);

    // Check if place exists
    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    // Check if already in wishlist
    if (user.wishlist.includes(placeId)) {
      return res.status(400).json({ message: 'Place already in wishlist' });
    }

    user.wishlist.push(placeId);
    await user.save();

    // Log activity
    await ActivityLog.create({
      user: req.user._id,
      activityType: 'wishlist',
      place: placeId,
      category: place.category,
    });

    res.json({ message: 'Place added to wishlist', wishlist: user.wishlist });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ message: 'Server error adding to wishlist' });
  }
};

/**
 * @route   DELETE /api/wishlist/:placeId
 * @desc    Remove place from wishlist
 * @access  Private
 */
const removeFromWishlist = async (req, res) => {
  try {
    const { placeId } = req.params;
    const user = await User.findById(req.user._id);

    // Check if place is in wishlist
    if (!user.wishlist.includes(placeId)) {
      return res.status(400).json({ message: 'Place not in wishlist' });
    }

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== placeId
    );
    await user.save();

    res.json({ message: 'Place removed from wishlist', wishlist: user.wishlist });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ message: 'Server error removing from wishlist' });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};

