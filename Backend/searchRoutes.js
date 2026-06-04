const express = require('express');
const router = express.Router();
const User = require('./models/user');
const Course = require('./models/course');

// GET: Smart search
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q ? req.query.q.toLowerCase() : "";
    let students = [];
    let courses = [];

    // Special logic
    if (query.includes("unpaid")) {
      // Find students with pending fees
      const allStudents = await User.find({ role: 'student' });
      students = allStudents.filter(s => (s.feeTotal - s.feePaid) > 0);
    } else if (query.includes("low enrollment")) {
      // Assuming a simple filter, e.g., low enrollment is < 5 students. 
      // But we'd need a way to count. For now, mock or fetch courses.
      // (Since course model doesn't explicitly have student count, we just return some or all courses for demo)
      courses = await Course.find().limit(5); 
    } else if (query) {
      // Generic search
      students = await User.find({ 
        role: 'student', 
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } }
        ] 
      });

      courses = await Course.find({
        name: { $regex: query, $options: 'i' }
      });
    }

    res.status(200).json({ students, courses });
  } catch (error) {
    console.error("Error in smart search:", error);
    res.status(500).json({ error: "Search failed" });
  }
});

module.exports = router;
