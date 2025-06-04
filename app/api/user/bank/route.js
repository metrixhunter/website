import { NextResponse } from 'next/server';
import { User } from '@/backend/models/User';
import dbConnect from '@/backend/utils/dbConnect';

export async function POST(req) {
  await dbConnect();
  const { phone, bank, accountNumber, debitCardNumber } = await req.json();

  const user = await User.findOne({ phone });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Debug logs for troubleshooting
  console.log('user.bank:', user.bank, '| received bank:', bank);

  // Compare bank names in a case-insensitive and whitespace-insensitive way
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