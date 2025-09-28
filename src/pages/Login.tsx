import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, Phone, Shield } from "lucide-react";
import { getFriendlyAuthError } from "../lib/errorMessages";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthActions, usePreventAuthenticatedAccess } from "../hooks/useAuthActions";
import { parsePhoneNumberFromString } from "libphonenumber-js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [phoneMode, setPhoneMode] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [recaptchaId, setRecaptchaId] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");

  const { loginWithPhone, loginWithEmail, verifyPhoneOtp } = useAuthActions();
  const { user, loading: authLoading } = usePreventAuthenticatedAccess();
  const navigate = useNavigate();
  const location = useLocation();

  // Show loading while checking auth status
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent mx-auto" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is already authenticated, this will redirect them
  if (user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError("");
    try {
      if (phoneMode) {
        if (!confirmationResult) {
          const parsed = parsePhoneNumberFromString(phone || "");
          if (!parsed?.isValid()) {
            setPhoneError("Enter a valid phone number (E.164)");
            return;
          }
          const { confirmationResult, recaptchaContainerId } = await loginWithPhone(phone);
          console.log(confirmationResult, recaptchaContainerId)
          setConfirmationResult(confirmationResult);
          if (recaptchaContainerId) {
            setRecaptchaId(recaptchaContainerId);
          }
          setPhoneError("");
        } else {
          console.log(confirmationResult, otp)
          const res = await verifyPhoneOtp(confirmationResult, otp);
          console.log(res)
          navigate("/");
        }
      } else {
        try {
          await loginWithEmail(email, password);
        } catch (e: any) {
          setAuthError(getFriendlyAuthError(e));
          return;
        }
        navigate((location.state as any)?.from?.pathname || "/");
      }
    } finally {
      setLoading(false);
    }
  };

  // Forgot password is a separate route now

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-[#7C3AED] via-[#6366F1] to-[#06B6D4] text-white p-12">
        <div className="max-w-md space-y-4">
          <div className="flex items-center gap-2 text-sm opacity-90">
            <Shield className="w-4 h-4" /> Enterprise‑grade security
          </div>
          <h2 className="text-4xl font-extrabold">Welcome back</h2>
          <p className="opacity-90">
            Manage orders, products, and analytics — all in one place.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-xl p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
          <div className="mb-6">
            <h2 className="text-3xl font-extrabold text-gray-900">Sign in</h2>
            <p className="text-gray-500">
              Choose email/password or phone with OTP.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            {!phoneMode ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      required
                      autoFocus
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="you@email.com"
                      autoComplete="email"
                      inputMode="email"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                      onClick={() => setShowPassword((v) => !v)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {!confirmationResult ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+1234567890"
                      />
                    </div>
                    {phoneError && (
                      <p className="text-xs text-red-600 mt-1">{phoneError}</p>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter OTP
                    </label>
                    <input
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="123456"
                    />
                  </div>
                )}
              </>
            )}
            {
              !phoneMode &&
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 block text-sm text-gray-600"
                  >
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:underline"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot password?
                </button>
              </div>
            }

            {authError && (
              <div className="text-sm text-red-600">{authError}</div>
            )}
            <div className="text-sm text-gray-600">
              {phoneMode ? (
                <button
                  type="button"
                  className="text-blue-600"
                  onClick={() => setPhoneMode(false)}
                >
                  Login with Email
                </button>
              ) : (
                <button
                  type="button"
                  className="text-blue-600"
                  onClick={() => setPhoneMode(true)}
                >
                  Use phone with OTP instead
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-60"
            >
              {loading
                ? "Continue"
                : !phoneMode
                  ? "Sign In"
                  : confirmationResult
                    ? "Verify OTP"
                    : "Send OTP"}
            </button>
            {/* <div className="text-center text-sm text-gray-600">
              New here?{" "}
              <Link className="text-blue-600" to="/signup">
                Create an account
              </Link>
            </div> */}
          </form>
          {recaptchaId && <div id={recaptchaId} />}
        </div>
      </div>
    </div>
  );
}
