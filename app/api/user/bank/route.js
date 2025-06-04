import { NextResponse } from 'next/server';
import { User } from '@/backend/models/User';
import dbConnect from '@/backend/utils/dbConnect';

// Helper: Build a dynamic OR query object
function buildOrQuery({ phone, countryCode, bank, accountNumber, debitCardNumber }) {
  const or = [];
  if (phone) or.push({ phone });
  if (countryCode) or.push({ countryCode });
  if (bank) or.push({ bank: new RegExp(bank, 'i') });
  if (accountNumber) or.push({ accountNumber });
  if (debitCardNumber) or.push({ debitCardNumber });
  return or.length > 0 ? { $or: or } : {};
}

export async function POST(req) {
  await dbConnect();
  const { phone, countryCode, bank, accountNumber, debitCardNumber } = await req.json();

  // Build the search query based on provided fields
  const query = buildOrQuery({ phone, countryCode, bank, accountNumber, debitCardNumber });

  // Find users matching any of the given fields
  const users = await User.find(query, '-password -__v').lean();

  if (!users || users.length === 0) {
    return NextResponse.json({ error: 'No users found matching criteria.' }, { status: 404 });
  }

  return NextResponse.json({ success: true, users });
}

// GET: Return all users (excluding sensitive fields, as before)
export async function GET() {
  await dbConnect();
  try {
    const users = await User.find({}, '-password -__v -_id').lean();
    return NextResponse.json(users);
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}