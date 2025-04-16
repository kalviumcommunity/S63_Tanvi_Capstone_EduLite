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

// POST: Create a new user
router.post('/users', async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      const user = new User({ name, email, password, role });
      await user.save();
      res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // PUT: Update a user's details by ID
router.put('/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const options = { new: true, runValidators: true };
  
      const user = await User.findByIdAndUpdate(id, updates, options);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  

  
module.exports = router;