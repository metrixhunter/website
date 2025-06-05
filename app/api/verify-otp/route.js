import { NextResponse } from 'next/server';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

const client = twilio(accountSid, authToken);

export async function POST(req) {
  try {
    const { phone, code } = await req.json();
    if (!phone || !code) {
      return NextResponse.json({ error: 'Missing phone or code.' }, { status: 400 });
    }

    // Check verification
    const verification_check = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({ to: phone, code });

    if (verification_check.status === 'approved') {
      return NextResponse.json({ success: true, message: 'OTP verified successfully.' });
    } else {
      return NextResponse.json({ success: false, message: 'Invalid or expired OTP.' }, { status: 400 });
    }
  } catch (err) {
    console.error('Error verifying OTP:', err?.message || err);
    return NextResponse.json({ error: 'Failed to verify OTP.' }, { status: 500 });
  }
}