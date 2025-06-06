import { NextResponse } from 'next/server';
import twilio from 'twilio';

const accountSid = 'AC14a4aa7099f887c777709b57b88c250e';
const authToken = '04fd6679e696318b09d9b9265c4ae2d5';
const verifyServiceSid = 'VA357c4e5a24bf3007dd034f0a1b4435fc';

const client = twilio(accountSid, authToken);

export async function POST(req) {
  try {
    const { phone, code } = await req.json();

    if (!phone || !code) {
      return NextResponse.json({ success: false, message: 'Phone and code are required' }, { status: 400 });
    }

    // If user enters '123456' as code, accept it immediately (testing fallback)
    if (code === '123456') {
      return NextResponse.json({ success: true, message: 'OTP verified successfully (test code)' });
    }

    const verificationCheck = await client.verify.v2.services(verifyServiceSid)
      .verificationChecks
      .create({ to: phone, code });

    if (verificationCheck.status === 'approved') {
      return NextResponse.json({ success: true, message: 'OTP verified successfully' });
    } else {
      return NextResponse.json({ success: false, message: 'Invalid OTP' }, { status: 400 });
    }
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
