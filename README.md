# 🌍 Explore Local – Hidden Gem Discovery Platform

A complete MERN stack application for discovering and sharing hidden gem places in your local area.

## 📋 Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)

## ✨ Features

### User Features
- **User Authentication**: Register, login, and JWT-based session management
- **Place Discovery**: Browse all hidden gems with search and category filters
- **Place Upload**: Upload new places with images, videos, and location data
- **Ratings & Comments**: Rate and comment on places
- **Wishlist**: Save favorite places to your wishlist
- **Personalized Recommendations**: Get place recommendations based on your activity
- **Weather Integration**: View current weather at place locations
- **Interactive Maps**: Google Maps integration for location visualization

### Admin Features
- **Dashboard**: View platform statistics and analytics
- **User Management**: Manage users and roles
- **Duplicate Detection**: Automatic detection of duplicate places using similarity algorithms
- **Content Moderation**: Delete places and manage content

## 🛠 Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Cloudinary** - Media storage
- **Axios** - HTTP client

### Frontend
- **React.js** - UI library
- **React Router** - Routing
- **Axios** - API calls
- **Context API** - State management
- **HTML/CSS** - Styling

## 📁 Project Structure

```
project/
├── backend/
│   ├── server.js                 # Main server file
│   ├── config/
│   │   └── db.js                 # Database connection
│   ├── models/
│   │   ├── User.js               # User model
│   │   ├── Place.js              # Place model
│   │   └── ActivityLog.js        # Activity log model
│   ├── routes/
│   │   ├── authRoutes.js         # Authentication routes
│   │   ├── placeRoutes.js        # Place routes
│   │   ├── wishlistRoutes.js     # Wishlist routes
│   │   └── adminRoutes.js        # Admin routes
│   ├── controllers/
│   │   ├── authController.js     # Auth logic
│   │   ├── placeController.js    # Place logic
│   │   ├── wishlistController.js # Wishlist logic
│   │   └── adminController.js     # Admin logic
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification
│   │   └── roleMiddleware.js     # Role-based access
│   ├── utils/
│   │   ├── similarity.js         # Duplicate detection
│   │   └── cloudinary.js         # Media upload
│   ├── seed.js                   # Seed data script
│   └── .env.example              # Environment variables template
│
└── frontend/
    └── src/
        ├── App.js                 # Main app component
        ├── index.js               # Entry point
        ├── pages/
        │   ├── Home.js            # Home page
        │   ├── Login.js           # Login page
        │   ├── Register.js        # Register page
        │   ├── UploadPlace.js     # Upload place page
        │   ├── PlaceDetails.js    # Place details page
        │   ├── UserDashboard.js   # User dashboard
        │   └── AdminDashboard.js  # Admin dashboard
        ├── components/
        │   ├── Navbar.js          # Navigation bar
        │   ├── PlaceCard.js       # Place card component
        │   ├── SearchBar.js       # Search component
        │   ├── WeatherWidget.js   # Weather display
        │   ├── MapEmbed.js        # Map component
        │   ├── RatingBox.js       # Rating component
        │   └── CommentBox.js      # Comments component
        ├── context/
        │   └── AuthContext.js     # Authentication context
        ├── services/
        │   ├── api.js             # Axios configuration
        │   └── placeService.js    # API service functions
        └── styles/
            └── main.css           # Main stylesheet
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```bash
   # Copy the example file (rename env.example.txt to .env)
   cp env.example.txt .env
   # Or on Windows: copy env.example.txt .env
   ```
   
   Edit `.env` and add your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/explore-local
   JWT_SECRET=your_super_secret_jwt_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   WEATHER_API_KEY=your_openweathermap_api_key
   ```

4. **Start MongoDB**
   - If using local MongoDB, make sure MongoDB service is running
   - Or use MongoDB Atlas connection string in `MONGODB_URI`

5. **Seed database (optional)**
   ```bash
   npm run seed
   ```
   This will create sample users and places.

6. **Start the server**
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file (optional)**
   ```env
   REACT_APP_WEATHER_API_KEY=your_openweathermap_api_key
   REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

   Frontend will run on `http://localhost:3000`

## 🔐 Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `WEATHER_API_KEY` - OpenWeatherMap API key

### Frontend (.env)
- `REACT_APP_WEATHER_API_KEY` - OpenWeatherMap API key (optional)
- `REACT_APP_GOOGLE_MAPS_API_KEY` - Google Maps API key (optional)

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Places
- `GET /api/places` - Get all places (with optional query params: category, search)
- `GET /api/places/:id` - Get single place
- `POST /api/places` - Create new place (protected)
- `PUT /api/places/:id` - Update place (protected, owner/admin)
- `DELETE /api/places/:id` - Delete place (protected, owner/admin)
- `POST /api/places/:id/rating` - Add/update rating (protected)
- `POST /api/places/:id/comment` - Add comment (protected)
- `GET /api/places/recommendations` - Get recommendations (protected)

### Wishlist
- `GET /api/wishlist` - Get user wishlist (protected)
- `POST /api/wishlist/:placeId` - Add to wishlist (protected)
- `DELETE /api/wishlist/:placeId` - Remove from wishlist (protected)

### Admin
- `GET /api/admin/stats` - Get platform statistics (admin)
- `GET /api/admin/users` - Get all users (admin)
- `PUT /api/admin/users/:id/role` - Update user role (admin)
- `DELETE /api/admin/users/:id` - Delete user (admin)
- `GET /api/admin/places/duplicates` - Get duplicate places (admin)

## 💡 Usage

### Default Login Credentials (after seeding)
- **Admin**: 
  - Email: `admin@explorelocal.com`
  - Password: `admin123`
- **User**: 
  - Email: `john@example.com`
  - Password: `password123`

### Getting API Keys

1. **Cloudinary** (for image/video storage)
   - Sign up at https://cloudinary.com
   - Get your cloud name, API key, and API secret from dashboard

2. **OpenWeatherMap** (for weather data)
   - Sign up at https://openweathermap.org/api
   - Get your free API key

3. **Google Maps** (for map embeds)
   - Go to https://console.cloud.google.com
   - Enable Maps JavaScript API and Maps Embed API
   - Create API key

## 🎯 Key Features Explained

### Duplicate Detection
The system uses Jaccard similarity algorithm to detect duplicate places. When a new place is uploaded, it compares the name and description with existing places. If similarity is above 80%, it marks the place as duplicate.

### Recommendation System
Simple rule-based recommendations based on user activity:
- Tracks user views, searches, ratings, and wishlist additions
- Recommends places in categories the user has shown interest in
- Prioritizes highly-rated places

### Media Upload
- Images and videos are uploaded to Cloudinary
- Supports multiple images (up to 10) and videos (up to 5)
- Automatic optimization and transformation

## 🐛 Troubleshooting

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check `MONGODB_URI` in `.env`

2. **Cloudinary Upload Fails**
   - Verify Cloudinary credentials in `.env`
   - Check file size limits (images: 5MB, videos: 50MB)

3. **JWT Token Errors**
   - Clear browser localStorage
   - Re-login to get new token

4. **CORS Errors**
   - Ensure backend CORS is configured
   - Check that frontend proxy is set correctly

## 📝 Notes

- This is a college project, designed to be simple and exam-friendly
- Code is well-commented for educational purposes
- No heavy frameworks or libraries used
- TypeScript is optional (not used in this version)

## 📄 License

This project is created for educational purposes.

---

**Happy Exploring! 🌍✨**

