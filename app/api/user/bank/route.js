import { NextResponse } from 'next/server';
import { User } from '@/backend/models/User';
import dbConnect from '@/backend/utils/dbConnect';

export async function POST(req) {
  await dbConnect();
  // Expect countryCode in the request body!
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

  return NextResponse.json({ success: true });
}