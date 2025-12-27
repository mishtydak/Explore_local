/**
 * Place Model
 * Stores information about hidden gem places
 */

const mongoose = require('mongoose');


const replySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: [true, 'Comment text is required'],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  replies: [replySchema], // ✅ ADD THIS LINE
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ratingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Place name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['restaurant', 'cafe', 'park', 'museum', 'beach', 'mountain', 'market', 'temple', 'other'],
    default: 'other',
  },
  location: {
    latitude: {
      type: Number,
      required: [true, 'Latitude is required'],
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required'],
    },
    address: {
      type: String,
      trim: true,
    },
  },
  images: [{
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
    },
  }],
  videos: [{
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
    },
  }],
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  uploaderName: {
    type: String,
    required: true,
  },
  ratings: [ratingSchema],
  comments: [commentSchema],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalRatings: {
    type: Number,
    default: 0,
  },
  isDuplicate: {
    type: Boolean,
    default: false,
  },
  duplicateOf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Calculate average rating before saving
placeSchema.pre('save', function (next) {
  if (this.ratings && this.ratings.length > 0) {
    const sum = this.ratings.reduce((acc, rating) => acc + rating.rating, 0);
    this.averageRating = (sum / this.ratings.length).toFixed(1);
    this.totalRatings = this.ratings.length;
  } else {
    this.averageRating = 0;
    this.totalRatings = 0;
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Place', placeSchema);

