/**
 * Admin Controller
 * Handles admin-only operations
 */

const User = require('../models/User');
const Place = require('../models/Place');
const ActivityLog = require('../models/ActivityLog');

/**
 * @route   GET /api/admin/stats
 * @desc    Get platform statistics
 * @access  Private (Admin)
 */
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPlaces = await Place.countDocuments({ isDuplicate: false });
    const totalDuplicates = await Place.countDocuments({ isDuplicate: true });
    const totalActivities = await ActivityLog.countDocuments();

    // Get places by category
    const placesByCategory = await Place.aggregate([
      { $match: { isDuplicate: false } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    // Get recent places
    const recentPlaces = await Place.find({ isDuplicate: false })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name createdAt');

    res.json({
      totalUsers,
      totalPlaces,
      totalDuplicates,
      totalActivities,
      placesByCategory,
      recentPlaces,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error fetching stats' });
  }
};

/**
 * @route   GET /api/admin/users
 * @desc    Get all users
 * @access  Private (Admin)
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

/**
 * @route   PUT /api/admin/users/:id/role
 * @desc    Update user role
 * @access  Private (Admin)
 */
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const { id } = req.params;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Server error updating user role' });
  }
};

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete user
 * @access  Private (Admin)
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting yourself
    if (id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error deleting user' });
  }
};

/**
 * @route   GET /api/admin/places/duplicates
 * @desc    Get all duplicate places
 * @access  Private (Admin)
 */
const getDuplicates = async (req, res) => {
  try {
    const duplicates = await Place.find({ isDuplicate: true })
      .populate('duplicateOf', 'name')
      .populate('uploadedBy', 'username')
      .sort({ createdAt: -1 });

    res.json(duplicates);
  } catch (error) {
    console.error('Get duplicates error:', error);
    res.status(500).json({ message: 'Server error fetching duplicates' });
  }
};

module.exports = {
  getStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getDuplicates,
};

