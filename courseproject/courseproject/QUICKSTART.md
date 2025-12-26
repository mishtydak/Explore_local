# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Backend Setup
```bash
cd backend
npm install
cp env.example.txt .env
# Edit .env with your credentials
npm run seed  # Optional: Add sample data
npm start
```

### Step 2: Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Step 3: Access the App
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🔑 Default Login (after seeding)
- **Admin**: admin@explorelocal.com / admin123
- **User**: john@example.com / password123

## 📝 Important Notes

1. **MongoDB**: Make sure MongoDB is running locally or use MongoDB Atlas
2. **Cloudinary**: Required for image/video uploads - sign up at cloudinary.com
3. **API Keys**: 
   - OpenWeatherMap (optional) - for weather widget
   - Google Maps (optional) - for map embeds

## 🐛 Troubleshooting

- **Port 5000 already in use?** Change PORT in backend/.env
- **MongoDB connection error?** Check MONGODB_URI in .env
- **Cloudinary upload fails?** Verify your Cloudinary credentials

## 📚 Full Documentation
See README.md for complete setup instructions and API documentation.

