const express = require("express");
const router = express.Router();
const Admin = require("./models/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const multer = require('multer');
const path = require('path');
const Course = require('./models/course');
const Notification = require("./models/notification");

// Environment Variables
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// Multer configuration for student profile photos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/students');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}`);
  },
});
const upload = multer({ storage });

// Admin Login Route
router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Admin login attempt:", { email });

  try {
    // Find admin user
    const admin = await Admin.findOne({ email });
    console.log("Found admin:", admin ? { email: admin.email } : "No admin found");

    if (!admin) {
      console.log("No admin found with email:", email);
      return res.status(401).json({ error: "Invalid admin credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid admin credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: "Admin login successful",
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name
      }
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ error: "Server error during admin login" });
  }
});

// GET: Fetch all users (admin only)
router.get("/admin/users", async (req, res) => {
  try {
    // Get all users except their passwords, and populate enrolledCourses with course names
    const users = await User.find()
      .select("-password")
      .populate({ path: "enrolledCourses", select: "name" });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// POST: Add a new student (admin only)
router.post('/admin/users', upload.single('profilePhoto'), async (req, res) => {
  try {
    console.log('Received student creation request. Body:', req.body);
    console.log('Received file:', req.file);
    const { name, email, phone, dob, courses, password } = req.body;
    if (!name || !email || !phone || !dob) {
      return res.status(400).json({ error: 'Name, email, phone, and date of birth are required.' });
    }
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists.' });
    }
    // Set a default password if not provided
    const userPassword = password || 'student123';
    // Handle profile photo
    let profilePhotoPath = undefined;
    if (req.file) {
      profilePhotoPath = `/uploads/students/${req.file.filename}`;
      console.log('Profile photo path set to:', profilePhotoPath);
    }
    
    // Handle multiple courses
    let enrolledCourses = [];
    if (courses) {
      try {
        enrolledCourses = JSON.parse(courses);
      } catch (parseError) {
        console.error('Error parsing courses:', parseError);
        return res.status(400).json({ error: 'Invalid courses format' });
      }
    }
    
    // Create and save the new user
    const newUser = new User({
      name,
      email,
      password: userPassword,
      role: 'student',
      enrolledCourses,
      phone,
      dob,
      profilePicture: profilePhotoPath,
    });
    await newUser.save();
    res.status(201).json({
      message: 'Student added successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        dob: newUser.dob,
        enrolledCourses: newUser.enrolledCourses,
        profilePicture: newUser.profilePicture,
      },
    });
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ error: 'Failed to add student' });
  }
});

// PUT: Update a student (admin only)
router.put('/admin/users/:id', upload.single('profilePhoto'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, dob, courses } = req.body;
    const updateData = { name, email, phone, dob };
    
    // Handle multiple courses
    if (courses) {
      try {
        const courseIds = JSON.parse(courses);
        updateData.enrolledCourses = courseIds;
      } catch (parseError) {
        console.error('Error parsing courses:', parseError);
        return res.status(400).json({ error: 'Invalid courses format' });
      }
    }
    
    if (req.file) {
      updateData.profilePicture = `/uploads/students/${req.file.filename}`;
    }
    
    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true })
      .select('-password')
      .populate({ path: 'enrolledCourses', select: 'name' });
      
    if (!updatedUser) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.status(200).json({ message: 'Student updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Failed to update student' });
  }
});

// DELETE: Delete a student (admin only)
router.delete('/admin/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

// GET: Fetch all fee records (admin only)
router.get('/admin/fees', async (req, res) => {
  try {
    // Find all students (users with role 'student')
    const students = await User.find({ role: 'student' })
      .populate({ path: 'enrolledCourses', select: 'name' });
    // Build fee records
    const feeRecords = students.map(student => {
      // For simplicity, use the first enrolled course (if any)
      const course = student.enrolledCourses && student.enrolledCourses[0] ? student.enrolledCourses[0].name : 'N/A';
      // Calculate amount due and status
      const amountDue = student.feeTotal - student.feePaid;
      let status = 'Unpaid';
      if (student.feePaid > 0 && amountDue > 0) status = 'Partial';
      if (amountDue <= 0) status = 'Paid';
      return {
        id: student._id,
        name: student.name,
        course,
        amountDue: student.feeTotal,
        dueDate: student.nextFeeDue ? student.nextFeeDue.toISOString().substring(0, 10) : 'N/A',
        status
      };
    });
    res.status(200).json(feeRecords);
  } catch (error) {
    console.error('Error fetching fee records:', error);
    res.status(500).json({ error: 'Failed to fetch fee records' });
  }
});

// POST: Record a new fee payment (admin only)
router.post('/admin/fees', async (req, res) => {
  try {
    const { studentId, courseId, totalFee, amountPaid, paymentDate, paymentMode } = req.body;

    // Validate required fields
    if (!studentId || !courseId || !totalFee || !amountPaid || !paymentDate || !paymentMode) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Find the student
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Update student's fee information
    student.feeTotal = totalFee;
    student.feePaid = (student.feePaid || 0) + amountPaid;
    student.nextFeeDue = new Date(paymentDate);
    await student.save();

    res.status(200).json({
      message: 'Fee payment recorded successfully',
      student: {
        id: student._id,
        name: student.name,
        feePaid: student.feePaid,
        feeTotal: student.feeTotal,
        nextFeeDue: student.nextFeeDue
      }
    });
  } catch (error) {
    console.error('Error recording fee payment:', error);
    res.status(500).json({ error: 'Failed to record fee payment' });
  }
});

// GET: Admin Dashboard Statistics
router.get('/admin/dashboard', async (req, res) => {
  try {
    // Get total number of students
    const totalStudents = await User.countDocuments({ role: 'student' });
    
    // Get total number of courses
    const activeCourses = await Course.countDocuments();
    
    // Calculate total revenue (sum of all feePaid)
    const students = await User.find({ role: 'student' });
    const revenue = students.reduce((sum, student) => sum + (student.feePaid || 0), 0);
    
    // Calculate total due fees (sum of feeTotal - feePaid)
    const dueFees = students.reduce((sum, student) => {
      const feePaid = student.feePaid || 0;
      const feeTotal = student.feeTotal || 0;
      return sum + (feeTotal - feePaid);
    }, 0);

    // Get new enrollments (students enrolled in the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newEnrollments = await User.countDocuments({
      role: 'student',
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Calculate completion rate (students who have completed at least one course)
    const studentsWithCompletedCourses = await User.countDocuments({
      role: 'student',
      completedCourses: { $gt: 0 }
    });
    const completionRate = totalStudents > 0 
      ? Math.round((studentsWithCompletedCourses / totalStudents) * 100)
      : 0;

    // Calculate growth percentages (for demo purposes, using fixed values)
    // In a real app, you would calculate these based on historical data
    const stats = {
      totalStudents,
      activeCourses,
      revenue,
      dueFees,
      newEnrollments,
      completionRate,
      studentGrowth: 12, // Example growth percentage
      courseGrowth: 8,   // Example growth percentage
      revenueGrowth: 22, // Example growth percentage
      feeChange: -5,     // Example change percentage
      enrollmentGrowth: 15, // Example growth percentage
      completionGrowth: 3   // Example growth percentage
    };

    // Get recent notifications (for demo purposes)
    const notifications = [
      {
        message: `${newEnrollments} new students enrolled this month`,
        time: '1 hour ago'
      },
      {
        message: `₹${dueFees} in fees due this month`,
        time: '2 hours ago'
      },
      {
        message: `${studentsWithCompletedCourses} students completed courses`,
        time: '1 day ago'
      }
    ];

    res.status(200).json({ stats, notifications });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// POST: Create a new notification
router.post('/admin/notifications', async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }
    const notification = new Notification({ title, description });
    await notification.save();
    res.status(201).json({ message: "Notification created", notification });
  } catch (error) {
    res.status(500).json({ error: "Failed to create notification" });
  }
});

// GET: Fetch all notifications
router.get('/admin/notifications', async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

module.exports = router; 