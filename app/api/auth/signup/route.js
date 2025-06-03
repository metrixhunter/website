import { NextResponse } from 'next/server';
import { User } from '@/backend/models/User';
import dbConnect from '@/backend/utils/dbConnect';
import { saveUserBackup } from '@/app/secret/backup-util';

const banks = ['SBI', 'HDFC', 'ICICI', 'AXIS'];

function generateAccountNumber() {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}
function generateDebitCardNumber() {
  return Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
}

export async function POST(req) {
  const { username, phone, countryCode } = await req.json();

  await dbConnect();

  // Check if user exists (by phone and countryCode)
  const existing = await User.findOne({ phone, countryCode });
  if (existing) {
    // User already exists, do not create new account/bank/card
    return NextResponse.json({
      success: false,
      message: 'User already exists.',
      username: existing.username,
      bank: existing.bank,
      countryCode: existing.countryCode,
      accountNumber: existing.accountNumber,
      debitCardNumber: existing.debitCardNumber,
      linked: existing.linked
    }, { status: 409 });
  }

  // Assign random bank and numbers
  const bank = banks[Math.floor(Math.random() * banks.length)];
  const accountNumber = generateAccountNumber();
  const debitCardNumber = generateDebitCardNumber();

  const userObj = {
    username,
    phone,
    countryCode,
    bank,
    accountNumber,
    debitCardNumber,
    linked: false, // Always false at signup
    createdAt: new Date().toISOString(),
  };

  try {
    const user = new User(userObj);
    await user.save();
  } catch (e) {
    // Ignore DB errors for backup fallback
  }

  await saveUserBackup(userObj);

  return NextResponse.json({
    success: true,
    username,
    bank,
    countryCode,
    accountNumber,
    debitCardNumber,
    linked: false
  });
}