# Cloudinary Setup Guide

## Prerequisites
1. Create a free account at [Cloudinary](https://cloudinary.com/)
2. Get your Cloudinary credentials from your dashboard

## Environment Variables
Add the following environment variables to your `.env` file:

```
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## How to get Cloudinary credentials:
1. Sign up/login to Cloudinary
2. Go to your Dashboard
3. Copy the following values:
   - Cloud Name
   - API Key
   - API Secret

## Features Implemented:
- ✅ Profile picture upload to Cloudinary
- ✅ Automatic image optimization (400x400, face detection)
- ✅ File type validation (JPEG, PNG, GIF, WebP)
- ✅ File size validation (max 5MB)
- ✅ Automatic deletion of old profile pictures
- ✅ Progress tracking for uploads
- ✅ Error handling

## API Endpoints:
- `PUT /users/profile-picture` - Update profile picture
- `POST /upload` - General file upload (for testing)

## Frontend Features:
- File selection with validation
- Upload progress indicator
- Real-time image preview
- Error handling and user feedback 