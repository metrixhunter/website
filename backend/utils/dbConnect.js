import mongoose from 'mongoose';
import { createClient } from 'redis';
import { User } from '../models/User.js'; // Use relative path, NOT alias

// --- Redis client setup ---
const redisClient = createClient({
  url: process.env.UPSTASH_REDIS_URL,
});
redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

// --- MongoDB connection cache ---
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// --- Main dbConnect ---
async function dbConnect() {
  if (cached.conn) {
    return { mongoAvailable: true, redisAvailable: false };
  }
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error('Missing MONGODB_URI');
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local or in your Vercel project settings'
    );
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongoose) => mongoose);
  }
  try {
    cached.conn = await cached.promise;
    return { mongoAvailable: true, redisAvailable: false };
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    // Try Redis fallback
    try {
      if (!redisClient.isOpen) await redisClient.connect();
      return { mongoAvailable: false, redisAvailable: true };
    } catch (redisErr) {
      console.error('Redis connection failed:', redisErr);
      throw new Error('Both MongoDB and Redis connections failed');
    }
  }
}

// --- Unified getUser ---
async function getUser({ phone, username }) {
  const { mongoAvailable, redisAvailable } = await dbConnect();
  if (mongoAvailable) {
    if (username) {
      return await User.findOne({ phone, username });
    } else {
      return await User.findOne({ phone });
    }
  } else if (redisAvailable) {
    const data = await redisClient.get(`user:${phone}`);
    if (!data) return null;
    const user = JSON.parse(data);
    if (username && user.username !== username) return null;
    return user;
  }
  return null;
}

// --- Unified saveUser ---
async function saveUser(userObj) {
  const { mongoAvailable, redisAvailable } = await dbConnect();
  if (mongoAvailable) {
    const user = new User(userObj);
    return await user.save();
  } else if (redisAvailable) {
    await redisClient.set(`user:${userObj.phone}`, JSON.stringify(userObj));
    return userObj;
  }
  return null;
}

export { dbConnect, getUser, saveUser };