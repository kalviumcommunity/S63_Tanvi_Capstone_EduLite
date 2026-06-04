const express = require('express');
const router = express.Router();
const Reminder = require('./models/Reminder');
const verifyToken = require('./authMiddleware');

// POST: Create a new reminder
router.post('/reminders', verifyToken, async (req, res) => {
  try {
    const { studentId, type, message, dueDate, channels } = req.body;
    
    if (!studentId || !type || !message || !dueDate) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const reminder = new Reminder({
      studentId,
      type,
      message,
      dueDate,
      channels: channels || ["EMAIL"]
    });

    await reminder.save();
    res.status(201).json({ message: "Reminder created successfully", reminder });
  } catch (error) {
    console.error("Error creating reminder:", error);
    res.status(500).json({ error: "Failed to create reminder" });
  }
});

// GET: Fetch reminders for a specific student
router.get('/reminders/student/:studentId', verifyToken, async (req, res) => {
  try {
    const { studentId } = req.params;
    const reminders = await Reminder.find({ studentId }).sort({ createdAt: -1 });
    res.status(200).json(reminders);
  } catch (error) {
    console.error("Error fetching reminders:", error);
    res.status(500).json({ error: "Failed to fetch reminders" });
  }
});

// PUT: Update status
router.put('/reminders/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const reminder = await Reminder.findByIdAndUpdate(id, { status }, { new: true });
    
    if (!reminder) {
      return res.status(404).json({ error: "Reminder not found" });
    }

    res.status(200).json({ message: "Reminder updated successfully", reminder });
  } catch (error) {
    console.error("Error updating reminder:", error);
    res.status(500).json({ error: "Failed to update reminder" });
  }
});

module.exports = router;
