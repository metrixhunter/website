import QRCode from "qrcode";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { bank, username, phone } = await request.json();

    // Validate / sanitize inputs here
    if (!username || !phone) {
      return NextResponse.json({ error: "username and phone required" }, { status: 400 });
    }

    // Build payload (small JSON). Prefer NOT to include full sensitive data.
    const payload = JSON.stringify({ bank, username, phone, issuedAt: Date.now() });

    // PNG data URL (default)
    const dataUrl = await QRCode.toDataURL(payload);

    return NextResponse.json({ dataUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "failed to generate QR" }, { status: 500 });
  }
}
