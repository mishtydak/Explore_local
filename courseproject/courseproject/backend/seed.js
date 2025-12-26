/**
 * Seed Data Script
 * Populates database with sample data for testing
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Place = require('./models/Place');

// Sample data
const sampleUsers = [
  {
    username: 'admin',
    email: 'admin@explorelocal.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    username: 'johndoe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
  },
  {
    username: 'janedoe',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user',
  },
];

const samplePlaces = [
  {
    name: 'Hidden Garden Cafe',
    description: 'A cozy cafe tucked away in a quiet alley, serving the best coffee and pastries in town. The garden setting makes it perfect for a peaceful afternoon.',
    category: 'cafe',
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
      address: '123 Hidden Lane, New York, NY',
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
        publicId: 'sample-cafe-1',
      },
    ],
    uploaderName: 'johndoe',
  },
  {
    name: 'Sunset Beach Point',
    description: 'A secluded beach spot perfect for watching sunsets. Not many people know about this hidden gem!',
    category: 'beach',
    location: {
      latitude: 34.0522,
      longitude: -118.2437,
      address: 'Coastal Road, Los Angeles, CA',
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
        publicId: 'sample-beach-1',
      },
    ],
    uploaderName: 'janedoe',
  },
  {
    name: 'Mountain View Trail',
    description: 'A lesser-known hiking trail that offers breathtaking views without the crowds. Perfect for nature lovers seeking solitude.',
    category: 'mountain',
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      address: 'Mountain Trail Road, San Francisco, CA',
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        publicId: 'sample-mountain-1',
      },
    ],
    uploaderName: 'johndoe',
  },
  {
    name: 'Local Artisan Market',
    description: 'A weekend market featuring local artisans and fresh produce. Discover unique handmade items and support local businesses.',
    category: 'market',
    location: {
      latitude: 41.8781,
      longitude: -87.6298,
      address: 'Market Square, Chicago, IL',
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
        publicId: 'sample-market-1',
      },
    ],
    uploaderName: 'janedoe',
  },
  {
    name: 'Secret Garden Restaurant',
    description: 'An intimate restaurant with a beautiful garden setting. The menu features locally sourced ingredients and innovative dishes.',
    category: 'restaurant',
    location: {
      latitude: 29.7604,
      longitude: -95.3698,
      address: 'Garden Street, Houston, TX',
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
        publicId: 'sample-restaurant-1',
      },
    ],
    uploaderName: 'johndoe',
  },
  {
    name: 'Quiet Reading Park',
    description: 'A peaceful park with benches and trees, perfect for reading or quiet contemplation. Away from the city noise.',
    category: 'park',
    location: {
      latitude: 39.9526,
      longitude: -75.1652,
      address: 'Park Avenue, Philadelphia, PA',
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
        publicId: 'sample-park-1',
      },
    ],
    uploaderName: 'janedoe',
  },
];

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Place.deleteMany({});

    // Create users
    console.log('Creating users...');
    const createdUsers = await User.insertMany(sampleUsers);
    console.log(`Created ${createdUsers.length} users`);

    // Create user map for assigning places
    const userMap = {};
    createdUsers.forEach((user) => {
      userMap[user.username] = user._id;
    });

    // Create places with user references
    console.log('Creating places...');
    const placesWithUsers = samplePlaces.map((place) => ({
      ...place,
      uploadedBy: userMap[place.uploaderName],
    }));

    const createdPlaces = await Place.insertMany(placesWithUsers);
    console.log(`Created ${createdPlaces.length} places`);

    // Add some ratings and comments
    console.log('Adding sample ratings and comments...');
    for (let i = 0; i < createdPlaces.length; i++) {
      const place = createdPlaces[i];
      const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];

      // Add a rating
      place.ratings.push({
        user: randomUser._id,
        rating: Math.floor(Math.random() * 3) + 3, // 3-5 stars
      });

      // Add a comment
      place.comments.push({
        user: randomUser._id,
        username: randomUser.username,
        text: `This is a great place! I highly recommend visiting.`,
      });

      await place.save();
    }

    console.log('✅ Database seeded successfully!');
    console.log('\nSample login credentials:');
    console.log('Admin: admin@explorelocal.com / admin123');
    console.log('User: john@example.com / password123');
    console.log('User: jane@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

