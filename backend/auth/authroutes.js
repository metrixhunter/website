import express from "express";
import fs from "fs";
import path from "path";
import { dbConnect, getUser, saveUser } from "../utils/dbConnect.js";

const router = express.Router();

const banks = ["SBI", "HDFC", "ICICI", "AXIS"];
const countryCodes = ["+91", "+1", "+44", "+81", "+61", "+49", "+971", "+86"];

// ------------------ Utility Generators ------------------
function generateAccountNumber() {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}
function generateDebitCardNumber() {
  return Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
}
function generatePin() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}
function generateBalance() {
  return Math.floor(5000 + Math.random() * 95000);
}

// ------------------ Backup Helper ------------------
function encodeBase64(data) {
  return Buffer.from(data, "utf-8").toString("base64");
}

function backupUserData(userData) {
  const backupDir = path.join(process.cwd(), "public", "user_data");
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

  const backupObj = {
    username: userData.username,
    phone: userData.phone,
    countryCode: userData.countryCode,
    banks: userData.banks,
    upiBalance: userData.upiBalance,
    createdAt: userData.createdAt,
    linked: userData.linked,
  };

  const backupStr = JSON.stringify(backupObj, null, 2);
  const encoded = encodeBase64(backupStr);

  fs.appendFileSync(path.join(backupDir, "backup_raw.json"), backupStr + "\n", "utf-8");
  fs.appendFileSync(path.join(backupDir, "backup_encoded.txt"), encoded + "\n", "utf-8");
}

// ------------------ SIGNUP ROUTE ------------------
router.post("/signup", async (req, res) => {
  const { username, phone, countryCode } = req.body;

  try {
    // Basic validation
    if (!username || !phone || !countryCode) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!countryCodes.includes(countryCode)) {
      return res.status(400).json({ message: "Invalid country code" });
    }
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: "Phone number must be valid 10 digits" });
    }

    await dbConnect();

    let existingUser = await getUser({ phone });
    if (existingUser) {
      return res.status(400).json({ message: "User with this phone already exists" });
    }

    // ------------------ Bank Generation ------------------
    const bankCount = Math.floor(Math.random() * 4) + 1; // 1–4 banks
    const banksData = [];
    for (let i = 0; i < bankCount; i++) {
      const bankName = banks[i % banks.length];
      banksData.push({
        bankName,
        bankDetails: {
          accountNumber: generateAccountNumber(),
          debitCardNumber: generateDebitCardNumber(),
          pin: generatePin(),
          balance: generateBalance(),
        },
      });
    }

    // ------------------ User Object ------------------
    const userData = {
      username,
      phone,
      countryCode,
      upiBalance: 0, // upi wallet (max 10000)
      banks: banksData,
      transactions: [], // empty initially
      comments: [], // support messages + AI responses
      createdAt: new Date().toISOString(),
      linked: false, // can be changed later
    };

    const savedUser = await saveUser(userData);
    backupUserData(savedUser);

    res.status(201).json({
      message: "User registered successfully",
      user: savedUser,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error during signup" });
  }
});

// ------------------ LOGIN ROUTE ------------------
router.post("/login", async (req, res) => {
  const { username, phone } = req.body;

  try {
    if (!username || !phone) {
      return res.status(400).json({ message: "Username and phone are required" });
    }

    await dbConnect();

    const user = await getUser({ username, phone });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

export default router;
