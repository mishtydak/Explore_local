/**
 * Wishlist Routes
 */

const express = require('express');
const router = express.Router();
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getWishlist);
router.post('/:placeId', protect, addToWishlist);
router.delete('/:placeId', protect, removeFromWishlist);

module.exports = router;

