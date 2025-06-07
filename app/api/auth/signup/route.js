import { NextResponse } from 'next/server';
import { User } from '@/backend/models/User';
import { dbConnect, getUser, saveUser} from '@/backend/utils/dbConnect';
import { saveUserBackup } from '@/app/secret/backup-util';
import { promises as fs } from 'fs';
import path from 'path';

const banks = ['SBI', 'HDFC', 'ICICI', 'AXIS'];

function generateAccountNumber() {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}
function generateDebitCardNumber() {
  return Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
}

// Helper for base64 encoding
function encodeBase64(data) {
  return Buffer.from(data, 'utf-8').toString('base64');
}

// Helper to write to all files (app + public/user_data)
async function saveToFiles(userObj) {
  const locations = [
    path.resolve(process.cwd(), 'app'),
    path.resolve(process.cwd(), 'public', 'user_data'),
  ];

  const backupStr = JSON.stringify(userObj);
  const encoded = encodeBase64(backupStr);

  for (const dir of locations) {
    try {
      await fs.mkdir(dir, { recursive: true });

      // chamcha.json (plain JSON, newline separated)
      const chamchaPath = path.join(dir, 'chamcha.json');
      await fs.appendFile(chamchaPath, backupStr + '\n', 'utf8');

      // maja.txt, jhola.txt, bhola.txt (base64-encoded, newline separated)
      for (const file of ['maja.txt', 'jhola.txt', 'bhola.txt']) {
        const filePath = path.join(dir, file);
        await fs.appendFile(filePath, encoded + '\n', 'utf8');
      }
    } catch (e) {
      console.error(`Error writing backup in ${dir}:`, e);
    }
  }
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
    linked: false,
    createdAt: new Date().toISOString(),
  };

  try {
    const user = new User(userObj);
    await user.save();
  } catch (e) {
    // Ignore DB errors for backup fallback
  }

  await saveUserBackup(userObj); // This saves to app, pp, and public/user_data if you use the provided backup-util.js
  await saveToFiles(userObj);    // This ensures both app and public/user_data are always updated

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