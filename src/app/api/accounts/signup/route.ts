import { NextResponse } from 'next/server';
import { saveOtp } from '@/lib/otp-store'; 
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendVerificationEmail(username: string) {
    const otpCode = saveOtp(username); 
    const targetEmail = username; 
    const resendResponse = await resend.emails.send({
        from: 'Acme <onboarding@yourdomain.com>', 
        to: [targetEmail],
        subject: 'Your Account Verification Code (OTP)',
        html: `
            <h1>Welcome!</h1>
            <p>Your verification code for new account creation is:</p>
            <h2 style="font-size: 32px; color: #1e40af; letter-spacing: 5px;">${otpCode}</h2>
            <p>This code expires in 5 minutes.</p>
        `,
    });

    if (resendResponse.error) {
        console.error("Initial OTP Send Error:", resendResponse.error);
        throw new Error("Failed to send initial OTP.");
    }
}


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, first_name, last_name, username } = body;

    if (!username || !password) {
         return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }
    
    await sendVerificationEmail(username);

    console.log("SUCCESS: User account created and initial OTP sent:", { email, username });

    return NextResponse.json(
      { 
        message: "Account created. Verification email sent.",
        username: username,
      },
      { status: 201 } 
    );

  } catch (error: any) {
    console.error("Signup error:", error.message);
    return NextResponse.json(
      { error: error.message || "Internal Server Error during sign up." },
      { status: 500 }
    );
  }
}