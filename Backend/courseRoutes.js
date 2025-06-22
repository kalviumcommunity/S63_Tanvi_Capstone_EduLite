const express = require('express');
const Course = require('./models/course'); // Course model
const User = require('./models/user'); // User model
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Multer configuration for course images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/courses');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}`);
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and JPG are allowed.'));
    }
  }
});

// GET: Fetch all courses
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find().populate('enrolledStudents', 'name email');
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Fetch a single course by ID
router.get('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('enrolledStudents', 'name email');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Create a new course with image upload
router.post('/courses', upload.single('image'), async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

    const { name, description, duration, price, category } = req.body;
    
    // Validate required fields
    if (!name || !description || !duration || !price || !category) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Convert string values to numbers
    const courseData = {
      name,
      description,
      duration: Number(duration),
      price: Number(price),
      category,
      enrolledStudents: []
    };

    // Add image path if file was uploaded
    if (req.file) {
      courseData.image = `/uploads/courses/${req.file.filename}`;
    }

    console.log('Creating course with data:', courseData);

    const course = new Course(courseData);
    await course.save();

    console.log('Course created successfully:', course);
    res.status(201).json({ message: 'Course created successfully', course });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(400).json({ error: error.message });
  }
});

// PUT: Enroll a user in a course
router.put('/courses/:courseId/enroll/:userId', async (req, res) => {
  try {
    const { courseId, userId } = req.params;

    // Find the course and user
    const course = await Course.findById(courseId);
    const user = await User.findById(userId);

    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if the user is already enrolled
    if (course.enrolledStudents.includes(userId)) {
      return res.status(400).json({ message: 'User is already enrolled in this course' });
    }

    // Add the user to the course's enrolledStudents
    course.enrolledStudents.push(userId);

    // Add the course to the user's enrolledCourses
    user.enrolledCourses.push(courseId);

    // Save both updates
    await course.save();
    await user.save();

    res.status(200).json({ message: 'User enrolled in course successfully', course, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE: Delete a course by ID
router.delete('/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find the course to delete
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Remove the course ID from all enrolled users
    await User.updateMany(
      { enrolledCourses: id },
      { $pull: { enrolledCourses: id } }
    );

    // Delete the course
    await course.deleteOne();

    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE: Unenroll a user from a course
router.delete('/courses/:courseId/unenroll/:userId', async (req, res) => {
  try {
    const { courseId, userId } = req.params;

    // Find the course and user
    const course = await Course.findById(courseId);
    const user = await User.findById(userId);

    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if the user is enrolled in the course
    if (!course.enrolledStudents.includes(userId)) {
      return res.status(400).json({ message: 'User is not enrolled in this course' });
    }

    // Remove the user from the course's enrolledStudents
    course.enrolledStudents = course.enrolledStudents.filter(
      (studentId) => studentId.toString() !== userId
    );

    // Remove the course from the user's enrolledCourses
    user.enrolledCourses = user.enrolledCourses.filter(
      (courseId) => courseId.toString() !== courseId
    );

    // Save both updates
    await course.save();
    await user.save();

    res.status(200).json({ message: 'User unenrolled from course successfully', course, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Fetch all courses for admin
router.get('/admin/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// PUT: Update a course by ID with image upload
router.put('/courses/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, duration, price, category } = req.body;
    const updateData = {
      name,
      description,
      duration: Number(duration),
      price: Number(price),
      category
    };
    if (req.file) {
      updateData.image = `/uploads/courses/${req.file.filename}`;
    }
    const updatedCourse = await Course.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.status(200).json({ message: 'Course updated successfully', course: updatedCourse });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

module.exports = router;
