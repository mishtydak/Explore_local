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
    username: 'rajeshkumar',
    email: 'rajesh@example.com',
    password: 'password123',
    role: 'user',
  },
  {
    username: 'priyanka',
    email: 'priya@example.com',
    password: 'password123',
    role: 'user',
  },
];

const samplePlaces = [
  {
    name: 'Pangi Valley',
    description: 'Remote, rugged, almost untouched valley in Himachal Pradesh. Snow even in summer in higher reaches. Very few tourists compared to Spiti. Perfect for adventure lovers and photographers.',
    category: 'mountain',
    location: {
      latitude: 32.4941,
      longitude: 77.1111,
      address: 'Pangi Valley, Himachal Pradesh',
    },
    images: [
      {
        url: 'https://www.potala-himalaya.com/uploads/potala_himalaya/package/main/5af95459d95ad143_king_of_the_valley.jpg',
        publicId: 'sample-mountain-1',
      },
    ],
    uploaderName: 'rajeshkumar',
  },
  {
    name: 'Chitkul Beyond',
    description: 'Most people stop at Chitkul village, but go further towards Nagasti and river trails. Absolute silence with Baspa river views. Perfect for slow travel, writers, and solitude seekers.',
    category: 'mountain',
    location: {
      latitude: 31.0833,
      longitude: 78.3833,
      address: 'Chitkul, Himachal Pradesh',
    },
    images: [
      {
        url: 'https://raacho.b-cdn.net//wp-content/uploads/2018/01/A-walking-trail-leading-to-Chitkul-village.jpg',
        publicId: 'sample-mountain-2',
      },
    ],
    uploaderName: 'priyanka',
  },
  {
    name: 'Tirthan Valley Interiors',
    description: 'Everyone visits Jibhi, ignore that and explore Pekhri, Rolla, Gushaini interiors. Perfect for trout fishing and forest stays. Ideal for nature lovers and calm stays.',
    category: 'park',
    location: {
      latitude: 31.8667,
      longitude: 77.6167,
      address: 'Tirthan Valley, Himachal Pradesh',
    },
    images: [
      {
        url: 'https://himalayansaga.com/wp-content/uploads/2022/03/tirthan.jpg',
        publicId: 'sample-park-1',
      },
    ],
    uploaderName: 'rajeshkumar',
  },
  {
    name: 'Ziro Valley',
    description: 'Beautiful rice fields and pine forests in Arunachal Pradesh. Home to Apatani tribal culture. Visit when there is no festival for a more authentic experience. Perfect for culture and landscape enthusiasts.',
    category: 'park',
    location: {
      latitude: 27.0362,
      longitude: 93.8028,
      address: 'Ziro, Arunachal Pradesh',
    },
    images: [
      {
        url: 'https://www.naturetravelagency.com/uploads/1730551339Ziro%20Valley%20resort.jpg',
        publicId: 'sample-park-2',
      },
    ],
    uploaderName: 'priyanka',
  },
  {
    name: 'Dzukou Valley',
    description: 'Less crowded than Manipur side with rolling green hills like a Windows wallpaper. Perfect for trekkers and minimalists.',
    category: 'mountain',
    location: {
      latitude: 25.8292,
      longitude: 94.5988,
      address: 'Dzukou Valley, Nagaland',
    },
    images: [
      {
        url: 'https://s7ap1.scene7.com/is/image/incredibleindia/dzukou-valley-kohima-nagaland-attr-hero-1?qlt=82&ts=1727012411648',
        publicId: 'sample-mountain-3',
      },
    ],
    uploaderName: 'rajeshkumar',
  },
  {
    name: 'Majuli Island',
    description: 'World\'s largest river island in Assam. Skip tourist ghats and visit local monasteries (satras) for spiritual and cultural depth.',
    category: 'temple',
    location: {
      latitude: 26.9333,
      longitude: 94.3333,
      address: 'Majuli, Assam',
    },
    images: [
      {
        url: 'https://www.gourav.pro/wp-content/uploads/2025/10/Majuli-Island_-The-Worlds-Largest-River-Island-in-Assam-A-Comprehensive-Travel-Guide-1-1024x573.jpg',
        publicId: 'sample-temple-1',
      },
    ],
    uploaderName: 'priyanka',
  },
  {
    name: 'Mandarmani Beach',
    description: 'Go to the less-developed beach stretch beyond the resorts. Empty beaches and fishermen villages for peaceful beach lovers.',
    category: 'beach',
    location: {
      latitude: 21.9046,
      longitude: 87.4728,
      address: 'Mandarmani, West Bengal',
    },
    images: [
      {
        url: 'https://media.assettype.com/outlooktraveller%2F2023-12%2Fa6ed3df2-a42b-4738-a9ef-1383001f2eec%2Fmandarmani1.jpg?rect=0%2C6%2C1000%2C563',
        publicId: 'sample-beach-1',
      },
    ],
    uploaderName: 'rajeshkumar',
  },
  {
    name: 'Netarhat',
    description: 'Known as the "Queen of Chotanagpur" with beautiful sunrise and sunset points and cool climate. Perfect for budget travelers and couples.',
    category: 'mountain',
    location: {
      latitude: 23.4747,
      longitude: 83.8358,
      address: 'Netarhat, Jharkhand',
    },
    images: [
      {
        url: 'https://travelentice.com/wp-content/uploads/2022/10/Netarhat-Pine-Forest-2.jpg',
        publicId: 'sample-mountain-4',
      },
    ],
    uploaderName: 'priyanka',
  },
  {
    name: 'Satkosia Gorge',
    description: 'The Mahanadi river cuts through hills creating beautiful landscapes. Home to crocodiles, forests, and boat safaris. Perfect for wildlife and offbeat explorers.',
    category: 'park',
    location: {
      latitude: 21.8833,
      longitude: 84.1667,
      address: 'Satkosia, Odisha',
    },
    images: [
      {
        url: 'https://s7ap1.scene7.com/is/image/incredibleindia/satkosia-gorge-wildlife-sanctuary-bhubaneshwar-odisha-2-attr-hero?qlt=82&ts=1742156610865',
        publicId: 'sample-park-3',
      },
    ],
    uploaderName: 'rajeshkumar',
  },
  {
    name: 'Agumbe Rainforest',
    description: 'Rainforest with beautiful sunsets and known as the "Cherrapunji of South India". Habitat for king cobras. Feels like Jurassic Park during monsoons. Perfect for monsoon lovers and photographers.',
    category: 'park',
    location: {
      latitude: 13.5833,
      longitude: 75.1667,
      address: 'Agumbe, Karnataka',
    },
    images: [
      {
        url: 'https://praveenmusafir.com/wp-content/uploads/2024/01/image-9.jpeg',
        publicId: 'sample-park-4',
      },
    ],
    uploaderName: 'priyanka',
  },
  {
    name: 'Valparai Interiors',
    description: 'Tea plantations, waterfalls, and elephants in the interior estates. Much quieter than Munnar. Perfect for nature lovers and slow travel enthusiasts.',
    category: 'park',
    location: {
      latitude: 10.3167,
      longitude: 76.9833,
      address: 'Valparai, Tamil Nadu',
    },
    images: [
      {
        url: 'https://www.gokitetours.com/wp-content/uploads/2025/04/the-best-season-to-visit-valparai-950x950.webp',
        publicId: 'sample-park-5',
      },
    ],
    uploaderName: 'rajeshkumar',
  },
  {
    name: 'Gokarna Beaches Beyond Om',
    description: 'Go to Paradise, Half Moon, and Nirvana beaches beyond the crowded Om Beach. Walk between beaches for backpackers and calm beach time.',
    category: 'beach',
    location: {
      latitude: 14.5833,
      longitude: 74.3167,
      address: 'Gokarna, Karnataka',
    },
    images: [
      {
        url: 'https://d26dp53kz39178.cloudfront.net/media/uploads/Location_Based_Travel_Guide_Images/Nirvana_Beach_result-1668436503952.webp',
        publicId: 'sample-beach-2',
      },
    ],
    uploaderName: 'priyanka',
  },
  {
    name: 'Kumbhalgarh Forest Trail',
    description: 'Explore beyond the fort with forest walks and amazing night skies. Perfect for history and nature combo enthusiasts.',
    category: 'mountain',
    location: {
      latitude: 25.2167,
      longitude: 73.5667,
      address: 'Kumbhalgarh, Rajasthan',
    },
    images: [
      {
        url: 'https://goyahills.com/wp-content/uploads/2025/02/explore-the-fort-majestic-walls-and-gates.jpg',
        publicId: 'sample-mountain-5',
      },
    ],
    uploaderName: 'rajeshkumar',
  },
  {
    name: 'Dholavira',
    description: 'Ancient Indus Valley Civilization site with salt desert landscapes. Perfect for history nerds and minimalists.',
    category: 'museum',
    location: {
      latitude: 23.8833,
      longitude: 70.25,
      address: 'Dholavira, Gujarat',
    },
    images: [
      {
        url: 'https://kvramakrishnarao.wordpress.com/wp-content/uploads/2021/07/dolavira-port.jpg?w=1004',
        publicId: 'sample-museum-1',
      },
    ],
    uploaderName: 'priyanka',
  },
  {
    name: 'Jawhar and Mokhada',
    description: 'Tribal villages and waterfalls near Mumbai but unknown to most. Perfect for weekend off-grid trips.',
    category: 'park',
    location: {
      latitude: 19.75,
      longitude: 73.3333,
      address: 'Jawhar, Maharashtra',
    },
    images: [
      {
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7v0w8IjoE3p_FY5otMbfSDois3cf7deKl1g&s',
        publicId: 'sample-park-6',
      },
    ],
    uploaderName: 'rajeshkumar',
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
    console.log('User: rajesh@example.com / password123');
    console.log('User: priya@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

