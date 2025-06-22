const express = require('express');
const { passport, generateToken } = require('./googleAuth');
const router = express.Router();

// Check if Google OAuth is configured
const isGoogleConfigured = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;

// Google OAuth login route
router.get('/auth/google', (req, res) => {
  if (!isGoogleConfigured) {
    return res.status(503).json({ 
      error: 'Google OAuth is not configured',
      message: 'Please set up GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables'
    });
  }
  
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res);
});

// Google OAuth callback route
router.get('/auth/google/callback', (req, res) => {
  if (!isGoogleConfigured) {
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=Google OAuth not configured`);
  }
  
  passport.authenticate('google', { failureRedirect: '/login' })(req, res, (err) => {
    if (err) {
      console.error('Google auth callback error:', err);
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=Authentication failed`);
    }
    
    try {
      // Generate JWT token
      const token = generateToken(req.user);
      
      // Redirect to frontend with token
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth-success?token=${token}`);
    } catch (error) {
      console.error('Google auth callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=Authentication failed`);
    }
  });
});

// Logout route
router.get('/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

module.exports = router; 