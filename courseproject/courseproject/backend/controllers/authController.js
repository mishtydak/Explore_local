/**
 * Authentication Controller
 * Handles user registration and login
 */

const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check if user exists and password matches
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @route   PUT /api/auth/users/:id/preferences
 * @desc    Update user preferences
 * @access  Private
 */
const updateUserPreferences = async (req, res) => {
  try {
    const { id } = req.params;
    const { preferences } = req.body;

    // Validation
    if (!preferences || !Array.isArray(preferences) || preferences.length > 3) {
      return res.status(400).json({ message: 'Please provide up to 3 preferences as an array' });
    }

    // Validate preference values
    const validCategories = ['restaurant', 'cafe', 'park', 'museum', 'beach', 'mountain', 'market', 'temple', 'other'];
    const invalidPreferences = preferences.filter(pref => !validCategories.includes(pref));
    
    if (invalidPreferences.length > 0) {
      return res.status(400).json({ message: 'Invalid preference categories' });
    }

    // Check if user is updating their own preferences or is admin
    if (req.user._id.toString() !== id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update preferences' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { preferences },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ message: 'Server error updating preferences' });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateUserPreferences,
};

