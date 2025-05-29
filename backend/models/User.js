import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  phone: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^\d{10}$/,
      'Phone number must be a valid 10-digit number'
    ]
  },
  bank: { type: String }, // e.g. 'HDFC', 'ICICI', etc.
  accountNumber: { type: String }, // Add your own validation if needed
  debitCardNumber: { type: String }, // Add your own validation if needed
}, { timestamps: true });

// No password hashing needed anymore

const User = mongoose.models.User || mongoose.model('User', userSchema);

export { User };