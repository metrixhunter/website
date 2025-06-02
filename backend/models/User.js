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
  countryCode: { type: String, required: true }, // ITU country code, e.g., "+91"
  bank: { type: String, required: true },
  accountNumber: { type: String, required: true },
  debitCardNumber: { type: String, required: true },
}, { timestamps: true });

// Named export for ESModules/Next.js compatibility
export const User = mongoose.models.User || mongoose.model('User', userSchema);