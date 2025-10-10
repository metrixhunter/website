import { NextResponse } from 'next/server';
import { dbConnect, getUser } from '@/backend/utils/dbConnect';
import { createClient } from 'redis';
import { promises as fs } from 'fs';
import path from 'path';

// Helper: decode base64 lines
function decodeBase64(str) {
  return Buffer.from(str, 'base64').toString('utf-8');
}

// Read from chamcha.json (backup)
async function findUserInChamcha({ username, phone, countryCode }) {
  const chamchaPath = path.join(process.cwd(), 'public', 'user_data', 'chamcha.json');
  try {
    const data = await fs.readFile(chamchaPath, 'utf8');
    const lines = data.split('\n').filter(Boolean);
    for (const line of lines) {
      const user = JSON.parse(line);
      if (user.username === username && user.phone === phone && user.countryCode === countryCode)
        return user;
    }
  } catch {}
  return null;
}

// Read from encrypted txt backups
async function findUserInEncryptedTxt({ username, phone, countryCode }, file) {
  const txtPath = path.join(process.cwd(), 'public', 'user_data', file);
  try {
    const data = await fs.readFile(txtPath, 'utf8');
    const lines = data.split('\n').filter(Boolean);
    for (const line of lines) {
      const decoded = JSON.parse(decodeBase64(line));
      if (decoded.username === username && decoded.phone === phone && decoded.countryCode === countryCode)
        return decoded;
    }
  } catch {}
  return null;
}

// Redis fallback
async function findUserInRedis({ username, phone, countryCode }) {
  const redisUrl = process.env.UPSTASH_REDIS_URL || process.env.REDIS_URL;
  if (!redisUrl) return null;
  const client = createClient({ url: redisUrl });
  try {
    await client.connect();
    const key = `user:${phone}`;
    const userStr = await client.get(key);
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.username === username && user.phone === phone && user.countryCode === countryCode)
        return user;
    }
  } catch {}
  try { await client.disconnect(); } catch {}
  return null;
}

// Main login route
export async function POST(req) {
  try {
    const { username, phone, countryCode } = await req.json();
    if (!username || !phone || !countryCode)
      return NextResponse.json({ success: false, message: 'Missing fields.' }, { status: 400 });

    let user = null;
    let mongoTried = false;

    try {
      await dbConnect();
      user = await getUser({ username, phone, countryCode });
      mongoTried = true;
    } catch (err) {
      console.error('MongoDB error', err.message);
    }

    if (!user) user = await findUserInRedis({ username, phone, countryCode });
    if (!user) user = await findUserInChamcha({ username, phone, countryCode });
    if (!user) {
      for (const file of ['maja.txt', 'jhola.txt', 'bhola.txt']) {
        user = await findUserInEncryptedTxt({ username, phone, countryCode }, file);
        if (user) break;
      }
    }

    if (!user) {
      const msg = mongoTried ? 'User not found.' : 'MongoDB unreachable and user not found.';
      return NextResponse.json({ success: false, message: msg }, { status: 404 });
    }

    const responseUser = {
      success: true,
      username: user.username,
      phone: user.phone,
      countryCode: user.countryCode,
      upiBalance: user.upiBalance || 0,
      banks: Array.isArray(user.banks) ? user.banks : [],
      transactions: Array.isArray(user.transactions) ? user.transactions : [],
      comments: Array.isArray(user.comments) ? user.comments : [],
      linked: user.linked || false,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return NextResponse.json(responseUser, { status: 200 });
  } catch (err) {
    console.error('Login POST error:', err);
    return NextResponse.json(
      { success: false, message: 'Login failed.', error: err.message },
      { status: 500 }
    );
  }
}
