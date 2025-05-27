// finedge/backend/routes/authRoutes.js
import express from 'express';
import { User } from '../models/User.js'; // Import the User model (note the .js extension!)
import bcrypt from 'bcryptjs';

const router = express.Router();

// Signup Route (FULL LOGIC RESTORED)
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    user = new User({ username, email, password });
    // The password hashing happens automatically via the pre-save hook in the User model
    await user.save();

    res.status(201).json({ message: 'User registered successfully', username: user.username });
  } catch (error) {
    console.error('Signup error:', error); // This will log to your backend terminal
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// Login Route (FULL LOGIC RESTORED)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' }); // User not found
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' }); // Password mismatch
    }

    res.status(200).json({ message: 'Login successful', username: user.username });
  } catch (error) {
    console.error('Login error:', error); // This will log to your backend terminal
    res.status(500).json({ message: 'Server error during login' });
  }
});

export default router; // Export the router as default
