import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Invalid email'
    ]
  },
  password: { type: String, required: true, minlength: 6 },
  bank: { type: String }, // e.g. 'HDFC', 'ICICI', etc.
  accountNumber: { type: String }, // Add your own validation if needed
  debitCardNumber: { type: String }, // Add your own validation if needed
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// The fix is here:
const User = mongoose.models.User || mongoose.model('User', userSchema);

export { User };