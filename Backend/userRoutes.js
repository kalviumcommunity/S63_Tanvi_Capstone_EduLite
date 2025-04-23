const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const multer = require("multer");
const path = require("path");
const verifyToken = require("./authMiddleware");
const bcrypt = require("bcryptjs");

const router = express.Router();

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}`);
  },
});
const upload = multer({ storage });

// Environment Variables (for JWT secret)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// Protect a route
router.get("/dashboard", verifyToken, (req, res) => {
  res.status(200).json({
    message: "Welcome to the protected dashboard",
    user: req.user,
  });
});

// File Upload Route
router.post("/upload", upload.single("profilePicture"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.status(200).json({
    message: "File uploaded successfully",
    filePath: `/uploads/${req.file.filename}`,
  });
});

// User Registration Route (Signup)
router.post("/users/signup", upload.single("profilePicture"), async (req, res) => {
  const { name, email, password } = req.body;

  // Validate input fields
  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields (name, email, password) are required." });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists." });
    }

    // Handle profile picture
    const profilePicturePath = req.file ? `/uploads/${req.file.filename}` : undefined;

    // Create and save the new user
    const newUser = new User({
      name,
      email,
      password,
      profilePicture: profilePicturePath,
    });
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        profilePicture: newUser.profilePicture,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error.message);
    res.status(500).json({ error: "Failed to register user. Please try again." });
  }
});

// User Login Route
router.post("/users/login", async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Invalid email or password." });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id, name: user.name }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ error: "Failed to login. Please try again." });
  }
});

// GET: Fetch all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users. Please try again." });
  }
});

module.exports = router;
