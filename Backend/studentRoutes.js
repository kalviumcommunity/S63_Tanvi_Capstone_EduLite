const express = require("express");
const router = express.Router();
const Student = require("./models/student"); // Import the Student model
const verifyToken = require("./authMiddleware"); // Import the verifyToken middleware

// Get a student by ID
router.get("/:id", async (req, res) => {
  try {
    const studentId = req.params.id;

    // Find the student by ID
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error("Error fetching student data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add a new student (for testing)
router.post("/", async (req, res) => {
  try {
    const { name, completedCourses, totalCourses, feePaid, feeTotal, nextFeeDue } = req.body;

    const newStudent = new Student({
      name,
      completedCourses,
      totalCourses,
      feePaid,
      feeTotal,
      nextFeeDue,
    });

    const savedStudent = await newStudent.save();

    res.status(201).json(savedStudent);
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ message: "Server error" });
  }
});
const mongoose = require("mongoose");

// Protected dashboard route
router.get("/dashboard", verifyToken, async (req, res) => {
    try {
      // Find the user by ID, including additional details like enrolled courses if needed
      const user = await User.findById(req.user.id).select("-password"); // Exclude password field
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Add logic to fetch student-related details if needed
      const studentData = {
        name: user.name,
        email: user.email,
        enrolledCourses: user.enrolledCourses || [],
        // Add other fields based on requirements
      };
  
      res.status(200).json(studentData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
module.exports = router;


