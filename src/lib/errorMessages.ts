export function getFriendlyAuthError(error: unknown): string {
  const defaultMsg = "Something went wrong. Please try again.";
  if (!error) return defaultMsg;
  const e = error as any;
  const code: string | undefined = e?.code || e?.name;
  const message: string | undefined = e?.message;
  if (typeof code === "string") {
    switch (code) {
      case "auth/invalid-email":
        return "The email address is invalid.";
      case "auth/user-disabled":
        return "This account has been disabled.";
      case "auth/user-not-found":
        return "No account found with these credentials.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again.";
      case "auth/too-many-requests":
        return "Too many attempts. Please try again later.";
      case "auth/email-already-in-use":
        return "This email is already registered.";
      case "auth/weak-password":
        return "Please use a stronger password.";
      case "auth/network-request-failed":
        return "Network error. Check your connection and try again.";
      case "auth/invalid-phone-number":
        return "Invalid phone number format.";
      case "auth/quota-exceeded":
        return "Verification quota exceeded. Try again later.";
      case "auth/captcha-check-failed":
        return "Verification failed. Please retry.";
      case "auth/invalid-verification-code":
      case "auth/missing-verification-code":
        return "Invalid OTP code.";
      case "auth/invalid-credential":
        return "Credential is invalid or expired. If you used an OTP, please request a new code; otherwise check your email or password.";
      case "auth/operation-not-allowed":
        return "This sign‑in method is currently disabled. Please contact support.";
      default:
        break;
    }
  }
  if (typeof message === "string") {
    if (message === "OPERATION_NOT_ALLOWED") {
      return "This sign‑in method is currently disabled. Please contact support.";
    }
    return message;
  }
  try {
    return String(error);
  } catch {
    return defaultMsg;
  }
}

export async function extractApiError(res: Response): Promise<string> {
  try {
    const data = await res.json();
    return data?.message || data?.error || res.statusText || "Request failed";
  } catch {
    return res.statusText || "Request failed";
  }
}
