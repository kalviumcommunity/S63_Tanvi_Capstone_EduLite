const express = require('express');
const User = require('../Backend/models/user'); // Adjust path if necessary
const router = express.Router();

// GET: Fetch all users or a single user by ID
router.get('/users/:id?', async (req, res) => {
  try {
    if (req.params.id) {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      return res.status(200).json(user);
    }
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
