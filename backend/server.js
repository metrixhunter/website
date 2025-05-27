import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './auth/authroutes.js'; // ✅ Import auth routes

dotenv.config(); // Load environment variables

const app = express();
app.use(cors({ origin: 'http://localhost:3000' })); // ✅ Allow Next.js frontend
app.use(express.json()); // ✅ Parse JSON requests

const PORT = process.env.PORT || 5000;

// ✅ Connect MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

app.use('/api/auth', authRoutes); // ✅ Mount authentication routes

app.get('/', (req, res) => {
  res.send('🚀 Backend is running!');
});

app.listen(PORT, () => console.log(`🌐 Server running on http://localhost:${PORT}`));
