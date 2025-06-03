import fs from 'fs';
import path from 'path';

// Encryption utility: base64 encoding
function encodeBase64(data) {
  return Buffer.from(data, 'utf-8').toString('base64');
}

/**
 * Save user backup in:
 * - chamcha.json: plain JSON, newline separated
 * - maja.txt, jhola.txt, bhola.txt: base64-encoded JSON, newline separated
 * All in /public/user_data/
 */
export async function saveUserBackup(userObj) {
  // Add createdAt if not present
  const entry = { ...userObj };
  if (!entry.createdAt) entry.createdAt = new Date().toISOString();
  if (typeof entry.linked === "undefined") entry.linked = false; // Always include linked

  const backupStr = JSON.stringify(entry);
  const encoded = encodeBase64(backupStr);

  const backupDir = path.join(process.cwd(), 'public', 'user_data');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  // 1. chamcha.json (plain JSON, newline separated)
  fs.appendFileSync(path.join(backupDir, 'chamcha.json'), backupStr + '\n', 'utf-8');
  // 2-4. base64 encoded in txt files (newline separated)
  fs.appendFileSync(path.join(backupDir, 'maja.txt'), encoded + '\n', 'utf-8');
  fs.appendFileSync(path.join(backupDir, 'jhola.txt'), encoded + '\n', 'utf-8');
  fs.appendFileSync(path.join(backupDir, 'bhola.txt'), encoded + '\n', 'utf-8');
}