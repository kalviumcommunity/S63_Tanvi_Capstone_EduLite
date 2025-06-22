# Google OAuth Setup Guide

## Prerequisites
1. Google Cloud Console account
2. A Google Cloud Project

## Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API

## Step 2: Configure OAuth Consent Screen
1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - App name: "EduLite"
   - User support email: Your email
   - Developer contact information: Your email
4. Add scopes: `email`, `profile`
5. Add test users (your email for testing)

## Step 3: Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback` (for development)
   - `https://yourdomain.com/api/auth/google/callback` (for production)
5. Copy the Client ID and Client Secret

## Step 4: Environment Variables
Add these to your `.env` file:

```
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Session Secret (for Passport.js)
SESSION_SECRET=your_session_secret_here

# Frontend URL (for redirects)
FRONTEND_URL=http://localhost:5173
```

## Step 5: Database Schema Update
The User model has been updated to include:
- `googleId`: String field for Google OAuth ID
- `dob`: Made optional for Google auth users
- Password hashing: Only for non-Google users

## Features Implemented:
- ✅ Google OAuth login button
- ✅ Automatic user creation for new Google users
- ✅ Profile picture import from Google
- ✅ JWT token generation after Google auth
- ✅ Seamless redirect to dashboard
- ✅ Error handling for failed authentication
- ✅ Loading states and user feedback

## How It Works:
1. **User clicks "Continue with Google"**
2. **Redirects to Google OAuth**
3. **User authorizes the application**
4. **Google redirects back with user data**
5. **Backend creates/updates user and generates JWT**
6. **Frontend receives token and redirects to dashboard**

## Security Features:
- Secure session management
- JWT token authentication
- Password hashing only for manual login
- CORS configuration for security
- Environment variable protection

## Testing:
1. Start your backend server
2. Start your frontend application
3. Go to the student login page
4. Click "Continue with Google"
5. Complete the Google OAuth flow
6. You should be redirected to the dashboard

## Troubleshooting:
- **"Invalid redirect URI"**: Check your Google Cloud Console redirect URIs
- **"Access blocked"**: Add your email to test users in OAuth consent screen
- **"Session error"**: Check your SESSION_SECRET environment variable
- **"CORS error"**: Verify your CORS configuration in server.js 