require('dotenv').config(); // For environment variables
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const session = require('express-session');
const passport = require('passport');
const userRoutes = require('./userRoutes');
const courseRoutes = require('./courseRoutes');
const path = require("path");
const studentRoutes = require("./studentRoutes");
const adminRoutes = require("./adminRoutes");
const googleRoutes = require("./googleRoutes");

const cors = require('cors');

const app = express();
app.use(cors({
  origin: '*', // Allow all origins during development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Session configuration for Passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware
// app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Configure CORS
app.use(express.json()); // To parse JSON in request body
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', userRoutes);
app.use('/api', courseRoutes);
app.use('/api', studentRoutes);
app.use('/api', adminRoutes);
app.use('/api', googleRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

// MongoDB connection using environment variables
mongoose.connect(process.env.MONGO_URI || "mongodb+srv://tanviagarwals63:1234tanvi@edulite.9zovzao.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if database connection fails
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please use a different port.`);
        process.exit(1);
    } else {
        console.error('Server error:', err);
        process.exit(1);
    }
});
