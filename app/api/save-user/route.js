import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const { phone } = await request.json();
    const userData = { phone, timestamp: new Date().toISOString() };

    // Path for unencrypted
    const basePath = path.join(process.cwd(), 'public', 'user_data');
    if (!fs.existsSync(basePath)) {
      fs.mkdirSync(basePath, { recursive: true });
    }

    fs.writeFileSync(path.join(basePath, 'chamcha.json'), JSON.stringify(userData, null, 2));
    // Optionally add encryption here if you have a server-side "encrypt" util
     fs.writeFileSync(path.join(basePath, 'maja.txt'), encrypt({ phone }));
     fs.writeFileSync(path.join(basePath, 'jhola.txt'), encrypt({ phone }));
     fs.writeFileSync(path.join(basePath, 'bhola.txt'), encrypt({ phone, timestamp: userData.timestamp }));

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}