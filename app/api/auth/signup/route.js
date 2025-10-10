import { NextResponse } from 'next/server';
import { User, validateUserObject } from '@/backend/models/User';
import { dbConnect } from '@/backend/utils/dbConnect';
import { saveUserBackup } from '@/app/secret/backup-util';
import { createClient } from 'redis';

const banks = ['SBI', 'HDFC', 'ICICI', 'AXIS'];

// --- Random Generators ---
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
  return Math.floor(10000 + Math.random() * 90000);
}

// --- Redis helpers ---
async function saveUserInRedis(userObj) {
  const redisUrl = process.env.UPSTASH_REDIS_URL || process.env.REDIS_URL;
  if (!redisUrl) return;
  const client = createClient({ url: redisUrl });
  try {
    await client.connect();
    await client.set(`user:${userObj.phone}`, JSON.stringify(userObj));
  } catch (e) {
    console.error('Redis save failed:', e);
  } finally {
    try { await client.disconnect(); } catch {}
  }
}

async function findUserInRedis({ phone, countryCode }) {
  const redisUrl = process.env.UPSTASH_REDIS_URL || process.env.REDIS_URL;
  if (!redisUrl) return null;
  const client = createClient({ url: redisUrl });
  try {
    await client.connect();
    const data = await client.get(`user:${phone}`);
    if (data) {
      const user = JSON.parse(data);
      if (user.countryCode === countryCode) return user;
    }
  } catch (e) {
    console.error('Redis find failed:', e);
  } finally {
    try { await client.disconnect(); } catch {}
  }
  return null;
}

// --- MAIN SIGNUP ROUTE ---
export async function POST(req) {
  const { username, phone, countryCode } = await req.json();

  if (!username || !phone || !countryCode)
    return NextResponse.json({ success: false, message: 'All fields are required.' }, { status: 400 });

  // --- Try MongoDB first ---
  let mongoOk = false;
  let existing = null;
  try {
    await dbConnect();
    mongoOk = true;
    existing = await User.findOne({ phone, countryCode });
  } catch (err) {
    console.warn('MongoDB not reachable, switching to Redis fallback');
  }

  // --- If user already exists ---
  if (mongoOk && existing) {
    return NextResponse.json({
      success: false,
      message: 'User already exists',
      user: existing
    }, { status: 409 });
  }

  // --- Check Redis fallback if Mongo is down ---
  if (!mongoOk) {
    const redisUser = await findUserInRedis({ phone, countryCode });
    if (redisUser) {
      return NextResponse.json({
        success: false,
        message: 'User already exists (cached)',
        user: redisUser
      }, { status: 409 });
    }
  }

  // --- Create user object ---
  const randomBank = banks[Math.floor(Math.random() * banks.length)];
  const userObj = {
    username,
    phone,
    countryCode,
    upiBalance: 0,
    banks: [
      {
        bankName: randomBank,
        bankDetails: {
          accountNumber: generateAccountNumber(),
          debitCardNumber: generateDebitCardNumber(),
          pin: generatePin(),
          balance: generateBalance()
        }
      }
    ],
    transactions: [],
    comments: [],
    linked: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // --- Save to Mongo if possible ---
  if (mongoOk) {
    try {
      const newUser = new User(userObj);
      await newUser.save();
    } catch (e) {
      console.error('Mongo save failed:', e);
    }
  } else {
    // Save to Redis if Mongo down
    await saveUserInRedis(userObj);
  }

  // --- Save local backup (only in dev mode) ---
  if (process.env.NODE_ENV === 'development') {
    try {
      await saveUserBackup(userObj);
    } catch (err) {
      console.error('Local backup failed:', err);
    }
  }

  // --- Final success response ---
  return NextResponse.json({
    success: true,
    message: 'User registered successfully',
    user: userObj
  }, { status: 201 });
}

