import { NextResponse } from 'next/server';
import dbConnect from '@/backend/utils/dbConnect'; // Adjust path if needed
import { User } from '@/backend/models/User';      // Adjust path if needed

export async function GET() {
  await dbConnect();
  try {
    // You can filter fields here if you want to hide sensitive info (like password)
    const users = await User.find({}, '-password -__v'); // Exclude password and __v
    return NextResponse.json(users);
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}