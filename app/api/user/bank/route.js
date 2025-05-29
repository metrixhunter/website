import { NextResponse } from 'next/server';
import { User } from '@/backend/models/User';
import dbConnect from '@/backend/utils/dbConnect';

export async function POST(req) {
  await dbConnect();
  const { email, bank, accountNumber, debitCardNumber } = await req.json();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (user.bank !== bank) {
    return NextResponse.json({ error: 'Incorrect bank for this user.' }, { status: 400 });
  }
  if (user.accountNumber !== accountNumber) {
    return NextResponse.json({ error: 'Incorrect account number.' }, { status: 400 });
  }
  if (user.debitCardNumber !== debitCardNumber) {
    return NextResponse.json({ error: 'Incorrect debit card number.' }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}