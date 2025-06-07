import { NextResponse } from 'next/server';
import { User } from '@/backend/models/User';
import {dbConnect, getUser, saveUser} from '@/backend/utils/dbConnect';

export async function POST(req) {
  try {
    const { username, phone, countryCode } = await req.json();

    await dbConnect();

    // Find user by unique info
    const user = await User.findOne({ username, phone, countryCode });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      username: user.username,
      phone: user.phone,
      countryCode: user.countryCode,
      bank: user.bank,
      accountNumber: user.accountNumber,
      debitCardNumber: user.debitCardNumber,
      linked: user.linked,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: 'Login failed.', error: err.message },
      { status: 500 }
    );
  }
}