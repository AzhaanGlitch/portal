"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import styles from "./active.module.css";
import { Suspense } from "react";

export default function OTPPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AccountActive />
    </Suspense>
  );
}

function AccountActive() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle form submission
  const handleSubmit = async () => {
    if (!username.trim()) {
      setError("Username is required");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/accounts/resend-signup-otp/", { username });
      console.log("OTP sent:", res.data.otp);
      localStorage.setItem("i2dcUsername@#12", username);
      router.push("/auth/verify-otp");
    } finally {
      setLoading(false);
    }
  };

  const spans = new Array(200).fill(0);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white relative overflow-hidden">
      <section className={`${styles.section} absolute inset-0`}>
        {spans.map((_, index) => (
          <span key={index} className={styles.span}></span>
        ))}
      </section>

      <div
        className={`${styles.container} relative z-10 w-full max-w-md p-6 bg-gray-900 rounded-2xl shadow-xl`}
      >
        <div className={styles.formContainer}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="flex flex-col gap-6"
          >
            <h1 className="text-2xl font-bold text-center">Verify OTP</h1>

            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all duration-200 font-semibold"
            >
              {loading ? "Processing..." : "Continue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
