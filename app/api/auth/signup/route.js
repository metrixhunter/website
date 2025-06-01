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
  const { username, email, password } = await req.json();

  // Randomly assign bank and generate account/card numbers
  const bank = banks[Math.floor(Math.random() * banks.length)];
  const accountNumber = generateAccountNumber();
  const debitCardNumber = generateDebitCardNumber();

  // Try database, fallback to file backup
  let dbOk = false;
  try {
    await dbConnect();
    const user = new User({
      username,
      email,
      password,
      bank,
      accountNumber,
      debitCardNumber
    });
    await user.save();
    dbOk = true;
  } catch (e) {
    // ignore, fallback to file backup
  }

  // Always save file backup (for Vercel or offline mode)
  await saveUserBackup({
    username,
    email,
    password,
    bank,
    accountNumber,
    debitCardNumber
  });

  return NextResponse.json({
    success: true,
    bank,
    accountNumber,
    debitCardNumber,
    db: dbOk ? "mongodb" : "file-backup"
  });
}