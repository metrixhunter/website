import mongoose from 'mongoose';
import { createClient } from 'redis';

// --- Transaction Schema ---
const transactionSchema = new mongoose.Schema({
  type: { type: String }, // e.g., "bill_payment", "transfer", "upi", etc.
  amount: { type: Number },
  method: { type: String }, // e.g., "UPI", "Debit Card", "Credit Card"
  bank: { type: String },
  status: { type: String, default: "pending" },
  comment: { type: String }, // optional note or AI comment
  date: { type: Date, default: Date.now }
}, { _id: false });

// --- Comment / Support Message Schema ---
const commentSchema = new mongoose.Schema({
  sender: { type: String, enum: ["user", "ai", "Lakshya"], required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now }
}, { _id: false });

// --- Bank Details Schema ---
const bankDetailsSchema = new mongoose.Schema({
  accountNumber: { type: String, required: true },
  debitCardNumber: { type: String, required: true },
  pin: { type: String, required: true },
  balance: { type: Number, default: 0 }
}, { _id: false });

// --- Individual Bank Entry Schema ---
const bankSchema = new mongoose.Schema({
  bankName: { type: String, required: true },
  bankDetails: { type: bankDetailsSchema, required: true }
}, { _id: false });

// --- Main User Schema ---
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  phone: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{10}$/, 'Phone number must be a valid 10-digit number']
  },
  countryCode: { type: String, required: true }, // e.g., "+91"

  // --- Wallet ---
  upiBalance: {
    type: Number,
    default: 0,
    max: [10000, 'UPI balance cannot exceed ₹10,000']
  },

  // --- Banks (at least one required) ---
  banks: {
    type: [bankSchema],
    validate: [arr => arr.length >= 1, 'User must have at least one bank']
  },

  // --- Transactions and Support ---
  transactions: [transactionSchema],
  comments: [commentSchema],

  // --- Status ---
  linked: { type: Boolean, default: false }
}, { timestamps: true });

// --- Model Export ---
export const User = mongoose.models.User || mongoose.model('User', userSchema);

// --- Utility Validator for Redis / Fallback ---
export function validateUserObject(obj) {
  return (
    typeof obj?.username === 'string' &&
    typeof obj?.phone === 'string' &&
    typeof obj?.countryCode === 'string' &&
    Array.isArray(obj?.banks)
  );
}

// --- Export redis createClient for cache/fallback use ---
export { createClient };
