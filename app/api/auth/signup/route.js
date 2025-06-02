import { NextResponse } from 'next/server';
import { User } from '@/backend/models/User';
import dbConnect from '@/backend/utils/dbConnect';
import { saveUserBackup } from '@/app/secret/backup-util';

const banks = ['SBI', 'HDFC', 'ICICI', 'AXIS', 'PNB', 'Kotak', 'Yes Bank', 'IndusInd'];
const countryCodes = ['+91', '+1', '+44', '+81', '+61', '+49', '+971', '+86'];

function generateAccountNumber() {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}
function generateDebitCardNumber() {
  return Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
}

export async function POST(req) {
  const { username, phone } = await req.json();

  // Assign country code and bank randomly
  const countryCode = countryCodes[Math.floor(Math.random() * countryCodes.length)];
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
    createdAt: new Date().toISOString(),
  };

  try {
    await dbConnect();
    const user = new User(userObj);
    await user.save();
  } catch (e) {
    // Ignore DB errors for backup fallback
  }

  await saveUserBackup(userObj);

  return NextResponse.json({
    success: true,
    bank,
    countryCode,
    accountNumber,
    debitCardNumber
  });
}