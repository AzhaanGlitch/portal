type OtpStore = {
  [username: string]: {
    code: string;
    expiresAt: number; 
    isVerified: boolean;
  };
};

// Global in-memory storage for OTPs
const otpStore: OtpStore = {};

const OTP_EXPIRY_MINUTES = 5;

/**
 * Generates a random 6-digit OTP code.
 * @returns {string} The 6-digit OTP.
 */
function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Saves a new OTP for a user and calculates its expiration time.
 * @param {string} username - The user's unique identifier.
 * @returns {string} The generated OTP code.
 */
export function saveOtp(username: string): string {
  const code = generateOtp();
  const expiresAt = Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000; 
  
  otpStore[username] = {
    code,
    expiresAt,
    isVerified: false,
  };
  
  console.log(`[DEV-MOCK] Stored OTP ${code} for user ${username}. Expires at: ${new Date(expiresAt).toLocaleTimeString()}`);
  return code;
}

/**
 * Retrieves and validates an OTP code.
 * @param {string} username - The user's unique identifier.
 * @param {string} code - The submitted OTP code.
 * @returns {boolean} True if the code is valid and not expired, false otherwise.
 */
export function verifyOtp(username: string, code: string): boolean {
  const userOtpData = otpStore[username];

  if (!userOtpData) {
    return false; // User has no stored OTP
  }
  
  if (userOtpData.code !== code) {
    return false; // Code mismatch
  }

  if (Date.now() > userOtpData.expiresAt) {
    // Optional: Delete expired OTP here
    console.log(`[DEV-MOCK] OTP for ${username} is EXPIRED.`);
    delete otpStore[username];
    return false; // Expired
  }
  
  // Mark as verified and remove to prevent reuse
  userOtpData.isVerified = true;
  delete otpStore[username]; 
  return true;
}

export function markUserAsVerified(username: string): void {
  console.log(`[DEV-MOCK] User ${username} marked as VERIFIED.`);
}