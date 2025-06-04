import { NextResponse } from 'next/server';
import { User } from '@/backend/models/User';
import dbConnect from '@/backend/utils/dbConnect';

// POST: Verify and check a specific user's bank info
export async function POST(req) {
  await dbConnect();
  const { phone, countryCode, bank, accountNumber, debitCardNumber } = await req.json();

  // Always find user by BOTH phone and countryCode
  const user = await User.findOne({ phone, countryCode });
  if (!user) {
    console.log('User not found with', { phone, countryCode });
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Compare bank names case-insensitively and with trim
  if (
    !user.bank ||
    !bank ||
    user.bank.trim().toLowerCase() !== bank.trim().toLowerCase()
  ) {
    return NextResponse.json(
      { error: 'Incorrect bank for this user.' },
      { status: 400 }
    );
  }
  if (user.accountNumber !== accountNumber) {
    return NextResponse.json(
      { error: 'Incorrect account number.' },
      { status: 400 }
    );
  }
  if (user.debitCardNumber !== debitCardNumber) {
    return NextResponse.json(
      { error: 'Incorrect debit card number.' },
      { status: 400 }
    );
  }

  // Optionally, return user data (excluding sensitive fields)
  const { password, __v, _id, ...safeUser } = user.toObject ? user.toObject() : user;
  return NextResponse.json({ success: true, user: safeUser });
}

// GET: Fetch all users (ADMIN/DEBUG ONLY!)
// This mimics the "userdump" GET handler, but is included here for feature parity.
// Protect this in production.
export async function GET() {
  await dbConnect();
  try {
    // Exclude sensitive fields such as passwords and __v
    const users = await User.find({}, '-password -__v -_id').lean();

    // Optional: If you want to show the _id, remove '-_id'
    // Optional: You can also filter out any other private field here

    return NextResponse.json(users);
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}