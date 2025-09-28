"use client";
import api from "@/lib/api";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./OTPPage.module.css";
import { toast } from "sonner";
import "./OTPPage.css";
import { Suspense } from "react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Input } from "@/components/ui/input";
import { REGEXP_ONLY_DIGITS } from "input-otp"

const COUNTDOWN_TIME = 15;

export default function OTPPageWrapper() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <OTPPage />
    </Suspense>
  );
}

function OTPPage() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(COUNTDOWN_TIME);
  const [canResend, setCanResend] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [isEmailSent, setIsEmailSent] = useState(false);

  // Get username from localStorage safely
  const getUsername = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("i2dcUsername@#12");
    }
    return null;
  };

  // Initialize username from localStorage on component mount
  useEffect(() => {
    const storedUsername = getUsername();
    if (storedUsername) {
      setUsername(storedUsername);
      setIsEmailSent(true);
    }
  }, []);

  // Handle email submission to send OTP
  const handleSendOTP = async () => {
    if (!username || !username.includes("@")) {
      setError("Please enter a valid email address");
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/accounts/resend-signup-otp/", { 
        username 
      });

      if (response.status === 200 || response.status === 201) {
        setIsEmailSent(true);
        setSuccess("OTP sent to your email successfully!");
        toast.success("OTP sent to your email successfully!");
        setCountdown(COUNTDOWN_TIME);
        setCanResend(false);
        localStorage.setItem("i2dcUsername@#12", username);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to send OTP. Please try again.");
      toast.error(error.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!isEmailSent) {
      await handleSendOTP();
      return;
    }

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    const currentUsername = getUsername() || username;
    if (!currentUsername) {
      setError("User session not found. Please enter your email.");
      toast.error("User session not found. Please enter your email.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/accounts/verify-otp/", {
        username: currentUsername,
        otp,
      });

      if (response.status === 200) {
        setSuccess("OTP verified successfully! Redirecting...");
        toast.success("OTP verified successfully! Redirecting...");
        // Clear sensitive data from localStorage
        localStorage.removeItem("i2dcUsername@#12");
        setTimeout(() => {
          router.push("/auth");
        }, 2000);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "OTP verification failed. Please try again.");
      toast.error(error.response?.data?.message || "OTP verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    const currentUsername = getUsername() || username;
    if (!currentUsername) {
      setError("Please enter your email first");
      toast.error("Please enter your email first");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post(
        "/accounts/resend-signup-otp/",
        { username: currentUsername }
      );

      if (response.status === 200 || response.status === 201) {
        setSuccess("New OTP sent to your email");
        toast.success("New OTP sent to your email");
        setCountdown(COUNTDOWN_TIME);
        setCanResend(false);
        setOtp(""); // Clear existing OTP
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to resend OTP. Please try again.");
      toast.error(error.response?.data?.message || "Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP change
  const handleOtpChange = (value: string) => {
    setOtp(value);
    setError(""); // Clear error when user starts typing

    // Auto-submit when OTP is complete and email is already sent
    if (value.length === 6 && isEmailSent) {
      handleSubmit();
    }
  };

  // Handle email input change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setError("");
  };

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const spans = new Array(200).fill(0);

  return (
    <div className="otp-container">
      <section className={styles.section}>
        {spans.map((_, index) => (
          <span key={index} className={styles.span}></span>
        ))}

        <div className={styles.container}>
          <div className={styles.formContainer}>
            <form onSubmit={handleSubmit}>
              <h1>{isEmailSent ? "Verify OTP" : "Verify Email"}</h1>
              <p className="otp-instructions">
                {isEmailSent 
                  ? `Enter the 6-digit code sent to ${username}`
                  : "Enter your Email ID to send verification code"
                }
              </p>

              {!isEmailSent ? (
                <Input
                  type="email"
                  name="username"
                  className="border-gray-700"
                  value={username}
                  onChange={handleEmailChange}
                  placeholder="Enter your email"
                  disabled={loading}
                />
              ) : (
                <div className="text-center text-sm text-gray-600 mb-4">
                  {username} 
                  <button
                    type="button"
                    onClick={() => {
                      setIsEmailSent(false);
                      setOtp("");
                      setCanResend(false);
                      setCountdown(COUNTDOWN_TIME);
                      localStorage.removeItem("i2dcUsername@#12");
                    }}
                    className="ml-2 text-blue-500 underline hover:text-blue-700 text-xs"
                    disabled={loading}
                  >
                    Change email
                  </button>
                </div>
              )}
              <br />

              {error && (
                <div className="otp-error-message">
                  {error}
                </div>
              )}

              {success && (
                <div className="otp-success-message">
                  {success}
                </div>
              )}

              {isEmailSent && (
                <div className="otp-inputs-container">
                  <InputOTP
                    pattern={REGEXP_ONLY_DIGITS}
                    maxLength={6}
                    value={otp}
                    onChange={handleOtpChange}
                    disabled={loading}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || (isEmailSent ? otp.length !== 6 : !username)}
                className={`otp-button ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading 
                  ? (isEmailSent ? "Verifying..." : "Sending...") 
                  : (isEmailSent ? "Verify OTP" : "Send OTP")
                }
              </button>

              {isEmailSent && (
                <div className="otp-resend">
                  <p>
                    Didn't receive the code?&nbsp;
                    {canResend ? (
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={loading}
                        className="text-blue-500 underline hover:text-blue-700 disabled:opacity-50"
                      >
                        Resend OTP
                      </button>
                    ) : (
                      <span className="text-gray-600">
                        Resend in {countdown}s
                      </span>
                    )}
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={() => router.push("/auth")}
                disabled={loading}
                className={`text-blue-500 underline hover:text-blue-700 disabled:opacity-50 mt-2`}
              >
                Back to Login
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}