import { NextResponse } from 'next/server';
import { User } from '@/backend/models/User';
import {dbConnect, getUser, saveUser} from '@/backend/utils/dbConnect';

/**
 * Accepts: POST JSON body with { username, phone, countryCode, bank, accountNumber, debitCardNumber }
 * - Checks if user exists and matches these bank details.
 * - If match: sets linked=true for user, returns success.
 * - If not: returns error.
 */
export async function POST(req) {
  try {
    const { username, phone, countryCode, bank, accountNumber, debitCardNumber } = await req.json();

    await dbConnect();

    // Find user by identity
    const user = await User.findOne({ username, phone, countryCode });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found.' },
        { status: 404 }
      );
    }

    // Check if bank details match
    if (
      user.bank !== bank ||
      user.accountNumber !== accountNumber ||
      user.debitCardNumber !== debitCardNumber
    ) {
      return NextResponse.json(
        { success: false, message: 'Bank details do not match.' },
        { status: 401 }
      );
    }

    // Details correct, set linked true if not already
    if (!user.linked) {
      user.linked = true;
      await user.save();
    }

    return NextResponse.json({
      success: true,
      message: 'Bank account linked successfully.',
      linked: true,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: 'Failed to link account.', error: err.message },
      { status: 500 }
    );
  }
}