const express = require('express');
const User = require('./models/user'); // Adjust the path to your user model
const router = express.Router();

// GET: Fetch all users or a single user by ID
router.get('/users', async (req, res) => {
    const { name } = req.query; // Example: /users?name=John
    try {
        const users = name
            ? await User.find({ name: new RegExp(name, 'i') })
            : await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST: Create a new user
router.post('/users', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required.' });
        }

        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists.' });
        }

        // Create and save user
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
