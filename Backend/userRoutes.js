const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const Notification = require("./models/notification");
const verifyToken = require("./authMiddleware");
const bcrypt = require("bcryptjs");
const { cloudinary, upload } = require("./cloudinaryConfig");

const router = express.Router();

// Environment Variables (for JWT secret)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// Protect a route
router.get("/dashboard", verifyToken, async (req, res) => {
    try {
      // Find the user by ID, including additional details like enrolled courses if needed
      const user = await User.findById(req.user.id).select("-password"); // Exclude password field
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Return all necessary student data
      const studentData = {
        name: user.name,
        email: user.email,
        completedCourses: user.completedCourses || 0,
        totalCourses: user.enrolledCourses?.length || 0,
        feePaid: user.feePaid || 0,
        feeTotal: user.feeTotal || 0,
        nextFeeDue: user.nextFeeDue || null,
        enrolledCourses: user.enrolledCourses || []
      };
  
      res.status(200).json(studentData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({ message: "Server error" });
    }
});

// File Upload Route (now using Cloudinary)
router.post("/upload", upload.single("profilePicture"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.status(200).json({
    message: "File uploaded successfully",
    filePath: req.file.path,
    publicId: req.file.filename
  });
});

// Update Profile Picture Route
router.put("/users/profile-picture", verifyToken, upload.single("profilePicture"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete old profile picture from Cloudinary if it exists
    if (user.profilePicture && user.profilePicture.includes('cloudinary')) {
      const publicId = user.profilePicture.split('/').pop().split('.')[0];
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.log("Error deleting old image:", error);
      }
    }

    // Update user with new profile picture URL
    user.profilePicture = req.file.path;
    await user.save();

    res.status(200).json({
      message: "Profile picture updated successfully",
      profilePicture: user.profilePicture
    });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ error: "Failed to update profile picture" });
  }
});

// User Registration Route (Signup) - Updated for Cloudinary
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
    const profilePicturePath = req.file ? req.file.path : undefined;

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

    // Allow login with DOB as password (YYYY-MM-DD)
    let isMatch = false;
    if (user.dob) {
      const dobString = user.dob instanceof Date
        ? user.dob.toISOString().substring(0, 10)
        : String(user.dob).substring(0, 10);
      if (password === dobString) {
        isMatch = true;
      }
    }
    // Fallback to hashed password check for legacy users
    if (!isMatch) {
      isMatch = await bcrypt.compare(password, user.password);
    }
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
        phone: user.phone,
        dob: user.dob,
        enrolledCourses: user.enrolledCourses,
        completedCourses: user.completedCourses,
        feePaid: user.feePaid,
        feeTotal: user.feeTotal,
        nextFeeDue: user.nextFeeDue,
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

// Backend route to update or create student data
router.post("/update-student-data", verifyToken, async (req, res) => {
  try {
    const { completedCourses, feePaid, feeTotal, nextFeeDue } = req.body;
    const userId = req.user.id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { completedCourses, feePaid, feeTotal, nextFeeDue } },
      { new: true } // Return the updated user object
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Explicitly return the updated fields
    res.status(200).json({
      message: "Student data updated successfully",
      studentData: updatedUser,  // This will include all updated fields
    });
  } catch (error) {
    console.error("Error updating student data:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // POST route to update student data for dashboard
router.post("/dashboard", verifyToken, async (req, res) => {
    try {
      const { id } = req.user; // Use the ID from the token
      const { enrolledCourses, name, email } = req.body;
  
      // Find the user by ID
      const user = await User.findById(id);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Update user fields
      user.enrolledCourses = enrolledCourses || user.enrolledCourses;
      user.name = name || user.name;
      user.email = email || user.email;
  
      // Save the updated user
      await user.save();
  
      res.status(200).json({ message: "Dashboard data updated successfully", data: user });
    } catch (error) {
      console.error("Error updating dashboard data:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

// Get current logged-in student data
router.get("/users/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate({ path: "enrolledCourses", select: "name image price category" });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

// Get current logged-in student data with all fields and populated enrolledCourses (name only, like admin)
router.get("/users/full-me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate({ path: "enrolledCourses", select: "name" });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log("[DEBUG] /users/full-me user:", JSON.stringify(user, null, 2));
    res.status(200).json(user);
  } catch (error) {
    console.error("[DEBUG] /users/full-me error:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

// GET: Student's own fee/payment status for each enrolled course
router.get("/fees/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate({ path: "enrolledCourses", select: "name image price category" });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // For each enrolled course, build a fee record
    const fees = (user.enrolledCourses || []).map((course) => {
      // For now, use the user's feePaid, feeTotal, nextFeeDue for all courses (can be extended for per-course payments)
      const dueAmount = user.feeTotal || 0;
      const paidAmount = user.feePaid || 0;
      const amountDue = dueAmount - paidAmount;
      let status = "Unpaid";
      if (paidAmount > 0 && amountDue > 0) status = "Partial";
      if (amountDue <= 0 && dueAmount > 0) status = "Paid";
      return {
        _id: course._id,
        course: course.name,
        image: course.image,
        dueAmount,
        dueDate: user.nextFeeDue ? user.nextFeeDue.toISOString().substring(0, 10) : null,
        status,
        paidAmount,
        paidDate: user.updatedAt ? user.updatedAt.toISOString().substring(0, 10) : null,
      };
    });
    res.status(200).json(fees);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch fee records" });
  }
});

// GET: Fetch all notifications for students
router.get("/notifications", verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(10);
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

module.exports = router;
