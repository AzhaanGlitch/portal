import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { saveOtp } from '@/lib/otp-store';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username } = body; 
    
    if (!username) {
        return NextResponse.json({ error: "Username is required." }, { status: 400 });
    }
    
    const otpCode = saveOtp(username); 
    
    const targetEmail = username; 

    const resendResponse = await resend.emails.send({
        from: 'Acme <onboarding@yourdomain.com>',
        to: [targetEmail],
        subject: 'Your Account Verification Code (OTP)',
        html: `
            <h1>Hello, ${username}!</h1>
            <p>Your one-time verification code is:</p>
            <h2 style="font-size: 32px; color: #1e40af; letter-spacing: 5px;">${otpCode}</h2>
            <p>This code expires in 5 minutes.</p>
        `,
    });

    if (resendResponse.error) {
        console.error("Resend Error:", resendResponse.error);
        throw new Error(resendResponse.error.message);
    }

    console.log(`Successfully sent OTP to ${targetEmail}. Resend ID: ${resendResponse.data?.id}`);
    
    return NextResponse.json(
      { message: "New OTP sent successfully." },
      { status: 200 } 
    );

  } catch (error: any) {
    console.error("Resend OTP error:", error.message);
    return NextResponse.json(
      { error: "Failed to send OTP. Please ensure your Resend API key and domain are correct." },
      { status: 500 }
    );
  }
}