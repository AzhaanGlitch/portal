"use client";
import api from "@/lib/api";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "./OTPPage.css";
import styles from "./OTPPage.module.css";
import { Suspense } from "react";

export default function OTPPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OTPPage />
    </Suspense>
  );
}

function OTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Handle OTP input change
  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newOtp.every((digit) => digit !== "") && index === 5) {
      handleSubmit(newOtp.join(""));
    }
  };

  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent, _: number) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const pastedDigits = pastedData
      .replace(/[^0-9]/g, "")
      .split("")
      .slice(0, 6);

    if (pastedDigits.length === 6) {
      const newOtp = [...otp];
      pastedDigits.forEach((digit, i) => {
        if (i < 6) newOtp[i] = digit;
      });
      setOtp(newOtp);

      // Focus on the last input
      inputRefs.current[5]?.focus();

      // Auto-submit if all digits are pasted
      if (newOtp.every((digit) => digit !== "")) {
        handleSubmit(newOtp.join(""));
      }
    }
  };

  // Handle backspace key
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle form submission
  const handleSubmit = async (otpValue?: string) => {
    const otpCode = otpValue || otp.join("");

    const username = localStorage.getItem("i2dcUsername@#12");

    if (otpCode.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/accounts/verify-otp/", {
        username,
        otp: otpCode,
      });

      if (response.status === 200) {
        setSuccess("OTP verified successfully! Redirecting...");
        setTimeout(() => {
          router.push("/home");
        }, 2000);
      }
    } catch (error: unknown) {

      setError("OTP verification failed");

    } finally {
      setLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    setLoading(true);
    setError("");
    const username = localStorage.getItem("i2dcUsername@#12");
    try {
      const response = await api.post(
        "/accounts/resend-signup-otp/",
        {username}
      );
      console.log("Resend OTP response:", response.data.otp);

      if (response.status === 200) {
        setSuccess("New OTP sent to your email");
        setCountdown(60);
        setCanResend(false);

        // Reset OTP fields
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (error: unknown) {

      setError("Failed to resend OTP");

    } finally {
      setLoading(false);
    }
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

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);
  const spans = new Array(200).fill(0);
  return (
    <div className="otp-container">
      <section className={styles.section}>
        {spans.map((_, index) => (
          <span key={index} className={styles.span}></span>
        ))}

        <div className={styles.container}>
          <div className={styles.formContainer}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <h1>Verify OTP</h1>
              <p className="otp-instructions">
                Enter the 6-digit code sent to
                <br />
                <strong>{email}</strong>
              </p>

              {error && <p className="otp-error">{error}</p>}
              {success && <p className="otp-success">{success}</p>}

              <div className="otp-inputs-container">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onPaste={(e) => handlePaste(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="otp-input"
                    disabled={loading}
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading || otp.some((digit) => digit === "")}
                className="otp-button"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <div className="otp-resend">
                <p>
                  Didn&lsquo;t receive the code?&nbsp;
                  {canResend ? (
                    <a type="button" onClick={handleResendOTP} className="">
                      Resend OTP
                    </a>
                  ) : (
                    `Resend in ${countdown}s`
                  )}
                </p>
                <a
                  type="button"
                  className="cursor-pointer text-blue-500 underline"
                  onClick={() => router.push("/auth")}
                >
                  Back to Login
                </a>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
