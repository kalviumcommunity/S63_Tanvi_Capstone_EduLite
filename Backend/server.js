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

/* =========================
   ✅ FIXED CORS CONFIG
   ========================= */
// Initialize cron scheduler
require('./cron/scheduler');

const allowedOrigins = [
  'https://edulitebytanvi.netlify.app',
  'http://localhost:5173'
];

app.use(cors({
  origin: allowedOrigins,   // ✅ removed custom function
  credentials: true
}));

app.options('*', cors());   // ✅ handle preflight requests

/* =========================
   SESSION CONFIG (unchanged)
   ========================= */

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // ✅ important for cross-origin cookies
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

/* =========================
   MIDDLEWARE (unchanged order improved)
   ========================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* =========================
   ROUTES (unchanged)
   ========================= */

// Require new routes
const activityRoutes = require('./activityRoutes');
const auditRoutes = require('./auditRoutes');
const reminderRoutes = require('./reminderRoutes');
const searchRoutes = require('./searchRoutes');
const gamificationRoutes = require('./gamificationRoutes');
const paymentRoutes = require('./paymentRoutes');

// Routes
// Put specific routes before generic ones that might have catch-all params like /:id
app.use('/api', activityRoutes);
app.use('/api', auditRoutes);
app.use('/api', reminderRoutes);
app.use('/api', searchRoutes);
app.use('/api', gamificationRoutes);
app.use('/api', paymentRoutes);

app.use('/api', userRoutes);
app.use('/api', courseRoutes);
app.use('/api', adminRoutes);
app.use('/api', googleRoutes);
app.use('/api', studentRoutes); // Keep this at the bottom as it contains /:id

app.get('/', (req, res) => {
    res.send('API is running...');
});

/* =========================
   DB CONNECTION (unchanged)
   ========================= */

mongoose.connect(process.env.MONGO_URI || "mongodb+srv://tanviagarwals63:1234tanvi@edulite.9zovzao.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

/* =========================
   ERROR HANDLER (unchanged)
   ========================= */

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message || 'Something went wrong!' }); // ✅ slightly improved
});

/* =========================
   SERVER START (unchanged)
   ========================= */

const PORT = process.env.PORT || 5000;

const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  }
});

// Set io globally so routes can emit events
app.set('io', io);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start server
server.listen(PORT, () => {
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
