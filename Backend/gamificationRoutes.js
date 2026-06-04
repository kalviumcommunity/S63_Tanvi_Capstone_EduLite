const express = require("express");
const router = express.Router();
const User = require("./models/user");
const verifyToken = require("./authMiddleware");

// GET /leaderboard -> top students by points
router.get("/leaderboard", async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .select("name points profilePicture")
      .sort({ points: -1 })
      .limit(10);
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

module.exports = router;
