require('dotenv').config(); // For environment variables
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const cors = require("cors");
const userRoutes = require('./userRoutes');
const courseRoutes = require('./courseRoutes');
const path = require("path");
const studentRoutes = require("./studentRoutes");

const cors = require('cors');

const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // React app's URL
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
}));

// Initialize the app first

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

app.get('/', (req, res) => {
    res.send('API is running...');
});

// MongoDB connection using environment variables
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});




// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
