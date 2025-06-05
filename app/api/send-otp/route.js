import { NextResponse } from 'next/server';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

const client = twilio(accountSid, authToken);

export async function POST(req) {
  try {
    const { phone, countryCode } = await req.json();
    if (!phone || !countryCode) {
      return NextResponse.json({ error: 'Missing phone or country code.' }, { status: 400 });
    }
    const to = `${countryCode}${phone}`;

    // Initiate verification (Twilio sends OTP)
    await client.verify.v2.services(serviceSid).verifications.create({
      to,
      channel: 'sms',
    });

    return NextResponse.json({ success: true, message: 'OTP sent successfully.' });
  } catch (err) {
    console.error('Error in send-otp:', err?.message || err);
    return NextResponse.json({ error: 'Failed to send OTP.' }, { status: 500 });
  }
}