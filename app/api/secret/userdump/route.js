import { NextResponse } from 'next/server';
import dbConnect from '@/backend/utils/dbConnect';
import { User } from '@/backend/models/User';

// IMPORTANT: In production, you should protect this route with authentication/authorization.

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