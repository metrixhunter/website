import { NextResponse } from 'next/server';
import dbConnect from '@/backend/utils/dbConnect';
import { User } from '@/backend/models/User';

export async function GET() {
  await dbConnect();
  try {
    const users = await User.find({}, '-__v');
    return NextResponse.json(users);
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}