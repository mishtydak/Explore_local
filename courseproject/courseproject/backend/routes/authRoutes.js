/**
 * Authentication Routes
 */

const express = require('express');
const router = express.Router();
const { register, login, getMe, updateUserPreferences } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/users/:id/preferences', protect, updateUserPreferences);

module.exports = router;

