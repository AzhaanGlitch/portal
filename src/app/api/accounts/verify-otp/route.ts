import { NextResponse } from 'next/server';
import { verifyOtp, markUserAsVerified } from '@/lib/otp-store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { otp, username } = body; 

    if (!otp || !username) {
        return NextResponse.json({ error: "Missing OTP or username." }, { status: 400 });
    }
    
    const isValid = verifyOtp(username, otp); 

    if (isValid) {
        markUserAsVerified(username);
        
        return NextResponse.json(
            { 
                message: "Email verified successfully",
                access: "real-jwt-access-token", 
                refresh: "real-jwt-refresh-token"
            },
            { status: 200 }
        );
    } else {
        // 4. Return failure
        return NextResponse.json(
            { error: "Invalid or expired OTP code. Please request a new one." },
            { status: 400 }
        );
    }

  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { error: "Internal Server Error during verification." },
      { status: 500 }
    );
  }
}