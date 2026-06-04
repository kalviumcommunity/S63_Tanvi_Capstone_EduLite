const express = require('express');
const router = express.Router();
const ActivityLog = require('./models/ActivityLog');
const verifyToken = require('./authMiddleware');

// GET: Fetch all activity logs (recent first)
router.get('/activity-logs', verifyToken, async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(50).populate('userId', 'name role email');
    res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    res.status(500).json({ error: "Failed to fetch activity logs" });
  }
});

module.exports = router;
