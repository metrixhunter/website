import express from 'express';
import { User } from '../models/User.js'; // Import the User model
const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
  const { username, phone } = req.body;

  try {
    let user = await User.findOne({ phone });
    if (user) {
      return res.status(400).json({ message: 'User with this phone already exists' });
    }

    user = new User({ username, phone });
    await user.save();

    res.status(201).json({ message: 'User registered successfully', username: user.username, phone: user.phone });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { username, phone } = req.body;

  try {
    const user = await User.findOne({ phone, username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' }); // User not found
    }

    res.status(200).json({ message: 'Login successful', username: user.username, phone: user.phone });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

export default router;