"use client";
import api from "@/lib/api";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Suspense } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Mail, ArrowLeft, Clock, ShieldCheck, RefreshCw } from "lucide-react";

const COUNTDOWN_TIME = 15;

export default function OTPPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-blue-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
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

  const getUsername = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("i2dcUsername@#12");
    }
    return null;
  };

  useEffect(() => {
    const storedUsername = getUsername();
    if (storedUsername) {
      setUsername(storedUsername);
      setIsEmailSent(true);
    }
  }, []);

  const handleSendOTP = async () => {
    if (!username || !username.includes("@")) {
      setError("Please enter a valid email address");
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/accounts/resend-signup-otp/", { username });
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
      const response = await api.post("/accounts/resend-signup-otp/", { username: currentUsername });
      if (response.status === 200 || response.status === 201) {
        setSuccess("New OTP sent to your email");
        toast.success("New OTP sent to your email");
        setCountdown(COUNTDOWN_TIME);
        setCanResend(false);
        setOtp("");
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to resend OTP. Please try again.");
      toast.error(error.response?.data?.message || "Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);
    setError("");
    if (value.length === 6 && isEmailSent) {
      handleSubmit();
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setError("");
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-blue-900/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {isEmailSent ? "Verify OTP" : "Verify Email"}
          </h1>
          <p className="text-muted-foreground">
            {isEmailSent 
              ? "Enter the verification code sent to your email"
              : "Enter your email to receive a verification code"
            }
          </p>
        </div>

        <Card className="border-border/50 shadow-xl">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle className="text-center">
                {isEmailSent ? "Check Your Email" : "Email Verification"}
              </CardTitle>
              <CardDescription className="text-center">
                {isEmailSent 
                  ? `We've sent a 6-digit code to ${username}`
                  : "We'll send you a verification code"
                }
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {!isEmailSent ? (
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={username}
                      onChange={handleEmailChange}
                      className="pl-10"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-center p-4 bg-muted/50 rounded-lg">
                    <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-sm font-medium">{username}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsEmailSent(false);
                        setOtp("");
                        setCanResend(false);
                        setCountdown(COUNTDOWN_TIME);
                        localStorage.removeItem("i2dcUsername@#12");
                      }}
                      className="ml-2 h-6 text-xs"
                      disabled={loading}
                    >
                      Change
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-center block">Enter 6-Digit Code</Label>
                    <div className="flex justify-center">
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
                  </div>

                  {canResend ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleResendOTP}
                      disabled={loading}
                      className="w-full"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Resend OTP
                    </Button>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Resend code in {countdown}s</span>
                    </div>
                  )}
                </>
              )}

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive text-center">{error}</p>
                </div>
              )}

              {success && (
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-700 dark:text-green-300 text-center">{success}</p>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col space-y-3">
              <Button
                type="submit"
                className="w-full"
                disabled={loading || (isEmailSent ? otp.length !== 6 : !username)}
              >
                {loading 
                  ? (isEmailSent ? "Verifying..." : "Sending...") 
                  : (isEmailSent ? "Verify OTP" : "Send OTP")
                }
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/auth")}
                disabled={loading}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            Didn't receive the code? Check your spam folder or{' '}
            <button 
              onClick={handleResendOTP} 
              disabled={!canResend || loading}
              className="text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              request a new one
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}