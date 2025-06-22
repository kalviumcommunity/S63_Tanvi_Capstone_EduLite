const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/user');
const jwt = require('jsonwebtoken');

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// Only configure Google Strategy if credentials are available
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  // Configure Google Strategy
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ googleId: profile.id });
        
        if (user) {
          // User exists, return user
          return done(null, user);
        }
        
        // Check if user exists with same email
        user = await User.findOne({ email: profile.emails[0].value });
        
        if (user) {
          // User exists with email but no googleId, update with googleId
          user.googleId = profile.id;
          user.profilePicture = profile.photos[0]?.value || user.profilePicture;
          await user.save();
          return done(null, user);
        }
        
        // Create new user
        const newUser = new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          profilePicture: profile.photos[0]?.value,
          password: 'google-auth-' + Math.random().toString(36).substring(7), // Dummy password
          role: 'student'
        });
        
        await newUser.save();
        return done(null, newUser);
        
      } catch (error) {
        return done(error, null);
      }
    }
  ));
  
  console.log('✅ Google OAuth configured successfully');
} else {
  console.log('⚠️  Google OAuth not configured - missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET');
  console.log('   Google login will be disabled. Set up credentials to enable Google authentication.');
}

// Serialize user for the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

module.exports = { passport, generateToken }; 