import { NextResponse } from 'next/server';
import { User } from '@/backend/models/User';
import dbConnect from '@/backend/utils/dbConnect';
import { saveUserBackup } from '@/app/secret/backup-util';

const banks = ['sbi', 'hdfc', 'icici', 'axis'];

function generateAccountNumber() {
  return Math.floor(100000000 + Math.random() * 900000000).toString();
}

function generateDebitCardNumber() {
  return Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
}

export async function POST(req) {
  const { username, email, password, phone } = await req.json();

  // Generate bank info
  const bank = banks[Math.floor(Math.random() * banks.length)];
  const accountNumber = generateAccountNumber();
  const debitCardNumber = generateDebitCardNumber();

  // Prepare full user object for DB and backup
  const userObj = {
    username,
    email,
    password,
    phone,
    bank,
    accountNumber,
    debitCardNumber,
    createdAt: new Date().toISOString(),
  };

  // Try to save to database (if available)
  try {
    await dbConnect();
    const user = new User(userObj);
    await user.save();
  } catch (e) {
    // Database connection failed or not present (Vercel fallback), ignore error
  }

  // Always save to file backup (Vercel/local file system)
  await saveUserBackup(userObj);

  // Only return minimal info to frontend (never the file content!)
  return NextResponse.json({ success: true, bank, accountNumber, debitCardNumber });
}