/**
 * Admin Routes
 */

const express = require('express');
const router = express.Router();
const {
  getStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getDuplicates,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

// All admin routes require authentication and admin role
router.use(protect);
router.use(adminOnly);

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/places/duplicates', getDuplicates);

module.exports = router;

