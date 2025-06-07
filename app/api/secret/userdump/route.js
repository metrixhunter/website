import { NextResponse } from 'next/server';
import { dbConnect } from '@/backend/utils/dbConnect';
import { User } from '@/backend/models/User';
import { createClient } from 'redis';

// Helper: Fetch all users from Redis if needed
async function fetchAllUsersFromRedis(redisClient) {
  const users = [];
  // Get all keys of pattern user:*
  const keys = await redisClient.keys('user:*');
  for (const key of keys) {
    const val = await redisClient.get(key);
    if (val) {
      try {
        const obj = JSON.parse(val);
        // Remove sensitive fields if any (add/remove as needed)
        delete obj.password;
        users.push(obj);
      } catch {}
    }
  }
  return users;
}

export async function GET() {
  // Try Mongo first, then Redis
  let mongoAvailable = false;
  let redisAvailable = false;
  let redisClient = null;
  try {
    const conn = await dbConnect();
    mongoAvailable = conn.mongoAvailable;
    redisAvailable = conn.redisAvailable;
    if (conn.redisAvailable && conn.redisClient) {
      redisClient = conn.redisClient;
    }
  } catch (e) {
    // If dbConnect throws, both are unavailable
  }

  // --- Try MongoDB
  if (mongoAvailable) {
    try {
      const users = await User.find({}, '-password -__v -_id').lean();
      return NextResponse.json(users);
    } catch (err) {
      // fall through to Redis
    }
  }

  // --- Try Redis
  if (redisAvailable) {
    try {
      // If using Upstash Redis with ioredis, you may need to create the client here
      if (!redisClient) {
        redisClient = createClient({ url: process.env.UPSTASH_REDIS_URL });
        await redisClient.connect();
      }
      const users = await fetchAllUsersFromRedis(redisClient);
      return NextResponse.json(users);
    } catch (err) {
      // fall through to error
    }
  }

  // --- If both fail
  return NextResponse.json({ error: 'Server error: cannot retrieve users from MongoDB or Redis' }, { status: 500 });
}