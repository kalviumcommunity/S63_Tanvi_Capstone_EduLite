const express = require('express');
const router = express.Router();
const AuditLog = require('./models/AuditLog');
const verifyToken = require('./authMiddleware');

// GET: Fetch all audit logs (Admin only ideally, but we'll protect with token for now)
router.get('/audit-logs', verifyToken, async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).populate('performedBy', 'name email');
    res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    res.status(500).json({ error: "Failed to fetch audit logs" });
  }
});

module.exports = router;
