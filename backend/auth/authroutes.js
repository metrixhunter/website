import express from 'express';
import { User } from '../models/User.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// List of banks
const banks = ['SBI', 'HDFC', 'ICICI', 'AXIS', 'PNB', 'Kotak', 'Yes Bank', 'IndusInd'];

// Helper functions to generate account and card numbers
function generateAccountNumber() {
  // 10-digit number
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}
function generateDebitCardNumber() {
  // 16-digit number
  return Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
}

// Helper for base64 encode
function encodeBase64(data) {
  return Buffer.from(data, 'utf-8').toString('base64');
}

// Helper to write backups
function backupUserData(userData) {
  // Prepare user details for backup
  const backupObj = {
    username: userData.username,
    phone: userData.phone,
    bank: userData.bank,
    accountNumber: userData.accountNumber,
    debitCardNumber: userData.debitCardNumber,
    createdAt: new Date().toISOString()
  };
  const backupStr = JSON.stringify(backupObj, null, 2);
  const encoded = encodeBase64(backupStr);

  // Files to backup
  const backupFiles = ['chamcha.json', 'maja.txt', 'bhola.txt', 'jhola.txt'];
  backupFiles.forEach(filename => {
    const filePath = path.join(process.cwd(), filename);
    // Append or create file if doesn't exist
    try {
      fs.appendFileSync(filePath, encoded + '\n', 'utf-8');
    } catch (err) {
      // In production you might want to handle/log this
      console.error(`Failed to backup to ${filename}:`, err);
    }
  });
}

// Signup Route
router.post('/signup', async (req, res) => {
  const { username, phone } = req.body;

  try {
    let user = await User.findOne({ phone });
    if (user) {
      return res.status(400).json({ message: 'User with this phone already exists' });
    }

    // Randomly assign bank and generate numbers
    const bank = banks[Math.floor(Math.random() * banks.length)];
    const accountNumber = generateAccountNumber();
    const debitCardNumber = generateDebitCardNumber();

    user = new User({ username, phone, bank, accountNumber, debitCardNumber });
    await user.save();

    // Backup user data in base64
    backupUserData(user);

    res.status(201).json({
      message: 'User registered successfully',
      username: user.username,
      phone: user.phone,
      bank: user.bank,
      accountNumber: user.accountNumber,
      debitCardNumber: user.debitCardNumber
    });
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
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({
      message: 'Login successful',
      username: user.username,
      phone: user.phone,
      bank: user.bank,
      accountNumber: user.accountNumber,
      debitCardNumber: user.debitCardNumber
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

export default router;