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
  bank: { type: String, required: true }, // Now required
  accountNumber: { type: String, required: true }, // Now required
  debitCardNumber: { type: String, required: true }, // Now required
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

export { User };