/**
 * Place Routes
 */

const express = require('express');
const router = express.Router();
const {
  createPlace,
  getAllPlaces,
  getPlaceById,
  updatePlace,
  deletePlace,
  addRating,
  addComment,
  addReplyToComment,
  getRecommendations,
} = require('../controllers/placeController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../utils/cloudinary');

// Public routes
router.get('/', getAllPlaces);
router.get('/recommendations', protect, getRecommendations);
router.get('/:id', getPlaceById);

// Protected routes
router.post(
  '/',
  protect,
  upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'videos', maxCount: 5 },
  ]),
  createPlace
);

router.put(
  '/:id',
  protect,
  upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'videos', maxCount: 5 },
  ]),
  updatePlace
);

router.delete('/:id', protect, deletePlace);
router.post('/:id/rating', protect, addRating);
router.post('/:id/comment', protect, addComment);

// ✅ ADD REPLY ROUTE (Q&A)
router.post(
  '/:placeId/comment/:commentIndex/reply',
  protect,
  addReplyToComment
);

module.exports = router;
